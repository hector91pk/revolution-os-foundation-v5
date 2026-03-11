import { createContactEntry } from '../../../domain/crm/factories';
import { parseCsv } from '../../../shared/utils/csv';
import { nowIso } from '../../../shared/utils/date';

function normalizeText(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function normalizeHeader(value) {
  return normalizeText(value).replace(/[^a-z0-9]+/g, ' ').trim();
}

function getHeaderMap(row) {
  const entries = Object.entries(row ?? {});
  return entries.reduce((acc, [key, value]) => {
    acc[normalizeHeader(key)] = value;
    return acc;
  }, {});
}

function pickValue(row, candidates) {
  const headerMap = getHeaderMap(row);
  for (const candidate of candidates) {
    const value = headerMap[normalizeHeader(candidate)];
    if (String(value ?? '').trim()) {
      return String(value).trim();
    }
  }
  return '';
}

function normalizeBirthDate(value) {
  const text = String(value ?? '').trim();
  if (!text) return '';

  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return text;
  }

  const slashMatch = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) {
    const day = String(slashMatch[1]).padStart(2, '0');
    const month = String(slashMatch[2]).padStart(2, '0');
    const year = slashMatch[3];
    return `${year}-${month}-${day}`;
  }

  const parsed = new Date(text);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function normalizeDateTime(value) {
  const text = String(value ?? '').trim();
  if (!text) return nowIso();

  if (!Number.isNaN(new Date(text).getTime())) {
    return new Date(text).toISOString();
  }

  const match = text.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/
  );

  if (match) {
    const day = Number(match[1]);
    const month = Number(match[2]) - 1;
    const year = Number(match[3]);
    const hour = Number(match[4] ?? 0);
    const minute = Number(match[5] ?? 0);
    const second = Number(match[6] ?? 0);
    const parsed = new Date(year, month, day, hour, minute, second);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }

  return nowIso();
}

function normalizeSource(value) {
  const normalized = normalizeText(value);

  if (!normalized) return 'formulario-web';
  if (normalized.includes('google')) return 'google-ads';
  if (normalized.includes('meta') || normalized.includes('facebook')) return 'meta-ads';
  if (normalized.includes('instagram') || normalized.includes('insta')) return 'instagram';
  if (normalized.includes('whatsapp') || normalized.includes('whats')) return 'whatsapp';
  if (normalized.includes('telefono') || normalized.includes('llamada')) return 'telefono';
  if (normalized.includes('presencial')) return 'presencial';
  if (normalized.includes('recomend')) return 'recomendacion';
  if (normalized.includes('colegio')) return 'colegio';
  if (normalized.includes('landing')) return 'landing-page';
  if (normalized.includes('formulario')) return 'formulario-web';

  return 'otro';
}

function resolveCenterId(rawValue, centers, defaultCenterId = '') {
  const normalized = normalizeText(rawValue);
  if (!normalized) return defaultCenterId;

  const matched = centers.find((center) => {
    const values = [
      center.id,
      center.name,
      center.shortName,
      center.city,
    ].map((item) => normalizeText(item));
    return values.some((value) => value && (value === normalized || normalized.includes(value) || value.includes(normalized)));
  });

  return matched?.id ?? defaultCenterId;
}

export function mapCsvRowToLeadPayload(row, centers, defaultCenterId = '') {
  const fullName = pickValue(row, [
    'name',
    'nombre',
    'nombre y apellidos',
    'nombre completo',
    'full name',
  ]);

  if (!fullName) {
    return null;
  }

  const receivedAt = normalizeDateTime(
    pickValue(row, [
      'createdAt',
      'created at',
      'timestamp',
      'marca temporal',
      'fecha de envio',
      'fecha recepción',
      'fecha recepcion',
    ])
  );

  const centerId = resolveCenterId(
    pickValue(row, ['center', 'centro', 'centro de interés', 'centro de interes']),
    centers,
    defaultCenterId
  );

  return {
    fullName,
    email: pickValue(row, ['email', 'correo', 'correo electrónico', 'correo electronico']),
    phone: pickValue(row, ['phone', 'telefono', 'teléfono', 'movil', 'móvil']),
    activityInterest: pickValue(row, [
      'activity',
      'actividad',
      'actividad a probar',
      'actividad de interes',
      'actividad de interés',
    ]),
    centerId,
    source: normalizeSource(
      pickValue(row, [
        'source',
        'origen',
        'cómo nos conocisteis',
        'como nos conocisteis',
        'como nos conociste',
        'cómo nos conociste',
      ])
    ),
    expectations: pickValue(row, [
      'expectations',
      'qué esperas de la clase',
      'que esperas de la clase',
      'expectativas',
    ]),
    dateOfBirth: normalizeBirthDate(
      pickValue(row, [
        'dateofbirth',
        'date of birth',
        'fecha de nacimiento',
        'nacimiento',
      ])
    ),
    notes: pickValue(row, ['notes', 'nota', 'notas', 'direccion', 'dirección']),
    receivedAt,
    createdAt: receivedAt,
    pipelineStage: 'primer-contacto',
    nextActionType: 'primer-contacto',
    nextActionLabel: 'Primer contacto y seguimiento operativo',
    contactHistory: [
      createContactEntry({
        at: receivedAt,
        channel: 'interno',
        direction: 'nota',
        summary: 'Lead importado desde CSV / formulario.',
        outcome: 'Pendiente primer contacto',
      }),
    ],
  };
}

export function parseLeadPayloadsFromCsv(text, centers, defaultCenterId = '') {
  return parseCsv(text)
    .map((row) => mapCsvRowToLeadPayload(row, centers, defaultCenterId))
    .filter(Boolean);
}

function normalizeText(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

const REQUEST_KEYWORDS = [
  {
    requestType: 'evento',
    keywords: ['cumple', 'cumpleanos', 'cumpleaños', 'campus', 'taller', 'evento', 'entrenamiento personal'],
  },
  {
    requestType: 'facturacion',
    keywords: ['factura', 'facturacion', 'recibo', 'cobro', 'domiciliacion', 'domiciliación'],
  },
  {
    requestType: 'moroso',
    keywords: ['moroso', 'deuda', 'pago pendiente', 'impago'],
  },
  {
    requestType: 'baja',
    keywords: ['baja', 'cancelar', 'dejar las clases', 'dar de baja'],
  },
  {
    requestType: 'cambio-horario',
    keywords: ['cambio de horario', 'cambiar horario', 'cambio clase', 'otra clase', 'otro grupo', 'horario'],
  },
  {
    requestType: 'incidencia',
    keywords: ['incidencia', 'problema', 'queja', 'lesion', 'lesión', 'conflicto'],
  },
  {
    requestType: 'lead',
    keywords: ['informacion', 'información', 'prueba', 'quiero probar', 'clase de prueba', 'me interesa', 'horarios', 'clases'],
  },
  {
    requestType: 'tarea-interna',
    keywords: ['interno', 'equipo', 'tarea', 'recordatorio'],
  },
];

export function inferRequestTypeFromPayload(payload = {}) {
  if (payload.requestType && payload.requestType !== 'auto') {
    return payload.requestType;
  }

  const combined = normalizeText(
    [payload.subject, payload.message, payload.notes, payload.channel].filter(Boolean).join(' ')
  );

  const matched = REQUEST_KEYWORDS.find((entry) =>
    entry.keywords.some((keyword) => combined.includes(normalizeText(keyword)))
  );

  if (matched) {
    return matched.requestType;
  }

  if (normalizeText(payload.channel) === 'formulario') {
    return 'lead';
  }

  return 'consulta-general';
}

export function suggestModuleForRequestType(requestType = '') {
  switch (requestType) {
    case 'lead':
      return 'leads-crm';
    case 'evento':
      return 'events';
    case 'facturacion':
    case 'moroso':
    case 'baja':
      return 'administration';
    case 'cambio-horario':
    case 'incidencia':
      return 'operations';
    case 'tarea-interna':
      return 'planner';
    default:
      return 'human';
  }
}

export function normalizeInboxPayload(payload = {}) {
  const requestType = inferRequestTypeFromPayload(payload);
  const suggestedModuleId =
    payload.suggestedModuleId && payload.suggestedModuleId !== 'auto'
      ? payload.suggestedModuleId
      : suggestModuleForRequestType(requestType);

  return {
    ...payload,
    requestType,
    suggestedModuleId,
  };
}

export function mapInboxChannelToLeadSource(channel = '') {
  const normalized = normalizeText(channel);

  if (normalized === 'formulario') return 'formulario-web';
  if (normalized === 'whatsapp') return 'whatsapp';
  if (normalized === 'instagram') return 'instagram';
  if (normalized === 'telefono') return 'telefono';
  if (normalized === 'presencial') return 'presencial';
  if (normalized === 'ads') return 'google-ads';
  return 'otro';
}

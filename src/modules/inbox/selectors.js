import {
  INBOX_CHANNEL_OPTIONS,
  INBOX_STATUS_OPTIONS,
  REQUEST_TYPE_OPTIONS,
  ROUTE_TARGET_OPTIONS,
} from '../../domain/reference/catalogs';
import { labelFromOptions } from '../../shared/utils/format';

const statusWeight = {
  nuevo: 4,
  clasificado: 3,
  derivado: 2,
  resuelto: 1,
};

const requestWeight = {
  lead: 6,
  incidencia: 5,
  moroso: 5,
  facturacion: 4,
  evento: 4,
  baja: 4,
  'cambio-horario': 3,
  'consulta-general': 2,
  'tarea-interna': 1,
};

export function enrichInboxItem(item, centers) {
  const center = centers.find((entry) => entry.id === item.centerId);

  return {
    ...item,
    centerName: center?.name ?? 'Sin centro',
    channelLabel: labelFromOptions(INBOX_CHANNEL_OPTIONS, item.channel, item.channel || 'Sin canal'),
    requestTypeLabel: labelFromOptions(REQUEST_TYPE_OPTIONS, item.requestType, item.requestType || 'Sin clasificar'),
    statusLabel: labelFromOptions(INBOX_STATUS_OPTIONS, item.status, item.status || 'Sin estado'),
    suggestedModuleLabel: labelFromOptions(ROUTE_TARGET_OPTIONS, item.suggestedModuleId, item.suggestedModuleId || 'Humano'),
  };
}

export function filterInboxItems(items, filters) {
  const normalizedSearch = String(filters.search ?? '').trim().toLowerCase();

  return items.filter((item) => {
    const matchesSearch =
      !normalizedSearch ||
      [
        item.senderName,
        item.senderContact,
        item.subject,
        item.message,
        item.notes,
        item.requestTypeLabel,
        item.centerName,
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch);

    const matchesChannel = filters.channel === 'all' || item.channel === filters.channel;
    const matchesRequestType = filters.requestType === 'all' || item.requestType === filters.requestType;
    const matchesStatus = filters.status === 'all' || item.status === filters.status;
    const matchesCenter = filters.centerId === 'all' || item.centerId === filters.centerId;

    return matchesSearch && matchesChannel && matchesRequestType && matchesStatus && matchesCenter;
  });
}

export function sortInboxItems(items) {
  return [...items].sort((left, right) => {
    const statusDiff = (statusWeight[right.status] ?? 0) - (statusWeight[left.status] ?? 0);
    if (statusDiff !== 0) return statusDiff;

    const requestDiff = (requestWeight[right.requestType] ?? 0) - (requestWeight[left.requestType] ?? 0);
    if (requestDiff !== 0) return requestDiff;

    return String(right.receivedAt ?? '').localeCompare(String(left.receivedAt ?? ''));
  });
}

export function buildInboxSummary(items) {
  return {
    total: items.length,
    nuevos: items.filter((item) => item.status === 'nuevo').length,
    clasificados: items.filter((item) => item.status === 'clasificado').length,
    derivados: items.filter((item) => item.status === 'derivado').length,
    paraCrm: items.filter((item) => item.suggestedModuleId === 'leads-crm' || item.requestType === 'lead').length,
    paraPlanner: items.filter((item) => item.suggestedModuleId === 'planner').length,
  };
}

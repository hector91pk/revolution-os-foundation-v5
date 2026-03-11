import { getMonthGrid, getWeekKeys, parseDateKey, toDateKey } from '../../shared/utils/date';

const priorityWeight = { alta: 3, media: 2, baja: 1 };
const kindWeight = { reservation: 4, 'follow-up': 3, event: 2, task: 1 };

export function sortPlannerItems(items) {
  return [...items].sort((left, right) => {
    if (left.dueDate !== right.dueDate) {
      return String(left.dueDate).localeCompare(String(right.dueDate));
    }
    if (left.dueTime !== right.dueTime) {
      return String(left.dueTime).localeCompare(String(right.dueTime));
    }
    const priorityDiff = (priorityWeight[right.priority] ?? 0) - (priorityWeight[left.priority] ?? 0);
    if (priorityDiff !== 0) return priorityDiff;
    return (kindWeight[right.kind] ?? 0) - (kindWeight[left.kind] ?? 0);
  });
}

export function filterPlannerItems(items, { search = '', centerId = 'all', status = 'all' } = {}) {
  const normalizedSearch = search.trim().toLowerCase();

  return items.filter((item) => {
    const matchesSearch =
      !normalizedSearch ||
      [item.title, item.description, item.centerId, item.kind].join(' ').toLowerCase().includes(normalizedSearch);
    const matchesCenter = centerId === 'all' || item.centerId === centerId;
    const matchesStatus = status === 'all' || item.status === status;
    return matchesSearch && matchesCenter && matchesStatus;
  });
}

export function buildPlannerSummary(items, dateKey) {
  return {
    total: items.length,
    today: items.filter((item) => item.dueDate === dateKey).length,
    pending: items.filter((item) => item.status === 'pendiente').length,
    reservations: items.filter((item) => item.kind === 'reservation').length,
    followUps: items.filter((item) => item.kind === 'follow-up').length,
  };
}

export function getItemsForDate(items, dateKey) {
  return sortPlannerItems(items.filter((item) => item.dueDate === dateKey));
}

export function getItemsForWeek(items, dateKey) {
  const weekKeys = getWeekKeys(parseDateKey(dateKey) ?? new Date());
  return weekKeys.map((key) => ({
    dateKey: key,
    items: getItemsForDate(items, key),
  }));
}

export function getItemsForMonth(items, dateKey) {
  const grid = getMonthGrid(parseDateKey(dateKey) ?? new Date());
  return grid.map((cell) => ({
    ...cell,
    items: getItemsForDate(items, cell.dateKey),
  }));
}

export function getAvailableLinkedEntities(state) {
  return [
    ...state.controlCenter.projects.map((project) => ({
      id: project.id,
      label: `${project.name} · proyecto`,
      entityType: 'project',
    })),
    ...state.crm.leads.map((lead) => ({
      id: lead.id,
      label: `${lead.fullName} · lead`,
      entityType: 'lead',
    })),
    ...state.inbox.items.map((item) => ({
      id: item.id,
      label: `${item.senderName || item.subject || 'Entrada'} · inbox`,
      entityType: 'inbox-item',
    })),
  ];
}

export function normalizePlannerDateKey(value) {
  return toDateKey(parseDateKey(value) ?? new Date());
}

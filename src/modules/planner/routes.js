import { todayKey } from '../../shared/utils/date';

export function parsePlannerRoute(subPath = '/') {
  const normalized = subPath.startsWith('/') ? subPath : `/${subPath}`;
  const parts = normalized.split('/').filter(Boolean);

  if (parts[0] === 'item' && parts[1]) {
    return {
      view: 'item',
      itemId: decodeURIComponent(parts[1]),
      dateKey: todayKey(),
    };
  }

  const view = ['day', 'week', 'month'].includes(parts[0]) ? parts[0] : 'day';
  const dateKey = parts[1] || todayKey();

  return { view, dateKey, itemId: null };
}

export function getPlannerTitle(subPath, state) {
  const route = parsePlannerRoute(subPath);
  const appName = state.meta.appName ?? 'R-evolution OS';

  if (route.view === 'item') {
    return `Tarea · ${appName}`;
  }

  const labels = { day: 'Planner día', week: 'Planner semana', month: 'Planner mes' };
  return `${labels[route.view] ?? 'Planner'} · ${appName}`;
}
import { todayKey } from '../../shared/utils/date';

export function parsePlannerRoute(subPath = '/') {
  const normalized = subPath.startsWith('/') ? subPath : `/${subPath}`;
  const parts = normalized.split('/').filter(Boolean);
  const view = ['day', 'week', 'month'].includes(parts[0]) ? parts[0] : 'day';
  const dateKey = parts[1] || todayKey();
  return { view, dateKey };
}

export function getPlannerTitle(subPath, state) {
  const route = parsePlannerRoute(subPath);
  const appName = state.meta.appName ?? 'R-evolution OS';
  const labels = { day: 'Planner día', week: 'Planner semana', month: 'Planner mes' };
  return `${labels[route.view] ?? 'Planner'} · ${appName}`;
}

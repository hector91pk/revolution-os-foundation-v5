export function parseControlCenterRoute(subPath = '/') {
  const normalized = subPath.startsWith('/') ? subPath : `/${subPath}`;
  const parts = normalized.split('/').filter(Boolean);

  if (parts.length === 0) return { view: 'dashboard' };
  if (parts[0] === 'focus') return { view: 'focus' };
  if (parts[0] === 'map') return { view: 'map' };
  if (parts[0] === 'category' && parts[1]) {
    return { view: 'category', categoryId: decodeURIComponent(parts[1]) };
  }
  if (parts[0] === 'project' && parts[1]) {
    return { view: 'project', projectId: decodeURIComponent(parts[1]) };
  }

  return { view: 'dashboard' };
}

export function getControlCenterTitle(subPath, state) {
  const route = parseControlCenterRoute(subPath);
  const appName = state.meta.appName ?? 'R-evolution OS';
  if (route.view === 'focus') return `Foco actual · ${appName}`;
  if (route.view === 'map') return `Mapa estratégico · ${appName}`;
  if (route.view === 'category') {
    const category = state.controlCenter.categories.find((item) => item.id === route.categoryId);
    return category ? `${category.name} · ${appName}` : appName;
  }
  if (route.view === 'project') {
    const project = state.controlCenter.projects.find((item) => item.id === route.projectId);
    return project ? `${project.name} · ${appName}` : appName;
  }
  return appName;
}

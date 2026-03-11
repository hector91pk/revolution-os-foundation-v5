export function parseInboxRoute(subPath = '/') {
  const normalized = subPath.startsWith('/') ? subPath : `/${subPath}`;
  const parts = normalized.split('/').filter(Boolean);

  if (parts.length === 0) {
    return { view: 'dashboard' };
  }

  if (parts[0] === 'dashboard') {
    return { view: 'dashboard' };
  }

  if (parts[0] === 'item' && parts[1]) {
    return {
      view: 'item',
      itemId: decodeURIComponent(parts[1]),
    };
  }

  return { view: 'dashboard' };
}

export function getInboxTitle(subPath, state) {
  const route = parseInboxRoute(subPath);
  const appName = state.meta.appName ?? 'R-evolution OS';

  if (route.view === 'item') {
    const item = state.inbox.items.find((entry) => entry.id === route.itemId);
    const label = item?.senderName || item?.subject || 'Entrada';
    return `${label} · Inbox · ${appName}`;
  }

  return `Inbox / Router · ${appName}`;
}

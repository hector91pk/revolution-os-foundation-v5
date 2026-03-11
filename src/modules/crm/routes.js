export function parseCrmRoute(subPath = '/') {
  const normalized = subPath.startsWith('/') ? subPath : `/${subPath}`;
  const parts = normalized.split('/').filter(Boolean);

  if (parts.length === 0) {
    return { view: 'dashboard' };
  }

  if (parts[0] === 'dashboard') {
    return { view: 'dashboard' };
  }

  if (parts[0] === 'lead' && parts[1]) {
    return {
      view: 'lead',
      leadId: decodeURIComponent(parts[1]),
    };
  }

  return { view: 'dashboard' };
}

export function getCrmTitle(subPath, state) {
  const route = parseCrmRoute(subPath);
  const appName = state.meta.appName ?? 'R-evolution OS';

  if (route.view === 'lead') {
    const lead = state.crm.leads.find((item) => item.id === route.leadId);
    return lead ? `${lead.fullName} · CRM · ${appName}` : `CRM · ${appName}`;
  }

  return `Leads / CRM · ${appName}`;
}

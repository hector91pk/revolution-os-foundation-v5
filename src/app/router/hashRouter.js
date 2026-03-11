export function buildModuleHash(moduleId, subPath = '/') {
  const normalizedSubPath = !subPath || subPath === '/' ? '' : subPath.startsWith('/') ? subPath : `/${subPath}`;
  return `#/${moduleId}${normalizedSubPath}`;
}

export function parseAppHash(hash, modules) {
  const rawHash = String(hash ?? '').replace(/^#/, '');
  const normalized = rawHash.startsWith('/') ? rawHash : `/${rawHash}`;
  const parts = normalized.split('/').filter(Boolean);

  if (parts.length === 0) {
    return { moduleId: null, subPath: '/' };
  }

  const module = modules.find((entry) => entry.id === parts[0]);
  if (module) {
    return {
      moduleId: module.id,
      subPath: `/${parts.slice(1).join('/')}`.replace(/\/$/, '') || '/',
    };
  }

  if (parts[0] === 'crm') {
    return { moduleId: 'leads-crm', subPath: `/${parts.slice(1).join('/')}` || '/dashboard' };
  }

  return { moduleId: 'control-center', subPath: '/' };
}

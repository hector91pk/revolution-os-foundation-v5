import { useEffect, useMemo, useState } from 'react';
import { useAppStore } from './state/useAppStore';
import { parseAppHash, buildModuleHash } from './router/hashRouter';
import { getFirstAllowedModule, moduleMap, moduleRegistry } from './moduleRegistry.jsx';
import { AppShell } from './AppShell';

export default function App() {
  const { state, actions, lastSavedAt } = useAppStore();
  const [currentHash, setCurrentHash] = useState(() => (typeof window === 'undefined' ? '' : window.location.hash));

  const roles = state.shared.roles;
  const activeRoleId = state.session.activeRoleId ?? roles[0]?.id ?? 'founder';
  const parsedRoute = useMemo(() => parseAppHash(currentHash, moduleRegistry), [currentHash]);
  const firstAllowedModule = useMemo(() => getFirstAllowedModule(activeRoleId), [activeRoleId]);

  const activeModule = useMemo(() => {
    const requested = parsedRoute.moduleId ? moduleMap.get(parsedRoute.moduleId) : null;
    if (requested && requested.allowedRoles.includes(activeRoleId)) {
      return requested;
    }
    return firstAllowedModule;
  }, [parsedRoute.moduleId, activeRoleId, firstAllowedModule]);

  const activeSubPath = useMemo(() => {
    const requested = parsedRoute.moduleId ? moduleMap.get(parsedRoute.moduleId) : null;
    if (requested && requested.id === activeModule.id && requested.allowedRoles.includes(activeRoleId)) {
      return parsedRoute.subPath || requested.defaultSubPath;
    }
    return activeModule.defaultSubPath;
  }, [parsedRoute, activeModule, activeRoleId]);

  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = buildModuleHash(firstAllowedModule.id, firstAllowedModule.defaultSubPath);
    }

    const handleHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [firstAllowedModule]);

  useEffect(() => {
    const requested = parsedRoute.moduleId ? moduleMap.get(parsedRoute.moduleId) : null;
    if (!requested || !requested.allowedRoles.includes(activeRoleId)) {
      window.location.hash = buildModuleHash(firstAllowedModule.id, firstAllowedModule.defaultSubPath);
    }
  }, [parsedRoute.moduleId, activeRoleId, firstAllowedModule]);

  useEffect(() => {
    document.title = activeModule.getTitle?.(activeSubPath, state) ?? `${activeModule.label} · ${state.meta.appName ?? 'R-evolution OS'}`;
  }, [activeModule, activeSubPath, state]);

  function navigateModule(moduleId, subPath = '/') {
    window.location.hash = buildModuleHash(moduleId, subPath);
  }

  function navigateWithinModule(subPath = '/') {
    navigateModule(activeModule.id, subPath);
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `r-evolution-os-foundation-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    window.URL.revokeObjectURL(url);
  }

  function resetData() {
    if (!window.confirm('Esto borrará tus cambios locales y restaurará la semilla inicial. ¿Continuar?')) {
      return;
    }
    actions.app.reset();
    const target = getFirstAllowedModule(activeRoleId);
    navigateModule(target.id, target.defaultSubPath);
  }

  const ActiveModuleComponent = activeModule.Component;

  return (
    <AppShell
      appName={state.meta.appName ?? 'R-evolution OS'}
      description={state.meta.description}
      roles={roles}
      activeRoleId={activeRoleId}
      activeModule={activeModule}
      modules={moduleRegistry}
      lastSavedAt={lastSavedAt}
      onRoleChange={(roleId) => {
        actions.session.setActiveRole(roleId);
        const requested = parsedRoute.moduleId ? moduleMap.get(parsedRoute.moduleId) : null;
        if (!requested || !requested.allowedRoles.includes(roleId)) {
          const target = getFirstAllowedModule(roleId);
          window.setTimeout(() => navigateModule(target.id, target.defaultSubPath), 0);
        }
      }}
      onNavigateModule={navigateModule}
      onExport={exportData}
      
    >
      <ActiveModuleComponent subPath={activeSubPath} navigateWithinModule={navigateWithinModule} navigateModule={navigateModule} />
    </AppShell>
  );
}

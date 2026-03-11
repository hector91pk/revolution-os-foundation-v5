import { FOUNDATION_MODULE_GROUPS } from '../domain/reference/catalogs';

function lastSavedLabel(value) {
  if (!value) return 'Pendiente';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Pendiente';
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function AppShell({
  appName,
  description,
  roles,
  activeRoleId,
  activeModule,
  modules,
  lastSavedAt,
  onRoleChange,
  onNavigateModule,
  onExport,
  onReset,
  children,
}) {
  return (
    <div className="shell-root">
      <aside className="shell-sidebar panel">
        <div className="brand-block">
          <div className="brand-mark">R</div>
          <div>
            <p className="eyebrow">Foundation release</p>
            <h1>{appName}</h1>
            <p className="muted-copy">{description}</p>
          </div>
        </div>

        <label className="field">
          <span>Rol activo</span>
          <select value={activeRoleId} onChange={(event) => onRoleChange(event.target.value)}>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
        </label>

        <div className="sidebar-meta-grid">
          <div>
            <span>Módulo</span>
            <strong>{activeModule.label}</strong>
          </div>
          <div>
            <span>Guardado</span>
            <strong>{lastSavedLabel(lastSavedAt)}</strong>
          </div>
        </div>

        {FOUNDATION_MODULE_GROUPS.map((group) => (
          <div key={group.id} className="module-group-block">
            <p className="sidebar-group-title">{group.label}</p>
            <div className="module-nav-stack">
              {modules.filter((module) => module.group === group.id).map((module) => {
                const allowed = module.allowedRoles.includes(activeRoleId);
                const active = module.id === activeModule.id;
                return (
                  <button
                    key={module.id}
                    className={`module-nav-item ${active ? 'is-active' : ''} ${allowed ? '' : 'is-disabled'}`}
                    onClick={() => allowed && onNavigateModule(module.id, module.defaultSubPath)}
                  >
                    <span className="module-icon">{module.icon}</span>
                    <div>
                      <strong>{module.label}</strong>
                      <small>{allowed ? module.description : 'No disponible con este rol'}</small>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="sidebar-actions">
          <button className="ghost-button" onClick={onExport}>Exportar JSON</button>
          <button className="danger-button" onClick={onReset}>Restaurar seed</button>
        </div>
      </aside>

      <main className="shell-main">
        <header className="panel shell-topbar">
          <div>
            <p className="eyebrow">{activeModule.status === 'implemented' ? 'Módulo implementado' : 'Módulo preparado'}</p>
            <h2>{activeModule.label}</h2>
            <p className="muted-copy">{activeModule.description}</p>
          </div>
          <div className="topbar-side-meta">
            <span className="pill">1 app · modular</span>
            <span className="pill">Local-first</span>
            <span className="pill">Preparado backend</span>
          </div>
        </header>
        <section className="shell-content">{children}</section>
      </main>
    </div>
  );
}

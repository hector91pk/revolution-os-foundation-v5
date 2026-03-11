import { EmptyState } from '../../../shared/ui/EmptyState';
import { Panel } from '../../../shared/ui/Panel';
import { SectionHeader } from '../../../shared/ui/SectionHeader';
import { PROJECT_STATUS_OPTIONS } from '../../../domain/reference/catalogs';
import { ProjectListItem } from '../components/ProjectListItem';

export function CategoryView({
  category,
  projects,
  search,
  status,
  setSearch,
  setStatus,
  onBack,
  onOpenProject,
  draft,
  setDraft,
  onCreateProject,
}) {
  return (
    <div className="module-stack">
      <SectionHeader
        eyebrow="Categoría"
        title={category.name}
        description={category.description}
        actions={<button className="ghost-button" onClick={onBack}>Volver</button>}
      />

      <div className="split-grid align-start">
        <Panel>
          <div className="form-grid">
            <label className="field">
              <span>Buscar</span>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nombre, nota o siguiente paso" />
            </label>
            <label className="field">
              <span>Estado</span>
              <select value={status} onChange={(event) => setStatus(event.target.value)}>
                <option value="all">Todos</option>
                {PROJECT_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="stack-list compact-list top-gap">
            {projects.length ? (
              projects.map((project) => (
                <ProjectListItem key={project.id} project={project} onOpen={() => onOpenProject(project.id)} />
              ))
            ) : (
              <EmptyState title="Sin resultados" copy="Prueba otro filtro o crea un proyecto nuevo en esta categoría." />
            )}
          </div>
        </Panel>

        <Panel>
          <SectionHeader
            eyebrow="Alta rápida"
            title="Añadir proyecto a esta categoría"
            description="Creación rápida orientada a ejecución sin cambiar de contexto."
          />
          <div className="form-grid">
            <label className="field">
              <span>Nombre</span>
              <input value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} />
            </label>
            <label className="field">
              <span>Prioridad</span>
              <select value={draft.priority} onChange={(event) => setDraft((current) => ({ ...current, priority: event.target.value }))}>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </label>
            <label className="field span-2">
              <span>Siguiente paso</span>
              <textarea rows="3" value={draft.nextStep} onChange={(event) => setDraft((current) => ({ ...current, nextStep: event.target.value }))} />
            </label>
            <div className="inline-actions span-2">
              <button className="primary-button" onClick={onCreateProject}>
                Crear proyecto
              </button>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

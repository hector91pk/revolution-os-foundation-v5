import { MetricCard } from '../../../shared/ui/MetricCard';
import { Panel } from '../../../shared/ui/Panel';
import { SectionHeader } from '../../../shared/ui/SectionHeader';
import { CategoryCard } from '../components/CategoryCard';
import { ProjectListItem } from '../components/ProjectListItem';

export function DashboardView({
  categoriesWithStats,
  dashboard,
  projects,
  draft,
  setDraft,
  onCreateProject,
  onOpenCategory,
  onOpenProject,
}) {
  return (
    <div className="module-stack">
      <SectionHeader
        eyebrow="Dirección / Control"
        title="Control Center"
        description="Centro de mando estratégico para proyectos, líneas de negocio y foco ejecutivo."
      />

      <div className="metric-grid">
        <MetricCard label="Categorías" value={dashboard.categories} />
        <MetricCard label="Proyectos" value={dashboard.projects} />
        <MetricCard label="Activos" value={dashboard.activos} />
        <MetricCard label="Bloqueados" value={dashboard.bloqueados} />
        <MetricCard label="Prioritarios" value={dashboard.prioritarios} />
        <MetricCard label="Sin revisar" value={dashboard.stale} />
      </div>

      <div className="split-grid">
        <Panel>
          <SectionHeader
            eyebrow="Captura rápida"
            title="Nuevo proyecto"
            description="Alta rápida dentro del sistema operativo sin abandonar la home."
          />
          <div className="form-grid">
            <label className="field">
              <span>Nombre</span>
              <input value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} />
            </label>
            <label className="field">
              <span>Categoría</span>
              <select value={draft.categoryId} onChange={(event) => setDraft((current) => ({ ...current, categoryId: event.target.value }))}>
                {categoriesWithStats.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
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

        <Panel>
          <SectionHeader
            eyebrow="Prioridad alta"
            title="Top de foco actual"
            description="Lo más importante dentro del portafolio estratégico ahora mismo."
          />
          <div className="stack-list compact-list">
            {projects.slice(0, 5).map((project) => (
              <ProjectListItem key={project.id} project={project} onOpen={() => onOpenProject(project.id)} />
            ))}
          </div>
        </Panel>
      </div>

      <div className="responsive-grid categories-grid">
        {categoriesWithStats.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            stats={category.stats}
            onOpen={() => onOpenCategory(category.id)}
          />
        ))}
      </div>
    </div>
  );
}

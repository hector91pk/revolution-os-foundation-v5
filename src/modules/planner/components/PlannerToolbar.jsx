import { PLANNER_STATUS_OPTIONS, PLANNER_VIEW_OPTIONS } from '../../../domain/reference/catalogs';

export function PlannerToolbar({
  view,
  dateKey,
  onViewChange,
  onDateChange,
  filters,
  setFilters,
  centers,
  projects,
}) {
  return (
    <div className="panel toolbar-panel">
      <div className="toolbar-grid">
        <label className="field slim-field">
          <span>Vista</span>
          <select value={view} onChange={(event) => onViewChange(event.target.value)}>
            {PLANNER_VIEW_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field slim-field">
          <span>Fecha base</span>
          <input type="date" value={dateKey} onChange={(event) => onDateChange(event.target.value)} />
        </label>

        <label className="field slim-field">
          <span>Buscar</span>
          <input
            value={filters.search}
            onChange={(event) =>
              setFilters((current) => ({ ...current, search: event.target.value }))
            }
          />
        </label>

        <label className="field slim-field">
          <span>Centro</span>
          <select
            value={filters.centerId}
            onChange={(event) =>
              setFilters((current) => ({ ...current, centerId: event.target.value }))
            }
          >
            <option value="all">Todos</option>
            {centers.map((center) => (
              <option key={center.id} value={center.id}>
                {center.name}
              </option>
            ))}
          </select>
        </label>

        <label className="field slim-field">
          <span>Proyecto</span>
          <select
            value={filters.projectId}
            onChange={(event) =>
              setFilters((current) => ({ ...current, projectId: event.target.value }))
            }
          >
            <option value="all">Todos</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </label>

        <label className="field slim-field">
          <span>Estado</span>
          <select
            value={filters.status}
            onChange={(event) =>
              setFilters((current) => ({ ...current, status: event.target.value }))
            }
          >
            <option value="all">Todos</option>
            {PLANNER_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
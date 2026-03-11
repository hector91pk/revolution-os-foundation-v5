import { EmptyState } from '../../../shared/ui/EmptyState';
import { Panel } from '../../../shared/ui/Panel';
import { StatusBadge } from '../../../shared/ui/StatusBadge';
import { formatDateLabel } from '../../../shared/utils/date';

function toneForTask(task) {
  if (task.status === 'hecha') return 'success';
  if (task.priority === 'alta') return 'danger';
  if (task.kind === 'reservation') return 'warning';
  return 'info';
}

export function ProjectTasksPanel({ tasks, onOpenTask }) {
  return (
    <Panel>
      <div className="section-header compact-header">
        <div>
          <p className="eyebrow">Proyecto / Tareas</p>
          <h3>Tareas vinculadas</h3>
          <p className="section-subtitle">
            Tareas del Planner relacionadas con este proyecto.
          </p>
        </div>
        <span className="pill">{tasks.length} tareas</span>
      </div>

      <div className="stack-list compact-list top-gap">
        {tasks.length ? (
          tasks.map((task) => (
            <div
              key={task.id}
              className="list-card"
              role="button"
              tabIndex={0}
              onClick={() => onOpenTask(task.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onOpenTask(task.id);
                }
              }}
            >
              <div className="list-card-main">
                <div className="list-card-header">
                  <strong>{task.title}</strong>
                  <StatusBadge tone={toneForTask(task)}>
                    {task.status === 'hecha' ? 'Hecha' : 'Pendiente'}
                  </StatusBadge>
                </div>

                <p className="muted-copy clamp-2">
                  {task.description || 'Sin descripción.'}
                </p>

                <small className="muted-caption">
                  {formatDateLabel(task.dueDate)}
                  {task.dueTime ? ` · ${task.dueTime}` : ''}
                  {task.department ? ` · ${task.department}` : ''}
                </small>
              </div>

              <div className="list-card-side">
                <span className="pill">{task.kind}</span>
                <span className="pill">{task.priority}</span>
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            title="Sin tareas vinculadas"
            copy="Todavía no hay tareas del Planner asociadas a este proyecto."
          />
        )}
      </div>
    </Panel>
  );
}
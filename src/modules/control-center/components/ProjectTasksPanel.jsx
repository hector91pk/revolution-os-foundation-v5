import { useState } from 'react';
import { PRIORITY_OPTIONS } from '../../../domain/reference/catalogs';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { Panel } from '../../../shared/ui/Panel';
import { StatusBadge } from '../../../shared/ui/StatusBadge';
import { formatDateLabel, todayKey } from '../../../shared/utils/date';

function toneForTask(task) {
  if (task.status === 'hecha') return 'success';
  if (task.priority === 'alta') return 'danger';
  if (task.kind === 'reservation') return 'warning';
  return 'info';
}

function buildTaskDraft() {
  return {
    title: '',
    description: '',
    dueDate: todayKey(),
    dueTime: '',
    priority: 'media',
  };
}

export function ProjectTasksPanel({ tasks, onOpenTask, onCreateTask }) {
  const [isCreating, setIsCreating] = useState(false);
  const [draft, setDraft] = useState(buildTaskDraft());

  function handleCreate() {
    if (!draft.title.trim()) return;

    onCreateTask({
      title: draft.title.trim(),
      description: draft.description.trim(),
      dueDate: draft.dueDate,
      dueTime: draft.dueTime,
      priority: draft.priority,
    });

    setDraft(buildTaskDraft());
    setIsCreating(false);
  }

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

        <div className="inline-actions">
          <span className="pill">{tasks.length} tareas</span>
          <button
            type="button"
            className="ghost-button small-button"
            onClick={() => setIsCreating((current) => !current)}
          >
            {isCreating ? 'Cancelar' : 'Añadir tarea'}
          </button>
        </div>
      </div>

      {isCreating ? (
        <div className="form-grid two-columns top-gap">
          <label className="field span-2">
            <span>Título</span>
            <input
              value={draft.title}
              onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
            />
          </label>

          <label className="field span-2">
            <span>Descripción</span>
            <textarea
              rows="3"
              value={draft.description}
              onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
            />
          </label>

          <label className="field">
            <span>Fecha</span>
            <input
              type="date"
              value={draft.dueDate}
              onChange={(event) => setDraft((current) => ({ ...current, dueDate: event.target.value }))}
            />
          </label>

          <label className="field">
            <span>Hora</span>
            <input
              type="time"
              value={draft.dueTime}
              onChange={(event) => setDraft((current) => ({ ...current, dueTime: event.target.value }))}
            />
          </label>

          <label className="field">
            <span>Prioridad</span>
            <select
              value={draft.priority}
              onChange={(event) => setDraft((current) => ({ ...current, priority: event.target.value }))}
            >
              {PRIORITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div className="inline-actions">
            <button type="button" className="primary-button" onClick={handleCreate}>
              Crear tarea
            </button>
          </div>
        </div>
      ) : null}

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
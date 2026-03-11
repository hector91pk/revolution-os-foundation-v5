import { PLANNER_KIND_OPTIONS, PRIORITY_OPTIONS } from '../../../domain/reference/catalogs';
import { Panel } from '../../../shared/ui/Panel';
import { SectionHeader } from '../../../shared/ui/SectionHeader';

function linkedLabel(item) {
  if (item.linkedEntityType === 'project') return 'Abrir proyecto';
  if (item.linkedEntityType === 'lead') return 'Abrir lead';
  if (item.linkedEntityType === 'inbox-item') return 'Abrir inbox';
  return 'Abrir enlace';
}

export function PlannerItemDetailView({
  item,
  centers,
  onBack,
  onFieldChange,
  onToggle,
  onDelete,
  onOpenLinked,
}) {
  return (
    <div className="module-stack">
      <SectionHeader
        eyebrow="Planner / Tarea"
        title={item.title || 'Tarea sin título'}
        description="Ficha operativa de la tarea para editarla, marcarla como hecha o abrir su entidad vinculada."
      />

      <Panel>
        <div className="form-grid two-columns">
          <label className="field span-2">
            <span>Título</span>
            <input value={item.title} onChange={(event) => onFieldChange('title', event.target.value)} />
          </label>

          <label className="field span-2">
            <span>Descripción</span>
            <textarea
              rows="4"
              value={item.description || ''}
              onChange={(event) => onFieldChange('description', event.target.value)}
            />
          </label>

          <label className="field">
            <span>Tipo</span>
            <select value={item.kind} onChange={(event) => onFieldChange('kind', event.target.value)}>
              {PLANNER_KIND_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Prioridad</span>
            <select value={item.priority} onChange={(event) => onFieldChange('priority', event.target.value)}>
              {PRIORITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Fecha</span>
            <input type="date" value={item.dueDate || ''} onChange={(event) => onFieldChange('dueDate', event.target.value)} />
          </label>

          <label className="field">
            <span>Hora</span>
            <input type="time" value={item.dueTime || ''} onChange={(event) => onFieldChange('dueTime', event.target.value)} />
          </label>

          <label className="field">
            <span>Centro</span>
            <select value={item.centerId || ''} onChange={(event) => onFieldChange('centerId', event.target.value)}>
              <option value="">Sin centro</option>
              {centers.map((center) => (
                <option key={center.id} value={center.id}>
                  {center.name}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Estado</span>
            <input value={item.status || ''} disabled />
          </label>

          <label className="field span-2">
            <span>Entidad vinculada</span>
            <input
              value={
                item.linkedEntityType && item.linkedEntityId
                  ? `${item.linkedEntityType} · ${item.linkedEntityId}`
                  : 'Sin enlace'
              }
              disabled
            />
          </label>
        </div>

        <div className="inline-actions top-gap">
          <button type="button" className="ghost-button" onClick={onBack}>
            Volver
          </button>

          <button type="button" className="ghost-button" onClick={onToggle}>
            {item.status === 'hecha' ? 'Reabrir tarea' : 'Marcar como hecha'}
          </button>

          {item.linkedEntityType && item.linkedEntityId ? (
            <button type="button" className="primary-button" onClick={onOpenLinked}>
              {linkedLabel(item)}
            </button>
          ) : null}

          <button
            type="button"
            className="danger-button"
            onClick={() => {
              if (confirm('¿Eliminar esta tarea?')) {
                onDelete();
              }
            }}
          >
            Borrar
          </button>
        </div>
      </Panel>
    </div>
  );
}
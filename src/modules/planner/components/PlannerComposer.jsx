import { PLANNER_KIND_OPTIONS, PRIORITY_OPTIONS } from '../../../domain/reference/catalogs';

export function PlannerComposer({ draft, setDraft, centers, linkedEntities, onCreate }) {
  return (
    <div className="panel">
      <div className="section-header compact-header">
        <div>
          <p className="eyebrow">Nueva entrada</p>
          <h3>Crear tarea o evento</h3>
          <p className="section-subtitle">Planner desacoplado del resto, pero listo para enlazarse con CRM, inbox y proyectos.</p>
        </div>
      </div>
      <div className="form-grid two-columns">
        <label className="field span-2">
          <span>Título</span>
          <input value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} />
        </label>
        <label className="field">
          <span>Tipo</span>
          <select value={draft.kind} onChange={(event) => setDraft((current) => ({ ...current, kind: event.target.value }))}>
            {PLANNER_KIND_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Prioridad</span>
          <select value={draft.priority} onChange={(event) => setDraft((current) => ({ ...current, priority: event.target.value }))}>
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Fecha</span>
          <input type="date" value={draft.dueDate} onChange={(event) => setDraft((current) => ({ ...current, dueDate: event.target.value }))} />
        </label>
        <label className="field">
          <span>Hora</span>
          <input type="time" value={draft.dueTime} onChange={(event) => setDraft((current) => ({ ...current, dueTime: event.target.value }))} />
        </label>
        <label className="field">
          <span>Centro</span>
          <select value={draft.centerId} onChange={(event) => setDraft((current) => ({ ...current, centerId: event.target.value }))}>
            <option value="">Sin centro</option>
            {centers.map((center) => (
              <option key={center.id} value={center.id}>
                {center.name}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Enlazar con entidad</span>
          <select
            value={draft.linkedValue}
            onChange={(event) => {
              const selected = linkedEntities.find((item) => `${item.entityType}:${item.id}` === event.target.value);
              setDraft((current) => ({
                ...current,
                linkedValue: event.target.value,
                linkedEntityType: selected?.entityType || '',
                linkedEntityId: selected?.id || '',
              }));
            }}
          >
            <option value="">Sin enlace</option>
            {linkedEntities.map((entity) => (
              <option key={`${entity.entityType}:${entity.id}`} value={`${entity.entityType}:${entity.id}`}>
                {entity.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field span-2">
          <span>Descripción</span>
          <textarea rows="3" value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} />
        </label>
        <div className="inline-actions span-2">
          <button className="primary-button" onClick={onCreate}>Añadir al planner</button>
        </div>
      </div>
    </div>
  );
}

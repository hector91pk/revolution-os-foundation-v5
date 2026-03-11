import {
  LEAD_SOURCE_OPTIONS,
} from '../../../domain/reference/catalogs';

export function LeadQuickForm({ draft, setDraft, centers, activities, onCreate }) {
  return (
    <div className="panel">
      <div className="section-header compact-header">
        <div>
          <p className="eyebrow">Alta rápida</p>
          <h3>Nuevo lead</h3>
          <p className="section-subtitle">Creación manual desde recepción, teléfono, presencial o campañas.</p>
        </div>
      </div>

      <div className="form-grid two-columns">
        <label className="field span-2">
          <span>Nombre y apellidos</span>
          <input value={draft.fullName} onChange={(event) => setDraft((current) => ({ ...current, fullName: event.target.value }))} />
        </label>

        <label className="field">
          <span>Centro</span>
          <select value={draft.centerId} onChange={(event) => setDraft((current) => ({ ...current, centerId: event.target.value }))}>
            {centers.map((center) => (
              <option key={center.id} value={center.id}>
                {center.name}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Actividad</span>
          <select
            value={draft.activityInterest}
            onChange={(event) => setDraft((current) => ({ ...current, activityInterest: event.target.value }))}
          >
            <option value="">Sin definir</option>
            {activities.map((activity) => (
              <option key={activity} value={activity}>
                {activity}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Teléfono</span>
          <input value={draft.phone} onChange={(event) => setDraft((current) => ({ ...current, phone: event.target.value }))} />
        </label>

        <label className="field">
          <span>Email</span>
          <input value={draft.email} onChange={(event) => setDraft((current) => ({ ...current, email: event.target.value }))} />
        </label>

        <label className="field">
          <span>Fecha de nacimiento</span>
          <input type="date" value={draft.dateOfBirth} onChange={(event) => setDraft((current) => ({ ...current, dateOfBirth: event.target.value }))} />
        </label>

        <label className="field">
          <span>Origen</span>
          <select value={draft.source} onChange={(event) => setDraft((current) => ({ ...current, source: event.target.value }))}>
            {LEAD_SOURCE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field span-2">
          <span>Qué espera de la clase</span>
          <textarea rows="3" value={draft.expectations} onChange={(event) => setDraft((current) => ({ ...current, expectations: event.target.value }))} />
        </label>

        <div className="inline-actions span-2">
          <button className="primary-button" onClick={onCreate}>
            Crear lead
          </button>
        </div>
      </div>
    </div>
  );
}

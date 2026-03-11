import {
  INBOX_CHANNEL_OPTIONS,
  REQUEST_TYPE_OPTIONS,
  ROUTE_TARGET_OPTIONS,
} from '../../../domain/reference/catalogs';

export function InboxComposer({ draft, setDraft, centers, onCreate }) {
  return (
    <div className="panel">
      <div className="section-header compact-header">
        <div>
          <p className="eyebrow">Nueva entrada</p>
          <h3>Bandeja universal</h3>
          <p className="section-subtitle">
            Crea entradas manuales desde teléfono, presencial, WhatsApp o cualquier canal mientras llegan integraciones reales.
          </p>
        </div>
      </div>

      <div className="form-grid two-columns">
        <label className="field">
          <span>Canal</span>
          <select value={draft.channel} onChange={(event) => setDraft((current) => ({ ...current, channel: event.target.value }))}>
            {INBOX_CHANNEL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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
          <span>Nombre remitente</span>
          <input value={draft.senderName} onChange={(event) => setDraft((current) => ({ ...current, senderName: event.target.value }))} />
        </label>

        <label className="field">
          <span>Contacto</span>
          <input value={draft.senderContact} onChange={(event) => setDraft((current) => ({ ...current, senderContact: event.target.value }))} />
        </label>

        <label className="field span-2">
          <span>Asunto</span>
          <input value={draft.subject} onChange={(event) => setDraft((current) => ({ ...current, subject: event.target.value }))} />
        </label>

        <label className="field span-2">
          <span>Mensaje</span>
          <textarea rows="5" value={draft.message} onChange={(event) => setDraft((current) => ({ ...current, message: event.target.value }))} />
        </label>

        <label className="field">
          <span>Tipo de solicitud</span>
          <select value={draft.requestType} onChange={(event) => setDraft((current) => ({ ...current, requestType: event.target.value }))}>
            <option value="auto">Auto</option>
            {REQUEST_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Derivación sugerida</span>
          <select value={draft.suggestedModuleId} onChange={(event) => setDraft((current) => ({ ...current, suggestedModuleId: event.target.value }))}>
            <option value="auto">Auto</option>
            {ROUTE_TARGET_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Actividad de interés</span>
          <input value={draft.activityInterest} onChange={(event) => setDraft((current) => ({ ...current, activityInterest: event.target.value }))} />
        </label>

        <label className="field">
          <span>Estado</span>
          <select value={draft.status} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value }))}>
            <option value="nuevo">Nuevo</option>
            <option value="clasificado">Clasificado</option>
          </select>
        </label>

        <label className="field span-2">
          <span>Notas internas</span>
          <textarea rows="3" value={draft.notes} onChange={(event) => setDraft((current) => ({ ...current, notes: event.target.value }))} />
        </label>

        <div className="inline-actions span-2">
          <button className="primary-button" onClick={onCreate}>
            Añadir a inbox
          </button>
        </div>
      </div>
    </div>
  );
}

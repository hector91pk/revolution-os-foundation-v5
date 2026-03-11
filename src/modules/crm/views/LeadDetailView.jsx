import {
  CONTACT_CHANNEL_OPTIONS,
  CONTACT_DIRECTION_OPTIONS,
  LEAD_LANGUAGE_OPTIONS,
  LEAD_SOURCE_OPTIONS,
  LEAD_STAGE_OPTIONS,
  NEXT_ACTION_TYPE_OPTIONS,
  REASON_JOINED_OPTIONS,
  REASON_NOT_JOINED_OPTIONS,
  RESERVATION_TYPE_OPTIONS,
} from '../../../domain/reference/catalogs';
import { Panel } from '../../../shared/ui/Panel';
import { SectionHeader } from '../../../shared/ui/SectionHeader';
import {
  formatDateTimeLabel,
  fromDateTimeInputValue,
  toDateTimeInputValue,
} from '../../../shared/utils/date';
import { ContactHistoryList } from '../components/ContactHistoryList';

export function LeadDetailView({
  lead,
  centers,
  activities,
  contactDraft,
  setContactDraft,
  onBack,
  onFieldChange,
  onAddContact,
  onScheduleTrial,
  onMarkTrialCompleted,
  onMarkLost,
}) {
  return (
    <div className="module-stack">
      <SectionHeader
        eyebrow="Ficha de lead"
        title={lead.fullName}
        description={`${lead.centerName} · ${lead.stageLabel}`}
        actions={<button className="ghost-button" onClick={onBack}>Volver</button>}
      />

      <div className="metric-grid">
        <div className="metric-card">
          <span className="metric-label">Edad</span>
          <strong className="metric-value">{lead.age !== null ? `${lead.age}` : '—'}</strong>
          <small className="metric-hint">{lead.ageGroupLabel}</small>
        </div>
        <div className="metric-card">
          <span className="metric-label">Origen</span>
          <strong className="metric-value">{lead.source || '—'}</strong>
          <small className="metric-hint">Canal de captación</small>
        </div>
        <div className="metric-card">
          <span className="metric-label">Próxima acción</span>
          <strong className="metric-value">{lead.nextActionRelativeLabel}</strong>
          <small className="metric-hint">{lead.nextActionLabel || 'Sin definir'}</small>
        </div>
        <div className="metric-card">
          <span className="metric-label">Último contacto</span>
          <strong className="metric-value">{lead.lastContactAt ? formatDateTimeLabel(lead.lastContactAt) : '—'}</strong>
          <small className="metric-hint">{lead.isFirstContactOverdue ? '⚠ primer contacto vencido' : lead.isFollowUpOverdue ? '⚠ seguimiento vencido' : 'SLA ok'}</small>
        </div>
      </div>

      <div className="split-grid align-start">
        <Panel>
          <div className="section-header compact-header">
            <div>
              <p className="eyebrow">Datos y estado</p>
              <h3>Ficha editable</h3>
            </div>
          </div>

          <div className="form-grid two-columns">
            <label className="field span-2">
              <span>Nombre y apellidos</span>
              <input value={lead.fullName} onChange={(event) => onFieldChange('fullName', event.target.value)} />
            </label>

            <label className="field">
              <span>Centro</span>
              <select value={lead.centerId} onChange={(event) => onFieldChange('centerId', event.target.value)}>
                {centers.map((center) => (
                  <option key={center.id} value={center.id}>
                    {center.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Estado CRM</span>
              <select value={lead.pipelineStage} onChange={(event) => onFieldChange('pipelineStage', event.target.value)}>
                {LEAD_STAGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Actividad de interés</span>
              <select value={lead.activityInterest} onChange={(event) => onFieldChange('activityInterest', event.target.value)}>
                <option value="">Sin definir</option>
                {activities.map((activity) => (
                  <option key={activity} value={activity}>
                    {activity}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Origen</span>
              <select value={lead.source} onChange={(event) => onFieldChange('source', event.target.value)}>
                {LEAD_SOURCE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Teléfono</span>
              <input value={lead.phone} onChange={(event) => onFieldChange('phone', event.target.value)} />
            </label>

            <label className="field">
              <span>Email</span>
              <input value={lead.email} onChange={(event) => onFieldChange('email', event.target.value)} />
            </label>

            <label className="field">
              <span>Canal preferido</span>
              <select value={lead.preferredChannel} onChange={(event) => onFieldChange('preferredChannel', event.target.value)}>
                {CONTACT_CHANNEL_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Idioma</span>
              <select value={lead.language} onChange={(event) => onFieldChange('language', event.target.value)}>
                {LEAD_LANGUAGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Fecha de nacimiento</span>
              <input type="date" value={lead.dateOfBirth || ''} onChange={(event) => onFieldChange('dateOfBirth', event.target.value)} />
            </label>

            <label className="field span-2">
              <span>Qué espera de la clase</span>
              <textarea rows="3" value={lead.expectations || ''} onChange={(event) => onFieldChange('expectations', event.target.value)} />
            </label>

            <label className="field">
              <span>Próxima acción</span>
              <input
                type="datetime-local"
                value={toDateTimeInputValue(lead.nextActionAt)}
                onChange={(event) => onFieldChange('nextActionAt', fromDateTimeInputValue(event.target.value))}
              />
            </label>

            <label className="field">
              <span>Tipo de próxima acción</span>
              <select value={lead.nextActionType} onChange={(event) => onFieldChange('nextActionType', event.target.value)}>
                {NEXT_ACTION_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field span-2">
              <span>Etiqueta próxima acción</span>
              <input value={lead.nextActionLabel || ''} onChange={(event) => onFieldChange('nextActionLabel', event.target.value)} />
            </label>

            <label className="field">
              <span>Tipo de reserva</span>
              <select value={lead.reservationType || ''} onChange={(event) => onFieldChange('reservationType', event.target.value)}>
                {RESERVATION_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Fecha / hora prueba</span>
              <input
                type="datetime-local"
                value={toDateTimeInputValue(lead.testClassAt)}
                onChange={(event) => onFieldChange('testClassAt', fromDateTimeInputValue(event.target.value))}
              />
            </label>

            <div className="inline-actions span-2 wrap-actions">
              <button className="ghost-button" onClick={onScheduleTrial}>
                Guardar reserva / prueba
              </button>
              <button className="ghost-button" onClick={onMarkTrialCompleted}>
                Marcar prueba realizada
              </button>
            </div>

            <label className="field">
              <span>Motivo de apuntarse</span>
              <select value={lead.reasonJoined || ''} onChange={(event) => onFieldChange('reasonJoined', event.target.value)}>
                {REASON_JOINED_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Motivo de no apuntarse</span>
              <select value={lead.reasonNotJoined || ''} onChange={(event) => onFieldChange('reasonNotJoined', event.target.value)}>
                {REASON_NOT_JOINED_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="inline-actions span-2">
              <button className="danger-button" onClick={onMarkLost}>
                Marcar como perdido
              </button>
            </div>

            <label className="field span-2">
              <span>Alternativas ofrecidas / notas comerciales</span>
              <textarea rows="3" value={lead.alternativeOfferNotes || ''} onChange={(event) => onFieldChange('alternativeOfferNotes', event.target.value)} />
            </label>

            <label className="field">
              <span>IBAN</span>
              <input value={lead.iban || ''} onChange={(event) => onFieldChange('iban', event.target.value)} />
            </label>

            <label className="field">
              <span>Titular de la cuenta</span>
              <input value={lead.ibanHolder || ''} onChange={(event) => onFieldChange('ibanHolder', event.target.value)} />
            </label>

            <label className="field span-2">
              <span>Notas internas</span>
              <textarea rows="4" value={lead.notes || ''} onChange={(event) => onFieldChange('notes', event.target.value)} />
            </label>
          </div>
        </Panel>

        <div className="module-stack compact-stack">
          <Panel>
            <div className="section-header compact-header">
              <div>
                <p className="eyebrow">Contacto</p>
                <h3>Registrar interacción</h3>
              </div>
            </div>

            <div className="form-grid two-columns">
              <label className="field">
                <span>Canal</span>
                <select
                  value={contactDraft.channel}
                  onChange={(event) => setContactDraft((current) => ({ ...current, channel: event.target.value }))}
                >
                  {CONTACT_CHANNEL_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>Dirección</span>
                <select
                  value={contactDraft.direction}
                  onChange={(event) => setContactDraft((current) => ({ ...current, direction: event.target.value }))}
                >
                  {CONTACT_DIRECTION_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field span-2">
                <span>Resumen</span>
                <textarea
                  rows="3"
                  value={contactDraft.summary}
                  onChange={(event) => setContactDraft((current) => ({ ...current, summary: event.target.value }))}
                />
              </label>

              <label className="field span-2">
                <span>Resultado</span>
                <textarea
                  rows="3"
                  value={contactDraft.outcome}
                  onChange={(event) => setContactDraft((current) => ({ ...current, outcome: event.target.value }))}
                />
              </label>

              <div className="inline-actions span-2">
                <button className="primary-button" onClick={onAddContact}>
                  Añadir contacto al historial
                </button>
              </div>
            </div>
          </Panel>

          <Panel>
            <div className="section-header compact-header">
              <div>
                <p className="eyebrow">Historial</p>
                <h3>Interacciones registradas</h3>
              </div>
            </div>
            <ContactHistoryList items={lead.contactHistory} />
          </Panel>
        </div>
      </div>
    </div>
  );
}

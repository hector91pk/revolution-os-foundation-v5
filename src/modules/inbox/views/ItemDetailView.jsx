import {
  INBOX_CHANNEL_OPTIONS,
  INBOX_STATUS_OPTIONS,
  REQUEST_TYPE_OPTIONS,
  ROUTE_TARGET_OPTIONS,
} from '../../../domain/reference/catalogs';
import { Panel } from '../../../shared/ui/Panel';
import { SectionHeader } from '../../../shared/ui/SectionHeader';
import { formatDateTimeLabel } from '../../../shared/utils/date';

export function ItemDetailView({
  item,
  centers,
  onBack,
  onFieldChange,
  onDeriveToCrm,
  onDeriveToPlanner,
  onOpenDerived,
}) {
  return (
    <div className="module-stack">
      <SectionHeader
        eyebrow="Entrada universal"
        title={item.senderName || item.subject || 'Entrada'}
        description={`${item.channelLabel} · ${item.requestTypeLabel} · ${item.centerName}`}
        actions={<button className="ghost-button" onClick={onBack}>Volver</button>}
      />

      <div className="split-grid align-start">
        <Panel>
          <div className="section-header compact-header">
            <div>
              <p className="eyebrow">Clasificación</p>
              <h3>Ficha de entrada</h3>
            </div>
          </div>

          <div className="form-grid two-columns">
            <label className="field">
              <span>Canal</span>
              <select value={item.channel} onChange={(event) => onFieldChange('channel', event.target.value)}>
                {INBOX_CHANNEL_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Centro</span>
              <select value={item.centerId} onChange={(event) => onFieldChange('centerId', event.target.value)}>
                {centers.map((center) => (
                  <option key={center.id} value={center.id}>
                    {center.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Estado</span>
              <select value={item.status} onChange={(event) => onFieldChange('status', event.target.value)}>
                {INBOX_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Tipo de solicitud</span>
              <select value={item.requestType} onChange={(event) => onFieldChange('requestType', event.target.value)}>
                {REQUEST_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Derivación sugerida</span>
              <select value={item.suggestedModuleId} onChange={(event) => onFieldChange('suggestedModuleId', event.target.value)}>
                {ROUTE_TARGET_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Actividad de interés</span>
              <input value={item.activityInterest || ''} onChange={(event) => onFieldChange('activityInterest', event.target.value)} />
            </label>

            <label className="field">
              <span>Remitente</span>
              <input value={item.senderName || ''} onChange={(event) => onFieldChange('senderName', event.target.value)} />
            </label>

            <label className="field">
              <span>Contacto</span>
              <input value={item.senderContact || ''} onChange={(event) => onFieldChange('senderContact', event.target.value)} />
            </label>

            <label className="field span-2">
              <span>Asunto</span>
              <input value={item.subject || ''} onChange={(event) => onFieldChange('subject', event.target.value)} />
            </label>

            <label className="field span-2">
              <span>Mensaje</span>
              <textarea rows="6" value={item.message || ''} onChange={(event) => onFieldChange('message', event.target.value)} />
            </label>

            <label className="field span-2">
              <span>Notas internas</span>
              <textarea rows="4" value={item.notes || ''} onChange={(event) => onFieldChange('notes', event.target.value)} />
            </label>
          </div>
        </Panel>

        <div className="module-stack compact-stack">
          <Panel>
            <div className="section-header compact-header">
              <div>
                <p className="eyebrow">Router</p>
                <h3>Acciones</h3>
              </div>
            </div>

            <div className="simple-list">
              <p><strong>Recibido:</strong> {formatDateTimeLabel(item.receivedAt)}</p>
              <p><strong>Ruta sugerida:</strong> {item.suggestedModuleLabel}</p>
              <p><strong>Derivado a:</strong> {item.derivedEntityType ? `${item.derivedEntityType} · ${item.derivedEntityId}` : 'Aún no derivado'}</p>
            </div>

            <div className="inline-actions wrap-actions top-gap">
              <button className="ghost-button" onClick={onDeriveToCrm}>
                Crear / enlazar lead en CRM
              </button>
              <button className="ghost-button" onClick={onDeriveToPlanner}>
                Crear tarea en Planner
              </button>
              {item.derivedEntityId ? (
                <button className="primary-button" onClick={onOpenDerived}>
                  Abrir derivación
                </button>
              ) : null}
            </div>
          </Panel>

          <Panel>
            <div className="section-header compact-header">
              <div>
                <p className="eyebrow">Visión operativa</p>
                <h3>Para qué sirve esta entrada</h3>
              </div>
            </div>

            <ul className="simple-list">
              <li>Registrar todo lo que entra antes de perderlo por WhatsApp, email o recepción.</li>
              <li>Clasificar la intención de forma homogénea.</li>
              <li>Derivar a CRM, Planner o módulos futuros sin mezclar responsabilidades.</li>
              <li>Dejar la base lista para automatizaciones e integraciones externas.</li>
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}

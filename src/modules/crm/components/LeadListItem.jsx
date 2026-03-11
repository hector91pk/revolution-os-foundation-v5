import { StatusBadge } from '../../../shared/ui/StatusBadge';

function stageTone(stage) {
  if (stage === 'alumno') return 'success';
  if (stage === 'reserva') return 'warning';
  if (stage === 'perdido') return 'danger';
  if (stage === 'inactivo') return 'neutral';
  return 'info';
}

export function LeadListItem({ lead, onOpen }) {
  return (
    <button className="list-card lead-list-item" onClick={onOpen}>
      <div className="list-card-main">
        <div className="list-card-header">
          <strong>{lead.fullName}</strong>
          <StatusBadge tone={stageTone(lead.pipelineStage)}>{lead.stageLabel}</StatusBadge>
        </div>

        <p className="muted-copy clamp-2">
          {lead.activityInterest || 'Actividad sin definir'} · {lead.centerName}
        </p>

        <small className="muted-caption">
          {lead.email || 'sin email'} · {lead.phone || 'sin teléfono'}
        </small>
      </div>

      <div className="list-card-side">
        <span className="pill">{lead.source || 'sin origen'}</span>
        {lead.age !== null ? <span className="pill">{lead.age} años</span> : <span className="pill">Edad desconocida</span>}
        {lead.isFirstContactOverdue ? <StatusBadge tone="danger">Alerta 24h</StatusBadge> : null}
        {!lead.isFirstContactOverdue && lead.isFollowUpOverdue ? <StatusBadge tone="warning">Seguimiento vencido</StatusBadge> : null}
        <span className="muted-caption">{lead.nextActionRelativeLabel}</span>
      </div>
    </button>
  );
}

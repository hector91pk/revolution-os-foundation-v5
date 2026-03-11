import { StatusBadge } from '../../../shared/ui/StatusBadge';

function toneForStatus(status) {
  if (status === 'nuevo') return 'warning';
  if (status === 'clasificado') return 'info';
  if (status === 'derivado') return 'success';
  return 'neutral';
}

export function InboxItemCard({ item, onOpen }) {
  return (
    <button className="list-card inbox-item-card" onClick={onOpen}>
      <div className="list-card-main">
        <div className="list-card-header">
          <strong>{item.senderName || item.subject || 'Entrada sin remitente'}</strong>
          <StatusBadge tone={toneForStatus(item.status)}>{item.statusLabel}</StatusBadge>
        </div>

        <p className="muted-copy clamp-2">{item.subject || item.message || 'Sin contenido'}</p>

        <small className="muted-caption">
          {item.channelLabel} · {item.centerName}
        </small>
      </div>

      <div className="list-card-side">
        <span className="pill">{item.requestTypeLabel}</span>
        <span className="pill">{item.suggestedModuleLabel}</span>
        {item.derivedEntityType ? <StatusBadge tone="success">Derivado</StatusBadge> : null}
      </div>
    </button>
  );
}

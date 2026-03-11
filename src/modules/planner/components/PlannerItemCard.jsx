import { formatDateLabel } from '../../../shared/utils/date';
import { StatusBadge } from '../../../shared/ui/StatusBadge';

function toneForItem(item) {
  if (item.status === 'hecha') return 'success';
  if (item.kind === 'reservation') return 'warning';
  if (item.kind === 'follow-up') return 'info';
  return 'neutral';
}

export function PlannerItemCard({ item, onToggle, onDelete, onOpen }) {
  return (
    <div className="list-card planner-item-card">
      <div
        className="list-card-main"
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpen();
          }
        }}
      >
        <div className="list-card-header">
          <strong>{item.title}</strong>
          <StatusBadge tone={toneForItem(item)}>{item.kind}</StatusBadge>
        </div>
        <p className="muted-copy clamp-2">{item.description || 'Sin descripción.'}</p>
        <small className="muted-caption">
          {formatDateLabel(item.dueDate)} {item.dueTime ? `· ${item.dueTime}` : ''}
          {item.centerId ? ` · ${item.centerId}` : ''}
        </small>
      </div>

      <div className="list-card-side">
        <button type="button" className="ghost-button small-button" onClick={onToggle}>
          {item.status === 'hecha' ? 'Reabrir' : 'Hecha'}
        </button>
        <button type="button" className="danger-button small-button" onClick={onDelete}>
          Borrar
        </button>
      </div>
    </div>
  );
}
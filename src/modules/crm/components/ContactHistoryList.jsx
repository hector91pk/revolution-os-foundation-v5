import { EmptyState } from '../../../shared/ui/EmptyState';
import { formatDateTimeLabel } from '../../../shared/utils/date';

export function ContactHistoryList({ items }) {
  const ordered = [...(items ?? [])].sort((left, right) => String(right.at).localeCompare(String(left.at)));

  return (
    <div className="timeline-list">
      {ordered.length ? (
        ordered.map((item) => (
          <div key={item.id} className="timeline-item">
            <span className="timeline-dot" />
            <strong>{item.summary || 'Contacto'}</strong>
            <p className="muted-copy">{item.outcome || 'Sin resultado registrado.'}</p>
            <small className="muted-caption">
              {formatDateTimeLabel(item.at)} · {item.channel} · {item.direction}
            </small>
          </div>
        ))
      ) : (
        <EmptyState title="Sin historial" copy="Todavía no hay interacciones registradas para este lead." />
      )}
    </div>
  );
}

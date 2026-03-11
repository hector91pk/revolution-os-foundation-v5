import { EmptyState } from '../../../shared/ui/EmptyState';
import { Panel } from '../../../shared/ui/Panel';
import { formatWeekdayLabel } from '../../../shared/utils/date';
import { PlannerItemCard } from './PlannerItemCard';

export function DayViewSection({ dateKey, items, onOpen, onToggle, onDelete }) {
  return (
    <Panel>
      <div className="card-row-between">
        <div>
          <p className="eyebrow">Agenda diaria</p>
          <h3>{formatWeekdayLabel(dateKey)}</h3>
        </div>
        <span className="pill">{items.length} items</span>
      </div>
      <div className="stack-list compact-list top-gap">
        {items.length ? (
          items.map((item) => (
            <PlannerItemCard
              key={item.id}
              item={item}
              onOpen={() => onOpen(item)}
              onToggle={() => onToggle(item.id)}
              onDelete={() => onDelete(item.id)}
            />
          ))
        ) : (
          <EmptyState title="Día limpio" copy="No hay elementos para este día con los filtros actuales." />
        )}
      </div>
    </Panel>
  );
}
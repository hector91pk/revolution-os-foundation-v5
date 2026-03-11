import { Panel } from '../../../shared/ui/Panel';
import { formatWeekdayLabel } from '../../../shared/utils/date';

export function WeekViewSection({ weeks }) {
  return (
    <div className="week-grid">
      {weeks.map((day) => (
        <Panel key={day.dateKey} className="week-column">
          <div className="card-row-between">
            <strong>{formatWeekdayLabel(day.dateKey)}</strong>
            <span className="pill">{day.items.length}</span>
          </div>
          <div className="mini-list top-gap">
            {day.items.map((item) => (
              <div key={item.id} className="mini-list-item">
                <strong>{item.title}</strong>
                <small>{item.dueTime || item.kind}</small>
              </div>
            ))}
            {!day.items.length ? <small className="muted-caption">Sin entradas</small> : null}
          </div>
        </Panel>
      ))}
    </div>
  );
}

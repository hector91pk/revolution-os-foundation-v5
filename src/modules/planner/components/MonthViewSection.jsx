import { Panel } from '../../../shared/ui/Panel';

export function MonthViewSection({ cells }) {
  return (
    <div className="month-grid">
      {cells.map((cell) => (
        <Panel key={cell.dateKey} className={`month-cell ${cell.isCurrentMonth ? '' : 'is-muted-month'}`}>
          <div className="card-row-between">
            <strong>{cell.date.getDate()}</strong>
            <span className="pill">{cell.items.length}</span>
          </div>
          <div className="mini-list top-gap">
            {cell.items.slice(0, 3).map((item) => (
              <div key={item.id} className="mini-list-item">
                <strong>{item.title}</strong>
                <small>{item.dueTime || item.kind}</small>
              </div>
            ))}
          </div>
        </Panel>
      ))}
    </div>
  );
}

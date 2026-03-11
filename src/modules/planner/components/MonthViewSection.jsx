import { Panel } from '../../../shared/ui/Panel';

export function MonthViewSection({ cells, onOpenItem }) {
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
              <div
                key={item.id}
                className="mini-list-item"
                role="button"
                tabIndex={0}
                onClick={() => onOpenItem(item)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpenItem(item);
                  }
                }}
              >
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
import { Panel } from '../../../shared/ui/Panel';
import { StatusBadge } from '../../../shared/ui/StatusBadge';

export function CategoryCard({ category, stats, onOpen }) {
  return (
    <Panel className="category-card">
      <div className="card-row-between">
        <div>
          <h3>{category.name}</h3>
          <p className="muted-copy">{category.description}</p>
        </div>
        <StatusBadge tone={category.defaultAlignment === 'core' ? 'success' : 'warning'}>
          {category.defaultAlignment === 'core' ? 'Core' : 'Experimental'}
        </StatusBadge>
      </div>

      <div className="mini-stats-grid">
        <div>
          <span>Proyectos</span>
          <strong>{stats.total}</strong>
        </div>
        <div>
          <span>Activos</span>
          <strong>{stats.activos}</strong>
        </div>
        <div>
          <span>Bloqueados</span>
          <strong>{stats.bloqueados}</strong>
        </div>
        <div>
          <span>Sin revisar</span>
          <strong>{stats.stale}</strong>
        </div>
      </div>

      <button className="ghost-button" onClick={onOpen}>
        Entrar en categoría
      </button>
    </Panel>
  );
}

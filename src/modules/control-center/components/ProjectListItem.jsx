import { StatusBadge } from '../../../shared/ui/StatusBadge';

function toneForStatus(status) {
  if (status === 'activo') return 'success';
  if (status === 'bloqueado') return 'danger';
  if (status === 'pausado') return 'warning';
  if (status === 'archivado') return 'neutral';
  return 'info';
}

export function ProjectListItem({ project, onOpen }) {
  return (
    <button className="list-card project-list-item" onClick={onOpen}>
      <div className="list-card-main">
        <div className="list-card-header">
          <strong>{project.name}</strong>
          <StatusBadge tone={toneForStatus(project.status)}>{project.status}</StatusBadge>
        </div>
        <p className="muted-copy clamp-2">{project.description || project.nextStep || 'Sin descripción aún.'}</p>
      </div>
      <div className="list-card-side">
        <span className="pill">Prioridad {project.priority}</span>
        <span className="muted-caption">Siguiente: {project.nextStep || 'Sin definir'}</span>
      </div>
    </button>
  );
}

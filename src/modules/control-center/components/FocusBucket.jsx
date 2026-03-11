import { EmptyState } from '../../../shared/ui/EmptyState';
import { ProjectListItem } from './ProjectListItem';

export function FocusBucket({ title, copy, projects, onOpenProject }) {
  return (
    <section className="panel focus-bucket">
      <h3>{title}</h3>
      <p className="muted-copy">{copy}</p>
      <div className="stack-list compact-list">
        {projects.length ? (
          projects.map((project) => (
            <ProjectListItem key={project.id} project={project} onOpen={() => onOpenProject(project.id)} />
          ))
        ) : (
          <EmptyState title="Nada aquí" copy="No hay elementos en este bloque ahora mismo." />
        )}
      </div>
    </section>
  );
}

import { Panel } from '../../../shared/ui/Panel';
import { SectionHeader } from '../../../shared/ui/SectionHeader';
import { ProjectForm } from '../components/ProjectForm';

export function ProjectView({ project, categories, onBack, onChange, onDelete }) {
  return (
    <div className="module-stack">
      <SectionHeader
        eyebrow="Proyecto"
        title={project.name}
        description="Ficha editable y estable para gestionar estrategia, contexto y siguiente paso."
        actions={<button className="ghost-button" onClick={onBack}>Volver</button>}
      />
      <Panel>
        <ProjectForm project={project} categories={categories} onChange={onChange} onDelete={onDelete} />
      </Panel>
    </div>
  );
}

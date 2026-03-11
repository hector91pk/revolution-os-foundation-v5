import { Panel } from '../../../shared/ui/Panel';
import { SectionHeader } from '../../../shared/ui/SectionHeader';
import { ProjectForm } from '../components/ProjectForm';
import { ProjectTasksPanel } from '../components/ProjectTasksPanel';

export function ProjectView({
  project,
  categories,
  linkedTasks,
  onOpenTask,
  onCreateTask,
  onBack,
  onChange,
  onDelete,
}) {
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

      <ProjectTasksPanel
        tasks={linkedTasks}
        onOpenTask={onOpenTask}
        onCreateTask={onCreateTask}
      />
    </div>
  );
}
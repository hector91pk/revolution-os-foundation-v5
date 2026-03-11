import { SectionHeader } from '../../../shared/ui/SectionHeader';
import { FocusBucket } from '../components/FocusBucket';

export function FocusView({ buckets, onOpenProject }) {
  return (
    <div className="module-stack">
      <SectionHeader
        eyebrow="Vista de foco"
        title="Foco actual"
        description="Qué merece atención ahora, qué está bloqueado y qué lleva demasiado tiempo sin revisarse."
      />
      <div className="responsive-grid focus-grid">
        <FocusBucket title="Prioritarios" copy="Alta prioridad y activos" projects={buckets.priority} onOpenProject={onOpenProject} />
        <FocusBucket title="Bloqueados" copy="Proyectos que requieren destrabar decisión o recurso" projects={buckets.blocked} onOpenProject={onOpenProject} />
        <FocusBucket title="Sin revisar" copy="Elementos que empiezan a quedar fuera del radar" projects={buckets.stale} onOpenProject={onOpenProject} />
        <FocusBucket title="Core" copy="Alineados con el negocio principal" projects={buckets.core} onOpenProject={onOpenProject} />
        <FocusBucket title="Experimental" copy="Laboratorio y apuestas opcionales" projects={buckets.experimental} onOpenProject={onOpenProject} />
      </div>
    </div>
  );
}

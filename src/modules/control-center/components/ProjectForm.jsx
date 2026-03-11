import { ALIGNMENT_OPTIONS, PRIORITY_OPTIONS, PROJECT_STATUS_OPTIONS } from '../../../domain/reference/catalogs';

export function ProjectForm({ project, categories, onChange, onDelete }) {
  return (
    <div className="form-grid two-columns">
      <label className="field span-2">
        <span>Nombre</span>
        <input value={project.name} onChange={(event) => onChange('name', event.target.value)} />
      </label>

      <label className="field">
        <span>Categoría</span>
        <select value={project.categoryId} onChange={(event) => onChange('categoryId', event.target.value)}>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Estado</span>
        <select value={project.status} onChange={(event) => onChange('status', event.target.value)}>
          {PROJECT_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Prioridad</span>
        <select value={project.priority} onChange={(event) => onChange('priority', event.target.value)}>
          {PRIORITY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Alineación</span>
        <select value={project.alignment} onChange={(event) => onChange('alignment', event.target.value)}>
          {ALIGNMENT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="field span-2">
        <span>Descripción</span>
        <textarea rows="4" value={project.description} onChange={(event) => onChange('description', event.target.value)} />
      </label>

      <label className="field span-2">
        <span>Siguiente paso</span>
        <textarea rows="3" value={project.nextStep} onChange={(event) => onChange('nextStep', event.target.value)} />
      </label>

      <label className="field">
        <span>Última revisión</span>
        <input type="date" value={project.lastReview || ''} onChange={(event) => onChange('lastReview', event.target.value)} />
      </label>

      <label className="field">
        <span>Tiempo estimado</span>
        <input value={project.estimatedTime || ''} onChange={(event) => onChange('estimatedTime', event.target.value)} />
      </label>

      <label className="field">
        <span>Interés / motivación (0-10)</span>
        <input type="number" min="0" max="10" value={project.interestLevel} onChange={(event) => onChange('interestLevel', Number(event.target.value))} />
      </label>

      <label className="field">
        <span>Impacto potencial (0-10)</span>
        <input type="number" min="0" max="10" value={project.impactPotential} onChange={(event) => onChange('impactPotential', Number(event.target.value))} />
      </label>

      <label className="field span-2">
        <span>Notas</span>
        <textarea rows="5" value={project.notes} onChange={(event) => onChange('notes', event.target.value)} />
      </label>

      <label className="field span-2">
        <span>Documentación</span>
        <textarea rows="4" value={project.documentation} onChange={(event) => onChange('documentation', event.target.value)} />
      </label>

      <label className="field span-2">
        <span>Ideas</span>
        <textarea rows="4" value={project.ideas} onChange={(event) => onChange('ideas', event.target.value)} />
      </label>

      <label className="field span-2">
        <span>Bloqueos</span>
        <textarea rows="3" value={project.blockers} onChange={(event) => onChange('blockers', event.target.value)} />
      </label>

      <label className="field span-2">
        <span>Enlaces / archivos relacionados</span>
        <textarea rows="3" value={project.relatedLinks} onChange={(event) => onChange('relatedLinks', event.target.value)} />
      </label>

      <div className="danger-zone span-2">
        <div>
          <strong>Eliminar proyecto</strong>
          <p className="muted-copy">Se quitará del panel y se eliminarán también sus enlaces de planner.</p>
        </div>
        <button className="danger-button" onClick={onDelete}>
          Eliminar proyecto
        </button>
      </div>
    </div>
  );
}

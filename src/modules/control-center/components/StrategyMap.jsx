export function StrategyMap({ categories, projectsByCategory, onOpenProject }) {
  return (
    <div className="strategy-map-grid">
      {categories.map((category) => (
        <section key={category.id} className="panel strategy-cluster">
          <div className="card-row-between">
            <div>
              <p className="eyebrow">{category.defaultAlignment === 'core' ? 'Core' : 'Experimental'}</p>
              <h3>{category.name}</h3>
            </div>
            <span className="pill">{projectsByCategory[category.id]?.length ?? 0} nodos</span>
          </div>
          <div className="node-stack">
            {(projectsByCategory[category.id] ?? []).map((project) => (
              <button key={project.id} className="map-node" onClick={() => onOpenProject(project.id)}>
                <strong>{project.name}</strong>
                <small>{project.relatedProjectIds?.length ?? 0} conexiones</small>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

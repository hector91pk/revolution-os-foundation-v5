import { SectionHeader } from '../../../shared/ui/SectionHeader';
import { StrategyMap } from '../components/StrategyMap';

export function MapView({ categories, projectsByCategory, onOpenProject }) {
  return (
    <div className="module-stack">
      <SectionHeader
        eyebrow="Mapa estratégico"
        title="Mapa del cerebro"
        description="Lectura visual por dominios. Base simple y limpia preparada para evolucionar a grafo más rico en futuras iteraciones."
      />
      <StrategyMap categories={categories} projectsByCategory={projectsByCategory} onOpenProject={onOpenProject} />
    </div>
  );
}

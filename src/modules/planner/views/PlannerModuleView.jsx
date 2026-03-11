import { MetricCard } from '../../../shared/ui/MetricCard';
import { SectionHeader } from '../../../shared/ui/SectionHeader';
import { DayViewSection } from '../components/DayViewSection';
import { MonthViewSection } from '../components/MonthViewSection';
import { PlannerComposer } from '../components/PlannerComposer';
import { PlannerToolbar } from '../components/PlannerToolbar';
import { WeekViewSection } from '../components/WeekViewSection';

export function PlannerModuleView({
  view,
  dateKey,
  summary,
  filters,
  setFilters,
  centers,
  linkedEntities,
  draft,
  setDraft,
  onCreate,
  onViewChange,
  onDateChange,
  dayItems,
  weekItems,
  monthItems,
  onOpenItem,
  onToggleItem,
  onDeleteItem,
}) {
  return (
    <div className="module-stack">
      <SectionHeader
        eyebrow="Planner / Tareas"
        title="Agenda operativa"
        description="Núcleo compartido para tareas, reservas, seguimientos y eventos de cualquier módulo."
      />

      <div className="metric-grid">
        <MetricCard label="Total" value={summary.total} />
        <MetricCard label="Hoy" value={summary.today} />
        <MetricCard label="Pendientes" value={summary.pending} />
        <MetricCard label="Reservas" value={summary.reservations} />
        <MetricCard label="Follow-ups" value={summary.followUps} />
      </div>

      <PlannerToolbar
        view={view}
        dateKey={dateKey}
        onViewChange={onViewChange}
        onDateChange={onDateChange}
        filters={filters}
        setFilters={setFilters}
        centers={centers}
      />

      <div className="split-grid align-start">
        <PlannerComposer
          draft={draft}
          setDraft={setDraft}
          centers={centers}
          linkedEntities={linkedEntities}
          onCreate={onCreate}
        />

        {view === 'day' ? (
          <DayViewSection
            dateKey={dateKey}
            items={dayItems}
            onOpen={onOpenItem}
            onToggle={onToggleItem}
            onDelete={onDeleteItem}
          />
        ) : view === 'week' ? (
          <WeekViewSection weeks={weekItems} onOpenItem={onOpenItem} />
        ) : (
          <MonthViewSection cells={monthItems} onOpenItem={onOpenItem} />
        )}
      </div>
    </div>
  );
}
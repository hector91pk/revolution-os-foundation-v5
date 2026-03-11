import { useMemo, useState } from 'react';
import { useAppStore } from '../../app/state/useAppStore';
import { todayKey } from '../../shared/utils/date';
import { parsePlannerRoute, getPlannerTitle } from './routes';
import {
  buildPlannerSummary,
  filterPlannerItems,
  getAvailableLinkedEntities,
  getItemsForDate,
  getItemsForMonth,
  getItemsForWeek,
  normalizePlannerDateKey,
} from './selectors';
import { PlannerModuleView } from './views/PlannerModuleView';

function buildDraft(defaultDate) {
  return {
    title: '',
    description: '',
    kind: 'task',
    priority: 'media',
    dueDate: defaultDate,
    dueTime: '',
    centerId: '',
    linkedEntityType: '',
    linkedEntityId: '',
    linkedValue: '',
  };
}

export function PlannerModule({ subPath, navigateWithinModule }) {
  const { state, actions } = useAppStore();
  const route = useMemo(() => parsePlannerRoute(subPath), [subPath]);
  const [filters, setFilters] = useState({ search: '', centerId: 'all', status: 'all' });
  const [draft, setDraft] = useState(() => buildDraft(route.dateKey || todayKey()));

  const filteredItems = useMemo(
    () => filterPlannerItems(state.planner.items, filters),
    [state.planner.items, filters]
  );
  const summary = useMemo(() => buildPlannerSummary(filteredItems, route.dateKey), [filteredItems, route.dateKey]);
  const linkedEntities = useMemo(() => getAvailableLinkedEntities(state), [state]);

  const dayItems = useMemo(() => getItemsForDate(filteredItems, route.dateKey), [filteredItems, route.dateKey]);
  const weekItems = useMemo(() => getItemsForWeek(filteredItems, route.dateKey), [filteredItems, route.dateKey]);
  const monthItems = useMemo(() => getItemsForMonth(filteredItems, route.dateKey), [filteredItems, route.dateKey]);

  function handleViewChange(nextView) {
    navigateWithinModule(`/${nextView}/${route.dateKey}`);
  }

  function handleDateChange(nextDateKey) {
    const normalized = normalizePlannerDateKey(nextDateKey);
    navigateWithinModule(`/${route.view}/${normalized}`);
    setDraft((current) => ({ ...current, dueDate: normalized }));
  }

  function createItem() {
    if (!draft.title.trim()) return;
    actions.planner.createItem({
      ...draft,
      title: draft.title.trim(),
      description: draft.description.trim(),
      sourceModule: 'planner',
    });
    setDraft(buildDraft(route.dateKey));
  }

  return (
    <PlannerModuleView
      view={route.view}
      dateKey={route.dateKey}
      summary={summary}
      filters={filters}
      setFilters={setFilters}
      centers={state.shared.centers}
      linkedEntities={linkedEntities}
      draft={draft}
      setDraft={setDraft}
      onCreate={createItem}
      onViewChange={handleViewChange}
      onDateChange={handleDateChange}
      dayItems={dayItems}
      weekItems={weekItems}
      monthItems={monthItems}
      onToggleItem={actions.planner.toggleItemStatus}
      onDeleteItem={actions.planner.deleteItem}
    />
  );
}

export { getPlannerTitle };

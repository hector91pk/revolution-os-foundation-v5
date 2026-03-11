import { useMemo, useState } from 'react';
import { useAppStore } from '../../app/state/useAppStore';
import { buildInboxSummary, enrichInboxItem, filterInboxItems, sortInboxItems } from './selectors';
import { getInboxTitle, parseInboxRoute } from './routes';

import { DashboardView } from './views/DashboardView';
import { ItemDetailView } from './views/ItemDetailView';

function buildDraft(defaultCenterId = '') {
  return {
    channel: 'formulario',
    centerId: defaultCenterId,
    senderName: '',
    senderContact: '',
    subject: '',
    message: '',
    requestType: 'auto',
    suggestedModuleId: 'auto',
    activityInterest: '',
    status: 'nuevo',
    notes: '',
  };
}

export function InboxModule({ subPath, navigateWithinModule, navigateModule }) {
  const { state, actions } = useAppStore();
  const route = useMemo(() => parseInboxRoute(subPath), [subPath]);

  const [filters, setFilters] = useState({
    search: '',
    channel: 'all',
    requestType: 'all',
    status: 'all',
    centerId: 'all',
  });

  const defaultCenterId = state.shared.centers?.[0]?.id ?? '';
  const [draft, setDraft] = useState(() => buildDraft(defaultCenterId));

  const enrichedItems = useMemo(
    () => state.inbox.items.map((item) => enrichInboxItem(item, state.shared.centers)),
    [state.inbox.items, state.shared.centers]
  );

  const filteredItems = useMemo(
    () => sortInboxItems(filterInboxItems(enrichedItems, filters)),
    [enrichedItems, filters]
  );

  const summary = useMemo(() => buildInboxSummary(filteredItems), [filteredItems]);

  const selectedItem = useMemo(
    () => enrichedItems.find((item) => item.id === route.itemId),
    [enrichedItems, route.itemId]
  );

  function openItem(itemId) {
    navigateWithinModule(`/item/${encodeURIComponent(itemId)}`);
  }

  function createItemNow() {
    if (!draft.senderName.trim() && !draft.subject.trim() && !draft.message.trim()) {
      return;
    }

    actions.inbox.createItem({
      ...draft,
      senderName: draft.senderName.trim(),
      senderContact: draft.senderContact.trim(),
      subject: draft.subject.trim(),
      message: draft.message.trim(),
      notes: draft.notes.trim(),
    });

    setDraft(buildDraft(draft.centerId || defaultCenterId));
  }

  function updateSelectedField(field, value) {
    if (!selectedItem) return;
    actions.inbox.updateItem(selectedItem.id, { [field]: value });
  }

  function deriveSelectedToCrm() {
    if (!selectedItem) return;
    actions.inbox.deriveToCrm(selectedItem.id);
  }

  function deriveSelectedToPlanner() {
    if (!selectedItem) return;
    actions.inbox.deriveToPlanner(selectedItem.id);
  }

  function openDerivedEntity() {
    if (!selectedItem?.derivedEntityId) return;

    if (selectedItem.derivedEntityType === 'lead') {
      navigateModule('leads-crm', `/lead/${encodeURIComponent(selectedItem.derivedEntityId)}`);
      return;
    }

    if (selectedItem.derivedEntityType === 'planner-item') {
      navigateModule('planner', '/day/' + String(new Date().toISOString()).slice(0, 10));
    }
  }

  if (route.view === 'item' && selectedItem) {
    return (
      <ItemDetailView
        item={selectedItem}
        centers={state.shared.centers}
        onBack={() => navigateWithinModule('/dashboard')}
        onFieldChange={updateSelectedField}
        onDeriveToCrm={deriveSelectedToCrm}
        onDeriveToPlanner={deriveSelectedToPlanner}
        onOpenDerived={openDerivedEntity}
      />
    );
  }

  return (
    <DashboardView
      summary={summary}
      items={filteredItems}
      filters={filters}
      setFilters={setFilters}
      centers={state.shared.centers}
      draft={draft}
      setDraft={setDraft}
      onCreateItem={createItemNow}
      onOpenItem={openItem}
      onDeleteItem={actions.inbox.deleteItem}
      canDeleteItems={state.session.activeRoleId === 'founder'}
    />
  );
}

export { getInboxTitle };

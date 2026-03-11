import { useMemo, useState } from 'react';
import { useAppStore } from '../../app/state/useAppStore';
import { buildCenterMetrics, buildCrmSummary, enrichLead, filterLeads, sortLeads } from './selectors';
import { getCrmTitle, parseCrmRoute } from './routes';
import { DashboardView } from './views/DashboardView';
import { LeadDetailView } from './views/LeadDetailView';

function buildLeadDraft(defaultCenterId = '') {
  return {
    centerId: defaultCenterId,
    fullName: '',
    activityInterest: '',
    phone: '',
    email: '',
    source: 'formulario-web',
    expectations: '',
    dateOfBirth: '',
  };
}

function buildContactDraft() {
  return {
    channel: 'whatsapp',
    direction: 'saliente',
    summary: '',
    outcome: '',
  };
}

export function LeadsCrmModule({ subPath, navigateWithinModule }) {
  const { state, actions } = useAppStore();
  const route = useMemo(() => parseCrmRoute(subPath), [subPath]);
  const defaultCenterId = state.shared.centers?.[0]?.id ?? '';

  const [filters, setFilters] = useState({
    search: '',
    centerId: 'all',
    activity: 'all',
    source: 'all',
    ageGroup: 'all',
    stage: 'all',
  });

  const [draft, setDraft] = useState(() => buildLeadDraft(defaultCenterId));
  const [contactDraft, setContactDraft] = useState(() => buildContactDraft());

  const enrichedLeads = useMemo(
    () => state.crm.leads.map((lead) => enrichLead(lead, state.shared.centers)),
    [state.crm.leads, state.shared.centers]
  );

  const filteredLeads = useMemo(
    () => sortLeads(filterLeads(enrichedLeads, filters)),
    [enrichedLeads, filters]
  );

  const summary = useMemo(() => buildCrmSummary(filteredLeads), [filteredLeads]);

  const centerMetrics = useMemo(
    () =>
      buildCenterMetrics(
        filterLeads(enrichedLeads, {
          ...filters,
          centerId: 'all',
        }),
        state.shared.centers
      ),
    [enrichedLeads, filters, state.shared.centers]
  );

  const selectedLead = useMemo(
    () => enrichedLeads.find((lead) => lead.id === route.leadId),
    [enrichedLeads, route.leadId]
  );

  function openLead(leadId) {
    navigateWithinModule(`/lead/${encodeURIComponent(leadId)}`);
  }

  function createLeadNow() {
    if (!draft.fullName.trim() || !draft.centerId) {
      return;
    }

    const created = actions.crm.createLead({
      centerId: draft.centerId,
      fullName: draft.fullName.trim(),
      activityInterest: draft.activityInterest,
      phone: draft.phone,
      email: draft.email,
      source: draft.source,
      expectations: draft.expectations,
      dateOfBirth: draft.dateOfBirth,
    });

    setDraft(buildLeadDraft(draft.centerId));
    openLead(created.id);
  }

  function updateSelectedLeadField(field, value) {
    if (!selectedLead) return;
    actions.crm.updateLead(selectedLead.id, { [field]: value });
  }

  function addContactToSelectedLead() {
    if (!selectedLead || !contactDraft.summary.trim()) {
      return;
    }

    actions.crm.addContact(selectedLead.id, {
      ...contactDraft,
      summary: contactDraft.summary.trim(),
      outcome: contactDraft.outcome.trim(),
    });

    setContactDraft(buildContactDraft());
  }

  function scheduleTrialForSelectedLead() {
    if (!selectedLead || !selectedLead.testClassAt) {
      return;
    }

    actions.crm.scheduleTrial(selectedLead.id, {
      testClassAt: selectedLead.testClassAt,
      reservationType: selectedLead.reservationType || 'clase-prueba',
    });
  }

  function markTrialCompletedForSelectedLead() {
    if (!selectedLead) return;
    actions.crm.markTrialCompleted(selectedLead.id);
  }

  function markSelectedLeadLost() {
    if (!selectedLead) return;
    if (!selectedLead.reasonNotJoined) {
      window.alert('Selecciona antes un motivo de no apuntarse.');
      return;
    }
    actions.crm.markLost(selectedLead.id, selectedLead.reasonNotJoined);
  }

  if (route.view === 'lead' && selectedLead) {
    return (
      <LeadDetailView
        lead={selectedLead}
        centers={state.shared.centers}
        activities={state.shared.activities}
        contactDraft={contactDraft}
        setContactDraft={setContactDraft}
        onBack={() => navigateWithinModule('/dashboard')}
        onFieldChange={updateSelectedLeadField}
        onAddContact={addContactToSelectedLead}
        onScheduleTrial={scheduleTrialForSelectedLead}
        onMarkTrialCompleted={markTrialCompletedForSelectedLead}
        onMarkLost={markSelectedLeadLost}
      />
    );
  }

  return (
    <DashboardView
      leads={filteredLeads}
      summary={summary}
      centerMetrics={centerMetrics}
      filters={filters}
      setFilters={setFilters}
      centers={state.shared.centers}
      activities={state.shared.activities}
      draft={draft}
      setDraft={setDraft}
      onCreateLead={createLeadNow}
      onDeleteLead={actions.crm.deleteLead}
      canDeleteLeads={state.session.activeRoleId === 'founder'}
      onImportCsv={actions.crm.importCsv}
      onOpenLead={openLead}
    />
  );
}

export { getCrmTitle };

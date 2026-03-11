import {
  AGE_GROUP_OPTIONS,
  LEAD_SOURCE_OPTIONS,
  LEAD_STAGE_OPTIONS,
} from '../../../domain/reference/catalogs';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { Panel } from '../../../shared/ui/Panel';
import { SectionHeader } from '../../../shared/ui/SectionHeader';
import { CsvImportPanel } from '../components/CsvImportPanel';
import { LeadListItem } from '../components/LeadListItem';
import { LeadQuickForm } from '../components/LeadQuickForm';
import { MetricsPanel } from '../components/MetricsPanel';

export function DashboardView({
  leads,
  summary,
  centerMetrics,
  filters,
  setFilters,
  centers,
  activities,
  draft,
  setDraft,
  onCreateLead,
  onImportCsv,
  onOpenLead,
  onDeleteLead,
  canDeleteLeads,
}) {
  return (
    <div className="module-stack">
      <SectionHeader
        eyebrow="Comercial / CRM"
        title="Leads / CRM"
        description="Embudo comercial multi-centro con seguimiento, métricas, importación y alertas operativas."
      />

      <MetricsPanel summary={summary} centerMetrics={centerMetrics} />

      <div className="split-grid align-start">
        <div className="module-stack compact-stack">
          <LeadQuickForm
            draft={draft}
            setDraft={setDraft}
            centers={centers}
            activities={activities}
            onCreate={onCreateLead}
          />
          <CsvImportPanel onImport={onImportCsv} />
        </div>

        <Panel>
          <div className="section-header compact-header">
            <div>
              <p className="eyebrow">Pipeline</p>
              <h3>Leads activos</h3>
              <p className="section-subtitle">Filtra por centro, actividad, origen, edad o estado.</p>
            </div>
            <span className="pill">{leads.length} resultados</span>
          </div>

          <div className="toolbar-grid">
            <label className="field slim-field">
              <span>Buscar</span>
              <input value={filters.search} onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))} />
            </label>

            <label className="field slim-field">
              <span>Centro</span>
              <select value={filters.centerId} onChange={(event) => setFilters((current) => ({ ...current, centerId: event.target.value }))}>
                <option value="all">Todos</option>
                {centers.map((center) => (
                  <option key={center.id} value={center.id}>
                    {center.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="field slim-field">
              <span>Actividad</span>
              <select value={filters.activity} onChange={(event) => setFilters((current) => ({ ...current, activity: event.target.value }))}>
                <option value="all">Todas</option>
                {activities.map((activity) => (
                  <option key={activity} value={activity}>
                    {activity}
                  </option>
                ))}
              </select>
            </label>

            <label className="field slim-field">
              <span>Origen</span>
              <select value={filters.source} onChange={(event) => setFilters((current) => ({ ...current, source: event.target.value }))}>
                <option value="all">Todos</option>
                {LEAD_SOURCE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field slim-field">
              <span>Grupo de edad</span>
              <select value={filters.ageGroup} onChange={(event) => setFilters((current) => ({ ...current, ageGroup: event.target.value }))}>
                {AGE_GROUP_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field slim-field">
              <span>Estado</span>
              <select value={filters.stage} onChange={(event) => setFilters((current) => ({ ...current, stage: event.target.value }))}>
                <option value="all">Todos</option>
                {LEAD_STAGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="stack-list compact-list top-gap">
            {leads.length ? (
              leads.map((lead) => (
                <LeadListItem
                  key={lead.id}
                  lead={lead}
                  onOpen={() => onOpenLead(lead.id)}
                  onDelete={onDeleteLead}
                  canDelete={canDeleteLeads}
                />
              ))
            ) : (
              <EmptyState title="Sin leads" copy="No hay resultados con los filtros actuales o aún no has creado/importado ninguno." />
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}

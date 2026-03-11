import {
  INBOX_CHANNEL_OPTIONS,
  INBOX_STATUS_OPTIONS,
  REQUEST_TYPE_OPTIONS,
} from '../../../domain/reference/catalogs';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { MetricCard } from '../../../shared/ui/MetricCard';
import { Panel } from '../../../shared/ui/Panel';
import { SectionHeader } from '../../../shared/ui/SectionHeader';
import { InboxComposer } from '../components/InboxComposer';
import { InboxItemCard } from '../components/InboxItemCard';

export function DashboardView({
  summary,
  items,
  filters,
  setFilters,
  centers,
  draft,
  setDraft,
  onCreateItem,
  onOpenItem,
}) {
  return (
    <div className="module-stack">
      <SectionHeader
        eyebrow="Recepción / Router"
        title="Inbox / Router"
        description="Bandeja universal con clasificación y derivación. Base real para conectar entradas externas sin mezclar lógica con módulos de negocio."
      />

      <div className="metric-grid">
        <MetricCard label="Total" value={summary.total} />
        <MetricCard label="Nuevos" value={summary.nuevos} />
        <MetricCard label="Clasificados" value={summary.clasificados} />
        <MetricCard label="Derivados" value={summary.derivados} />
        <MetricCard label="Para CRM" value={summary.paraCrm} />
        <MetricCard label="Para Planner" value={summary.paraPlanner} />
      </div>

      <div className="split-grid align-start">
        <InboxComposer
          draft={draft}
          setDraft={setDraft}
          centers={centers}
          onCreate={onCreateItem}
        />

        <Panel>
          <div className="section-header compact-header">
            <div>
              <p className="eyebrow">Entradas</p>
              <h3>Bandeja operativa</h3>
              <p className="section-subtitle">Filtro rápido por canal, tipo, estado o centro.</p>
            </div>
            <span className="pill">{items.length} resultados</span>
          </div>

          <div className="toolbar-grid">
            <label className="field slim-field">
              <span>Buscar</span>
              <input value={filters.search} onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))} />
            </label>

            <label className="field slim-field">
              <span>Canal</span>
              <select value={filters.channel} onChange={(event) => setFilters((current) => ({ ...current, channel: event.target.value }))}>
                <option value="all">Todos</option>
                {INBOX_CHANNEL_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field slim-field">
              <span>Tipo</span>
              <select value={filters.requestType} onChange={(event) => setFilters((current) => ({ ...current, requestType: event.target.value }))}>
                <option value="all">Todos</option>
                {REQUEST_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field slim-field">
              <span>Estado</span>
              <select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
                <option value="all">Todos</option>
                {INBOX_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
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
          </div>

          <div className="stack-list compact-list top-gap">
            {items.length ? (
              items.map((item) => (
                <InboxItemCard key={item.id} item={item} onOpen={() => onOpenItem(item.id)} />
              ))
            ) : (
              <EmptyState title="Inbox vacía" copy="No hay entradas con los filtros actuales." />
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}

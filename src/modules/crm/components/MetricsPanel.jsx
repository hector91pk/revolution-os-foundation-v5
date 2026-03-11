import { MetricCard } from '../../../shared/ui/MetricCard';
import { Panel } from '../../../shared/ui/Panel';

export function MetricsPanel({ summary, centerMetrics }) {
  return (
    <div className="module-stack compact-stack">
      <div className="metric-grid">
        <MetricCard label="Leads totales" value={summary.total} />
        <MetricCard label="Pruebas realizadas" value={summary.trialsCompleted} />
        <MetricCard label="Alumnos inscritos" value={summary.students} />
        <MetricCard label="Lead → prueba" value={summary.leadToTrialRatioLabel} />
        <MetricCard label="Prueba → alumno" value={summary.trialToStudentRatioLabel} />
        <MetricCard label="Lead → alumno" value={summary.leadToStudentRatioLabel} />
      </div>

      <div className="metric-grid">
        <MetricCard label="Alerta 24h" value={summary.firstContactAlerts} hint="Primer contacto vencido" />
        <MetricCard label="Seguimiento 48h" value={summary.followUpAlerts} hint="Próxima acción vencida" />
      </div>

      <div className="responsive-grid center-metrics-grid">
        {centerMetrics.map((entry) => (
          <Panel key={entry.center.id} className="center-metric-card">
            <div className="card-row-between">
              <div>
                <p className="eyebrow">Centro</p>
                <h3>{entry.center.name}</h3>
              </div>
              <span className="pill">{entry.metrics.total} leads</span>
            </div>
            <div className="mini-stats-grid top-gap">
              <div>
                <span>Pruebas</span>
                <strong>{entry.metrics.trialsCompleted}</strong>
              </div>
              <div>
                <span>Alumnos</span>
                <strong>{entry.metrics.students}</strong>
              </div>
              <div>
                <span>Lead → prueba</span>
                <strong>{entry.metrics.leadToTrialRatioLabel}</strong>
              </div>
              <div>
                <span>Lead → alumno</span>
                <strong>{entry.metrics.leadToStudentRatioLabel}</strong>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}

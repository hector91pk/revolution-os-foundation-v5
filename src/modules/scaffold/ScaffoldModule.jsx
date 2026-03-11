import { integrationRegistry } from '../../integrations/registry';
import { Panel } from '../../shared/ui/Panel';
import { SectionHeader } from '../../shared/ui/SectionHeader';
import { scaffoldModuleConfigs } from './moduleConfigs';

export function buildScaffoldTitle(moduleId, state) {
  const appName = state.meta.appName ?? 'R-evolution OS';
  return `${scaffoldModuleConfigs[moduleId]?.title || moduleId} · ${appName}`;
}

export function ScaffoldModule({ moduleId, title }) {
  const config = scaffoldModuleConfigs[moduleId] || {
    summary: 'Módulo preparado para crecer.',
    goals: [],
    integrations: [],
  };

  const relevantIntegrations = integrationRegistry.filter((item) => config.integrations.includes(item.label) || config.integrations.includes(item.id));

  return (
    <div className="module-stack">
      <SectionHeader
        eyebrow="Foundation / preparado"
        title={title}
        description={config.summary}
      />
      <div className="split-grid align-start">
        <Panel>
          <h3>Qué queda preparado</h3>
          <ul className="simple-list">
            {config.goals.map((goal) => (
              <li key={goal}>{goal}</li>
            ))}
          </ul>
        </Panel>
        <Panel>
          <h3>Integraciones futuras</h3>
          <ul className="simple-list">
            {(relevantIntegrations.length ? relevantIntegrations : integrationRegistry).map((integration) => (
              <li key={integration.id}>
                <strong>{integration.label}</strong>
                <p className="muted-copy">{integration.notes}</p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

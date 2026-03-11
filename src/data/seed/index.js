import { seedActivities, seedCenters, seedRoles } from './shared';
import { seedCategories, seedProjects } from './controlCenter';
import { seedLeads } from './crm';
import { seedPlannerItems } from './planner';
import { seedInboxItems } from './inbox';

export const seedState = {
  meta: {
    appName: 'R-evolution OS',
    description: 'Foundation release modular para dirección, CRM, planner e inbox de R-evolution.',
    schemaVersion: 5,
    staleAfterDays: 21,
    foundationVersion: '5.0.0',
  },
  session: {
    activeRoleId: 'founder',
  },
  shared: {
    roles: seedRoles,
    centers: seedCenters,
    activities: seedActivities,
  },
  controlCenter: {
    categories: seedCategories,
    projects: seedProjects,
  },
  planner: {
    items: seedPlannerItems,
  },
  crm: {
    leads: seedLeads,
  },
  inbox: {
    items: seedInboxItems,
  },
};

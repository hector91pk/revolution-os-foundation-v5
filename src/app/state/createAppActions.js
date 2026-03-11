import { createId } from '../../shared/utils/id';
import { createProject, deleteProject, updateProject } from '../../modules/control-center/services/projectService';
import { createPlannerItem, deletePlannerItem, togglePlannerItemStatus, updatePlannerItem } from '../../modules/planner/services/plannerService';
import {
  addLeadContact,
  createLead,
  deleteLead,
  importLeadsFromCsv,
  markLeadLost,
  markTrialCompleted,
  scheduleLeadTrial,
  updateLead,
} from '../../modules/crm/services/leadService';

import {
  createInboxItem,
  deleteInboxItem,
  deriveInboxItemToLead,
  deriveInboxItemToPlanner,
  updateInboxItem,
} from '../../modules/inbox/services/inboxService';

export function createAppActions({ updateState, resetToSeed, replaceState }) {
  return {
    app: {
      reset: resetToSeed,
      replaceState,
    },
    session: {
      setActiveRole(roleId) {
        updateState((state) => ({
          ...state,
          session: {
            ...state.session,
            activeRoleId: roleId,
          },
        }));
      },
    },
    controlCenter: {
      createProject(payload) {
        const project = { id: createId('project', payload.name), ...payload };
        updateState((state) => createProject(state, project));
        return project;
      },
      updateProject(projectId, patch) {
        updateState((state) => updateProject(state, projectId, patch));
      },
      deleteProject(projectId) {
        updateState((state) => deleteProject(state, projectId));
      },
    },
    planner: {
      createItem(payload) {
        const item = { id: createId('planner', payload.title), ...payload };
        updateState((state) => createPlannerItem(state, item));
        return item;
      },
      updateItem(itemId, patch) {
        updateState((state) => updatePlannerItem(state, itemId, patch));
      },
      deleteItem(itemId) {
        updateState((state) => deletePlannerItem(state, itemId));
      },
      toggleItemStatus(itemId) {
        updateState((state) => togglePlannerItemStatus(state, itemId));
      },
    },
    crm: {
      createLead(payload) {
        const lead = { id: createId('lead', payload.fullName), ...payload };
        updateState((state) => createLead(state, lead));
        return lead;
      },
      updateLead(leadId, patch) {
        updateState((state) => updateLead(state, leadId, patch));
      },
      addContact(leadId, payload) {
        updateState((state) => addLeadContact(state, leadId, payload));
      },
      markLost(leadId, reason) {
        updateState((state) => markLeadLost(state, leadId, reason));
      },
      scheduleTrial(leadId, payload) {
        updateState((state) => scheduleLeadTrial(state, leadId, payload));
      },
      markTrialCompleted(leadId) {
        updateState((state) => markTrialCompleted(state, leadId));
      },
      importCsv(text) {
        updateState((state) => importLeadsFromCsv(state, text));
      },
      deleteLead(leadId) {
        updateState((state) => deleteLead(state, leadId));
      },
    },
    inbox: {
      createItem(payload) {
        updateState((state) => createInboxItem(state, payload));
      },
      updateItem(itemId, patch) {
        updateState((state) => updateInboxItem(state, itemId, patch));
      },
      deriveToCrm(itemId) {
        updateState((state) => deriveInboxItemToLead(state, itemId));
      },
      deriveToPlanner(itemId) {
        updateState((state) => deriveInboxItemToPlanner(state, itemId));
      },
      deleteItem(itemId) {
        updateState((state) => deleteInboxItem(state, itemId));
      },
    },
  };
}

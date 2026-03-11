import { createLeadEntity } from '../../domain/crm/factories';
import { createInboxItemEntity } from '../../domain/inbox/factories';
import { createPlannerItemEntity } from '../../domain/planner/factories';
import { createProjectEntity } from '../../domain/control-center/factories';
import { deepClone } from '../../shared/utils/clone';

function normalizeFoundationState(seedState, state) {
  const defaultCenterId = state?.shared?.centers?.[0]?.id ?? seedState.shared.centers[0]?.id ?? '';

  return {
    meta: {
      ...seedState.meta,
      ...(state.meta ?? {}),
      schemaVersion: seedState.meta.schemaVersion,
      foundationVersion: seedState.meta.foundationVersion,
    },
    session: {
      ...seedState.session,
      ...(state.session ?? {}),
    },
    shared: {
      roles:
        Array.isArray(state.shared?.roles) && state.shared.roles.length
          ? deepClone(state.shared.roles)
          : deepClone(seedState.shared.roles),
      centers:
        Array.isArray(state.shared?.centers) && state.shared.centers.length
          ? deepClone(state.shared.centers)
          : deepClone(seedState.shared.centers),
      activities:
        Array.isArray(state.shared?.activities) && state.shared.activities.length
          ? deepClone(state.shared.activities)
          : deepClone(seedState.shared.activities),
    },
    controlCenter: {
      categories:
        Array.isArray(state.controlCenter?.categories) && state.controlCenter.categories.length
          ? deepClone(state.controlCenter.categories)
          : deepClone(seedState.controlCenter.categories),
      projects: Array.isArray(state.controlCenter?.projects)
        ? state.controlCenter.projects.map((project) => createProjectEntity(project))
        : deepClone(seedState.controlCenter.projects),
    },
    planner: {
      items: Array.isArray(state.planner?.items)
        ? state.planner.items.map((item) => createPlannerItemEntity(item))
        : deepClone(seedState.planner.items),
    },
    crm: {
      leads: Array.isArray(state.crm?.leads)
        ? state.crm.leads.map((lead) => createLeadEntity(lead, lead.centerId || defaultCenterId))
        : deepClone(seedState.crm.leads),
    },
    inbox: {
      items: Array.isArray(state.inbox?.items)
        ? state.inbox.items.map((item) => createInboxItemEntity(item))
        : deepClone(seedState.inbox.items),
    },
  };
}

function migrateLegacyPlanner(state) {
  const taskItems = Array.isArray(state.tasks)
    ? state.tasks.map((task) =>
        createPlannerItemEntity({
          id: task.id,
          kind: 'task',
          title: task.title,
          description: task.notes,
          dueDate: task.createdAt?.slice(0, 10) || '',
          dueTime: task.createdAt?.slice(11, 16) || '',
          status: task.status === 'hecha' ? 'hecha' : 'pendiente',
          priority: task.priority,
          linkedEntityType: task.linkedProjectId ? 'project' : '',
          linkedEntityId: task.linkedProjectId || '',
          sourceModule: 'planner',
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
        })
      )
    : [];

  const calendarItems = Array.isArray(state.calendarEntries)
    ? state.calendarEntries.map((entry) =>
        createPlannerItemEntity({
          id: entry.id,
          kind: entry.itemType === 'project' ? 'event' : 'task',
          title: entry.title || entry.label || 'Planificación',
          description: entry.note || '',
          dueDate: entry.dateKey || entry.date || '',
          dueTime: entry.time || '',
          status: entry.completed ? 'hecha' : 'pendiente',
          priority: entry.priority || 'media',
          linkedEntityType: entry.itemType === 'project' ? 'project' : 'task',
          linkedEntityId: entry.linkedId || '',
          sourceModule: 'planner',
          createdAt: entry.createdAt,
          updatedAt: entry.updatedAt,
        })
      )
    : [];

  return [...taskItems, ...calendarItems];
}

function migrateLegacyState(seedState, state) {
  const legacyCenters = Array.isArray(state.centers) && state.centers.length ? state.centers : seedState.shared.centers;
  const defaultCenterId = legacyCenters[0]?.id ?? '';

  return normalizeFoundationState(seedState, {
    meta: state.meta,
    session: state.session,
    shared: {
      roles: state.roles,
      centers: state.centers,
      activities: seedState.shared.activities,
    },
    controlCenter: {
      categories: state.categories,
      projects: state.projects,
    },
    planner: {
      items: migrateLegacyPlanner(state),
    },
    crm: {
      leads: Array.isArray(state.leads)
        ? state.leads.map((lead) =>
            createLeadEntity(
              {
                ...lead,
                fullName: lead.fullName || lead.name || '',
                activityInterest: lead.activityInterest || lead.activity || '',
                pipelineStage: lead.pipelineStage || 'primer-contacto',
                expectations: lead.expectations || '',
                dateOfBirth: lead.dateOfBirth || '',
                reasonJoined: lead.reasonJoined || '',
                reasonNotJoined: lead.reasonNotJoined || '',
              },
              lead.centerId || defaultCenterId
            )
          )
        : [],
    },
    inbox: {
      items: [],
    },
  });
}

export function migrateLoadedState(seedState, loadedState) {
  if (!loadedState || typeof loadedState !== 'object') {
    return deepClone(seedState);
  }

  if (loadedState.controlCenter || loadedState.crm || loadedState.planner || loadedState.inbox) {
    return normalizeFoundationState(seedState, loadedState);
  }

  if (loadedState.projects || loadedState.categories || loadedState.leads || loadedState.tasks) {
    return migrateLegacyState(seedState, loadedState);
  }

  return deepClone(seedState);
}

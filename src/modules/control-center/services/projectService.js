import { createProjectEntity } from '../../../domain/control-center/factories';
import { nowIso } from '../../../shared/utils/date';

export function createProject(state, payload) {
  const project = createProjectEntity(payload);

  return {
    ...state,
    controlCenter: {
      ...state.controlCenter,
      projects: [project, ...state.controlCenter.projects],
    },
  };
}

export function updateProject(state, projectId, patch) {
  return {
    ...state,
    controlCenter: {
      ...state.controlCenter,
      projects: state.controlCenter.projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              ...patch,
              updatedAt: nowIso(),
            }
          : project
      ),
    },
  };
}

export function deleteProject(state, projectId) {
  return {
    ...state,
    controlCenter: {
      ...state.controlCenter,
      projects: state.controlCenter.projects
        .filter((project) => project.id !== projectId)
        .map((project) => ({
          ...project,
          relatedProjectIds: (project.relatedProjectIds ?? []).filter((relatedId) => relatedId !== projectId),
        })),
    },
    planner: {
      ...state.planner,
      items: state.planner.items.filter(
        (item) => !(item.linkedEntityType === 'project' && item.linkedEntityId === projectId)
      ),
    },
  };
}

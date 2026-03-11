import { createPlannerItemEntity } from '../../../domain/planner/factories';
import { nowIso } from '../../../shared/utils/date';

export function createPlannerItem(state, payload) {
  const item = createPlannerItemEntity(payload);
  return {
    ...state,
    planner: {
      ...state.planner,
      items: [item, ...state.planner.items],
    },
  };
}

export function updatePlannerItem(state, itemId, patch) {
  return {
    ...state,
    planner: {
      ...state.planner,
      items: state.planner.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              ...patch,
              updatedAt: nowIso(),
            }
          : item
      ),
    },
  };
}

export function deletePlannerItem(state, itemId) {
  return {
    ...state,
    planner: {
      ...state.planner,
      items: state.planner.items.filter((item) => item.id !== itemId),
    },
  };
}

export function togglePlannerItemStatus(state, itemId) {
  return {
    ...state,
    planner: {
      ...state.planner,
      items: state.planner.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status: item.status === 'hecha' ? 'pendiente' : 'hecha',
              updatedAt: nowIso(),
            }
          : item
      ),
    },
  };
}

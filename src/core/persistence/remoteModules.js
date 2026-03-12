export const REMOTE_SHARED_MODULE_IDS = ['crm', 'planner', 'inbox', 'controlCenter'];

export function getRemoteModuleSlice(state, moduleId) {
  switch (moduleId) {
    case 'crm':
      return state.crm;
    case 'planner':
      return state.planner;
    case 'inbox':
      return state.inbox;
    case 'controlCenter':
      return state.controlCenter;
    default:
      return null;
  }
}

export function mergeRemoteModulesIntoState(state, remoteModules = {}) {
  let nextState = state;

  REMOTE_SHARED_MODULE_IDS.forEach((moduleId) => {
    if (Object.prototype.hasOwnProperty.call(remoteModules, moduleId) && remoteModules[moduleId]) {
      nextState = {
        ...nextState,
        [moduleId]: remoteModules[moduleId],
      };
    }
  });

  return nextState;
}

export function stableSerializeRemoteModule(moduleId, payload) {
  return JSON.stringify({
    moduleId,
    payload,
  });
}
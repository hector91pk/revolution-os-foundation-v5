import { seedState } from '../../data/seed';
import { deepClone } from '../../shared/utils/clone';
import { migrateLoadedState } from './migrations';
import { mergeRemoteModulesIntoState } from './remoteModules';
import {
  getRemoteSyncStateSnapshot,
  persistRemoteModules,
  startRemoteSession,
} from './remoteSession';
import { LEGACY_STORAGE_KEYS, STORAGE_KEY } from './storageKeys';

function getStoredPayload() {
  if (typeof window === 'undefined') {
    return null;
  }

  for (const key of [STORAGE_KEY, ...LEGACY_STORAGE_KEYS]) {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      continue;
    }

    try {
      return { key, data: JSON.parse(raw) };
    } catch (error) {
      console.error('No se pudo parsear almacenamiento local:', error);
    }
  }

  return null;
}

export function loadAppState() {
  if (typeof window === 'undefined') {
    return deepClone(seedState);
  }

  try {
    const stored = getStoredPayload();
    if (!stored) {
      return deepClone(seedState);
    }

    const migrated = migrateLoadedState(seedState, stored.data);
    if (stored.key !== STORAGE_KEY) {
      saveAppState(migrated);
    }
    return migrated;
  } catch (error) {
    console.error('No se pudo cargar el estado de la app:', error);
    return deepClone(seedState);
  }
}

export function saveAppState(state) {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('No se pudo guardar el estado local:', error);
    }
  }

  void persistRemoteModules(state);
}

export function connectAppRepository({ onRemoteState, onStatusChange }) {
  return startRemoteSession({
    onRemoteModules: onRemoteState,
    onStatusChange,
  });
}

export function mergeRemoteStateIntoAppState(state, remoteModules) {
  return mergeRemoteModulesIntoState(state, remoteModules);
}

export function getRepositorySyncState() {
  return getRemoteSyncStateSnapshot();
}

export function resetAppState(currentState = null) {
  const clean = deepClone(seedState);

  if (currentState) {
    clean.crm = deepClone(currentState.crm ?? clean.crm);
    clean.planner = deepClone(currentState.planner ?? clean.planner);
    clean.inbox = deepClone(currentState.inbox ?? clean.inbox);
  }

  saveAppState(clean);

  if (typeof window !== 'undefined') {
    LEGACY_STORAGE_KEYS.forEach((key) => window.localStorage.removeItem(key));
  }

  return clean;
}

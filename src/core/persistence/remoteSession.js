import {
  getFirebaseWorkspaceInfo,
  isFirebaseWorkspaceEnabled,
  subscribeToWorkspaceModules,
  writeWorkspaceModule,
} from '../../integrations/firebase/workspaceStore';
import {
  REMOTE_SHARED_MODULE_IDS,
  getRemoteModuleSlice,
  stableSerializeRemoteModule,
} from './remoteModules';

const DEFAULT_SYNC_STATE = {
  mode: 'local-only',
  ready: true,
  workspaceId: 'local',
  lastError: '',
};

let remoteSession = {
  syncState: DEFAULT_SYNC_STATE,
  unsubscribe: null,
  remoteHashes: new Map(),
  pendingHashes: new Map(),
  onRemoteModules: null,
  onStatusChange: null,
};

function emitSyncState(patch) {
  remoteSession.syncState = {
    ...remoteSession.syncState,
    ...patch,
  };

  remoteSession.onStatusChange?.(remoteSession.syncState);
}

function resetTransientState() {
  remoteSession.remoteHashes = new Map();
  remoteSession.pendingHashes = new Map();
}

export function getRemoteSyncStateSnapshot() {
  return remoteSession.syncState;
}

export function stopRemoteSession() {
  if (remoteSession.unsubscribe) {
    remoteSession.unsubscribe();
  }

  remoteSession.unsubscribe = null;
  resetTransientState();
  remoteSession.onRemoteModules = null;
  remoteSession.onStatusChange = null;
  remoteSession.syncState = DEFAULT_SYNC_STATE;
}

export function startRemoteSession({ onRemoteModules, onStatusChange }) {
  if (remoteSession.unsubscribe) {
    stopRemoteSession();
  }

  remoteSession.onRemoteModules = onRemoteModules;
  remoteSession.onStatusChange = onStatusChange;

  if (!isFirebaseWorkspaceEnabled()) {
    emitSyncState(DEFAULT_SYNC_STATE);
    return () => stopRemoteSession();
  }

  const workspace = getFirebaseWorkspaceInfo();

  emitSyncState({
    mode: 'remote-bootstrapping',
    ready: false,
    workspaceId: workspace.workspaceId,
    lastError: '',
  });

  remoteSession.unsubscribe = subscribeToWorkspaceModules({
    moduleIds: REMOTE_SHARED_MODULE_IDS,
    onModuleSnapshot({ moduleId, exists, data }) {
      if (!exists || !data?.payload) {
        return;
      }

      const hash = stableSerializeRemoteModule(moduleId, data.payload);
      remoteSession.remoteHashes.set(moduleId, hash);
      remoteSession.pendingHashes.delete(moduleId);

      remoteSession.onRemoteModules?.({
        [moduleId]: data.payload,
      });
    },
    onReady({ workspaceId }) {
      emitSyncState({
        mode: 'remote-ready',
        ready: true,
        workspaceId,
        lastError: '',
      });
    },
    onError(error) {
      emitSyncState({
        mode: 'remote-error',
        ready: false,
        lastError: error?.message || 'Firebase sync error',
      });
    },
  });

  return () => stopRemoteSession();
}

export async function persistRemoteModules(state) {
  if (remoteSession.syncState.mode !== 'remote-ready') {
    return;
  }

  const writes = REMOTE_SHARED_MODULE_IDS.map(async (moduleId) => {
    const payload = getRemoteModuleSlice(state, moduleId);
    const nextHash = stableSerializeRemoteModule(moduleId, payload);
    const remoteHash = remoteSession.remoteHashes.get(moduleId);
    const pendingHash = remoteSession.pendingHashes.get(moduleId);

    if (nextHash === remoteHash || nextHash === pendingHash) {
      return;
    }

    remoteSession.pendingHashes.set(moduleId, nextHash);

    try {
      await writeWorkspaceModule(moduleId, payload, {
        schemaVersion: state.meta?.schemaVersion,
        foundationVersion: state.meta?.foundationVersion,
      });

      remoteSession.remoteHashes.set(moduleId, nextHash);
      remoteSession.pendingHashes.delete(moduleId);
      emitSyncState({ lastError: '' });
    } catch (error) {
      remoteSession.pendingHashes.delete(moduleId);
      emitSyncState({
        mode: 'remote-ready',
        ready: true,
        lastError: error?.message || `No se pudo guardar ${moduleId} en Firebase.`,
      });
    }
  });

  await Promise.all(writes);
}

import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { getFirebaseClient } from './client';

function getWorkspaceModuleRef(db, workspaceId, moduleId) {
  return doc(db, 'workspaces', workspaceId, 'modules', moduleId);
}

export function isFirebaseWorkspaceEnabled() {
  return getFirebaseClient().enabled;
}

export function getFirebaseWorkspaceInfo() {
  const client = getFirebaseClient();

  return {
    enabled: client.enabled,
    workspaceId: client.workspaceId || 'revolution-os-shared',
  };
}

export function subscribeToWorkspaceModules({
  moduleIds,
  onModuleSnapshot,
  onReady,
  onError,
}) {
  const client = getFirebaseClient();

  if (!client.enabled) {
    onReady?.({
      enabled: false,
      workspaceId: 'local',
    });
    return () => {};
  }

  const pending = new Set(moduleIds);
  let readyEmitted = false;

  function maybeEmitReady() {
    if (!readyEmitted && pending.size === 0) {
      readyEmitted = true;
      onReady?.({
        enabled: true,
        workspaceId: client.workspaceId,
      });
    }
  }

  const unsubscribers = moduleIds.map((moduleId) =>
    onSnapshot(
      getWorkspaceModuleRef(client.db, client.workspaceId, moduleId),
      (snapshot) => {
        pending.delete(moduleId);

        onModuleSnapshot?.({
          moduleId,
          exists: snapshot.exists(),
          data: snapshot.exists() ? snapshot.data() : null,
        });

        maybeEmitReady();
      },
      (error) => {
        pending.delete(moduleId);
        onError?.(error);
        maybeEmitReady();
      }
    )
  );

  return () => {
    unsubscribers.forEach((unsubscribe) => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    });
  };
}

export async function writeWorkspaceModule(moduleId, payload, meta = {}) {
  const client = getFirebaseClient();

  if (!client.enabled) {
    return { skipped: true };
  }

  await setDoc(
    getWorkspaceModuleRef(client.db, client.workspaceId, moduleId),
    {
      moduleId,
      payload,
      schemaVersion: meta.schemaVersion ?? 0,
      foundationVersion: meta.foundationVersion ?? '',
      updatedAt: new Date().toISOString(),
    },
    { merge: false }
  );

  return {
    workspaceId: client.workspaceId,
    moduleId,
  };
}

import { useEffect, useMemo, useState } from 'react';
import {
  connectAppRepository,
  getRepositorySyncState,
  loadAppState,
  mergeRemoteStateIntoAppState,
  resetAppState,
  saveAppState,
} from '../../core/persistence/repository';
import { AppStoreContext } from './useAppStore';
import { createAppActions } from './createAppActions';

export function AppStoreProvider({ children }) {
  const [state, setState] = useState(() => loadAppState());
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [syncState, setSyncState] = useState(() => getRepositorySyncState());

  const updateState = (producer) => {
    setState((current) => producer(current));
  };

  const actions = useMemo(
    () =>
      createAppActions({
        updateState,
        resetToSeed: () => setState((current) => resetAppState(current)),
        replaceState: (nextState) => setState(nextState),
      }),
    []
  );

  useEffect(() => {
    const disconnect = connectAppRepository({
      onRemoteState(remoteModules) {
        setState((current) => mergeRemoteStateIntoAppState(current, remoteModules));
      },
      onStatusChange(nextSyncState) {
        setSyncState(nextSyncState);
      },
    });

    return disconnect;
  }, []);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      saveAppState(state);
      setLastSavedAt(new Date().toISOString());
    }, 250);

    return () => window.clearTimeout(handle);
  }, [state]);

  useEffect(() => {
    if (syncState.mode === 'remote-ready') {
      saveAppState(state);
    }
  }, [syncState.mode]);

  const value = useMemo(
    () => ({
      state,
      actions,
      lastSavedAt,
      syncState,
    }),
    [state, actions, lastSavedAt, syncState]
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

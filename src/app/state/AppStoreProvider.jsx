import { useEffect, useMemo, useState } from 'react';
import { loadAppState, resetAppState, saveAppState } from '../../core/persistence/repository';
import { AppStoreContext } from './useAppStore';
import { createAppActions } from './createAppActions';

export function AppStoreProvider({ children }) {
  const [state, setState] = useState(() => loadAppState());
  const [lastSavedAt, setLastSavedAt] = useState(null);

  const updateState = (producer) => {
    setState((current) => producer(current));
  };

  const actions = useMemo(
    () =>
      createAppActions({
        updateState,
        resetToSeed: () => setState(resetAppState()),
        replaceState: (nextState) => setState(nextState),
      }),
    []
  );

  useEffect(() => {
    const handle = window.setTimeout(() => {
      saveAppState(state);
      setLastSavedAt(new Date().toISOString());
    }, 250);

    return () => window.clearTimeout(handle);
  }, [state]);

  const value = useMemo(
    () => ({
      state,
      actions,
      lastSavedAt,
    }),
    [state, actions, lastSavedAt]
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

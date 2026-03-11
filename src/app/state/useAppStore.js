import { createContext, useContext } from 'react';

export const AppStoreContext = createContext(null);

export function useAppStore() {
  const value = useContext(AppStoreContext);
  if (!value) {
    throw new Error('useAppStore debe usarse dentro de AppStoreProvider.');
  }
  return value;
}

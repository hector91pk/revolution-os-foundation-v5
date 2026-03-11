import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getFirebaseRuntimeConfig } from './config';

let cachedClient = null;

export function getFirebaseClient() {
  const runtime = getFirebaseRuntimeConfig();

  if (!runtime.enabled) {
    return {
      enabled: false,
      workspaceId: runtime.workspaceId,
      app: null,
      db: null,
    };
  }

  if (cachedClient) {
    return cachedClient;
  }

  const app = getApps().length ? getApp() : initializeApp(runtime.firebaseConfig);
  const db = getFirestore(app);

  cachedClient = {
    enabled: true,
    workspaceId: runtime.workspaceId,
    app,
    db,
  };

  return cachedClient;
}

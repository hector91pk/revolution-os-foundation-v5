function readEnv(key) {
  return import.meta.env?.[key] ?? '';
}

export function getFirebaseRuntimeConfig() {
  const firebaseConfig = {
    apiKey: readEnv('VITE_FIREBASE_API_KEY'),
    authDomain: readEnv('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId: readEnv('VITE_FIREBASE_PROJECT_ID'),
    storageBucket: readEnv('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: readEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: readEnv('VITE_FIREBASE_APP_ID'),
    measurementId: readEnv('VITE_FIREBASE_MEASUREMENT_ID') || undefined,
  };

  const enabled = Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId
  );

  return {
    enabled,
    workspaceId: readEnv('VITE_FIREBASE_WORKSPACE_ID') || 'revolution-os-shared',
    firebaseConfig,
  };
}

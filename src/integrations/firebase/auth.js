import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirebaseClient } from './client';

export function getFirebaseAuth() {
  const client = getFirebaseClient();

  if (!client.enabled || !client.app) {
    return null;
  }

  return getAuth(client.app);
}

export function subscribeToAuthState(callback) {
  const auth = getFirebaseAuth();

  if (!auth) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, callback);
}

export async function signInWithFirebaseEmail({ email, password }) {
  const auth = getFirebaseAuth();

  if (!auth) {
    throw new Error('Firebase Auth no está disponible.');
  }

  return signInWithEmailAndPassword(auth, email, password);
}

export async function signOutFromFirebase() {
  const auth = getFirebaseAuth();

  if (!auth) {
    return;
  }

  await signOut(auth);
}
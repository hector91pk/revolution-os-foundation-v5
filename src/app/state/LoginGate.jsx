import { useState } from 'react';
import { signInWithFirebaseEmail, signOutFromFirebase } from '../../integrations/firebase/auth';
import { useAppStore } from './useAppStore';

export function LoginGate({ children }) {
  const { authReady, currentUser } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await signInWithFirebaseEmail({ email, password });
    } catch (err) {
      setError(err?.message || 'No se pudo iniciar sesión.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSignOut() {
    try {
      await signOutFromFirebase();
    } catch (err) {
      setError(err?.message || 'No se pudo cerrar sesión.');
    }
  }

  if (!authReady) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Cargando sesión...</h2>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div style={{ padding: 24, maxWidth: 420, margin: '40px auto' }}>
        <h1>R-evolution OS</h1>
        <p>Acceso privado</p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button type="submit" disabled={submitting}>
            {submitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {error ? <p style={{ color: 'red' }}>{error}</p> : null}
      </div>
    );
  }

  return (
    <>
      <div style={{ padding: '8px 16px', borderBottom: '1px solid #ddd' }}>
        <span style={{ marginRight: 12 }}>
          Sesión: {currentUser.email}
        </span>
        <button onClick={handleSignOut}>Salir</button>
      </div>
      {children}
    </>
  );
}
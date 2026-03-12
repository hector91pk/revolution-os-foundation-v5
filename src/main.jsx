import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import { AppStoreProvider } from './app/state/AppStoreProvider';
import { LoginGate } from './app/state/LoginGate';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppStoreProvider>
      <LoginGate>
        <App />
      </LoginGate>
    </AppStoreProvider>
  </React.StrictMode>
);
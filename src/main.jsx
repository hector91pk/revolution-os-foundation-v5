import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import { AppStoreProvider } from './app/state/AppStoreProvider';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppStoreProvider>
      <App />
    </AppStoreProvider>
  </React.StrictMode>
);

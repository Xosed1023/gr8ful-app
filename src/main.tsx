import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './tailwind.css';
import { applyStoredTheme } from './theme/applyStoredTheme';
import { installGlobalHaptics } from './hooks/useHaptics';

// Antes del primer render: evita el destello de tema claro al abrir en oscuro
applyStoredTheme();

// Háptico en cualquier botón (se puede desactivar en Ajustes)
installGlobalHaptics();

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
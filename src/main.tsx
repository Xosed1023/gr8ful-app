import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './tailwind.css';
import { applyStoredTheme } from './theme/applyStoredTheme';

// Antes del primer render: evita el destello de tema claro al abrir en oscuro
applyStoredTheme();

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
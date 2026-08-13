import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Catch and suppress benign Vite dev WebSocket disconnection logs
window.addEventListener('unhandledrejection', (event) => {
  const reasonStr = typeof event.reason === 'string' 
    ? event.reason 
    : (event.reason?.message || String(event.reason || ''));
  if (reasonStr.includes('WebSocket') || reasonStr.includes('vite')) {
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

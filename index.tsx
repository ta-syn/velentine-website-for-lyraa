
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

if (import.meta.env.DEV) {
  const originalInfo = console.info;
  console.info = (...args: unknown[]) => {
    const first = args[0];
    if (typeof first === 'string' && first.includes('Download the React DevTools')) return;
    originalInfo.apply(console, args as any);
  };
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

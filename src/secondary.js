// src/secondary.js
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import { createRoot } from 'react-dom/client';
import SecondaryApp from './SecondaryApp'; // Updated import path
import './styles.css'; // Shared styles or import secondary-specific styles

// Polyfills (same as main entry)
import { Buffer } from 'buffer';
import process from 'process';

window.Buffer = Buffer;
window.process = process;

// Initialize React root
const secondaryRootElement = document.getElementById('secondary-root');
if (secondaryRootElement) {
  const secondaryRoot = createRoot(secondaryRootElement);

  // Render secondary app
  secondaryRoot.render(
    <React.StrictMode>
      <SecondaryApp />
    </React.StrictMode>
  );

  // HMR support
  if (module.hot) {
    module.hot.accept('./SecondaryApp', () => {
      const NextSecondaryApp = require('./SecondaryApp').default;
      secondaryRoot.render(
        <React.StrictMode>
          <NextSecondaryApp />
        </React.StrictMode>
      );
    });
  }
}
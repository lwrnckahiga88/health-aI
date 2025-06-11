// src/index.js
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Import the main component
import './styles.css'; // Import styles

const root = document.getElementById('root');

const render = (Component) => {
  ReactDOM.render(<Component />, root);
};

// Initial render
render(App);

// Enable Hot Module Replacement (HMR)
if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;

    render(NextApp);
  });
}
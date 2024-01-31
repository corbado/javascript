import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ProjectIdProvider } from './contexts/ProjectIdContext';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <ProjectIdProvider>
      <App />
    </ProjectIdProvider>
  </React.StrictMode>,
);

reportWebVitals();

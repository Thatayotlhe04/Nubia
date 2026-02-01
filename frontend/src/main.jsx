import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { AuthProvider } from './contexts/AuthContext';
import { StudyInsightsProvider } from './contexts/StudyInsightsContext';
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <StudyInsightsProvider>
          <App />
          <Analytics />
        </StudyInsightsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

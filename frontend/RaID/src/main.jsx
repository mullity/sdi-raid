import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import ThemeProvider from './contexts/ThemeContext.jsx';
import './index.css';
import './styles/themes.css';
import App from './App.jsx';

// Get the root element from the HTML page
var rootElement = document.getElementById('root');

// Create React root
var root = ReactDOM.createRoot(rootElement);

// Render the app
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);

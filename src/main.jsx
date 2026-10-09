import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import startSmoothScroll from './useSmoothScroll.js';
import startWarmCaseStudy from './warmCaseStudy.js';
import './index.css';

startSmoothScroll();
startWarmCaseStudy();

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
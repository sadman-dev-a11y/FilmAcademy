import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import '@fontsource-variable/inter/wght.css';
import '@fontsource-variable/space-grotesk/index.css';
import './styles/index.css';
import App from './app/App';
import { LearningProvider } from './hooks/useLearning';
createRoot(document.getElementById('root')!).render(<StrictMode><HashRouter><LearningProvider><App/></LearningProvider></HashRouter></StrictMode>);

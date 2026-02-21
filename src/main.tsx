import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { getTheme } from './app/theme/theme';
import './app/globals.css';
import App from './App';

// Get initial theme
const initialMode = (localStorage.getItem('theme') as 'light' | 'dark') || 'light';

// Create theme instance
const theme = getTheme(initialMode);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
);

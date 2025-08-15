// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import { Provider } from 'react-redux';
import { store } from './redux/store.js';
import { logout } from './redux/authSlice.js';
import { setUnauthorizedHandler } from './services/api.js'; // <-- new import
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

// Set up a handler for 401 errors
setUnauthorizedHandler(() => {
  store.dispatch(logout());
  window.location.href = '/login';
});

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
    background: {
      default: '#f8f9fa',
    },
  },
  shape: {
    borderRadius: 8,
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);

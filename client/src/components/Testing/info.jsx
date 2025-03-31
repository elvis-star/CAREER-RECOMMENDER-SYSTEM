'use client';

import { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useMediaQuery } from '@mui/material';

// Pages
import Home from './pages/Home';
import KcseInput from './pages/KcseInput';
import Results from './pages/Results';
import Universities from './pages/Universities';
import Resources from './pages/Resources';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState(prefersDarkMode ? 'dark' : 'light');

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#2e7d32', // Green color for primary
          },
          secondary: {
            main: '#1976d2', // Blue color for secondary
          },
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route
            path="/"
            element={<Home toggleColorMode={toggleColorMode} />}
          />
          <Route
            path="/kcse-input"
            element={<KcseInput toggleColorMode={toggleColorMode} />}
          />
          <Route
            path="/results"
            element={<Results toggleColorMode={toggleColorMode} />}
          />
          <Route
            path="/universities"
            element={<Universities toggleColorMode={toggleColorMode} />}
          />
          <Route
            path="/resources"
            element={<Resources toggleColorMode={toggleColorMode} />}
          />
          <Route
            path="/about"
            element={<About toggleColorMode={toggleColorMode} />}
          />
          <Route
            path="/sign-in"
            element={<SignIn toggleColorMode={toggleColorMode} />}
          />
          <Route
            path="/sign-up"
            element={<SignUp toggleColorMode={toggleColorMode} />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

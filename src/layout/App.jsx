import React from 'react';
// material-ui
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// third-party
import { useSelector } from 'react-redux';

// project import
import { theme } from '../themes/index';
import Routes from '../routes/index';
import NavigationScroll from './NavigationScroll';
// ==============================|| APP ||============================== //
import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from '../auth/authConfig';


const App = () => {
  const customization = useSelector((state) => state.customization);
  return (
    <>
      {
        <MsalProvider instance={msalInstance}>
          <NavigationScroll>
            <StyledEngineProvider injectFirst>
              <ThemeProvider theme={theme(customization)}>
                <CssBaseline />
                <Routes />
              </ThemeProvider>
            </StyledEngineProvider>
          </NavigationScroll>
        </MsalProvider>
      }
    </>
  );
};

export default App;

import React from 'react';
import { Outlet } from 'react-router-dom';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { useMediaQuery, AppBar, Box, Toolbar } from '@mui/material';
// project import
import { drawerWidth } from '../../config.jsx';
import Header from './Header/index.jsx';
import Sidebar from './Sidebar/index.jsx';
import Expired from '../../component/expired/Expired.jsx';
import AlertDialog from '../../component/expired/index';
// custom style
const Main = styled((props) => <main {...props} />)(({ theme }) => ({
  width: '100%',
  minHeight: '100vh',
  flexGrow: 1,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  [theme.breakpoints.up('md')]: {
    marginLeft: -drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`
  }
}));

const OutletDiv = styled((props) => <div {...props} />)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3)
  },
  padding: theme.spacing(5)
}));

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {;
  const Expiration = Expired();
  const theme = useTheme();
  const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  React.useEffect(() => {
    setDrawerOpen(matchUpMd);
  }, [matchUpMd]);

  return (
    <>
      {Expiration && <AlertDialog />}
      
      <Box sx={{ display: 'flex', width: '100%' }}>
        <Sidebar drawerOpen={drawerOpen} drawerToggle={handleDrawerToggle} />
        <Main style={{
          ...(drawerOpen && {
            transition: theme.transitions.create('margin', {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen
            }),
            marginLeft: 0,
            marginRight: 'inherit'
          })
        }}>
          <AppBar
            position="fixed"
            sx={{
              zIndex: 1200,
              marginLeft: drawerOpen && matchUpMd ? drawerWidth : 0,
              width: drawerOpen && matchUpMd ? `calc(100% - ${drawerWidth}px)` : '100%',
            }}
          >
            <Toolbar>
              <Header drawerOpen={drawerOpen} drawerToggle={handleDrawerToggle} />
            </Toolbar>
          </AppBar>
          <Box sx={theme.mixins.toolbar} />
          <OutletDiv>
            <Outlet />
          </OutletDiv>
        </Main>
      </Box>
    </>
  );
};

export default MainLayout;

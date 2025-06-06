import PropTypes from 'prop-types';
import React from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { useMediaQuery, Divider, Drawer, Box } from '@mui/material';
import PerfectScrollbar from 'react-perfect-scrollbar';
import MenuList from './MenuList';
import { drawerWidth } from '../../../config.jsx';
import NavCard from './MenuList/NavCard';
import logo from '../../../img/TSO-AOV1.png';

const Nav = styled('nav')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    width: drawerWidth,
    flexShrink: 0,
  },
}));

const LogoContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingLeft: '10px',
  paddingTop: '5px',
  width: drawerWidth,
});

const Sidebar = ({ drawerOpen, drawerToggle, window }) => {
  const theme = useTheme();
  const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));

  const drawer = (
    <>
      <Divider />
      <LogoContainer>
        <img src={logo} alt="Logo" style={{ width: '120px', height: '60px' }} />
      </LogoContainer>
      <PerfectScrollbar style={{ height: 'calc(100vh - 65px)', display: 'flex', flexDirection: 'column', padding: '10px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <MenuList drawerToggle={drawerToggle} />
          <Box sx={{ flexGrow: 1 }} />
          <NavCard sx={{ alignSelf: 'flex-end' }} />
        </Box>
      </PerfectScrollbar>
    </>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Nav>
      <Drawer
        container={container}
        variant={matchUpMd ? 'persistent' : 'temporary'}
        anchor="left"
        open={drawerOpen}
        onClose={drawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            borderRight: 'none',
            boxShadow: '0 0.15rem 1.75rem 0 rgba(33, 40, 50, 0.15)',
            top: { md: 0, sm: 0 },
          },
        }}
        ModalProps={{ keepMounted: true }}
      >
        {drawer}
      </Drawer>
    </Nav>
  );
};

Sidebar.propTypes = {
  drawerOpen: PropTypes.bool,
  drawerToggle: PropTypes.func,
  window: PropTypes.object,
};

export default Sidebar;

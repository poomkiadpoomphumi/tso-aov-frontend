import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Grid, IconButton } from '@mui/material';

// project import
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';
import { drawerWidth } from '../../../config.jsx';
import Expired from '../../../component/expired/Expired';
import AlertDialog from '../../../component/expired/index';
// assets
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
// ==============================|| HEADER ||============================== //

const Header = ({ drawerToggle }) => {
  const theme = useTheme();
  const Expiration = Expired();
  return (
    <>
      {Expiration ? (<AlertDialog />) : null}
      <Box width={drawerWidth}>
        <Grid container justifyContent="space-between" alignItems="center" >
          <Grid item>
            <IconButton
              edge="start"
              sx={{ mr: theme.spacing(1.25) }}
              color="inherit"
              aria-label="open drawer"
              onClick={drawerToggle}
              size="large"
            >
              <MenuTwoToneIcon sx={{ fontSize: '1.5rem' }} />
            </IconButton>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      <NotificationSection />
      <br />
      <ProfileSection />
    </>
  );
};

Header.propTypes = {
  drawerToggle: PropTypes.func
};

export default Header;

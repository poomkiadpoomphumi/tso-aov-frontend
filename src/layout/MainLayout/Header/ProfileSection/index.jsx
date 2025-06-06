import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Fade, Button, ClickAwayListener, Paper, Popper, List, ListItemText, ListItemIcon, ListItemButton,
  Avatar, Stack, Box, Typography, Skeleton
} from '@mui/material';
import MeetingRoomTwoToneIcon from '@mui/icons-material/MeetingRoomTwoTone';
import PersonTwoToneIcon from '@mui/icons-material/PersonTwoTone';
import { useMsal } from '@azure/msal-react';
import { getCodeImg } from '../../../../axios/handleSubmit';
import Loader from '../../../../component/Loader/Loader';
import AzureData from '../../../../service/getApiData.js';
import { Link } from 'react-router-dom';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import ClippedDrawer from '../../Sidebar/Setting/seting';
import { ADMIN } from '../../../../config.jsx';
import TimeOutError from '../../../../component/error/TimeOutError.jsx';
import InternalError from '../../../../component/error/InternalError.jsx';
import Error404 from '../../../../component/error/404.jsx';
import ListIcon from '@mui/icons-material/List';
import AlertDialog from '../../../../component/expired/index';

const ProfileSection = () => {
  const AzureDataUser = AzureData();
  const theme = useTheme();
  const { instance } = useMsal();
  const hasReloaded = useRef(false);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const [dataUser, setDataUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const userLocalToken = useMemo(() => localStorage.getItem('tokenUser'), []);  // Memoize token fetching
  const [setting, setSetting] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [error, setError] = useState({ 0: false, 1: false, 2: false, 3: false });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getCodeImg(userLocalToken);
      if (response === null) { setError(prevError => ({ ...prevError, 3: true })); }
      if (Array.isArray(response) && response.length === 0) { window.location.reload(); }
      if (response && response[0] === 'N') {
        localStorage.removeItem("Employee");
        //ApiClearCache();
        if (!hasReloaded.current) {
          await fetchData(); // Wait for the second fetchData to complete
          hasReloaded.current = true;
          window.location.reload();
        }
      }
      if (response === 404) {
        setError(prevError => ({ ...prevError, 2: true }));
      } else if (response === 500) {
        setError(prevError => ({ ...prevError, 1: true }));
      } else {
        const hasAllowedCode = ADMIN[0].ADMINSETTING.includes(parseInt(response?.code, 10));
        setAdmin(hasAllowedCode || ADMIN[0].ADMINSYSTEM[0] === response?.code);
        setDataUser(response);
      }
    } catch (error) {
      setError(prevError => ({ ...prevError, 0: true }));
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [userLocalToken]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    instance.logoutPopup().catch(console.error);
    localStorage.clear();
  };

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const prevOpen = useRef(open);

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  const handleSettingClose = () => setSetting(false);

  const handleSettingOpen = () => setSetting(true);

  if (loading) return <Loader />;
  if (error[0]) return <TimeOutError />;
  if (error[1]) return <InternalError />;
  if (error[2]) return <Error404 />;
  if (error[3]) return <AlertDialog />;
  return (
    <>
      {setting && <ClippedDrawer onClose={handleSettingClose} />}
      <Button
        sx={{ minWidth: { sm: 50, xs: 35 } }}
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        aria-label="Profile"
        onClick={handleToggle}
        color="inherit"
      >
        <Stack direction="row" spacing={2}>
          {loading ? (
            <Loader />
          ) : dataUser && dataUser.code ? (  // Add null check for dataUser
            <Avatar alt="User Profile" src={`https://hq-web-s13.pttplc.com/directory/photo/${dataUser.code}.jpg?36JVBHXSPL`} />
          ) : dataUser === 'User exit or no have permission' && AzureDataUser && AzureDataUser.displayName ? (
            <Avatar />
          ) : (
            <Skeleton variant="circular" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.13)' }}>
              <Avatar />
            </Skeleton>
          )}
        </Stack>
        &nbsp;&nbsp;
        {dataUser && dataUser.fname_eng && dataUser.lname_eng ? (  // Checks for dataUser name
          `${dataUser.fname_eng} ${dataUser.lname_eng}`
        ) : (
          dataUser === 'User exit or no have permission' && AzureDataUser && AzureDataUser.displayName ? (  // Corrected casing for displayName
            `${AzureDataUser.displayName}`
          ) : (
            <Box sx={{ width: '100%' }}>
              <Skeleton width="100%" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.13)' }}>
                <Typography width="160px" height="40px">.</Typography>
              </Skeleton>
            </Box>
          )
        )}
      </Button>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        modifiers={[
          { name: 'offset', options: { offset: [0, 10] } },
          { name: 'preventOverflow', options: { altAxis: true } }
        ]}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <List
                  sx={{
                    width: '100%',
                    maxWidth: 350,
                    minWidth: 250,
                    backgroundColor: theme.palette.background.paper,
                    pb: 0,
                    borderRadius: '5px'
                  }}
                >
                  {
                    admin && (
                      <>
{/*                         <Link to={`/SystemLogs`} style={{ textDecoration: 'none' }}>
                          <ListItemButton onClick={() => { setOpen(false) }}>
                            <ListItemIcon>
                              <ListIcon />
                            </ListItemIcon>
                            <ListItemText primary="Logs system" />
                          </ListItemButton>
                        </Link> */}
                        <ListItemButton onClick={handleSettingOpen}>
                          <ListItemIcon>
                            <SettingsTwoToneIcon />
                          </ListItemIcon>
                          <ListItemText primary="Settings" />
                        </ListItemButton>

                      </>
                    )
                  }

                  <Link to={`/Profile`} style={{ textDecoration: 'none' }}>
                    <ListItemButton onClick={(event) => handleClose(event, 1)}>
                      <ListItemIcon>
                        <PersonTwoToneIcon />
                      </ListItemIcon>
                      <ListItemText primary="My profile" />
                    </ListItemButton>
                  </Link>
                  <ListItemButton selected={selectedIndex === 1} onClick={(event) => handleListItemClick(event, 1)}>
                    <ListItemIcon>
                      <MeetingRoomTwoToneIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                  </ListItemButton>
                </List>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
};

export default ProfileSection;

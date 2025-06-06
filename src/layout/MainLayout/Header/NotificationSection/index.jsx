import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Button,
  ClickAwayListener,
  Fade,
  Paper,
  Popper,
  Avatar,
  List,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
  Typography,
  ListItemButton,
  Alert,
  Badge
} from '@mui/material';
import { Link } from 'react-router-dom';
import Mail from '@mui/icons-material/Mail.js';
import { getDataFormdigital, getCodeImg } from '../../../../axios/handleSubmit.js';
import AccessTime from '@mui/icons-material/AccessTime.js';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth.js';
import AzureData from '../../../../service/getApiData.js';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Loader from '../../../../component/Loader/Loader.jsx';

const NotificationSection = () => {
  AzureData()

  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const anchorRef = React.useRef(null);
  const [notification, setCountNotification] = useState(0);
  const token = useMemo(() => localStorage.getItem('tokenUser'), []); // Memoize token
  const [data, setData] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const initialDisplayCount = 4;
  const [loader, setLoader] = useState(true);
  const openNoti = useMemo(() => localStorage.getItem('openNoti'), []);

  const handleToggle = () => {
    localStorage.setItem('openNoti', true);
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const prevOpen = React.useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  const fetchData = useCallback(
    async (retryCount = 0) => {
      try {
        if (token) {
          const [getCode, responseData] = await Promise.all([getCodeImg(token), getDataFormdigital(token)]);
          if (responseData && Array.isArray(responseData.data)) {
            const filteredItems = responseData.data.filter((item) =>
              (item.sectionHeadStatus === 'wait' && item.maxLevelApprover === 3) || (item.sectionHeadStatus === 'approved' && item.departmentHeadStatus === 'wait') ||
              (item.sectionHeadStatus === 'wait' && item.departmentHeadStatus === 'wait' && item.maxLevelApprover === 4 && item.sectionHeadCode === getCode.code) ||
              (item.sectionHeadStatus === 'approved' && item.departmentHeadStatus === 'wait' && item.maxLevelApprover === 4 && item.departmentHeadCode === getCode.code)
            );
            setData(filteredItems);
            setCountNotification(filteredItems.length);
          } else {
            if (retryCount < 3) {
              setTimeout(() => fetchData(retryCount + 1), 1000); // Retry with delay
            } else {
              console.error('Max retry attempts reached. Failed to fetch valid data.');
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoader(false);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Memoize the display data to avoid unnecessary recalculations
  const displayData = useMemo(() => (showAll ? data : data.slice(0, initialDisplayCount)), [showAll, data]);

  if (loader) return <Loader />;
  return (
    <>
      <Button
        sx={{ minWidth: { sm: 50, xs: 35 } }}
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        aria-label="Notification"
        onClick={handleToggle}
        color="inherit"
      >
        <Badge badgeContent={openNoti ? 0 : notification} max={openNoti ? 0 : notification} color="error" sx={{ '.MuiBadge-badge': { right: -1 } }}>
          <Mail sx={{ fontSize: '2rem' }} />
        </Badge>
      </Button>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 10]
            }
          },
          {
            name: 'preventOverflow',
            options: {
              altAxis: true
            }
          }
        ]}
        sx={{ zIndex: 1300 }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <List
                  sx={{
                    width: '100%',
                    maxWidth: 'auto',
                    minWidth: 'auto',
                    backgroundColor: theme.palette.background.paper,
                    pb: 0,
                    borderRadius: '5px'
                  }}
                >
                  <PerfectScrollbar style={{ height: 'auto', overflowX: 'hidden' }}>
                    <ListSubheader disableSticky>
                      Approval notification
                    </ListSubheader>
                    {displayData.length > 0 ? (
                      displayData.map((item) => (
                        <Link key={item._id} to={`/MyList`} style={{ textDecoration: 'none' }} onClick={handleClose}>
                          <ListItemButton alignItems="flex-start" sx={{ pt: 0 }}>
                            <ListItemAvatar>
                              <Avatar src={`https://hq-web-s13.pttplc.com/directory/photo/${item.requesterCode}.jpg?36JVBHXSPL`} />
                            </ListItemAvatar>
                            <ListItemText
                              primary={<><Typography variant="subtitle1">{item?.coordinatorName} - {item?.department} ({item?.system})</Typography></>}
                              secondary={
                                <>
                                  <Typography variant="body2" color="textSecondary">
                                    {item.jobName}{item?.systemRequested ? ' ' + item.systemRequested : ''}
                                  </Typography>
                                  <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CalendarMonthIcon
                                      sx={{
                                        fontSize: '0.95rem',
                                        mr: 0.5,
                                        color: theme.palette.grey[400],
                                        display: "flex", alignItems: "center"
                                      }}
                                    />
                                    <span style={{ flex: '1 1 0%' }}>
                                      {item.createAt.split(' ')[0]}
                                    </span>
                                    <AccessTime
                                      sx={{
                                        fontSize: '0.95rem',
                                        mr: 0.5,
                                        color: theme.palette.grey[400],
                                        display: "flex", alignItems: "center"
                                      }}
                                    />
                                    <span style={{ flex: '0 0 auto' }}>
                                      {item.createAt.split(' ')[1]}
                                    </span>
                                  </Typography>
                                </>
                              }
                            />
                          </ListItemButton>
                        </Link>
                      ))
                    ) : (
                      <ListItemText
                        secondary={
                          <>
                            <Alert severity="info" sx={{ width: 430 }}>
                              There are no new approval notifications.
                            </Alert>
                          </>
                        }
                      />
                    )}

                    {!showAll && data.length > initialDisplayCount && (
                      <ListItemButton
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          paddingTop: theme.spacing(2),
                          padding: '5px 0px 5px 0px'
                        }}
                        onClick={() => setShowAll(true)}
                      >
                        <Fade in={!showAll}>
                          <Typography variant="body2" color="primary">
                            See more notifications
                          </Typography>
                        </Fade>
                      </ListItemButton>
                    )}
                    {showAll && (
                      <ListItemButton
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          paddingTop: theme.spacing(2),
                          padding: '5px 0px 5px 0px'
                        }}
                        onClick={() => setShowAll(false)}
                      >
                        <Fade in={showAll}>
                          <Typography variant="body2" color="primary">
                            Show Less notifications
                          </Typography>
                        </Fade>
                      </ListItemButton>
                    )}
                  </PerfectScrollbar>
                </List>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
};

export default NotificationSection;

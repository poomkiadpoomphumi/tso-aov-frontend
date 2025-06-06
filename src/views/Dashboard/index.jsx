import React, { useEffect } from 'react';
import { Grid, Typography, Box } from '@mui/material';
import ReportCard from './ReportCard';
import { gridSpacing } from '../../config.jsx';
import { Link } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AzureData from '../../service/getApiData.js';
import Expired from '../../component/expired/Expired';
import AlertDialog from '../../component/expired/index';
import CardMedia from '@mui/material/CardMedia';
import img from '../../img/Automation control and Operation application division.png';
import Breadcrumbs from '../../component/Breadcrumb/index.jsx';
import useIsMobile from '../../layout/Mobile/isMobile.jsx';
import Zoom from '@mui/material/Zoom';
import sysLogsUser from '../../logs/sysLogs';


const useStyles = makeStyles((theme) => ({
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
  disabled: {
    pointerEvents: 'none',
    color: theme.palette.text.disabled,
  },
}));

const Default = () => {
  const profileAd = AzureData();
  const isMobile = useIsMobile();
  const classes = useStyles();
  const theme = useTheme();
  const Expiration = Expired();
  const checked = true;
  const isDisabled = true; // Replace this with your actual condition
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //Keep logs user
  /*   useEffect(() => {
      const keepLogs = async () => {
        await sysLogsUser(profileAd);
      }
      keepLogs();
    }, [profileAd]) */
  return (
    <Grid container spacing={gridSpacing} direction="column" style={{ minHeight: '100vh' }}>
      <Grid item xs={12} style={{ flexGrow: 1 }}>
        {
          !isMobile ? (
            <>
              <CardMedia
                component="img"
                image={img}
                style={{ width: '100%', height: 'auto', maxWidth: 'auto', borderRadius: '10px' }}
              />
              <Grid item xs={12}>
                <Breadcrumbs />
              </Grid>
            </>
          ) : null
        }
        {Expiration ? (<AlertDialog />) : null}

        <Grid container spacing={gridSpacing}>
          <Zoom in={checked} {...(checked ? { timeout: 1000 } : {})}>
            <Grid item lg={3} sm={6} xs={12}>
              <Link to="/DigitalRequestForm" style={{ textDecoration: 'none', color: 'inherit' }}>
                <ReportCard
                  primary="DIGITAL PROJECT REQUEST"
                  secondary="แบบฟอร์มขออนุมัติในหลักการดำเนินงานด้าน Digital ของสายงานระบบท่อส่งก๊าซธรรมชาติ"
                  color={theme.palette.warning.main}
                  footerData="Go to digital request form"
                />
              </Link>
            </Grid>
          </Zoom>
          <Zoom in={checked} {...(checked ? { timeout: 1000 } : {})}>
            <Grid item lg={3} sm={6} xs={12}>
              <Link to="/FireWallRequestForm" style={{ textDecoration: 'none', color: 'inherit' }}>
                <ReportCard
                  primary="FIREWALL REQUEST"
                  secondary={
                    <Typography sx={{ whiteSpace: 'pre-line' }}>
                      แบบฟอร์มขออนุมัติแก้ไข PMIS Firewall Policy{'\n'}{'\n'}
                    </Typography>
                  }
                  color={theme.palette.info.light}
                  footerData="Go to Firewall request form"
                />
              </Link>
            </Grid>
          </Zoom>




        </Grid>
        <br /><hr /><br />
        <Zoom in={checked} {...(checked ? { timeout: 1000 } : {})}>
          <Typography
            variant="h3"
            className={`${classes.link} ${isDisabled ? classes.disabled : ''}`}
          >
            COMING SOON...
          </Typography>
        </Zoom>
        <br />
        <Grid container spacing={gridSpacing}>
          <Zoom in={checked} {...(checked ? { timeout: 1000 } : {})}>
            <Grid item lg={3} sm={6} xs={12}>
              <Link to="/FileShareRequestForm" style={{ textDecoration: 'none', color: 'inherit' }}
              className={`${classes.link} ${isDisabled ? classes.disabled : ''}`}>
                <ReportCard
                  primary="FILE SHARE REQUEST"
                  secondary="แบบฟอร์มขออนุมัติในหลักการดำเนินงานด้าน File Share ของสายงานระบบท่อส่งก๊าซธรรมชาติ"
                  color={theme.palette.action.disabled}
                  footerData="Go to file share request form."
                />
              </Link>
            </Grid>
          </Zoom>
          <Zoom in={checked} {...(checked ? { timeout: 1000 } : {})}>
            <Grid item lg={3} sm={6} xs={12}>
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}
                className={`${classes.link} ${isDisabled ? classes.disabled : ''}`}>
                <ReportCard
                  primary="API REQUEST"
                  secondary="แบบฟอร์มขออนุมัติในหลักการดำเนินงานด้าน APIs ของสายงานระบบท่อส่งก๊าซธรรมชาติ"
                  color={theme.palette.action.disabled}
                  footerData="System is not activated."
                />
              </Link>
            </Grid>
          </Zoom>
          <Zoom in={checked} {...(checked ? { timeout: 1000 } : {})}>
            <Grid item lg={3} sm={6} xs={12}>
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}
                className={`${classes.link} ${isDisabled ? classes.disabled : ''}`}>
                <ReportCard
                  primary="PMIS SMART TSO REQUEST"
                  secondary="แบบฟอร์มขออนุมัติในหลักการดำเนินงานด้าน PMIS SMART TSO ของสายงานระบบท่อส่งก๊าซธรรมชาติ"
                  color={theme.palette.action.disabled}
                  footerData="Go to pmis smart tso request form."
                />
              </Link>
            </Grid>
          </Zoom>
          <Zoom in={checked} {...(checked ? { timeout: 1000 } : {})}>
            <Grid item lg={3} sm={6} xs={12}>
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}
                className={`${classes.link} ${isDisabled ? classes.disabled : ''}`}>
                <ReportCard
                  primary="TSO INTRANET REQUEST"
                  secondary="แบบฟอร์มขออนุมัติในหลักการดำเนินงานด้าน Intranet Request ของสายงานระบบท่อส่งก๊าซธรรมชาติ"
                  color={theme.palette.action.disabled}
                  footerData="System is not activated."
                />
              </Link>
            </Grid>
          </Zoom>
          <Zoom in={checked} {...(checked ? { timeout: 1000 } : {})}>
            <Grid item lg={3} sm={6} xs={12}>
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}
                className={`${classes.link} ${isDisabled ? classes.disabled : ''}`}>
                <ReportCard
                  primary="DATA CENTER REQUEST"
                  secondary="แบบฟอร์มขออนุมัติในหลักการดำเนินงานด้าน Data Center TSO ของสายงานระบบท่อส่งก๊าซธรรมชาติ"
                  color={theme.palette.action.disabled}
                  footerData="System is not activated."
                />
              </Link>
            </Grid>
          </Zoom>
        </Grid>
        <br />
      </Grid>
    </Grid>
  );
};

export default Default;

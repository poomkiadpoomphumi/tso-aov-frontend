import React from 'react';

// material-ui
import { styled } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import CircularProgress from '@mui/material/CircularProgress';
// loader style
const LoaderWrapper = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 2001,
  width: '100%',
  '& > * + *': {
    marginTop: theme.spacing(2)
  }
}));

// ==============================|| LOADER ||============================== //

const Loader = () => {
  return (
    <>
      <LoaderWrapper>
        <LinearProgress color="secondary" />
      </LoaderWrapper>
      <React.Fragment>
        <Dialog
          fullScreen
          open={true}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <DialogContentText id="alert-dialog-description" sx={{
              fontSize: '25px'
            }}>
              <CircularProgress color="inherit" /><br/>
              Loading...
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </React.Fragment>
    </>

  );
};

export default Loader;

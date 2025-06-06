import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function ExternalUser() {
  return (
    <React.Fragment>
      <Dialog
        open={true}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ color: 'red' }}>
          {"You don't have permission"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You don't have permission in digital service request . Please contact administrator or login through the system external user
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {window.location.reload()}} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

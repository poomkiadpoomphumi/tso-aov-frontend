import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
export default function TimeOutError() {

  return (
    <React.Fragment>
      <Dialog
        open={true}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ color: 'red' }}>
          {"You are the Executive Vice President, Natural Gas Transmission."}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          Unable to request failed with status code 204. Contact administrator <br /> (คป. คุณอธิเบศร์ โทร 35259 คุณปีติภัทร โทร 35266 คุณปกป้อง โทร 35395)
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


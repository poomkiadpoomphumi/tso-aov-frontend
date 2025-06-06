import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

const Error404 = () => {

  return (
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
          textAlign: 'center',

        }}>
          <DialogContentText id="alert-dialog-description" sx={{
            fontSize: '25px',
            backgroundImage: 'url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)',
            backgroundSize: 'cover', // Scale the image to cover the entire area
            backgroundPosition: 'center', // Center the image
            backgroundRepeat: 'no-repeat', // Prevent repeating the image
          }}>
            <b style={{ fontSize: '50px' }}>404 (API Not Found)</b>
            <br /><br />
            <br /><br />
            <br /><br />
            <br /><br />
            <br /><br />
            <br /> (คป. คุณอธิเบศร์ โทร 35259 คุณปีติภัทร โทร 35266 คุณปกป้อง โทร 35395)
          </DialogContentText>
          <br />
          <Button
            variant="outlined" size="large"
            onClick={() => { window.location.reload() }} color="primary"
            sx={{ fontSize: '1.25rem', padding: '3px 14px' }} autoFocus>TRY AGAIN</Button>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

export default Error404;
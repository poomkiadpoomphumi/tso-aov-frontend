import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useMsal } from '@azure/msal-react';
import { ApiClearCache } from '../../axios/handleSubmit';
const Permissiondenied = () => {
  const { instance } = useMsal();
  const handleListItemClick = (event, index) => {
    instance.logoutPopup().catch(console.error);
    ApiClearCache();
    localStorage.clear();
  };
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
            backgroundImage: 'url(https://cdn.dribbble.com/users/1192256/screenshots/6290585/1._friday.gif)',
            backgroundSize: 'cover', // Scale the image to cover the entire area
            backgroundPosition: 'center', // Center the image
            backgroundRepeat: 'no-repeat', // Prevent repeating the image
          }}>
            <br /><br />
            <br /><br />
            <br /><br />
            <br /><br />
            <br /><br />
            <br /><br/>
            <br /><br/>
            403 Forbidden หากมีข้อสงสัยโปรดติดต่อ (คป. คุณปกป้อง โทร 35395)
          </DialogContentText>
          <br />
          <Button
            variant="outlined" size="large"
            onClick={handleListItemClick} color="error"
            sx={{ fontSize: '1.25rem', padding: '3px 14px' }} autoFocus>GO BACK</Button>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
export default Permissiondenied;

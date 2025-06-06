import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useMsal } from '@azure/msal-react';

const AlertDialog = () => {
    const { instance } = useMsal();
    const [open, setOpen] = useState(true);
    const handleClose = () => {
        localStorage.clear();
        setOpen(false);
        instance.logoutPopup().catch(e => {
            console.error(e);
        });
    };
    return (
        <>
            <Dialog
                open={open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" color='error'>
                    {"Session Expired"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Your unable to view aov service request. Your session has expired. please log in again.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}> 
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
export default AlertDialog;

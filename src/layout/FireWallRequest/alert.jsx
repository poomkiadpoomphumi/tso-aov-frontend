import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AlertDialogSlide = ({ index, title, text, open, setOpen, recall, nextFuntion, component }) => {
    const handleClose = () => { setOpen(prev => ({ ...prev, [index]: false })); };
    const handleSubmit = () => {
        nextFuntion(true);
        if (!recall) {
            setOpen(prev => ({ ...prev, [index]: false }));
        }

    };
    return (
        <>
            <Dialog
                open={open}
                slots={{ transition: Transition }}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle sx={{ color: index === 1 ? 'red' : '', fontSize: index === 1 ? '25px' : '' }}>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description" sx={{ fontSize: index === 1 ? '20px' : '' }}>
                        {text}
                    </DialogContentText>
                    {component && (component)}
                </DialogContent>
                <DialogActions>
                    <Button color="error" onClick={handleClose}>Disagree</Button>
                    <Button onClick={handleSubmit}>Agree</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
export default AlertDialogSlide;

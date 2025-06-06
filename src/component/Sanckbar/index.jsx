import { useEffect } from 'react';
import { SnackbarProvider, useSnackbar } from 'notistack';

const MyApp = ({ variant, text }) => {
    const { enqueueSnackbar } = useSnackbar();
    useEffect(() => { enqueueSnackbar(text, { variant: variant }); },
        [enqueueSnackbar,text, variant]);
    return null;
}

const Snackbar = ({ variant, text }) => {
    return (
        <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <MyApp variant={variant} text={text} />
        </SnackbarProvider>
    );
}
export default Snackbar;

import { useEffect, useState, useCallback } from 'react';
import { checkTokenExpiration } from '../../axios/handleSubmit';

const CheckExpired = () => {
    const token = localStorage.getItem('tokenUser');
    const [openDialog, setOpenDialog] = useState(false);
    const getCheckExpired = useCallback(async () => {
        if (token) {
            try {
                const response = await checkTokenExpiration(token);
                if (response.data === 'error') {
                    setOpenDialog(true);
                }
            } catch (error) {
                console.error("Token check failed:", error);
                // If the request failed (like 401), we consider it expired
                setOpenDialog(true);
            }
        }
    }, [token]);
    useEffect(() => { getCheckExpired(); }, [getCheckExpired,token]);
    if (openDialog) {
        return true;
    } else {
        return false;
    }
}
export default CheckExpired;
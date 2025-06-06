import { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../auth/authConfig';
import { InteractionRequiredAuthError } from '@azure/msal-browser';
import { setToken, getEmployeeData, __init__ } from '../axios/handleSubmit';

const getUserProfile = async (accessToken) => {
    const response = await fetch(import.meta.env.VITE_GRAPH_MICROSOFT, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) { throw new Error('Failed to fetch user profile'); }
    return response.json();
};

const useAzureData = () => {
    const { instance, accounts } = useMsal();
    const [profileAd, setProfileAd] = useState(null);
    const token = localStorage.getItem('tokenUser');
    const [profileExternal, setProfileExternal] = useState(null);
    useEffect(() => {
        const fetchUserProfileAndData = async () => {
            if (accounts.length === 0) return;
            const request = { ...loginRequest, account: accounts[0] };
            try {
                const response = await instance.acquireTokenSilent(request);
                const userProfile = await getUserProfile(response.accessToken);
                localStorage.setItem('#$%1t0k', response.accessToken);
                const x5t = await __init__(response.accessToken);
                localStorage.setItem('7#4^>3%&', x5t);
                const profileData = await handleUserProfile(userProfile, x5t);
                setProfileAd(profileData);
            } catch (error) {
                if (error instanceof InteractionRequiredAuthError) {
                    try {
                        const response = await instance.acquireTokenPopup(request);
                        const userProfile = await getUserProfile(response.accessToken);
                        localStorage.setItem('#$%1t0k', response.accessToken);
                        const x5t = await __init__(response.accessToken);
                        localStorage.setItem('7#4^>3%&', x5t);
                        const profileData = await handleUserProfile(userProfile, x5t);
                        setProfileAd(profileData);
                    } catch (popupError) {
                        console.error('Error during popup token acquisition', popupError);
                    }
                }
            }
        };
        const handleUserProfile = async (userProfile, x5t) => {
            //const codeId = '610117'; //660105 เดฟ //400129 พี่เอ๋ //340044 พี่พงษ์ //610117 พี่ต๊าส //600010 พี่โจ้  //320101 พี่ประกอบ //510036 พี่โอ๋
            const codeId = userProfile.userPrincipalName.split('@')[0];
            localStorage.setItem('userCode', codeId);
            setProfileExternal(userProfile);
            if (!token && x5t) { await setToken(codeId); }
            const response = await getEmployeeData(codeId);
            return response === 'N' || response === 'No data available' ? userProfile : response;

        };
        fetchUserProfileAndData();
    }, [instance, accounts, token]);
    if (profileAd === 'User exit or no have permission') {
        return profileExternal;
    } else {
        return profileAd;
    }

};

export default useAzureData;

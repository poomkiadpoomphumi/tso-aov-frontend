import { sysLogsUser as sysLogsUserHandler } from '../axios/handleSubmit.js';

const sysLogsUser = (() => {
    return async (profileAd) => {
        if (profileAd !== null) {
            const hasLogged = localStorage.getItem('hasLogged');  // Check if already logged
            if (!hasLogged) {
                await sysLogsUserHandler(profileAd);  // Call the logging function
                localStorage.setItem('hasLogged', 'true');  // Set the flag in localStorage
            }
        }
    };
})();

export default sysLogsUser;
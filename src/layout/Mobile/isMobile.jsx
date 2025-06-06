import { useState, useEffect } from 'react';
const useIsMobile = () => {
    const [isDesktop, setIsDesktop] = useState(false);
    useEffect(() => {
        const checkDevice = () => {
            const userAgent = navigator.userAgent;
            const mobileRegex = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
            setIsDesktop(!mobileRegex.test(userAgent) && window.innerWidth > 768);
        };
        checkDevice();
        window.addEventListener('resize', checkDevice);
        return () => {
            window.removeEventListener('resize', checkDevice);
        };
    }, []);
    return !isDesktop; // true if mobile, false if desktop
}
export default useIsMobile;
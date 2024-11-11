import axios from 'axios';
import CryptoJS from 'crypto-js';
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

export const getSessionData = async () => {
    try {
        const token = localStorage.getItem('#$%1t0k');
        const hasMe = localStorage.getItem('7#4^>3%&');
        const userLocal = localStorage.getItem('username');
        if (userLocal) {
            const response = await axios.post("https://tso-aov-sr.pttplc.com/api/session", { userLocal }, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
                    'X-Has-Me': hasMe
                },
            });
            return response.data;
        }
    } catch (error) {
        console.error("Error getSessionData data:", error);
    }
};

export const uploadFile = async (formData) => {
    try {
        const token = localStorage.getItem('#$%1t0k');
        const hasMe = localStorage.getItem('7#4^>3%&');
        const response = await axios.post('https://tso-aov-sr.pttplc.com/api/upload', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
                'X-Has-Me': hasMe
            },
        });
        return [true, response.data];
    } catch (error) {
        console.error('Error fetching data uploadFile:', error);
        return [false, error];
    }
}

export const getDataFormdigital = async (userLocalToken) => {
    try {
        const encryptedData = localStorage.getItem('Employee');
        const token = localStorage.getItem('#$%1t0k');
        const hasMe = localStorage.getItem('7#4^>3%&');
        if (!encryptedData) {
            console.warn('No employee data found in localStorage');
            return [];
        }
        const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
        const storedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        if (storedData === 'N' || !storedData) {
            return [];
        }
        // Proceed with the API request if data is valid
        return await axios.post('https://tso-aov-sr.pttplc.com/api/getDataFormdigital', { userLocalToken }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
                'X-Has-Me': hasMe
            },
        });
    } catch (error) {
        console.error('Error fetching data getDataFormdigital:', error);
        throw error;
    }
}

export const getDataRequest = async (userLocalToken) => {
    try {
        const token = localStorage.getItem('#$%1t0k');
        const hasMe = localStorage.getItem('7#4^>3%&');
        const encryptedData = localStorage.getItem('Employee');
        if (!encryptedData) {
            console.warn('No employee data found in localStorage');
            return [];
        }
        const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
        const storedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        if (storedData === 'N' || !storedData) {
            return [];
        } else {
            return await axios.post('https://tso-aov-sr.pttplc.com/api/getDataRequest', { userLocalToken }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
                    'X-Has-Me': hasMe
                },
            });
        }
    } catch (error) {
        console.error('Error fetching data getDataRequest:', error);
        throw error;
    }
}

export const getCodeImg = async (token) => {
    try {
        const code = token;
        const encryptedData = localStorage.getItem('Employee');
        const tokenx = localStorage.getItem('#$%1t0k');
        const hasMe = localStorage.getItem('7#4^>3%&');
        if (!tokenx || !hasMe) {
            console.error("Invalid token or missing headers.");
            return null;
        }
        if (encryptedData) {
            try {
                const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
                const storedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                if (!storedData) {
                    console.error("Decryption failed or storedData is invalid.");
                    return null;
                }
                if (storedData[0] === 'N') {
                    return await fetchCodeImgFromAPI(code, token, tokenx, hasMe);
                }
                return storedData;
            } catch (decryptionError) {
                console.error("Error during decryption or JSON parsing:", decryptionError);
                return null;
            }
        } else {
            return await fetchCodeImgFromAPI(code, token, tokenx, hasMe);
        }
    } catch (error) {
        console.error('Error in getCodeImg:', error);
        throw error;
    }
};

const fetchCodeImgFromAPI = async (code, token, tokenx, hasMe) => {
    try {
        const response = await axios.post(
            'https://tso-aov-sr.pttplc.com/api/getCodeImg',
            { code, token },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenx}`,
                    'X-Has-Me': hasMe,
                },
            }
        );
        if (response.status === 500) { return 500; }
        return response.data;
    } catch (apiError) {
        console.error("Error fetching from API:", apiError);
        return null;
    }
};



export const getEmployeeData = async (code) => {
    try {
        const token = localStorage.getItem('tokenUser');
        const encryptedData = localStorage.getItem('Employee');
        const tokenx = localStorage.getItem('#$%1t0k');
        const hasMe = localStorage.getItem('7#4^>3%&');
        if (encryptedData) {
            const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
            const storedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            return storedData;
        } else {
            const response = await axios.post('https://tso-aov-sr.pttplc.com/api/getEmployeeData', { code, token }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenx}`, // Send the token in the Authorization header
                    'X-Has-Me': hasMe
                },
            });
            const encryptedResponse = CryptoJS.AES.encrypt(JSON.stringify(response.data), SECRET_KEY).toString();
            localStorage.setItem('Employee', encryptedResponse);
            return response.data;
        }
    } catch (error) {
        console.error('Error fetching data getEmployeeData:', error);
        return error.response.status
    }
}


export const isMaxHlvEmployer = async (code) => {
    try {
        const encryptedData = localStorage.getItem('Employer');
        if (encryptedData) {
            const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
            const storedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            return storedData;
        } else {
            const token = localStorage.getItem('#$%1t0k');
            const hasMe = localStorage.getItem('7#4^>3%&');
            const response = await axios.post('https://tso-aov-sr.pttplc.com/api/isMaxHlvEmployer', { code }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
                    'X-Has-Me': hasMe
                },
            });
            const encryptedResponse = CryptoJS.AES.encrypt(JSON.stringify(response.data), SECRET_KEY).toString();
            localStorage.setItem('Employer', encryptedResponse);
            return response.data;
        }
    } catch (error) {
        console.error('Error isMaxHlvEmployer data:', error);
        return error.response.status
    }
}

export const checkTokenExpiration = async (userLocalToken) => {
    try {
        const token = localStorage.getItem('#$%1t0k');
        const hasMe = localStorage.getItem('7#4^>3%&');
        const response = await axios.post('https://tso-aov-sr.pttplc.com/api/checkTokenExpiration', { userLocalToken }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
                'X-Has-Me': hasMe
            },
        });
        return response;
    } catch (error) {
        console.error('Error checkTokenExpiration data:', error);
        throw error;
    }
}

export const ApiClearCache = async () => {
    try {
        const token = localStorage.getItem('#$%1t0k');
        const hasMe = localStorage.getItem('7#4^>3%&');
        return await axios.post('https://tso-aov-sr.pttplc.com/api/ApiClearCache', {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
                'X-Has-Me': hasMe
            },
        });
    } catch (error) {
        console.error('Error ApiClearCache data:', error);
        throw error;
    }
}


export const setToken = async (params) => {
    const token = localStorage.getItem('#$%1t0k');
    const hasMe = localStorage.getItem('7#4^>3%&');
    const response = await axios.post('https://tso-aov-sr.pttplc.com/api/setToken', { params }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
            'X-Has-Me': hasMe
        },
    });
    localStorage.setItem('tokenUser', response.data);  // Store token in local storage
}

export const updateStatusApprove = async (id, commentValue, params, userCode) => {
    try {
        const token = localStorage.getItem('#$%1t0k');
        const hasMe = localStorage.getItem('7#4^>3%&');
        const response = await axios.post('https://tso-aov-sr.pttplc.com/api/updateStatusApprove', { id, commentValue, params, userCode }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
                'X-Has-Me': hasMe
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updateStatusApprove data:', error);
        throw error;
    }
}
export const updateStatusReject = async (id, commentValue, params, userCode) => {
    try {
        const token = localStorage.getItem('#$%1t0k');
        const hasMe = localStorage.getItem('7#4^>3%&');
        const response = await axios.post('https://tso-aov-sr.pttplc.com/api/updateStatusReject', { id, commentValue, params, userCode }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
                'X-Has-Me': hasMe
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updateStatusReject data:', error);
        throw error;
    }
}
export const CheckApprover = async (params) => {
    try {
        const token = localStorage.getItem('#$%1t0k');
        const hasMe = localStorage.getItem('7#4^>3%&');
        const response = await axios.post('https://tso-aov-sr.pttplc.com/api/CheckApprover', { params }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
                'X-Has-Me': hasMe
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error CheckApprover data:', error);
        throw error;
    }
}

export const getDataFormSent = async (id) => {
    try {
        const token = localStorage.getItem('#$%1t0k');
        const hasMe = localStorage.getItem('7#4^>3%&');
        const response = await axios.post('https://tso-aov-sr.pttplc.com/api/getDataFormSent', { id }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
                'X-Has-Me': hasMe
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error getDataFormSent data:', error);
        throw error;
    }
}


export const settingDigital = async (array, code) => {
    try {
        const token = localStorage.getItem('#$%1t0k');
        const hasMe = localStorage.getItem('7#4^>3%&');
        return await axios.post('https://tso-aov-sr.pttplc.com/api/settingDigital', { array, code }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
                'X-Has-Me': hasMe
            },
        });
    } catch (error) {
        console.error('Error settingDigital data:', error);
        throw error;
    }
}

export const getsettings = async (params) => {
    try {
        const token = localStorage.getItem('#$%1t0k');
        const hasMe = localStorage.getItem('7#4^>3%&');
        return await axios.post('https://tso-aov-sr.pttplc.com/api/getsettings', { params }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
                'X-Has-Me': hasMe
            },
        });
    } catch (error) {
        console.error('Error getsettings data:', error);
        throw error;
    }
}

export const Delete = async (id) => {
    try {
        const token = localStorage.getItem('#$%1t0k');
        const hasMe = localStorage.getItem('7#4^>3%&');
        return await axios.post('https://tso-aov-sr.pttplc.com/api/Delete', { id }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
                'X-Has-Me': hasMe
            },
        });
    } catch (error) {
        console.error('Error Delete data:', error);
        throw error;
    }
}

export const sysLogsUser = async (array) => {
    try {
        const token = localStorage.getItem('#$%1t0k');
        const hasMe = localStorage.getItem('7#4^>3%&');
        return await axios.post('https://tso-aov-sr.pttplc.com/api/LogsSystem', { array }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
                'X-Has-Me': hasMe
            },
        });
    } catch (error) {
        console.error('Error sysLogsUser data:', error);
        throw error;
    }
}

export const getLogsUser = async (s, e) => {
    try {
        const token = localStorage.getItem('#$%1t0k');
        const hasMe = localStorage.getItem('7#4^>3%&');
        return await axios.post('https://tso-aov-sr.pttplc.com/api/getLogsUser', { s, e }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
                'X-Has-Me': hasMe
            },
        });
    } catch (error) {
        console.error('Error getLogsUser data:', error);
        throw error;
    }
}

export const __init__ = async (params) => {
    const token = localStorage.getItem('#$%1t0k');
    return await axios.post('https://tso-aov-sr.pttplc.com/api/initail', {}, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${params}`, // Send the token in the Authorization header
            'X-Has-Me': token
        },
    });
}

export const getDataInMonth = async (s, e) => {
    try {
        const token = localStorage.getItem('#$%1t0k');
        const hasMe = localStorage.getItem('7#4^>3%&');
        return await axios.post('https://tso-aov-sr.pttplc.com/api/getDataInMonth', { s, e }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
                'X-Has-Me': hasMe
            },
        });
    } catch (error) {
        console.error('Error getDataInMonth data:', error);
        throw error;
    }
}

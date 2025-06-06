import axios from 'axios';
import CryptoJS from 'crypto-js';
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;
const api = axios.create({ baseURL: import.meta.env.VITE_ORIGIN });

export const getSessionData = async () => {
    try {
        const token = localStorage.getItem('#$%1t0k');
        const hasMe = localStorage.getItem('7#4^>3%&');
        const userLocal = localStorage.getItem('username');
        if (userLocal) {
            const response = await api.post(`/session`, { userLocal }, {
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
        const response = await api.post('/upload', formData, {
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
        return await api.post('/getDataFormdigital', { userLocalToken }, {
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
            return await api.post('/getDataRequest', { userLocalToken }, {
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
        const response = await api.post('/getCodeImg', { code, token },
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
            const response = await api.post('/getEmployeeData', { code, token }, {
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
        const token = localStorage.getItem('#$%1t0k');
        const hasMe = localStorage.getItem('7#4^>3%&');
        const response = await api.post('/isMaxHlvEmployer', { code }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'X-Has-Me': hasMe
            },
        });
        // เก็บ response ลง localStorage เผื่อใช้ในที่อื่น
        const encryptedResponse = CryptoJS.AES.encrypt(JSON.stringify(response.data), SECRET_KEY).toString();
        localStorage.setItem('Employer', encryptedResponse);
        return response.data;
    } catch (error) {
        console.error('Error isMaxHlvEmployer data:', error);
        // fallback จาก localStorage หาก request ล้มเหลว
        const encryptedData = localStorage.getItem('Employer');
        if (encryptedData) {
            const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
            const storedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            return storedData;
        }

        return error.response?.status || 500;
    }

}

export const checkTokenExpiration = async (userLocalToken) => {
    try {
        const token = localStorage.getItem('#$%1t0k');
        const hasMe = localStorage.getItem('7#4^>3%&');
        const response = await api.post('/checkTokenExpiration', { userLocalToken }, {
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
        return await api.post('/ApiClearCache', {}, {
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
    const response = await api.post('/setToken', { params }, {
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
        const response = await api.post('/updateStatusApprove', { id, commentValue, params, userCode }, {
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
        const response = await api.post('/updateStatusReject', { id, commentValue, params, userCode }, {
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
        const response = await api.post('/CheckApprover', { params }, {
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
        const response = await api.post('/getDataFormSent', { id }, {
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


export const settingDigital = async (array, code, service) => {
    try {
        const token = localStorage.getItem('#$%1t0k');
        const hasMe = localStorage.getItem('7#4^>3%&');
        return await api.post('/settingDigital', { array, code, service }, {
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
        return await api.post('/getsettings', { params }, {
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
        return await api.post('/Delete', { id }, {
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
        return await api.post('/LogsSystem', { array }, {
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

export const getLogsUser = async (s, e, module) => {
    try {
        const token = localStorage.getItem('#$%1t0k');
        const hasMe = localStorage.getItem('7#4^>3%&');
        return await api.post('/getLogsUser', { s, e, module }, {
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
    try {
        const token = localStorage.getItem('#$%1t0k');
        const response = await api.post('/initail', {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${params}`, // Send the token in the Authorization header
                'X-Has-Me': token
            },
        });
        return response.data; // Return response data for better usability
    } catch (error) {
        console.error('Error in __init__:', error.response?.data || error.message);
        throw error; // Rethrow the error for further handling
    }
};


export const getDataInMonth = async (s, e) => {
    try {
        const token = localStorage.getItem('#$%1t0k');
        const hasMe = localStorage.getItem('7#4^>3%&');
        return await api.post('/getDataInMonth', { s, e }, {
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

export const updateDataFireWall = async (formData) => {
    try {
        const token = localStorage.getItem('#$%1t0k');
        const hasMe = localStorage.getItem('7#4^>3%&');
        const response = await api.post('/uploadDataFirewall', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
                'X-Has-Me': hasMe
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updateDataFireWall:', error);
        throw error;
    }
}

export const updateStatusFirewall = async (id, comment, params, userCode, button) => {
    try {
        const token = localStorage.getItem('#$%1t0k');
        const hasMe = localStorage.getItem('7#4^>3%&');
        const response = await api.post('/updateStatusFirewall', { id, comment, params, userCode, button }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
                'X-Has-Me': hasMe
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updateStatusFirewall data:', error);
        throw error;
    }
}
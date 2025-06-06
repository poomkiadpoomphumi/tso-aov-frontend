import { PublicClientApplication } from '@azure/msal-browser';

const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_CLIENTID,
    authority: import.meta.env.VITE_AUTHORITY,
    redirectUri: 'http://localhost:6005',
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  }
};

const loginRequest = {
  scopes: ['openid', 'profile', 'User.Read']
};
const msalInstance = new PublicClientApplication(msalConfig);

export { msalInstance, loginRequest };

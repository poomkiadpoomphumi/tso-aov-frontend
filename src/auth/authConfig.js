import { PublicClientApplication } from '@azure/msal-browser';

const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_CLIENTID,
    authority: process.env.REACT_APP_AUTHORITY,
    redirectUri: 'https://tso-aov-sr.pttplc.com',
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

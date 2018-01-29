import auth0 from 'auth0-js';
import axios from 'axios';

class Auth0WebAuth {
  constructor(sdk) {
    this._sdk = sdk;

    const authConfig = {
      authorizationPath: '/callback',
      ...this._sdk.config.auth
    };

    if (!authConfig.authProviderClientId) {
      throw new Error('authProviderClientId is required for the WebAuth config');
    }

    if (!authConfig.clientId) {
      throw new Error('clientId is required for the WebAuth config');
    }

    this._auth0 = new auth0.WebAuth({
      audience: authConfig.authProviderClientId,
      clientId: authConfig.clientId,
      domain: 'ndustrial.auth0.com',
      redirectUri: window.location.origin +
        (authConfig.authorizationPath.indexOf('/') === 0 ? '' : '/') +
        authConfig.authorizationPath,
      responseType: 'token',
      scope: 'profile openid'
    });
  }

  getCurrentToken() {
    if (!(this._sessionInfo && this._sessionInfo.apiToken)) {
      throw new Error('No api token found');
    }

    return this._sessionInfo.apiToken;
  }

  getProfile() {
    const accessToken = this._sessionInfo && this._sessionInfo.accessToken;

    if (!accessToken) {
      throw new Error('No access token found');
    }

    return new Promise((resolve, reject) => {
      this._auth0.client.userInfo(accessToken, (err, profile) => {
        if (err) {
          reject(err);
        }

        resolve(profile);
      });
    });
  }

  handleAuthentication() {
    return this._parseWebAuthHash()
      .then((hash) => {
        return Promise.all([
          {
            accessToken: hash.accessToken,
            expiresAt: (hash.expiresIn * 1000) + Date.now()
          },
          this._getApiToken(hash.accessToken)
        ]);
      })
      .then(([partialSessionInfo, apiToken]) => {
        const sessionInfo = {
          ...partialSessionInfo,
          apiToken
        };

        this._saveSession(sessionInfo);

        return sessionInfo;
      });
  }

  isAuthenticated() {
    return this._sessionInfo.expiresAt > Date.now();
  }

  logIn() {
    this._auth0.authorize();
  }

  logOut() {
    delete this._sessionInfo;
    localStorage.removeItem('access_token');
    localStorage.removeItem('api_token');
    localStorage.removeItem('expires_at');
  }

  _getApiToken(accessToken) {
    return axios
      .post(
        'https://contxt-auth.api.ndustrial.io/v1/token',
        {
          audiences: this._sdk.config.apiDependencies,
          nonce: 'nonce'
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      )
      .then(({ data }) => data.access_token);
  }

  _parseWebAuthHash() {
    return new Promise((resolve, reject) => {
      this._auth0.parseHash((err, hashResponse) => {
        if (err || !hashResponse) {
          return reject(err || 'No valid tokens returned from auth0');
        }

        return resolve(hashResponse);
      });
    });
  }

  _saveSession(sessionInfo) {
    this._sessionInfo = sessionInfo;

    localStorage.setItem('access_token', sessionInfo.accessToken);
    localStorage.setItem('api_token', sessionInfo.apiToken);
    localStorage.setItem('expires_at', sessionInfo.expiresAt);
  }
}

export default Auth0WebAuth;

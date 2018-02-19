import auth0 from 'auth0-js';
import axios from 'axios';
import URL from 'url-parse';

class Auth0WebAuth {
  constructor(sdk) {
    this._sdk = sdk;

    if (!this._sdk.config.auth.clientId) {
      throw new Error('clientId is required for the WebAuth config');
    }

    this._sessionInfo = this._loadSession();

    const currentUrl = new URL(window.location);
    currentUrl.set('pathname', this._sdk.config.auth.authorizationPath);

    this._auth0 = new auth0.WebAuth({
      audience: this._sdk.config.audiences.contxtAuth.clientId,
      clientID: this._sdk.config.auth.clientId,
      domain: 'ndustrial.auth0.com',
      redirectUri: `${currentUrl.origin}${currentUrl.pathname}`,
      responseType: 'token',
      scope: 'profile openid'
    });
  }

  getCurrentAccessToken() {
    return this._getCurrentTokenByType('access');
  }

  getCurrentApiToken() {
    return this._getCurrentTokenByType('api');
  }

  getProfile() {
    return new Promise((resolve, reject) => {
      this._auth0.client.userInfo(this.getCurrentAccessToken(), (err, profile) => {
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
      })
      .then((sessionInfo) => {
        const redirectPathname = this._getRedirectPathname();
        const redirectUrl = this._generateRedirectUrlFromPathname(redirectPathname);
        window.location = redirectUrl;

        return sessionInfo;
      })
      .catch((err) => {
        console.log(`Error while handling authentication: ${err}`);
        window.location = this._generateRedirectUrlFromPathname('/');
        throw err;
      });
  }

  isAuthenticated() {
    const hasTokens = !!(this._sessionInfo && this._sessionInfo.accessToken &&
      this._sessionInfo.apiToken && this._sessionInfo.expiresAt);

    return hasTokens && this._sessionInfo.expiresAt > Date.now();
  }

  logIn() {
    this._auth0.authorize();
  }

  logOut() {
    this._sessionInfo = {};

    localStorage.removeItem('access_token');
    localStorage.removeItem('api_token');
    localStorage.removeItem('expires_at');

    window.location = this._generateRedirectUrlFromPathname('/');
  }

  _generateRedirectUrlFromPathname(path) {
    const newUrl = new URL(window.location);
    newUrl.set('hash', '');
    newUrl.set('pathname', path);

    return newUrl.href;
  }

  _getApiToken(accessToken) {
    return axios
      .post(
        `${this._sdk.config.audiences.contxtAuth.host}/v1/token`,
        {
          audiences: Object.keys(this._sdk.config.audiences)
            .map((audienceName) => this._sdk.config.audiences[audienceName].clientId)
            .filter((clientId) => clientId !== this._sdk.config.audiences.contxtAuth.clientId),
          nonce: 'nonce'
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      )
      .then(({ data }) => data.access_token);
  }

  _getCurrentTokenByType(type) {
    const propertyName = `${type}Token`;

    if (!(this._sessionInfo && this._sessionInfo[propertyName])) {
      throw new Error(`No ${type} token found`);
    }

    return this._sessionInfo[propertyName];
  }

  _getRedirectPathname() {
    const redirectPathname = localStorage.getItem('redirect_pathname');
    localStorage.removeItem('redirect_pathname');

    return redirectPathname || '/';
  }

  _loadSession() {
    return {
      accessToken: localStorage.getItem('access_token'),
      apiToken: localStorage.getItem('api_token'),
      expiresAt: localStorage.getItem('expires_at')
    };
  }

  _parseWebAuthHash() {
    return new Promise((resolve, reject) => {
      this._auth0.parseHash((err, hashResponse) => {
        if (err || !hashResponse) {
          return reject(err || new Error('No valid tokens returned from auth0'));
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

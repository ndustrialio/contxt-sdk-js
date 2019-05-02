import auth0 from 'auth0-js';
import axios from 'axios';
import URL from 'url-parse';

/**
 * @typedef {Object} UserProfile
 * @property {string} name
 * @property {string} nickname
 * @property {string} picture URL to an avatar
 * @property {string} sub The Subject Claim of the user's JWT
 * @property {string} updatedAt ISO 8601 Extended Format date/time string
 */

/**
 * @typedef {Object} Auth0WebAuthSessionInfo
 * @property {string} accessToken
 * @property {string} apiToken
 * @property {number} expiresAt
 */

/**
 * A SessionType that allows the user to initially authenticate with Auth0 and then gain a valid JWT
 * from the Contxt Auth service. This would only be used in web applications. You will need to
 * integrate this module's `logIn`, `logOut`, and `handleAuthentication` methods with your UI
 * elements. `logIn` would be tied to a UI element to log the user in. `logOut` would be tied to a
 * UI element to log the user out. `handleAuthentication` would be tied with your application's
 * router and would be called when visting the route defined by `config.authorizationPath` (the
 * default is `/callback`).
 *
 * This SessionType is set up to refresh auth tokens automatically. To ensure this works, make sure
 * your single page application has {@link https://auth0.com/docs/cross-origin-authentication#configure-your-application-for-cross-origin-authentication Cross-Origin Authentication}
 * enabled in Auth0.
 *
 * *NOTE*: The web origin added in auth0 should be something like
 * "http://localhost:5000", not "http://localhost:5000/callback"
 *
 * @type SessionType
 *
 * @typicalname contxtSdk.auth
 *
 * @example
 * import ContxtSdk from '@ndustrial/contxt-sdk';
 * import history from '../services/history';
 *
 * const contxtSdk = new ContxtSDK({
 *   config: {
 *     auth: {
 *       clientId: '<client id>',
 *       onRedirect: (pathname) => history.push(pathname)
 *     }
 *   },
 *   sessionType: 'auth0WebAuth'
 * });
 */
class Auth0WebAuth {
  /**
   * @param {Object} sdk An instance of the SDK so the module can communicate with other modules
   * @param {Object} sdk.audiences
   * @param {Object} sdk.audiences.contxtAuth
   * @param {string} sdk.audiences.contxtAuth.clientId The Auth0 client id of the
   *   Contxt Auth environment
   * @param {Object} sdk.config
   * @param {Object} sdk.config.auth
   * @param {string} sdk.config.auth.authorizationPath Path that is called by Auth0 after
   *   successfully authenticating
   * @param {string} sdk.config.auth.clientId The Auth0 client id of this application
   * @param {function} [sdk.config.auth.onRedirect] Redirect method used when navigating between
   *   Auth0 callbacks
   */
  constructor(sdk) {
    this._sdk = sdk;

    if (!this._sdk.config.auth.clientId) {
      throw new Error('clientId is required for the WebAuth config');
    }

    this._onRedirect =
      this._sdk.config.auth.onRedirect || this._defaultOnRedirect;
    this._sessionInfo = this._getStoredSession();
    this._tokenPromises = {};

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

  getCurrentApiToken(audienceName) {
    return this._getNewApiToken(audienceName);
  }

  handleAuthentication() {
    return this._parseHash()
      .then((authResult) => {
        this._storeSession(authResult);

        const redirectPathname = this._getRedirectPathname();

        this._onRedirect(redirectPathname);
      })
      .catch((err) => {
        console.log(`Error while handling authentication: ${err}`);

        this._onRedirect('/');

        throw err;
      });
  }

  isAuthenticated() {
    return (
      this._sessionInfo.accessToken && this._sessionInfo.expiresAt > Date.now()
    );
  }

  logIn() {
    this._auth0.authorize();
  }

  logOut() {
    this._sessionInfo = {};

    localStorage.removeItem('access_token');
    localStorage.removeItem('expires_at');

    this._auth0.logout({ returnTo: window.location.origin });
  }

  _defaultOnRedirect(pathname) {
    window.location = pathname;
  }

  _getNewApiToken(audienceName) {
    const audience = this._sdk.config.audiences[audienceName];

    if (!(audience && audience.clientId)) {
      return Promise.reject(new Error('No valid audience found'));
    }

    if (!this._tokenPromises[audienceName]) {
      this._tokenPromises[audienceName] = axios
        .post(
          `${this._sdk.config.audiences.contxtAuth.host}/v1/token`,
          {
            audiences: [audience.clientId],
            nonce: 'nonce'
          },
          {
            headers: {
              Authorization: `Bearer ${this._sessionInfo.accessToken}`
            }
          }
        )
        .then(({ data }) => data.access_token);
    }

    return this._tokenPromises[audienceName];
  }

  _getRedirectPathname() {
    const redirectPathname = localStorage.getItem('redirect_pathname');
    localStorage.removeItem('redirect_pathname');

    return redirectPathname || '/';
  }

  _getStoredSession() {
    return {
      accessToken: localStorage.getItem('access_token'),
      expiresAt: JSON.parse(localStorage.getItem('expires_at'))
    };
  }

  _parseHash() {
    return new Promise((resolve, reject) => {
      this._auth0.parseHash((err, authResult) => {
        if (err || !authResult) {
          return reject(
            err || new Error('No valid tokens returned from auth0')
          );
        }

        return resolve(authResult);
      });
    });
  }

  _storeSession({ accessToken, expiresIn }) {
    const expiresAt = expiresIn * 1000 + Date.now();

    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt));

    this._sessionInfo.accessToken = accessToken;
    this._sessionInfo.expiresAt = expiresAt;
  }
}

export const TYPE = 'auth0WebAuth';
export default Auth0WebAuth;

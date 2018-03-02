import auth0 from 'auth0-js';
import axios from 'axios';
import URL from 'url-parse';

/**
 * @typedef {Object} UserProfile
 * @property {string} name
 * @property {string} nickname
 * @property {string} picture URL to an avatar
 * @property {string} sub The Subject Claim of the user's JWT
 * @property {string} updated_at ISO 8601 Extended Format date/time string
 */

/**
 * @typedef {Object} Auth0WebAuthSessionInfo
 * @property {string} accessToken
 * @property {string} apiToken
 * @property {number} expiresAt
 */

/**
 * A SessionType that allows the user to initially authenticate with Auth0 and then gain a valid JWT
 * from the Contxt Auth service.
 *
 * @type SessionType
 *
 * @typicalname contxtSdk.auth
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

    this._onRedirect = this._sdk.config.auth.onRedirect || this._defaultOnRedirect;
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

  /**
   * Gets the current access token (used to communicate with Auth0 & Contxt Auth)
   *
   * @returns {Promise}
   * @fulfills {string} accessToken
   */
  getCurrentAccessToken() {
    return this._getCurrentTokenByType('access');
  }

  /**
   * Gets the current API token (used to communicate with other Contxt APIs)
   *
   * @returns {Promise}
   * @fulfills {string} apiToken
   */
  getCurrentApiToken() {
    return this._getCurrentTokenByType('api');
  }

  /**
   * Gets the current user's profile from Auth0
   *
   * @returns {Promise}
   * @fulfill {UserProfile}
   * @rejects {Error}
   */
  getProfile() {
    return this.getCurrentAccessToken()
      .then((accessToken) => {
        return new Promise((resolve, reject) => {
          this._auth0.client.userInfo(accessToken, (err, profile) => {
            if (err) {
              reject(err);
            }

            resolve(profile);
          });
        });
      });
  }

  /**
   * Routine that takes unparsed information from Auth0, uses it to get a valid API token, and then
   * redirects to the correct page in the application.
   *
   * @returns {Promise}
   * @fulfill {Auth0WebAuthSessionInfo}
   * @rejects {Error}
   */
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

        this._onRedirect(redirectPathname);

        return sessionInfo;
      })
      .catch((err) => {
        console.log(`Error while handling authentication: ${err}`);

        this._onRedirect('/');

        throw err;
      });
  }

  /**
   * Tells caller if the current user is authenticated.
   *
   * @returns {boolean}
   */
  isAuthenticated() {
    const hasTokens = !!(this._sessionInfo && this._sessionInfo.accessToken &&
      this._sessionInfo.apiToken && this._sessionInfo.expiresAt);

    return hasTokens && this._sessionInfo.expiresAt > Date.now();
  }

  /**
   * Starts the Auth0 log in process
   */
  logIn() {
    this._auth0.authorize();
  }

  /**
   * Logs the user out by removing any stored session info and redirecting to the root
   */
  logOut() {
    this._sessionInfo = {};

    localStorage.removeItem('access_token');
    localStorage.removeItem('api_token');
    localStorage.removeItem('expires_at');

    this._onRedirect('/');
  }

  /**
   * Default method used for redirecting around the web application. Overridden by `onRedirect` in
   * the auth config
   *
   * @private
   */
  _defaultOnRedirect(pathname) {
    window.location = pathname;
  }

  /**
   * Requests an access token from Contxt Auth with the correct audiences.
   *
   * @returns {Promise}
   * @fulfill {string} accessToken
   *
   * @private
   */
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

  /**
   * Returns the type of token requested if it exists.
   *
   * @param {string} type The type of token requested. Only valid types are `access` and `api`
   *
   * @returns {Promise}
   * @fulfills {string} token
   * @rejects {Error}
   *
   * @private
   */
  _getCurrentTokenByType(type) {
    return new Promise((resolve, reject) => {
      const propertyName = `${type}Token`;

      if (!(this._sessionInfo && this._sessionInfo[propertyName])) {
        reject(new Error(`No ${type} token found`));
      }

      resolve(this._sessionInfo[propertyName]);
    });
  }

  /**
   * Grabs a stored redirect pathname that may have been stored in another part of the
   * web application
   *
   * @private
   */
  _getRedirectPathname() {
    const redirectPathname = localStorage.getItem('redirect_pathname');
    localStorage.removeItem('redirect_pathname');

    return redirectPathname || '/';
  }

  /**
   * Loads a saved session from local storage
   *
   * @returns {Object} session
   * @returns {string} session.accessToken
   * @returns {string} session.apiToken
   * @returns {number} session.expiresAt
   *
   * @private
   */
  _loadSession() {
    return {
      accessToken: localStorage.getItem('access_token'),
      apiToken: localStorage.getItem('api_token'),
      expiresAt: localStorage.getItem('expires_at')
    };
  }

  /**
   * Wraps Auth0's method for parsing hash information after a successful authentication.
   *
   * @returns {Promise}
   * @fulfill {Object} hashResponse Information returned from Auth0
   * @rejects {Error}
   *
   * @private
   */
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

  /**
   * Saves a session in local storage for future use
   *
   * @param {Object} sessionInfo
   * @param {string} sessionInfo.accessToken
   * @param {string} sessionInfo.apiToken
   * @param {number} sessionInfo.expiresAt
   *
   * @private
   */
  _saveSession(sessionInfo) {
    this._sessionInfo = sessionInfo;

    localStorage.setItem('access_token', sessionInfo.accessToken);
    localStorage.setItem('api_token', sessionInfo.apiToken);
    localStorage.setItem('expires_at', sessionInfo.expiresAt);
  }
}

export const TYPE = 'auth0WebAuth';
export default Auth0WebAuth;

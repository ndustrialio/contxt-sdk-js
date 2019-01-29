import auth0 from 'auth0-js';
import axios from 'axios';

/**
 * A SessionType that allows the user to authenticate with Auth0 and
 * then gain a valid JWT from the Contxt Auth service. This method
 * utitlizes the password grant type authorization with Auth0. This
 * SessionType will expect a username and a password to be passed into
 * the `logIn` function from the user to authenticate.
 *
 * @type SessionType
 *
 * @typicalname contxtSdk.auth
 *
 * @example
 * const ContxtSdk = require('@ndustrial/contxt-sdk');
 *
 * const contxtService = new ContxtSdk({
 *   config: {
 *     auth: {
 *       clientId: '<client id>'
 *     }
 *   },
 *   sessionType: 'passwordGrantAuth'
 * });
 */

class PasswordGrantAuth {
  /**
   * @param {Object} sdk An instance of the SDK so the module can communicate with other modules
   * @param {Object} sdk.audiences
   * @param {Object} sdk.audiences.contxtAuth
   * @param {string} sdk.audiences.contxtAuth.clientId The Auth0 client id of the
   *   Contxt Auth environment
   * @param {string} sdk.audiences.contxtAuth.host
   * @param {Object} sdk.config
   * @param {Object} sdk.config.auth
   * @param {string} sdk.config.auth.clientId The Auth0 client id of the application
   */
  constructor(sdk) {
    this._sdk = sdk;
    this._sessionInfo = {};

    this._auth0 = new auth0.Authentication({
      domain: 'ndustrial.auth0.com',
      clientID: this._sdk.config.auth.clientId
    });
  }

  /**
   * Gets the current API token (used to communicate with other Contxt APIs)
   *
   * @returns {Promise}
   * @fulfills {string} apiToken
   * @rejects {Error}
   */
  getCurrentApiToken() {
    return new Promise((resolve, reject) => {
      if (!this._sessionInfo.accessToken) {
        return reject(new Error('No api token found.'));
      }

      return resolve(this._sessionInfo.accessToken);
    });
  }

  /**
   * Tells caller if the current user is authenticated
   *
   * @returns {boolean}
   */
  isAuthenticated() {
    const hasToken = !!(this._sessionInfo && this._sessionInfo.accessToken);

    return hasToken;
  }

  /**
   * Logs the user in using Auth0 using a username a password
   *
   * @param {string} username The username of the user to authenticate
   * @param {string} password The password of the user to authenticate
   *
   * @returns {Promise}
   * @fulfills {string}
   * @rejects {Error}
   */
  logIn(username, password) {
    return new Promise((resolve, reject) => {
      const audience = this._sdk.config.audiences.contxtAuth.clientId;

      this._auth0.loginWithDefaultDirectory(
        { password, username, audience },
        (err, response) => {
          if (err) {
            const errorMessage =
              (err && err.description) || 'Authentication failed.';

            return reject(new Error(errorMessage));
          }

          return resolve(response.accessToken);
        }
      );
    }).then((accessToken) => {
      return this._getApiToken(accessToken);
    });
  }

  /**
   * Logs the user out by removing any stored session info.
   *
   * @returns {Promise}
   * @fulfills {string}
   */
  logOut() {
    return new Promise((resolve) => {
      this._sessionInfo = {};

      return resolve('Logout successful - session info cleared.');
    });
  }

  /**
   * Requests an access token from Contxt Auth with the correct audiences.
   *
   * @param {string} accessToken
   *
   * @returns {Promise}
   * @fulfill {string} accessToken
   * @rejects {Error}
   *
   * @private
   */
  _getApiToken(accessToken) {
    return axios
      .post(
        `${this._sdk.config.audiences.contxtAuth.host}/v1/token`,
        {
          audiences: Object.keys(this._sdk.config.audiences)
            .map((audienceName) => {
              return this._sdk.config.audiences[audienceName].clientId;
            })
            .filter((clientId) => {
              return (
                clientId &&
                clientId !== this._sdk.config.audiences.contxtAuth.clientId
              );
            }),
          nonce: 'nonce'
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      )
      .then((response) => {
        const { data } = response;

        this._saveSession({
          accessToken: data.access_token
        });

        return data.access_token;
      });
  }

  /**
   * Saves the session info (i.e. the Contxt access token) for future use
   *
   * @param {Object} sessionInfo
   * @param {string} sessionInfo.accessToken
   *
   * @private
   */
  _saveSession(sessionInfo) {
    this._sessionInfo = sessionInfo;
  }
}

export const TYPE = 'passwordGrantAuth';
export default PasswordGrantAuth;

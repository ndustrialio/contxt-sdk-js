import auth0 from 'auth0-js';
import axios from 'axios';

/**
 * A SessionType that allows the user to initially authenticate with Auth0 and
 * then gain a valid JWT from the Contxt Auth service. This would only
 * be used in command line applications such as `contxt-cli`.
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
 *       clientId: 'bleED0RUwb7CJ9j7D48tqSiSZRZn29AV'
 *     }
 *   },
 *   sessionType: 'cliAuth'
 * });
 */

class CliAuth {
  /**
   * @param {Object} sdk An instance of the SDK so the module can communicate with other modules
   * @param {Object} sdk.audiences
   * @param {Object} sdk.audiences.contxtAuth
   * @param {string} sdk.audiences.contxtAuth.clientId The Auth0 client id of the
   *   Contxt Auth environment
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

          this._saveSession('accessInfo', response);

          return resolve('Authentication successful.');
        }
      );
    });
    // .then(() => {
    //   // return this._getApiToken(this._sessionInfo.accessInfo.accessToken)
    // })
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
   * @fulfill {string}
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

        this._saveSession('apiToken', data);

        return 'Contxt Authentication successful.';
      })
      .catch(() => {
        throw new Error('An error occurred during authorization with Contxt.');
      });
  }

  /**
   * Saves session info under a specific key for future use
   *
   * @param {string} key
   * @param {Object} sessionInfo
   *
   * @private
   */
  _saveSession(key, sessionInfo) {
    this._sessionInfo[key] = sessionInfo;
  }
}

export const TYPE = 'cliAuth';
export default CliAuth;

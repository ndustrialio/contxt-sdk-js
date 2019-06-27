import axios from 'axios';

/**
 * @typedef {Object} MachineAuthSessionInfo
 * @property {string} apiToken
 * @property {number} expiresAt
 */

/**
 * A SessionType that allows machine to machine communication between Node.js servers. This would
 * only be used in Node.js applications. This SessionType requires a client id and a client secret,
 * which are obtained from Auth0.
 *
 * @type SessionType
 *
 * @typicalname contxtSdk.auth
 *
 * @example
 * const ContxtSdk = require('@ndustrial/contxt-sdk');
 *
 * const contxtSdk = new ContxtSDK({
 *   config: {
 *     auth: {
 *       clientId: '<client id>',
 *       clientSecret: '<client secret>'
 *     }
 *   },
 *   sessionType: 'machineAuth'
 * });
 */
class MachineAuth {
  /**
   * @param {Object} sdk An instance of the SDK so the module can communicate with other modules
   */
  constructor(sdk) {
    this._sdk = sdk;
    this._sessionInfo = {};
    this._tokenPromises = {};

    if (!this._sdk.config.auth.clientId) {
      throw new Error('clientId is required for the MachineAuth config');
    }

    if (!this._sdk.config.auth.clientSecret) {
      throw new Error('clientSecret is required for the MachineAuth config');
    }
  }

  /**
   * Removes an audience's API token from the in-memory token storage
   *
   * @param audienceName
   *
   * @returns {Promise}
   */
  clearCurrentApiToken(audienceName) {
    const promise = this._tokenPromises[audienceName] || Promise.resolve();

    return promise.then(() => {
      delete this._sessionInfo[audienceName];
    });
  }

  /**
   * Gets the current API token (used to communicate with other Contxt APIs). Will get and store a
   * token or use a previously acquired and stored token.
   *
   * @param {string} audienceName The audience you wish to get an API for
   *
   * @returns {Promise}
   * @fulfills {string} apiToken
   */
  getCurrentApiToken(audienceName) {
    if (this.isAuthenticated(audienceName)) {
      return Promise.resolve(this._sessionInfo[audienceName].apiToken);
    }

    return this._getNewSessionInfo(audienceName).then(
      (sessionInfo) => sessionInfo.apiToken
    );
  }

  /**
   * Tells caller if the app is authenticated with a particular service.
   *
   * @param audienceName
   *
   * @returns {boolean}
   */
  isAuthenticated(audienceName) {
    if (!(this._sessionInfo && this._sessionInfo[audienceName])) {
      return false;
    }

    const { apiToken, expiresAt } = this._sessionInfo[audienceName];
    const tokenExpiresAtBufferMs =
      this._sdk.config.auth.tokenExpiresAtBufferMs || 0;
    const bufferedExpiresAt = expiresAt - tokenExpiresAtBufferMs;

    return !!(apiToken && bufferedExpiresAt > Date.now());
  }

  /**
   * Requests an access token from Contxt Auth for the correct audience
   *
   * @param audienceName
   *
   * @returns {Promise}
   * @fulfill {MachineAuthSessionInfo}
   *
   * @private
   */
  _getNewSessionInfo(audienceName) {
    const audience = this._sdk.config.audiences[audienceName];

    if (!(audience && audience.clientId)) {
      return Promise.reject(new Error('No valid audience found'));
    }

    if (!this._tokenPromises[audienceName]) {
      this._tokenPromises[audienceName] = axios
        .post(`${this._sdk.config.audiences.contxtAuth.host}/v1/oauth/token`, {
          audience: audience.clientId,
          client_id: this._sdk.config.auth.clientId,
          client_secret: this._sdk.config.auth.clientSecret,
          grant_type: 'client_credentials'
        })
        .then(({ data }) => {
          return {
            apiToken: data.access_token,
            expiresAt: Date.now() + data.expires_in * 1000
          };
        })
        .then((sessionInfo) => {
          this._saveSession(audienceName, sessionInfo);
          this._tokenPromises[audienceName] = null;

          return sessionInfo;
        })
        .catch((err) => {
          if (!(err.response && err.response.status)) {
            throw new Error(
              'There was a problem getting a token from the ContxtAuth server. Please check your configuration settings.'
            );
          }

          throw err;
        });
    }

    return this._tokenPromises[audienceName];
  }

  /**
   * Saves a session in the auth instance for future use
   *
   * @param {string} audienceName
   * @param {Object} sessionInfo
   * @param {string} sessionInfo.apiToken
   * @param {number} sessionInfo.expiresAt
   *
   * @private
   */
  _saveSession(audienceName, sessionInfo) {
    this._sessionInfo = {
      ...this._sessionInfo,
      [audienceName]: sessionInfo
    };
  }
}

export const TYPE = 'machineAuth';
export default MachineAuth;

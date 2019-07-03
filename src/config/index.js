import defaultAudiences from './audiences';
import defaultConfigs from './defaults';

/**
 * A single audience used for authenticating and communicating with an individual API.
 *
 * @typedef {Object} Audience
 * @param {string} config.clientId Client Id provided by Auth0 for the environment you are
 *   trying to communicate with
 * @param {string} config.host Hostname for the API that corresponds with the clientId provided
 * @param {string} [config.webSocket] WebSocket URL for the API that corresponds with the clientId provided
 */

/**
 * A custom audience that will override the configuration of an individual module. Consists of
 * either a reference to an environment that already exists or a clientId and host for a
 * custom environment.
 *
 * @typedef {Object} CustomAudience
 * @param {string} [config.clientId] Client Id provided by Auth0 for the environment you are
 *   trying to communicate with
 * @param {string} [config.env] The SDK provided environment name you are trying to reach
 * @param {string} [config.host] Hostname for the API that corresponds with the clientId provided
 * @param {string} [config.webSocket] WebSocket URL for the API that corresponds with the clientId provided
 */

/**
 * An object of audiences that corresponds to all the different environments available for a
 * single module.
 *
 * @typedef {Object.<string, Audience>} Environments
 */

/**
 * An external module to be integrated into the SDK as a first class citizen. Includes information
 * for authenticating and communicating with an individual API and the external module itself.
 *
 * @typedef {Object} ExternalModule
 * @param {string} config.clientId Client Id provided by Auth0 for the environment you are
 *   trying to communicate with. Can be a `null` value if the value is not needed. Some SessionType
 *   adapters (currently, just the MachineAuth adapter) require a value other than `null` if the
 *   built-in `request` module is used since they acquire contxt tokens based on a single clientId.
 * @param {string} config.host Hostname for the API that corresponds with the clientId provided.
 *   Can be a `null` value if the value is not needed.
 * @param {function} config.module The module that will be decorated into the SDK
 */

/**
 * An object of interceptors that get called on every request or response.
 * More information at {@link https://github.com/axios/axios#interceptors axios Interceptors}
 *
 * @typedef {Object} AxiosInterceptor
 * @param {function} interceptor.fulfilled A function that is run on every successful request or
 *   response
 * @param {function} interceptor.rejected A function that is run on every failed request or response
 */

/**
 * User provided configuration options
 *
 * @typedef {Object} UserConfig
 * @property {Object} auth User assigned configurations specific for their authentication methods
 * @property {string} [auth.authorizationPath] Path Auth0WebAuth process should redirect to after a
 *   successful sign in attempt
 * @property {string} auth.clientId Client Id provided by Auth0 for this application
 * @property {string} [auth.clientSecret] Client secret provided by Auth0 for this application. This
 *   is optional for the auth0WebAuth SessionType, but required for the machineAuth SessionType
 * @property {Object.<string, CustomAudience>} [auth.customModuleConfigs] Custom environment setups
 *   for individual modules. Requires clientId/host or env
 * @property {string} [auth.env = 'production'] The environment that every module should use for
 *   their clientId and host
 * @property {function} [auth.onRedirect = (pathname) => { window.location = pathname; }] A redirect
 *   method used for navigating through Auth0 callbacks in Web applications
 * @property {number} [auth.tokenExpiresAtBufferMs = 300000] The time (in milliseconds) before a
 *   token truly expires that we consider it expired (i.e. the token's expiresAt - this = calculated
 *   expiresAt). Defaults to 5 minutes.
 * @property {Object} [interceptors] Axios interceptors that can transform requests and responses.
 *   More information at {@link https://github.com/axios/axios#interceptors axios Interceptors}
 * @property {AxiosInterceptor[]} [interceptors.request] Interceptors that act on every request
 * @property {AxiosInterceptor[]} [intercepotrs.response] Intereptors that act on every response
 */

/**
 * Module that merges user assigned configurations with default configurations.
 *
 * @typicalname contxtSdk.config
 */
class Config {
  /**
   * @param {UserConfig} userConfig The user provided configuration options
   * @param {Object.<string, ExternalModule>} [externalModules] User provided external modules that should be treated as
   *   first class citizens
   */
  constructor(userConfig, externalModules) {
    Object.assign(this, userConfig);

    this._dynamicAudienceNames = [];
    this._replacedAudiences = {};

    this.audiences = this._getAudiences({
      externalModules,
      customModuleConfigs: userConfig.auth.customModuleConfigs,
      env: userConfig.auth.env
    });

    this.auth = {
      ...defaultConfigs.auth,
      ...userConfig.auth
    };

    this.interceptors = {
      ...defaultConfigs.interceptors,
      ...userConfig.interceptors
    };
  }

  addDynamicAudience(audienceName, { clientId, host }) {
    if (!clientId || !host) {
      throw new Error(
        'A dynamic audience must contain `clientId` and `host` properties'
      );
    }

    if (this._dynamicAudienceNames.indexOf(audienceName) > -1) {
      throw new Error(
        `A dynamic audience of the name \`${audienceName}\` already exists. This problem can be rectified by using a different name for the audience.`
      );
    }

    this._dynamicAudienceNames = [...this._dynamicAudienceNames, audienceName];

    if (this.audiences[audienceName]) {
      this._replacedAudiences[audienceName] = this.audiences[audienceName];
    }

    this.audiences[audienceName] = {
      clientId,
      host
    };
  }

  removeDynamicAudience(audienceName) {
    if (this._dynamicAudienceNames.indexOf(audienceName) === -1) {
      throw new Error('There is no dynamic audience to remove.');
    }

    this.audiences[audienceName] = this._replacedAudiences[audienceName];

    delete this._replacedAudiences[audienceName];
    this._dynamicAudienceNames = this._dynamicAudienceNames.filter(
      (name) => name !== audienceName
    );
  }

  /**
   * Parses a custom module configuration for a valid environment/audience. Requires either a
   * clientId and host, or an environment that matches a default audience/environment.
   *
   * @param {CustomAudience} config A custom audience configuration to parse
   * @param {Object.<string, Audience>} audiences An object with keys for environment names and values of Audience information
   *
   * @returns {Audience}
   * @throws {Error}
   *
   * @private
   */
  _getAudienceFromCustomConfig(config, audiences) {
    if (config.clientId && config.host) {
      const audience = {
        clientId: config.clientId,
        host: config.host
      };

      if (config.webSocket) {
        audience.webSocket = config.webSocket;
      }

      return audience;
    } else if (config.env) {
      return audiences[config.env];
    } else {
      throw new Error(
        'Custom module configurations must either contain a `host` and `clientId` or specify a specific target environment via the `env` property'
      );
    }
  }

  /**
   * Reconciles the main environment with custom environments and external modules.
   *
   * @param {Object} options
   * @param {Object.<string, CustomAudience>} [options.customModuleConfigs = {}] Any custom
   *   configurations for internal modules
   * @param {string} [options.env = 'production'] The base environment for any
   *   non-overridden modules
   * @param {Object.<string, ExternalModule>} [options.externalModules = {}] An object of external
   *   modules from which to build a set of audiences
   *
   * @returns {Object.<string, Audience>}
   *
   * @private
   */
  _getAudiences(options = {}) {
    const {
      customModuleConfigs = {},
      env = 'production',
      externalModules = {}
    } = options;

    return {
      ...this._getInternalAudiences({
        customModuleConfigs,
        env,
        audiences: defaultAudiences
      }),
      ...this._getExternalAudiences({ externalModules })
    };
  }

  /**
   * Builds up the audiences for external modules.
   *
   * @param {Object}
   * @param {Object.<string, ExternalModule>} externalModules An object of external modules from
   *   which to build a set of audiences
   *
   * @returns {Object.<string, Audience>}
   * @throws {Error}
   *
   * @private
   */
  _getExternalAudiences({ externalModules }) {
    return Object.keys(externalModules).reduce((memo, key) => {
      const clientId = externalModules[key].clientId;
      const host = externalModules[key].host;
      const hasClientId = !!clientId || clientId === null;
      const hasHost = !!host || host === null;

      if (!(hasClientId && hasHost)) {
        throw new Error(
          'External modules must contain `clientId` and `host` properties'
        );
      }

      memo[key] = {
        clientId,
        host
      };

      return memo;
    }, {});
  }

  /**
   * Reconciles the main environment with custom environments to build up audiences for
   * internal modules.
   *
   * @param {Object.<string, Environments>} audiences All possible audiences/environments for
   *   internal modules
   * @param {Object.<string, CustomAudience>} customModuleConfigs Any custom configurations for
   *   internal modules
   * @param {string} env The base environment for any non-overridden modules
   *
   * @returns {Object.<string, Audience>}
   *
   * @private
   */
  _getInternalAudiences({ audiences, customModuleConfigs, env }) {
    return Object.keys(audiences).reduce((memo, key) => {
      const customModuleConfig = customModuleConfigs[key];
      const moduleAudiences = audiences[key];

      if (customModuleConfig) {
        memo[key] = this._getAudienceFromCustomConfig(
          customModuleConfig,
          moduleAudiences
        );
      } else {
        memo[key] = moduleAudiences[env];
      }

      return memo;
    }, {});
  }
}

export default Config;

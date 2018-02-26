import defaultAudiences from './audiences';
import defaultConfigs from './defaults';

/**
 * User provided configuration options
 *
 * @typedef {object} UserConfig
 * @property {object} auth User assigned configurations specific for their authentication methods
 * @property {string} auth.clientId Client Id provided by Auth0 for this application
 * @property {object} [auth.customModuleConfigs] Custom environment setups for individual modules.
 *   Requires clientId/host or env
 * @property {object} [auth.customModuleConfigs.moduleName] The key of this object corresponds with
 *   the module for which you would like to override the host/clientId
 * @property {string} [auth.customModuleConfigs.moduleName.clientId] Client Id provided by Auth0
 *   for the environment you are trying to communicate with
 * @property {string} [auth.customModuleConfigs.moduleName.env] The SDK provided environment name
 *   you are trying to reach
 * @property {string} [auth.customModuleConfigs.moduleName.host] Hostname for the API that
 *   corresponds with the clientId provided
 * @property {string} [auth.env = 'production'] The environment that every module should use for
 *   their clientId and host
 * @property {function} [auth.onRedirect = (pathname) => { window.location = pathname; }] A redirect
 *   method used for navigating through Auth0 callbacks in Web applications
 */

/**
 * An object of multiple moduleNames that makes up all audiences that will be used for
 * authentication and communicating with various APIs
 *
 * @typedef {object} Audiences
 * @property {object} moduleName Key of this object is the name of the corresponding module
 *   (e.g. `facilities`)
 * @property {string} moduleName.clientId
 * @property {string} moduleName.host
 */

/**
 * Module that merges user assigned configurations with default configurations.
 *
 * @typicalname contxtSdk.config
 */
class Config {
  /**
   * @param {UserConfig} userConfig
   * @param {object} [externalModules] User provided external modules that should be treated as
   *   first class citizens
   */
  constructor(userConfig, externalModules) {
    Object.assign(this, userConfig);

    this.audiences = this._getAudiences({
      externalModules,
      customModuleConfigs: userConfig.auth.customModuleConfigs,
      env: userConfig.auth.env
    });

    this.auth = {
      ...defaultConfigs.auth,
      ...userConfig.auth
    };
  }

  /**
   * Parses a custom module configuration for a valid environment/audience. Requires either a
   * clientId and host, or an environment that matches a default audience/environment.
   *
   * @param {object} config
   * @param {string} [config.clientId] Client Id provided by Auth0 for the environment you are
   *   trying to communicate with
   * @param {string} [config.env] The SDK provided environment name you are trying to reach
   * @param {string} [config.host] Hostname for the API that corresponds with the clientId provided
   *
   * @returns {Audiences}
   * @throws {Error}
   *
   * @private
   */
  _getAudienceFromCustomConfig(config, audiences) {
    if (config.clientId && config.host) {
      return {
        clientId: config.clientId,
        host: config.host
      };
    } else if (config.env) {
      return audiences[config.env];
    } else {
      throw new Error('Custom module configurations must either contain a `host` and `clientId` or specify a specific target environment via the `env` property');
    }
  }

  /**
   * Reconciles the main environment with custom environments and external modules.
   *
   * @param {object} options
   * @param {object} [options.customModuleConfigs]
   * @param {string} [options.env = 'production']
   * @param {object} [options.externalModules]
   *
   * @returns {Audiences}
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
   * @param {object} externalModules
   * @param {object} [externalModules.moduleName] Key of this object is the name of the
   *   corresponding module (e.g. `facilities`)
   * @param {string} [externalModules.moduleName.clientId]
   * @param {string} [externalModules.moduleName.host]
   * @param {function} [externalModules.moduleName.module]
   *
   * @returns {Audiences}
   * @throws {Error}
   *
   * @private
   */
  _getExternalAudiences({ externalModules }) {
    return Object.keys(externalModules).reduce((memo, key) => {
      if (!(externalModules[key].clientId && externalModules[key].host)) {
        throw new Error('External modules must contain `clientId` and `host` properties');
      }

      memo[key] = {
        clientId: externalModules[key].clientId,
        host: externalModules[key].host
      };

      return memo;
    }, {});
  }

  /**
   * Reconciles the main environment with custom environments to build up audiences for
   * internal modules.
   *
   * @param {object} options
   * @param {Audiences} options.audiences
   * @param {object} options.customModuleConfigs
   * @param {string} options.env
   *
   * @returns {Audiences}
   *
   * @private
   */
  _getInternalAudiences({ audiences, customModuleConfigs, env }) {
    return Object.keys(audiences).reduce((memo, key) => {
      const customModuleConfig = customModuleConfigs[key];
      const moduleAudiences = audiences[key];

      if (customModuleConfig) {
        memo[key] = this._getAudienceFromCustomConfig(customModuleConfig, moduleAudiences);
      } else {
        memo[key] = moduleAudiences[env];
      }

      return memo;
    }, {});
  }
}

export default Config;

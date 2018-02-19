import defaultAudiences from './audiences';
import defaultConfigs from './defaults';

class Config {
  constructor(userConfig, externalModules) {
    Object.assign(this, userConfig);

    this.audiences = this._getAudiences({
      externalModules,
      customModuleConfigs: userConfig.customModuleConfigs,
      env: userConfig.env
    });

    this.auth = {
      ...defaultConfigs.auth,
      ...userConfig.auth
    };
  }

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

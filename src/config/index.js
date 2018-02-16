import defaultAudiences from './audiences';
import defaultConfigs from './defaults';

class Config {
  constructor(userConfig, externalModules) {
    Object.assign(this, userConfig);

    this.audiences = this._getAudiences({
      externalModules,
      customModuleConfig: userConfig.customModuleConfig,
      env: userConfig.env
    });

    this.auth = {
      ...defaultConfigs.auth,
      ...userConfig.auth
    };
  }

  _getAudiences(options = {}) {
    const {
      customModuleConfig = {},
      env = 'production',
      externalModules = {}
    } = options;

    return {
      ...this._getInternalAudiences({
        customModuleConfig,
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

  _getInternalAudiences({ audiences, customModuleConfig, env }) {
    return Object.keys(audiences).reduce((memo, key) => {
      memo[key] = (function() {
        switch (true) {
          case !!(customModuleConfig[key] && customModuleConfig[key].env):
            return audiences[key][customModuleConfig[key].env];

          case !!(customModuleConfig[key] && customModuleConfig[key].clientId && customModuleConfig[key].host):
            return {
              clientId: customModuleConfig[key].clientId,
              host: customModuleConfig[key].host
            };

          case !!(customModuleConfig[key]):
            throw new Error('Custom module configurations must either contain a `host` and `clientId` or specify a specific target environment via the `env` property');

          default:
            return audiences[key][env];
        }
      })();

      return memo;
    }, {});
  }
}

export default Config;

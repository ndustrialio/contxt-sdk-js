import defaultAudiences from './audiences';
import defaultConfigs from './defaults';

class Config {
  constructor(userConfig) {
    Object.assign(this, userConfig);

    this.audiences = this._getAudiences({
      env: userConfig.env,
      customModuleConfig: userConfig.customModuleConfig
    });

    this.auth = {
      ...defaultConfigs.auth,
      ...userConfig.auth
    };
  }

  _getAudiences({ audiences = defaultAudiences, env = 'production', customModuleConfig = {} }) {
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

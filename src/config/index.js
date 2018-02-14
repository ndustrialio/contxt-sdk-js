import isString from 'lodash.isstring';
import defaultAudiences from './audiences';
import defaultConfigs from './defaults';

class Config {
  constructor(userConfig) {
    Object.assign(this, userConfig);

    this.audiences = this._getAudiences({
      env: userConfig.env,
      moduleEnvs: userConfig.moduleEnvs
    });

    this.auth = {
      ...defaultConfigs.auth,
      ...userConfig.auth
    };
  }

  _getAudiences({ audiences = defaultAudiences, env = 'production', moduleEnvs = {} }) {
    return Object.keys(audiences).reduce((memo, key) => {
      memo[key] = (function() {
        switch (true) {
          case isString(moduleEnvs[key]):
            return audiences[key][moduleEnvs[key]];

          case !!(moduleEnvs[key] && moduleEnvs[key].clientId && moduleEnvs[key].host):
            return {
              clientId: moduleEnvs[key].clientId,
              host: moduleEnvs[key].host
            };

          case !!(moduleEnvs[key]):
            throw new Error('Custom module information must either be a string with an environment name or an object with a `host` and `clientId`');

          default:
            return audiences[key][env];
        }
      })();

      return memo;
    }, {});
  }
}

export default Config;

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
    return Object.keys(defaultAudiences).reduce((memo, key) => {
      memo[key] = audiences[key][env];
      return memo;
    }, {});
  }
}

export default Config;

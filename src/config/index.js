import defaultAudiences from './audiences';
import defaultConfigs from './defaults';

class Config {
  constructor(userConfig) {
    Object.assign(this, userConfig);

    this.audiences = this._getAudiences(userConfig.env);

    this.auth = {
      ...defaultConfigs.auth,
      ...userConfig.auth
    };
  }

  _getAudiences(env = 'production') {
    return Object.keys(defaultAudiences).reduce((memo, key) => {
      memo[key] = defaultAudiences[key][env];
      return memo;
    }, {});
  }
}

export default Config;

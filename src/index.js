import Config from './config';
import Facilities from './facilities';
import Request from './request';
import * as sessionTypes from './sessionTypes';

class ContxtSdk {
  constructor({ additionalModules = {}, config = {}, sessionType }) {
    this.config = new Config(config, additionalModules);

    this.auth = this._createAuthSession(sessionType);
    this.facilities = new Facilities(this, this._createRequest('facilities'));

    this._decorate(additionalModules);
  }

  _createAuthSession(sessionType) {
    switch (sessionType) {
      case 'auth0WebAuth':
        return new sessionTypes.Auth0WebAuth(this);

      default:
        throw new Error('Invalid sessionType provided');
    }
  }

  _createRequest(audienceName) {
    return new Request(this, audienceName);
  }

  _decorate(modules) {
    Object.keys(modules).forEach((moduleName) => {
      this[moduleName] = new modules[moduleName].module(this, this._createRequest(moduleName));
    });
  }
}

export default ContxtSdk;

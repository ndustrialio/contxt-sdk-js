import Facilities from './facilities';
import * as sessionTypes from './sessionTypes';

class ContxtSdk {
  constructor({ additionalModules = {}, config = {}, sessionType }) {
    this.config = config;

    this.auth = this._createAuthSession(sessionType);
    this.facilities = new Facilities(this);

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

  _decorate(modules) {
    Object.keys(modules).forEach((moduleName) => {
      this[moduleName] = new modules[moduleName].module(this);
    });
  }
}

export default ContxtSdk;

import Facilities from './facilities';
import Request from './request';
import * as sessionTypes from './sessionTypes';

class ContxtSdk {
  constructor(config = {}) {
    this.config = config;

    this.auth = this._createAuthSession();
    this.facilities = new Facilities(this);
    this.request = new Request(this);
  }

  _createAuthSession() {
    switch (this.config.sessionType) {
      case 'auth0WebAuth':
        return new sessionTypes.Auth0WebAuth(this);

      default:
        throw new Error('Invalid sessionType provided');
    }
  }
}

export default ContxtSdk;

import Request from './request';
import * as sessionTypes from './sessionTypes';

class ContxtSdk {
  constructor(config = {}) {
    this.config = config;

    this.auth = this.createAuthSession();
    this.request = new Request(this);
  }

  createAuthSession() {
    switch (this.config.sessionType) {
      case 'clientOauth':
        return new sessionTypes.ClientOauth(this);

      default:
        throw new Error('Invalid sessionType provided');
    }
  }
}

export default ContxtSdk;

import Auth from './Auth.js';
import Request from './request.js';

class ContxtSdk {
  constructor() {
    // TODO: Allow different types of Auth modules
    this.auth = new Auth(this);
    this.request = new Request(this);
  }
}

export default ContxtSdk;

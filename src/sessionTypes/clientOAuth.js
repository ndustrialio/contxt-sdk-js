import auth0 from 'auth0-js';

class ClientOAuth {
  constructor(sdk) {
    this.sdk = sdk;
    this.auth0 = new auth0.WebAuth(this.sdk.config.auth);
  }

  getCurrentToken() {
    // TODO: Do work to get a real token
    return 'not a real token';
  }
}

export default ClientOAuth;

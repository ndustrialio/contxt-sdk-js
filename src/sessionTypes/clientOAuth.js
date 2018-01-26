import auth0 from 'auth0-js';

class ClientOAuth {
  constructor(sdk) {
    this.sdk = sdk;

    const authConfig = {
      authorizationPath: '/callback',
      ...this.sdk.config.auth
    };

    if (!authConfig.authProviderClientId) {
      throw new Error('authProviderClientId is required for the WebAuth config');
    }

    if (!authConfig.clientId) {
      throw new Error('clientId is required for the WebAuth config');
    }

    this.auth0 = new auth0.WebAuth({
      audience: authConfig.authProviderClientId,
      clientId: authConfig.clientId,
      domain: 'ndustrial.auth0.com',
      redirectUri: window.location.origin +
        (authConfig.authorizationPath.indexOf('/') === 0 ? '' : '/') +
        authConfig.authorizationPath,
      responseType: 'token',
      scope: 'profile openid'
    });
  }

  getCurrentToken() {
    // TODO: Do work to get a real token
    return 'not a real token';
  }

  isAuthenticated() {
    return this.tokenInfo.expiresAt > Date.now();
  }

  logIn() {
    this.auth0.authorize();
  }

  parseHash() {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, hashResponse) => {
        if (err || !hashResponse) {
          return reject(err || 'No valid tokens returned from auth0');
        }

        return resolve(hashResponse);
      });
    });
  }
}

export default ClientOAuth;

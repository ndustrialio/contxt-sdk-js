import auth0 from 'auth0-js';

class CliAuth {
  constructor(sdk) {
    this._sdk = sdk;

    this._sessionInfo = {};

    this._auth0 = new auth0.Authentication({
      domain: 'ndustrial.auth0.com',
      clientID: this._sdk.config.auth.clientId
    });
    // this._auth0 = new auth0.WebAuth({
    //   domain: 'ndustrial.auth0.com',
    //   clientID: this._sdk.config.auth.clientId
    // });

    this._login();
  }

  _login(config) {
    return this._auth0.loginWithDefaultDirectory(
      {
        username: '',
        password: ''
      },
      (err, response) => {
        console.log('------');
        console.log(JSON.stringify(err, null, 2));
        console.log(response);
      }
    );
  }
}

export const TYPE = 'cliAuth';
export default CliAuth;

import auth0 from 'auth0-js';
import axios from 'axios';
import CliAuth from './cliAuth';

describe('sessionTypes/CliAuth', function() {
  let authentication;
  let authenticationSession;
  let sdk;

  beforeEach(function() {
    this.sandbox = sandbox.create();
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  describe('constructor', function() {
    let cliAuth;

    beforeEach(function() {
      sdk = {
        config: {
          audiences: {
            contxtAuth: fixture.build('audience'),
            facilities: fixture.build('audience')
          },
          auth: {
            clientId: faker.internet.password()
          }
        }
      };
      authenticationSession = {
        loginWithDefaultDirectory: this.sandbox.stub()
      };
      authentication = this.sandbox
        .stub(auth0, 'Authentication')
        .returns(authenticationSession);

      cliAuth = new CliAuth(sdk);
    });

    it('appends the supplied sdk to the class instance', function() {
      expect(cliAuth._sdk).to.deep.equal(sdk);
    });

    it('calls the auth0 Authentication constructor with the proper arguments', function() {
      expect(authentication).to.be.calledOnce;
      expect(authentication).to.be.calledWith({
        domain: 'ndustrial.auth0.com',
        clientID: cliAuth._sdk.config.auth.clientId
      });
    });

    it('sets an initial, empty session info state', function() {
      expect(cliAuth._sessionInfo).to.be.an('object');
      expect(cliAuth._sessionInfo).to.be.empty;
    });
  });

  describe('logIn', function() {
    let cliAuth;

    context('a successful login', function() {
      let expectedResponse;
      let getApiToken;
      let password;
      let promise;
      let username;

      beforeEach(function() {
        sdk = {
          config: {
            audiences: {
              contxtAuth: fixture.build('audience'),
              facilities: fixture.build('audience')
            },
            auth: {
              clientId: faker.internet.password()
            }
          }
        };
        password = faker.internet.password();
        username = faker.internet.email();
        expectedResponse = {
          accessToken: faker.internet.password(),
          expiresIn: faker.random.number({ min: 100, max: 1000 }),
          tokenType: 'Bearer'
        };

        authenticationSession = {
          loginWithDefaultDirectory: this.sandbox
            .stub()
            .yields(null, expectedResponse)
        };
        this.sandbox
          .stub(auth0, 'Authentication')
          .returns(authenticationSession);

        getApiToken = this.sandbox
          .stub(CliAuth.prototype, '_getApiToken')
          .resolves('Contxt Authentication successful.');

        cliAuth = new CliAuth(sdk);

        promise = cliAuth.logIn(username, password);
      });

      it("calls the 'loginWithDefaultDirectory' function with the username and password and correct audience", function() {
        expect(
          authenticationSession.loginWithDefaultDirectory
        ).to.be.calledOnce;
        expect(
          authenticationSession.loginWithDefaultDirectory
        ).to.be.calledWith({
          username,
          password,
          audience: cliAuth._sdk.config.audiences.contxtAuth.clientId
        });
      });

      it('updates the session info', function() {
        return promise.then(() => {
          expect(cliAuth._sessionInfo).to.deep.equal({
            accessInfo: expectedResponse
          });
        });
      });

      it('returns a fulfilled promise with a success message', function() {
        return promise.then((response) => {
          expect(response).to.equal('Contxt Authentication successful.');
        });
      });

      it("calls the '_getApiToken' private method with the correct information", function() {
        return promise.then(() => {
          expect(getApiToken).to.be.calledOnce;
          expect(getApiToken).to.be.calledWith(expectedResponse.accessToken);
        });
      });
    });

    context('a failed login', function() {
      let expectedErrorMessage;
      let password;
      let promise;
      let username;

      beforeEach(function() {
        sdk = {
          config: {
            audiences: {
              contxtAuth: fixture.build('audience'),
              facilities: fixture.build('audience')
            },
            auth: {
              clientId: faker.internet.password()
            }
          }
        };
        password = faker.internet.password();
        username = faker.internet.email();
        expectedErrorMessage = faker.lorem.sentence();

        authenticationSession = {
          loginWithDefaultDirectory: this.sandbox
            .stub()
            .yields({ description: expectedErrorMessage })
        };
        this.sandbox
          .stub(auth0, 'Authentication')
          .returns(authenticationSession);

        cliAuth = new CliAuth(sdk);

        promise = cliAuth.logIn(username, password);
      });

      it('returns a rejected promise with an error message', function() {
        return expect(promise).to.be.eventually.rejectedWith(
          expectedErrorMessage
        );
      });
    });
  });

  describe('logOut', function() {
    let cliAuth;
    let promise;

    beforeEach(function() {
      sdk = {
        config: {
          audiences: {
            contxtAuth: fixture.build('audience'),
            facilities: fixture.build('audience')
          },
          auth: {
            clientId: faker.internet.password()
          }
        }
      };
      authenticationSession = {
        loginWithDefaultDirectory: this.sandbox.stub()
      };
      authentication = this.sandbox.stub(auth0, 'Authentication');

      cliAuth = new CliAuth(sdk);

      promise = cliAuth.logOut();
    });

    it('clears out the session info', function() {
      expect(cliAuth._sessionInfo).to.be.an('object');
      expect(cliAuth._sessionInfo).to.be.empty;
    });

    it('returns a fulfilled promise with a success message', function() {
      return promise.then((response) => {
        expect(response).to.equal('Logout successful - session info cleared.');
      });
    });
  });

  describe('_getApiToken', function() {
    beforeEach(function() {
      sdk = {
        config: {
          audiences: {
            contxtAuth: fixture.build('audience'),
            facilities: fixture.build('audience')
          },
          auth: {
            clientId: faker.internet.password()
          }
        }
      };
      authenticationSession = {
        loginWithDefaultDirectory: this.sandbox.stub()
      };
      authentication = this.sandbox.stub(auth0, 'Authentication');
    });

    context('a successful request', function() {
      context('when handling audiences with a client id', function() {
        let accessToken;
        let expectedApiToken;
        let post;
        let promise;
        let saveSession;

        beforeEach(function() {
          accessToken = faker.internet.password();
          expectedApiToken = faker.internet.password();

          post = this.sandbox.stub(axios, 'post').callsFake(() => {
            return Promise.resolve({
              data: { access_token: expectedApiToken }
            });
          });

          saveSession = this.sandbox.stub(CliAuth.prototype, '_saveSession');

          const cliAuth = new CliAuth(sdk);

          promise = cliAuth._getApiToken(accessToken);
        });

        it('makes a POST to the contxt api to get a token', function() {
          expect(post).to.be.calledWith(
            `${sdk.config.audiences.contxtAuth.host}/v1/token`,
            {
              audiences: [sdk.config.audiences.facilities.clientId],
              nonce: 'nonce'
            },
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
        });

        it('returns a promise that fulfuills with a success message', function() {
          return promise.then((response) => {
            expect(response).to.equal('Contxt Authentication successful.');
          });
        });

        it('calls the _saveSession method with the correct information', function() {
          return promise.then(() => {
            expect(saveSession).to.be.calledWith('apiToken', {
              access_token: expectedApiToken
            });
          });
        });
      });

      context('when handling a null audience', function() {
        let accessToken;
        let post;

        beforeEach(function() {
          accessToken = faker.internet.password();
          post = this.sandbox.stub(axios, 'post').resolves({ data: {} });
          this.sandbox.stub(CliAuth.prototype, '_saveSession');

          const cliAuth = new CliAuth({
            ...sdk,
            config: {
              ...sdk.config,
              audiences: {
                ...sdk.config.audiences,
                [faker.hacker.noun()]: {
                  clientId: null,
                  host: faker.internet.url(),
                  module: function() {}
                }
              }
            }
          });

          cliAuth._getApiToken(accessToken);
        });

        it('does not include null values when getting a token from the contxt api', function() {
          const { audiences } = post.firstCall.args[1];
          expect(audiences).to.not.include(null);
        });
      });
    });

    context('a failed request', function() {
      let accessToken;
      let promise;

      beforeEach(function() {
        accessToken = faker.internet.password();

        this.sandbox.stub(axios, 'post').callsFake(() => {
          return Promise.reject(new Error(faker.lorem.sentence()));
        });

        const cliAuth = new CliAuth(sdk);

        promise = cliAuth._getApiToken(accessToken);
      });

      it('returns a rejected promise with an error message', function() {
        return expect(promise).to.be.eventually.rejectedWith(
          'An error occurred during authorization with Contxt.'
        );
      });
    });
  });

  describe('_saveSession', function() {
    let cliAuth;
    let expectedSessionInfo;
    let expectedKey;

    beforeEach(function() {
      sdk = {
        config: {
          audiences: {
            contxtAuth: fixture.build('audience'),
            facilities: fixture.build('audience')
          },
          auth: {
            clientId: faker.internet.password()
          }
        }
      };
      authenticationSession = {
        loginWithDefaultDirectory: this.sandbox.stub()
      };
      authentication = this.sandbox.stub(auth0, 'Authentication');

      expectedKey = faker.lorem.word();
      expectedSessionInfo = {
        accessToken: faker.internet.password(),
        apiToken: faker.internet.password(),
        expiresAt: faker.date.future().getTime()
      };

      cliAuth = new CliAuth(sdk);

      cliAuth._saveSession(expectedKey, expectedSessionInfo);
    });

    it('saves the session info  under the correct key', function() {
      expect(cliAuth._sessionInfo).to.deep.equal({
        [expectedKey]: expectedSessionInfo
      });
    });
  });
});

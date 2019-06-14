import auth0 from 'auth0-js';
import axios from 'axios';
import PasswordGrantAuth from './passwordGrantAuth';

describe('sessionTypes/passwordGrantAuth', function() {
  let authentication;
  let authenticationSession;
  let sdk;

  afterEach(function() {
    sinon.restore();
  });

  describe('constructor', function() {
    let passwordGrantAuth;

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
      authentication = sinon.stub(auth0, 'Authentication').returns({});

      passwordGrantAuth = new PasswordGrantAuth(sdk);
    });

    it('appends the supplied sdk to the class instance', function() {
      expect(passwordGrantAuth._sdk).to.deep.equal(sdk);
    });

    it('calls the auth0 Authentication constructor with the proper arguments', function() {
      expect(authentication).to.be.calledOnce;
      expect(authentication).to.be.calledWith({
        domain: 'ndustrial.auth0.com',
        clientID: passwordGrantAuth._sdk.config.auth.clientId
      });
    });

    it('sets an initial, empty session info state', function() {
      expect(passwordGrantAuth._sessionInfo).to.be.an('object');
      expect(passwordGrantAuth._sessionInfo).to.be.empty;
    });
  });

  describe('getCurrentApiToken', function() {
    let passwordGrantAuth;
    let expectedApiToken;
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
      sinon.stub(auth0, 'Authentication').returns({});

      expectedApiToken = faker.internet.password();

      passwordGrantAuth = new PasswordGrantAuth(sdk);
    });

    it('returns a rejected promise if there is no access token in the session info', function() {
      promise = passwordGrantAuth.getCurrentApiToken();

      return expect(promise).to.be.eventually.rejectedWith(
        'No api token found.'
      );
    });

    it('returns a fulfilled promise with the access token', function() {
      passwordGrantAuth._sessionInfo = {
        accessToken: expectedApiToken
      };

      promise = passwordGrantAuth.getCurrentApiToken();

      return promise.then((token) => {
        expect(token).to.deep.equal(expectedApiToken);
      });
    });
  });

  describe('isAuthenticated', function() {
    let passwordGrantAuth;

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
      sinon.stub(auth0, 'Authentication').returns({});

      passwordGrantAuth = new PasswordGrantAuth(sdk);
    });

    it('returns true when there is a stored access token', function() {
      passwordGrantAuth._sessionInfo = {
        accessToken: faker.internet.password()
      };

      const isAuthenticated = passwordGrantAuth.isAuthenticated();

      expect(isAuthenticated).to.be.true;
    });

    it('returns false when there is no stored access token', function() {
      const isAuthenticated = passwordGrantAuth.isAuthenticated();

      expect(isAuthenticated).to.be.false;
    });
  });

  describe('logIn', function() {
    let passwordGrantAuth;

    context('a successful login', function() {
      let apiToken;
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
        apiToken = faker.internet.password();
        password = faker.internet.password();
        username = faker.internet.email();
        expectedResponse = {
          accessToken: faker.internet.password(),
          expiresIn: faker.random.number({ min: 100, max: 1000 }),
          tokenType: 'Bearer'
        };

        authenticationSession = {
          loginWithDefaultDirectory: sinon.stub().yields(null, expectedResponse)
        };
        sinon.stub(auth0, 'Authentication').returns(authenticationSession);

        getApiToken = sinon
          .stub(PasswordGrantAuth.prototype, '_getApiToken')
          .resolves(apiToken);

        passwordGrantAuth = new PasswordGrantAuth(sdk);

        promise = passwordGrantAuth.logIn(username, password);
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
          audience: passwordGrantAuth._sdk.config.audiences.contxtAuth.clientId
        });
      });

      it('returns a fulfilled promise with a success message', function() {
        return promise.then((response) => {
          expect(response).to.equal(apiToken);
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
          loginWithDefaultDirectory: sinon
            .stub()
            .yields({ description: expectedErrorMessage })
        };
        sinon.stub(auth0, 'Authentication').returns(authenticationSession);

        passwordGrantAuth = new PasswordGrantAuth(sdk);

        promise = passwordGrantAuth.logIn(username, password);
      });

      it('returns a rejected promise with an error message', function() {
        return expect(promise).to.be.eventually.rejectedWith(
          expectedErrorMessage
        );
      });
    });
  });

  describe('logOut', function() {
    let passwordGrantAuth;
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
        loginWithDefaultDirectory: sinon.stub()
      };
      authentication = sinon.stub(auth0, 'Authentication');

      passwordGrantAuth = new PasswordGrantAuth(sdk);

      promise = passwordGrantAuth.logOut();
    });

    it('clears out the session info', function() {
      expect(passwordGrantAuth._sessionInfo).to.be.an('object');
      expect(passwordGrantAuth._sessionInfo).to.be.empty;
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
        loginWithDefaultDirectory: sinon.stub()
      };
      authentication = sinon.stub(auth0, 'Authentication');
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

          post = sinon.stub(axios, 'post').resolves({
            data: { access_token: expectedApiToken }
          });

          saveSession = sinon.stub(PasswordGrantAuth.prototype, '_saveSession');

          const passwordGrantAuth = new PasswordGrantAuth(sdk);

          promise = passwordGrantAuth._getApiToken(accessToken);
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
            expect(response).to.equal(expectedApiToken);
          });
        });

        it('calls the _saveSession method with the correct information', function() {
          return promise.then(() => {
            expect(saveSession).to.be.calledWith({
              accessToken: expectedApiToken
            });
          });
        });
      });

      context('when handling a null audience', function() {
        let accessToken;
        let post;

        beforeEach(function() {
          accessToken = faker.internet.password();
          post = sinon.stub(axios, 'post').resolves({ data: {} });
          sinon.stub(PasswordGrantAuth.prototype, '_saveSession');

          const passwordGrantAuth = new PasswordGrantAuth({
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

          passwordGrantAuth._getApiToken(accessToken);
        });

        it('does not include null values when getting a token from the contxt api', function() {
          const { audiences } = post.firstCall.args[1];
          expect(audiences).to.not.include(null);
        });
      });
    });

    context('a failed request', function() {
      let accessToken;
      let errorMsg;
      let promise;

      beforeEach(function() {
        accessToken = faker.internet.password();
        errorMsg = faker.lorem.sentence();

        sinon.stub(axios, 'post').rejects(new Error(errorMsg));

        const passwordGrantAuth = new PasswordGrantAuth(sdk);

        promise = passwordGrantAuth._getApiToken(accessToken);
      });

      it('returns a rejected promise with an error message', function() {
        return expect(promise).to.be.eventually.rejectedWith(errorMsg);
      });
    });
  });

  describe('_saveSession', function() {
    let passwordGrantAuth;
    let expectedSessionInfo;

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
        loginWithDefaultDirectory: sinon.stub()
      };
      authentication = sinon.stub(auth0, 'Authentication');

      expectedSessionInfo = {
        accessToken: faker.internet.password()
      };

      passwordGrantAuth = new PasswordGrantAuth(sdk);

      passwordGrantAuth._saveSession(expectedSessionInfo);
    });

    it('saves the session info', function() {
      expect(passwordGrantAuth._sessionInfo).to.deep.equal(expectedSessionInfo);
    });
  });
});

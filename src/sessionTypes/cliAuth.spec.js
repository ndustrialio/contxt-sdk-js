import auth0 from 'auth0-js';
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
          accessToken: faker.random.alphaNumeric(30),
          idToken: faker.random.alphaNumeric(300),
          scope: faker.lorem.sentence(),
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

        cliAuth = new CliAuth(sdk);

        promise = cliAuth.logIn(username, password);
      });

      it("calls the 'loginWithDefaultDirectory' function with the username and password", function() {
        expect(
          authenticationSession.loginWithDefaultDirectory
        ).to.be.calledOnce;
        expect(
          authenticationSession.loginWithDefaultDirectory
        ).to.be.calledWith({ username, password });
      });

      it('updates the session info', function() {
        return promise.then(() => {
          expect(cliAuth._sessionInfo).to.deep.equal({
            grantInfo: expectedResponse
          });
        });
      });

      it('returns a fulfilled promise with a success message', function() {
        return promise.then((response) => {
          expect(response).to.equal('Authentication successful.');
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
});

import auth0 from 'auth0-js';
import ClientOAuth from './clientOAuth';

describe('sessionTypes/ClientOAuth', function() {
  let sdk;
  let originalWindow;
  let webAuth;
  let webAuthSession;

  beforeEach(function() {
    this.sandbox = sandbox.create();

    sdk = {
      config: {
        auth: {
          authProviderClientId: faker.internet.url(),
          clientId: faker.internet.password()
        }
      }
    };
    webAuthSession = {
      authorize: this.sandbox.stub()
    };
    originalWindow = global.window;
    global.window = {
      location: {
        origin: faker.internet.url()
      }
    };

    webAuth = this.sandbox.stub(auth0, 'WebAuth').returns(webAuthSession);
  });

  afterEach(function() {
    global.window = originalWindow;
    this.sandbox.restore();
  });

  describe('constructor', function() {
    context('with default WebAuth config options', function() {
      let clientOAuth;

      beforeEach(function() {
        clientOAuth = new ClientOAuth(sdk);
      });

      it('appends the supplied sdk to the class instance', function() {
        expect(clientOAuth.sdk).to.equal(sdk);
      });

      it('creates an auth0 WebAuth instance with the default settings', function() {
        expect(webAuth).to.be.calledWithNew;
        expect(webAuth).to.be.calledWith({
          audience: sdk.config.auth.authProviderClientId,
          clientId: sdk.config.auth.clientId,
          domain: 'ndustrial.auth0.com',
          redirectUri: `${global.window.location.origin}/callback`,
          responseType: 'token',
          scope: 'profile openid'
        });
      });

      it('appends an auth0 WebAuth instance to the class instance', function() {
        expect(clientOAuth.auth0).to.equal(webAuthSession);
      });
    });

    context('with custom WebAuth config options', function() {
      let expectedAuthorizationPath;

      beforeEach(function() {
        expectedAuthorizationPath = faker.hacker.verb();
        sdk.config.auth.authorizationPath = expectedAuthorizationPath;

        new ClientOAuth(sdk); // eslint-disable-line no-new
      });

      it('creates an auth0 WebAuth instance with the default settings', function() {
        const [{ redirectUri }] = webAuth.firstCall.args;
        expect(redirectUri).to.match(new RegExp(`${expectedAuthorizationPath}$`));
      });
    });

    context('without required config options', function() {
      it('throws an error when no authProviderClientId is provided', function() {
        delete sdk.config.auth.authProviderClientId;
        const fn = () => new ClientOAuth(sdk);

        expect(fn).to.throw('authProviderClientId is required for the WebAuth config');
      });

      it('throws an error when no clientId is provided', function() {
        delete sdk.config.auth.clientId;
        const fn = () => new ClientOAuth(sdk);

        expect(fn).to.throw('clientId is required for the WebAuth config');
      });
    });
  });

  describe('getCurrentToken', function() {
    it('returns a current token');
  });

  describe('isAuthenticated', function() {
    let clientOAuth;

    beforeEach(function() {
      clientOAuth = new ClientOAuth(sdk);
    });

    it('returns true when the expiresAt info is in the future', function() {
      clientOAuth.tokenInfo = {
        expiresAt: faker.date.future().getTime()
      };

      const isAuthenticated = clientOAuth.isAuthenticated();

      expect(isAuthenticated).to.be.true;
    });

    it('returns true when the expiresAt info is in the past', function() {
      clientOAuth.tokenInfo = {
        expiresAt: faker.date.past().getTime()
      };

      const isAuthenticated = clientOAuth.isAuthenticated();

      expect(isAuthenticated).to.be.false;
    });
  });

  describe('logIn', function() {
    let clientOAuth;

    beforeEach(function() {
      clientOAuth = new ClientOAuth(sdk);
      clientOAuth.logIn();
    });

    it('begins to authorize an auth0 WebAuth session', function() {
      expect(webAuthSession.authorize).to.be.calledOnce;
    });
  });

  describe('parseHash', function() {
    let clientOAuth;

    beforeEach(function() {
      clientOAuth = new ClientOAuth(sdk);
      clientOAuth.logIn();
    });

    context('successfully parsing the hash', function() {
      let expectedHash;
      let promise;

      beforeEach(function() {
        expectedHash = faker.helpers.createTransaction();
        webAuthSession.parseHash = this.sandbox.stub().callsFake((cb) => cb(null, expectedHash));

        const clientOAuth = new ClientOAuth(sdk);
        promise = clientOAuth.parseHash();
      });

      it('parses the hash using auth0', function() {
        expect(webAuthSession.parseHash).to.be.calledOnce;
      });

      it('fulfills a promise with the hash information', function() {
        return expect(promise).to.become(expectedHash);
      });
    });

    context('erroring while parsing the hash', function() {
      let clientOAuth;
      let expectedError;

      beforeEach(function() {
        expectedError = new Error(faker.hacker.phrase());
        webAuthSession.parseHash = this.sandbox.stub().callsFake((cb) => cb(expectedError));

        clientOAuth = new ClientOAuth(sdk);
      });

      it('returns with a rejected promise', function() {
        return expect(clientOAuth.parseHash()).to.be.rejectedWith(expectedError);
      });
    });

    context('no valid token info returned from auth0', function() {
      let clientOAuth;

      beforeEach(function() {
        webAuthSession.parseHash = this.sandbox.stub().callsFake((cb) => cb(null, null));

        clientOAuth = new ClientOAuth(sdk);
      });

      it('returns with a rejected promise', function() {
        return expect(clientOAuth.parseHash())
          .to.be.rejectedWith('No valid tokens returned from auth0');
      });
    });
  });
});

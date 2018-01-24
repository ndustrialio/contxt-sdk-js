import auth0 from 'auth0-js';
import ClientOAuth from './clientOAuth';

describe('sessionTypes/ClientOAuth', function() {
  let baseSdk;
  let expectedWebAuthSession;
  let webAuth;

  beforeEach(function() {
    this.sandbox = sandbox.create();

    baseSdk = { config: {} };
    expectedWebAuthSession = {};

    webAuth = this.sandbox.stub(auth0, 'WebAuth').returns(expectedWebAuthSession);
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  describe('constructor', function() {
    let clientOAuth;
    let sdk;

    beforeEach(function() {
      sdk = {
        ...baseSdk,
        config: {
          ...baseSdk.config,
          auth: {
            audience: faker.internet.url(),
            clientId: faker.internet.password(),
            domain: faker.internet.domainName(),
            redirectUri: faker.internet.url(),
            responseType: faker.hacker.verb(),
            scope: faker.hacker.noun()
          }
        }
      };

      clientOAuth = new ClientOAuth(sdk);
    });

    it('appends the supplied sdk to the class instance', function() {
      expect(clientOAuth.sdk).to.equal(sdk);
    });

    it('appends an auth0 WebAuth instance to the class instance', function() {
      expect(webAuth).to.be.calledWithNew;
      expect(webAuth).to.be.calledWith(sdk.config.auth);
      expect(clientOAuth.auth0).to.equal(expectedWebAuthSession);
    });
  });

  describe('getCurrentToken', function() {
    it('returns a current token');
  });

  describe('isAuthenticated', function() {
    let clientOAuth;

    beforeEach(function() {
      clientOAuth = new ClientOAuth(baseSdk);
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
});

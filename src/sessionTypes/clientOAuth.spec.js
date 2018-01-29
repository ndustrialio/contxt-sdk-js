import auth0 from 'auth0-js';
import axios from 'axios';
import times from 'lodash.times';
import sinon from 'sinon';
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
        expect(clientOAuth._sdk).to.equal(sdk);
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
        expect(clientOAuth._auth0).to.equal(webAuthSession);
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
    let clientOAuth;

    beforeEach(function() {
      clientOAuth = new ClientOAuth(sdk);
    });

    it('throws an error when there is no current token', function() {
      const fn = () => clientOAuth.getCurrentToken();
      expect(fn).to.throw('No api token found');
    });

    it('returns a current token', function() {
      const expectedApiToken = faker.internet.password();
      const clientOAuth = new ClientOAuth(sdk);
      clientOAuth._sessionInfo = { apiToken: expectedApiToken };
      const currentToken = clientOAuth.getCurrentToken();

      expect(currentToken).to.equal(expectedApiToken);
    });
  });

  describe('getProfile', function() {
    context("the user's profile is successfully retrieved", function() {
      let clientOAuth;
      let expectedProfile;
      let promise;

      beforeEach(function() {
        expectedProfile = faker.helpers.userCard();

        webAuthSession.client = {
          userInfo: this.sandbox.stub().callsFake((accessToken, cb) => {
            cb(null, expectedProfile);
          })
        };

        clientOAuth = new ClientOAuth(sdk);
        clientOAuth._sessionInfo = { accessToken: faker.internet.password() };
        promise = clientOAuth.getProfile();
      });

      it("gets the user's profile", function() {
        expect(webAuthSession.client.userInfo)
          .to.be.calledWith(clientOAuth._sessionInfo.accessToken);
      });

      it("returns a fulfilled promise with the users's profile", function() {
        return expect(promise).to.be.fulfilled
          .and.to.eventually.equal(expectedProfile);
      });
    });

    context("there is no access token available to get a user's profile", function() {
      let clientOAuth;

      beforeEach(function() {
        webAuthSession.client = { userInfo: this.sandbox.stub() };

        clientOAuth = new ClientOAuth(sdk);
      });

      it('throws an error', function() {
        const fn = () => clientOAuth.getProfile();
        expect(fn).to.throw('No access token found');
      });
    });

    context("there is an error getting a users's profile", function() {
      let expectedError;
      let promise;

      beforeEach(function() {
        expectedError = new Error(faker.hacker.phrase());

        webAuthSession.client = {
          userInfo: this.sandbox.stub().callsFake((accessToken, cb) => {
            cb(expectedError);
          })
        };

        const clientOAuth = new ClientOAuth(sdk);
        clientOAuth._sessionInfo = { accessToken: faker.internet.password() };
        promise = clientOAuth.getProfile();
      });

      it('returns a rejected promise', function() {
        return expect(promise).to.be.rejectedWith(expectedError);
      });
    });
  });

  describe('handleAuthentication', function() {
    let clock;
    let expectedSessionInfo;
    let getApiToken;
    let parseWebAuthHash;
    let promise;
    let saveSession;

    beforeEach(function() {
      const currentDate = new Date();
      expectedSessionInfo = {
        accessToken: faker.internet.password(),
        apiToken: faker.internet.password(),
        expiresAt: faker.date.future().getTime()
      };

      clock = sinon.useFakeTimers(currentDate);
      getApiToken = this.sandbox.stub(ClientOAuth.prototype, '_getApiToken').callsFake(() => {
        return Promise.resolve(expectedSessionInfo.apiToken);
      });
      parseWebAuthHash = this.sandbox.stub(ClientOAuth.prototype, '_parseWebAuthHash').callsFake(() => {
        return Promise.resolve({
          accessToken: expectedSessionInfo.accessToken,
          expiresIn: (expectedSessionInfo.expiresAt - currentDate.getTime()) / 1000
        });
      });
      saveSession = this.sandbox.stub(ClientOAuth.prototype, '_saveSession');

      const clientOAuth = new ClientOAuth(sdk);
      promise = clientOAuth.handleAuthentication();
    });

    afterEach(function() {
      clock.restore();
    });

    it('parses the previously retrieved web auth hash', function() {
      expect(parseWebAuthHash).to.be.calledOnce;
    });

    it('gets a contxt api token using the web auth access token', function() {
      return promise.then(() => {
        expect(getApiToken).to.be.calledOnce;
        expect(getApiToken).to.be.calledWith(expectedSessionInfo.accessToken);
      });
    });

    it('saves the session info to local storage for future use', function() {
      return promise.then(() => {
        expect(saveSession).to.be.calledWith(expectedSessionInfo);
      });
    });

    it('returns a promise that is fulfilled with the web auth info and contxt api token', function() {
      return expect(promise).to.be.fulfilled
        .and.to.eventually.deep.equal(expectedSessionInfo);
    });
  });

  describe('isAuthenticated', function() {
    let clientOAuth;

    beforeEach(function() {
      clientOAuth = new ClientOAuth(sdk);
    });

    it('returns true when the expiresAt info is in the future', function() {
      clientOAuth._sessionInfo = {
        expiresAt: faker.date.future().getTime()
      };

      const isAuthenticated = clientOAuth.isAuthenticated();

      expect(isAuthenticated).to.be.true;
    });

    it('returns true when the expiresAt info is in the past', function() {
      clientOAuth._sessionInfo = {
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

  describe('logOut', function() {
    let clientOAuth;
    let localStorage;

    beforeEach(function() {
      localStorage = {
        removeItem: this.sandbox.stub()
      };
      global.localStorage = localStorage;

      clientOAuth = new ClientOAuth(sdk);
      clientOAuth._sessionInfo = {
        accessToken: faker.internet.password(),
        apiToken: faker.internet.password(),
        expiresAt: faker.date.future().getTime()
      };
      clientOAuth.logOut();
    });

    it('deletes the session info from the auth module instance', function() {
      expect(clientOAuth._sessionInfo).to.be.undefined;
    });

    it('deletes the access token from local storage', function() {
      expect(localStorage.removeItem).to.be.calledWith('access_token');
    });

    it('deletes the api access token from local storage', function() {
      expect(localStorage.removeItem).to.be.calledWith('api_token');
    });

    it('deletes the expires at information from local storage', function() {
      expect(localStorage.removeItem).to.be.calledWith('expires_at');
    });
  });

  describe('_getApiToken', function() {
    let accessToken;
    let expectedApiToken;
    let expectedAudiences;
    let post;
    let promise;

    beforeEach(function() {
      accessToken = faker.internet.password();
      expectedApiToken = faker.internet.password();
      expectedAudiences = times(faker.random.number({ min: 1, max: 5 }), () => faker.random.uuid());

      sdk.config.apiDependencies = expectedAudiences;
      post = this.sandbox.stub(axios, 'post').callsFake(() => {
        return Promise.resolve({ data: { access_token: expectedApiToken } });
      });

      const clientOAuth = new ClientOAuth(sdk);
      promise = clientOAuth._getApiToken(accessToken);
    });

    it('POSTs to the contxt api to get a token', function() {
      expect(post).to.be.calledWith(
        'https://contxt-auth.api.ndustrial.io/v1/token',
        {
          audiences: expectedAudiences,
          nonce: 'nonce'
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
    });

    it('returns a promise that fulfills with the api access token', function() {
      return expect(promise).to.be.fulfilled
        .and.to.eventually.equal(expectedApiToken);
    });
  });

  describe('_parseWebAuthHash', function() {
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
        promise = clientOAuth._parseWebAuthHash();
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
        return expect(clientOAuth._parseWebAuthHash()).to.be.rejectedWith(expectedError);
      });
    });

    context('no valid token info returned from auth0', function() {
      let clientOAuth;

      beforeEach(function() {
        webAuthSession.parseHash = this.sandbox.stub().callsFake((cb) => cb(null, null));

        clientOAuth = new ClientOAuth(sdk);
      });

      it('returns with a rejected promise', function() {
        return expect(clientOAuth._parseWebAuthHash())
          .to.be.rejectedWith('No valid tokens returned from auth0');
      });
    });
  });

  describe('_saveSession', function() {
    let clientOAuth;
    let expectedSessionInfo;
    let localStorage;

    beforeEach(function() {
      expectedSessionInfo = {
        accessToken: faker.internet.password(),
        apiToken: faker.internet.password(),
        expiresAt: faker.date.future().getTime()
      };

      localStorage = {
        setItem: this.sandbox.stub()
      };
      global.localStorage = localStorage;

      clientOAuth = new ClientOAuth(sdk);
      clientOAuth._saveSession(expectedSessionInfo);
    });

    it('saves the session info in the auth module instance', function() {
      expect(clientOAuth._sessionInfo).to.equal(expectedSessionInfo);
    });

    it('saves the access token to local storage', function() {
      expect(localStorage.setItem)
        .to.be.calledWith('access_token', expectedSessionInfo.accessToken);
    });

    it('saves the api access token to local storage', function() {
      expect(localStorage.setItem)
        .to.be.calledWith('api_token', expectedSessionInfo.apiToken);
    });

    it('saves the expires at information to local storage', function() {
      expect(localStorage.setItem)
        .to.be.calledWith('expires_at', expectedSessionInfo.expiresAt);
    });
  });
});

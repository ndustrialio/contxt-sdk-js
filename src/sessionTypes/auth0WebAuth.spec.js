import auth0 from 'auth0-js';
import axios from 'axios';
import times from 'lodash.times';
import sinon from 'sinon';
import Auth0WebAuth from './auth0WebAuth';

describe('sessionTypes/Auth0WebAuth', function() {
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
      location: faker.internet.url()
    };

    webAuth = this.sandbox.stub(auth0, 'WebAuth').returns(webAuthSession);
  });

  afterEach(function() {
    global.window = originalWindow;
    this.sandbox.restore();
  });

  describe('constructor', function() {
    context('with default WebAuth config options', function() {
      let auth0WebAuth;

      beforeEach(function() {
        auth0WebAuth = new Auth0WebAuth(sdk);
      });

      it('appends the supplied sdk to the class instance', function() {
        expect(auth0WebAuth._sdk).to.equal(sdk);
      });

      it('creates an auth0 WebAuth instance with the default settings', function() {
        expect(webAuth).to.be.calledWithNew;
        expect(webAuth).to.be.calledWith({
          audience: sdk.config.auth.authProviderClientId,
          clientId: sdk.config.auth.clientId,
          domain: 'ndustrial.auth0.com',
          redirectUri: `${global.window.location}/callback`,
          responseType: 'token',
          scope: 'profile openid'
        });
      });

      it('appends an auth0 WebAuth instance to the class instance', function() {
        expect(auth0WebAuth._auth0).to.equal(webAuthSession);
      });
    });

    context('with custom WebAuth config options', function() {
      let expectedAuthorizationPath;

      beforeEach(function() {
        expectedAuthorizationPath = faker.hacker.adjective();
        sdk.config.auth.authorizationPath = expectedAuthorizationPath;

        new Auth0WebAuth(sdk); // eslint-disable-line no-new
      });

      it('creates an auth0 WebAuth instance with the default settings', function() {
        const [{ redirectUri }] = webAuth.firstCall.args;
        expect(redirectUri).to.match(new RegExp(`${expectedAuthorizationPath}$`));
      });
    });

    context('without required config options', function() {
      it('throws an error when no authProviderClientId is provided', function() {
        delete sdk.config.auth.authProviderClientId;
        const fn = () => new Auth0WebAuth(sdk);

        expect(fn).to.throw('authProviderClientId is required for the WebAuth config');
      });

      it('throws an error when no clientId is provided', function() {
        delete sdk.config.auth.clientId;
        const fn = () => new Auth0WebAuth(sdk);

        expect(fn).to.throw('clientId is required for the WebAuth config');
      });
    });
  });

  describe('getCurrentToken', function() {
    let auth0WebAuth;

    beforeEach(function() {
      auth0WebAuth = new Auth0WebAuth(sdk);
    });

    it('throws an error when there is no current token', function() {
      const fn = () => auth0WebAuth.getCurrentToken();
      expect(fn).to.throw('No api token found');
    });

    it('returns a current token', function() {
      const expectedApiToken = faker.internet.password();
      const auth0WebAuth = new Auth0WebAuth(sdk);
      auth0WebAuth._sessionInfo = { apiToken: expectedApiToken };
      const currentToken = auth0WebAuth.getCurrentToken();

      expect(currentToken).to.equal(expectedApiToken);
    });
  });

  describe('getProfile', function() {
    context("the user's profile is successfully retrieved", function() {
      let auth0WebAuth;
      let expectedProfile;
      let promise;

      beforeEach(function() {
        expectedProfile = faker.helpers.userCard();

        webAuthSession.client = {
          userInfo: this.sandbox.stub().callsFake((accessToken, cb) => {
            cb(null, expectedProfile);
          })
        };

        auth0WebAuth = new Auth0WebAuth(sdk);
        auth0WebAuth._sessionInfo = { accessToken: faker.internet.password() };
        promise = auth0WebAuth.getProfile();
      });

      it("gets the user's profile", function() {
        expect(webAuthSession.client.userInfo)
          .to.be.calledWith(auth0WebAuth._sessionInfo.accessToken);
      });

      it("returns a fulfilled promise with the users's profile", function() {
        return expect(promise).to.be.fulfilled
          .and.to.eventually.equal(expectedProfile);
      });
    });

    context("there is no access token available to get a user's profile", function() {
      let auth0WebAuth;

      beforeEach(function() {
        webAuthSession.client = { userInfo: this.sandbox.stub() };

        auth0WebAuth = new Auth0WebAuth(sdk);
      });

      it('throws an error', function() {
        const fn = () => auth0WebAuth.getProfile();
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

        const auth0WebAuth = new Auth0WebAuth(sdk);
        auth0WebAuth._sessionInfo = { accessToken: faker.internet.password() };
        promise = auth0WebAuth.getProfile();
      });

      it('returns a rejected promise', function() {
        return expect(promise).to.be.rejectedWith(expectedError);
      });
    });
  });

  describe('handleAuthentication', function() {
    context('successfully getting a new api token', function() {
      let clock;
      let expectedRedirectPathname;
      let expectedSessionInfo;
      let expectedUrl;
      let generateRedirectUrlFromPathname;
      let getApiToken;
      let getRedirectPathname;
      let parseWebAuthHash;
      let promise;
      let saveSession;

      beforeEach(function() {
        const currentDate = new Date();
        expectedRedirectPathname = `/${faker.hacker.adjective()}/${faker.hacker.adjective()}`;
        expectedSessionInfo = {
          accessToken: faker.internet.password(),
          apiToken: faker.internet.password(),
          expiresAt: faker.date.future().getTime()
        };
        expectedUrl = faker.internet.url();

        clock = sinon.useFakeTimers(currentDate);
        getApiToken = this.sandbox.stub(Auth0WebAuth.prototype, '_getApiToken').callsFake(() => {
          return Promise.resolve(expectedSessionInfo.apiToken);
        });
        getRedirectPathname = this.sandbox.stub(Auth0WebAuth.prototype, '_getRedirectPathname')
          .returns(expectedRedirectPathname);
        generateRedirectUrlFromPathname = this.sandbox.stub(Auth0WebAuth.prototype, '_generateRedirectUrlFromPathname')
          .returns(expectedUrl);
        parseWebAuthHash = this.sandbox.stub(Auth0WebAuth.prototype, '_parseWebAuthHash').callsFake(() => {
          return Promise.resolve({
            accessToken: expectedSessionInfo.accessToken,
            expiresIn: (expectedSessionInfo.expiresAt - currentDate.getTime()) / 1000
          });
        });
        saveSession = this.sandbox.stub(Auth0WebAuth.prototype, '_saveSession');
        global.window = {
          _location: `${faker.internet.url()}/${faker.hacker.adjective()}`,
          get location() {
            return this._location;
          },
          set location(newLocation) {
            this._location = newLocation;
          }
        };

        const auth0WebAuth = new Auth0WebAuth(sdk);
        promise = auth0WebAuth.handleAuthentication();
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

      it('gets a stored (or default redirect pathname)', function() {
        return promise.then(() => {
          expect(getRedirectPathname).to.be.calledOnce;
        });
      });

      it('generates a redirect url', function() {
        return promise.then(() => {
          expect(generateRedirectUrlFromPathname).to.be.calledWith(expectedRedirectPathname);
        });
      });

      it("assigns the new redirect url to the browsers's location", function() {
        return promise
          .then(() => {
            expect(global.window.location).to.equal(expectedUrl);
          });
      });

      it('returns a promise that is fulfilled with the web auth info and contxt api token', function() {
        return expect(promise).to.be.fulfilled
          .and.to.eventually.deep.equal(expectedSessionInfo);
      });
    });

    context('unsuccessfully getting an api token', function() {
      let expectedError;
      let expectedUrl;
      let generateRedirectUrlFromPathname;
      let promise;

      beforeEach(function() {
        expectedError = faker.hacker.phrase();
        expectedUrl = faker.internet.url();

        generateRedirectUrlFromPathname = this.sandbox.stub(Auth0WebAuth.prototype, '_generateRedirectUrlFromPathname')
          .returns(expectedUrl);
        this.sandbox.stub(Auth0WebAuth.prototype, '_getApiToken').callsFake(() => {
          return Promise.reject(expectedError);
        });
        this.sandbox.stub(Auth0WebAuth.prototype, '_parseWebAuthHash').callsFake(() => {
          return Promise.resolve({});
        });
        global.window = {
          _location: `${faker.internet.url()}/${faker.hacker.adjective()}`,
          get location() {
            return this._location;
          },
          set location(newLocation) {
            this._location = newLocation;
          }
        };

        const auth0WebAuth = new Auth0WebAuth(sdk);
        promise = auth0WebAuth.handleAuthentication();
      });

      it('generates a redirect url', function() {
        return promise
          .then(expect.fail)
          .catch(() => {
            expect(generateRedirectUrlFromPathname).to.be.calledWith('/');
          });
      });

      it("assigns the new redirect url to the browsers's location", function() {
        return promise
          .then(expect.fail)
          .catch(() => {
            expect(global.window.location).to.equal(expectedUrl);
          });
      });

      it('returns with a rejected promise', function() {
        return expect(promise).to.be.rejectedWith(expectedError);
      });
    });
  });

  describe('isAuthenticated', function() {
    let auth0WebAuth;

    beforeEach(function() {
      auth0WebAuth = new Auth0WebAuth(sdk);
    });

    it('returns true when the expiresAt info is in the future', function() {
      auth0WebAuth._sessionInfo = {
        expiresAt: faker.date.future().getTime()
      };

      const isAuthenticated = auth0WebAuth.isAuthenticated();

      expect(isAuthenticated).to.be.true;
    });

    it('returns true when the expiresAt info is in the past', function() {
      auth0WebAuth._sessionInfo = {
        expiresAt: faker.date.past().getTime()
      };

      const isAuthenticated = auth0WebAuth.isAuthenticated();

      expect(isAuthenticated).to.be.false;
    });
  });

  describe('logIn', function() {
    let auth0WebAuth;

    beforeEach(function() {
      auth0WebAuth = new Auth0WebAuth(sdk);
      auth0WebAuth.logIn();
    });

    it('begins to authorize an auth0 WebAuth session', function() {
      expect(webAuthSession.authorize).to.be.calledOnce;
    });
  });

  describe('logOut', function() {
    let auth0WebAuth;
    let expectedUrl;
    let generateRedirectUrlFromPathname;
    let localStorage;
    let originalLocation;

    beforeEach(function() {
      expectedUrl = faker.internet.url();

      generateRedirectUrlFromPathname = this.sandbox.stub(Auth0WebAuth.prototype, '_generateRedirectUrlFromPathname')
        .returns(expectedUrl);
      localStorage = {
        removeItem: this.sandbox.stub()
      };
      originalLocation = faker.internet.url();

      global.localStorage = localStorage;
      global.window = {
        _location: originalLocation,
        get location() {
          return this._location;
        },
        set location(newLocation) {
          this._location = newLocation;
        }
      };

      auth0WebAuth = new Auth0WebAuth(sdk);
      auth0WebAuth._sessionInfo = {
        accessToken: faker.internet.password(),
        apiToken: faker.internet.password(),
        expiresAt: faker.date.future().getTime()
      };
      auth0WebAuth.logOut();
    });

    it('deletes the session info from the auth module instance', function() {
      expect(auth0WebAuth._sessionInfo).to.be.undefined;
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

    it('generates a redirect url', function() {
      expect(generateRedirectUrlFromPathname).to.be.calledWith('/');
    });

    it("assigns the new redirect url to the browsers's location", function() {
      expect(global.window.location).to.equal(expectedUrl);
    });
  });

  describe('_generateRedirectUrlFromPathname', function() {
    let expectedPathname;
    let hash;
    let newUrl;
    let origin;
    let query;

    beforeEach(function() {
      expectedPathname = faker.hacker.adjective();
      hash = `#${faker.hacker.adjective()}`;
      origin = faker.internet.url();
      query = `?q=${faker.hacker.adjective()}`;

      global.window = {
        _location: `${origin}/${faker.hacker.adjective()}/${faker.hacker.adjective()}/${query}${hash}`,
        get location() {
          return this._location;
        },
        set location(newLocation) {
          this._location = newLocation;
        }
      };

      const auth0WebAuth = new Auth0WebAuth(sdk);
      newUrl = auth0WebAuth._generateRedirectUrlFromPathname(expectedPathname);
    });

    it("changes the url's original path to the newly provided path", function() {
      expect(newUrl).to.equal(`${origin}/${expectedPathname}${query}${hash}`);
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

      const auth0WebAuth = new Auth0WebAuth(sdk);
      promise = auth0WebAuth._getApiToken(accessToken);
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

  describe('_getRedirectPathname', function() {
    beforeEach(function() {
      global.localStorage = {
        removeItem: this.sandbox.stub()
      };
    });

    context('when there is a saved redirect pathname', function() {
      let expectedPathname;
      let pathname;

      beforeEach(function() {
        expectedPathname = `/${faker.hacker.adjective()}/${faker.hacker.adjective()}`;

        global.localStorage.getItem = this.sandbox.stub().returns(expectedPathname);

        const auth0WebAuth = new Auth0WebAuth(sdk);
        pathname = auth0WebAuth._getRedirectPathname();
      });

      it('gets the stored pathname from local storage', function() {
        expect(global.localStorage.getItem).to.be.calledWith('redirect_pathname');
      });

      it('removes the previously stored pathname from local storage', function() {
        expect(global.localStorage.removeItem).to.be.calledWith('redirect_pathname');
      });

      it('returns the stored pathname', function() {
        expect(pathname).to.equal(expectedPathname);
      });
    });

    context('when there is no saved redirect pathname', function() {
      let pathname;

      beforeEach(function() {
        global.localStorage.getItem = this.sandbox.stub();

        const auth0WebAuth = new Auth0WebAuth(sdk);
        pathname = auth0WebAuth._getRedirectPathname();
      });

      it('returns a root pathname', function() {
        expect(pathname).to.equal('/');
      });
    });
  });

  describe('_parseWebAuthHash', function() {
    let auth0WebAuth;

    beforeEach(function() {
      auth0WebAuth = new Auth0WebAuth(sdk);
      auth0WebAuth.logIn();
    });

    context('successfully parsing the hash', function() {
      let expectedHash;
      let promise;

      beforeEach(function() {
        expectedHash = faker.helpers.createTransaction();
        webAuthSession.parseHash = this.sandbox.stub().callsFake((cb) => cb(null, expectedHash));

        const auth0WebAuth = new Auth0WebAuth(sdk);
        promise = auth0WebAuth._parseWebAuthHash();
      });

      it('parses the hash using auth0', function() {
        expect(webAuthSession.parseHash).to.be.calledOnce;
      });

      it('fulfills a promise with the hash information', function() {
        return expect(promise).to.become(expectedHash);
      });
    });

    context('erroring while parsing the hash', function() {
      let auth0WebAuth;
      let expectedError;

      beforeEach(function() {
        expectedError = new Error(faker.hacker.phrase());
        webAuthSession.parseHash = this.sandbox.stub().callsFake((cb) => cb(expectedError));

        auth0WebAuth = new Auth0WebAuth(sdk);
      });

      it('returns with a rejected promise', function() {
        return expect(auth0WebAuth._parseWebAuthHash()).to.be.rejectedWith(expectedError);
      });
    });

    context('no valid token info returned from auth0', function() {
      let auth0WebAuth;

      beforeEach(function() {
        webAuthSession.parseHash = this.sandbox.stub().callsFake((cb) => cb(null, null));

        auth0WebAuth = new Auth0WebAuth(sdk);
      });

      it('returns with a rejected promise', function() {
        return expect(auth0WebAuth._parseWebAuthHash())
          .to.be.rejectedWith('No valid tokens returned from auth0');
      });
    });
  });

  describe('_saveSession', function() {
    let auth0WebAuth;
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

      auth0WebAuth = new Auth0WebAuth(sdk);
      auth0WebAuth._saveSession(expectedSessionInfo);
    });

    it('saves the session info in the auth module instance', function() {
      expect(auth0WebAuth._sessionInfo).to.equal(expectedSessionInfo);
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

import auth0 from 'auth0-js';
import axios from 'axios';
import omit from 'lodash.omit';
import Auth0WebAuth from './auth0WebAuth';

describe('sessionTypes/Auth0WebAuth', function() {
  let getStoredSession;
  let isAuthenticated;
  let originalWindow;
  let scheduleSessionRefresh;
  let sdk;
  let webAuth;
  let webAuthSession;

  beforeEach(function() {
    sdk = {
      config: {
        audiences: {
          contxtAuth: fixture.build('audience'),
          facilities: fixture.build('audience')
        },
        auth: {
          authorizationPath: faker.hacker.noun(),
          clientId: faker.internet.password(),
          tokenExpiresAtBufferMs: faker.random.number()
        }
      }
    };
    webAuthSession = {
      authorize: sinon.stub(),
      logout: sinon.stub()
    };
    originalWindow = global.window;
    global.window = {
      location: faker.internet.url()
    };

    getStoredSession = sinon
      .stub(Auth0WebAuth.prototype, '_getStoredSession')
      .returns({});
    isAuthenticated = sinon
      .stub(Auth0WebAuth.prototype, 'isAuthenticated')
      .returns(true);
    scheduleSessionRefresh = sinon.stub(
      Auth0WebAuth.prototype,
      '_scheduleSessionRefresh'
    );
    webAuth = sinon.stub(auth0, 'WebAuth').returns(webAuthSession);
  });

  afterEach(function() {
    global.window = originalWindow;
    sinon.restore();
  });

  describe('constructor', function() {
    context('with default WebAuth config options', function() {
      let auth0WebAuth;
      let expectedSession;

      beforeEach(function() {
        getStoredSession.restore();

        expectedSession = {
          accessToken: faker.internet.url(),
          apiToken: faker.internet.url(),
          expiresAt: faker.date.future().getTime()
        };

        getStoredSession = sinon
          .stub(Auth0WebAuth.prototype, '_getStoredSession')
          .returns(expectedSession);

        auth0WebAuth = new Auth0WebAuth(sdk);
      });

      it('appends the supplied sdk to the class instance', function() {
        expect(auth0WebAuth._sdk).to.equal(sdk);
      });

      it('sets the default onRedirect method to the class instance', function() {
        expect(auth0WebAuth._onRedirect).to.equal(
          Auth0WebAuth.prototype._defaultOnRedirect
        );
      });

      it('loads the session from memory', function() {
        expect(getStoredSession.calledOnce).to.be.true;
      });

      it('stores the session in the Auth instance', function() {
        expect(auth0WebAuth._sessionInfo).to.equal(expectedSession);
      });

      it('sets up the default data structures for tokens', function() {
        expect(auth0WebAuth._sessionRenewalTimeout).to.be.null;
        expect(auth0WebAuth._tokenPromises).to.deep.equal({});
      });

      it('creates an auth0 WebAuth instance with the default settings', function() {
        expect(webAuth).to.be.calledWithNew;
        expect(webAuth).to.be.calledWith({
          audience: sdk.config.audiences.contxtAuth.clientId,
          clientID: sdk.config.auth.clientId,
          domain: 'ndustrial.auth0.com',
          redirectUri: `${global.window.location}/${
            sdk.config.auth.authorizationPath
          }`,
          responseType: 'token',
          scope: 'email profile openid'
        });
      });

      it('appends an auth0 WebAuth instance to the class instance', function() {
        expect(auth0WebAuth._auth0).to.equal(webAuthSession);
      });

      it('checks if the user is currently authenticated', function() {
        expect(isAuthenticated).to.be.calledOnce;
      });

      it('schedules a future token renewal', function() {
        expect(scheduleSessionRefresh).to.be.calledOnce;
      });
    });

    context('with custom WebAuth config options', function() {
      let auth0WebAuth;
      let expectedAuthorizationPath;
      let expectedOnRedirect;

      beforeEach(function() {
        expectedAuthorizationPath = faker.hacker.adjective();
        expectedOnRedirect = sinon.stub();
        sdk.config.auth.authorizationPath = expectedAuthorizationPath;
        sdk.config.auth.onRedirect = expectedOnRedirect;

        auth0WebAuth = new Auth0WebAuth(sdk);
      });

      it('sets the custom onRedirect method to the class instance', function() {
        expect(auth0WebAuth._onRedirect).to.equal(expectedOnRedirect);
      });

      it('creates an auth0 WebAuth instance with the default settings', function() {
        const [{ redirectUri }] = webAuth.firstCall.args;
        expect(redirectUri).to.match(
          new RegExp(`${expectedAuthorizationPath}$`)
        );
      });
    });

    context('when the user is not authenticated', function() {
      beforeEach(function() {
        isAuthenticated.restore();
        sinon.stub(Auth0WebAuth.prototype, 'isAuthenticated').returns(false);

        const auth0WebAuth = new Auth0WebAuth(sdk); // eslint-disable-line no-unused-vars
      });

      it('does not schedule  a future token renewal', function() {
        expect(scheduleSessionRefresh).to.not.be.called;
      });
    });

    context('without required config options', function() {
      it('throws an error when no clientId is provided', function() {
        delete sdk.config.auth.clientId;
        const fn = () => new Auth0WebAuth(sdk);

        expect(fn).to.throw('clientId is required for the WebAuth config');
      });
    });
  });

  describe('clearCurrentApiToken', function() {
    context(
      'when deleting an existing token where the request to acquire the token has completed',
      function() {
        let audienceNameToDelete;
        let auth0WebAuth;
        let promise;

        beforeEach(function() {
          audienceNameToDelete = faker.random.arrayElement(
            Object.keys(sdk.config.audiences)
          );

          auth0WebAuth = new Auth0WebAuth(sdk);
          auth0WebAuth._tokenPromises = Object.keys(
            sdk.config.audiences
          ).reduce((memo, audienceName) => {
            memo[audienceName] = Promise.resolve(faker.internet.password());

            return memo;
          }, {});

          promise = auth0WebAuth.clearCurrentApiToken(audienceNameToDelete);
        });

        it('removes the access token promise', function() {
          return promise.then(() => {
            expect(auth0WebAuth._tokenPromises[audienceNameToDelete]).to.be
              .undefined;
          });
        });

        it('returns a resolved promise', function() {
          return expect(promise).to.be.fulfilled;
        });
      }
    );

    context(
      'when deleting an token where the request to acquire the token has not yet completed',
      function() {
        let audienceNameToDelete;
        let auth0WebAuth;
        let promise;

        beforeEach(function() {
          let resolver;

          audienceNameToDelete = faker.random.arrayElement(
            Object.keys(sdk.config.audiences)
          );

          auth0WebAuth = new Auth0WebAuth(sdk);
          auth0WebAuth._tokenPromises = Object.keys(
            sdk.config.audiences
          ).reduce((memo, audienceName) => {
            if (audienceName === audienceNameToDelete) {
              memo[audienceName] = new Promise((resolve) => {
                resolver = resolve;
              });
            } else {
              memo[audienceName] = Promise.resolve(faker.internet.password());
            }

            return memo;
          }, {});

          promise = auth0WebAuth.clearCurrentApiToken(audienceNameToDelete);

          resolver(faker.internet.password());
        });

        it('removes the access token promise', function() {
          return promise.then(() => {
            expect(auth0WebAuth._tokenPromises[audienceNameToDelete]).to.be
              .undefined;
          });
        });

        it('returns a resolved promise', function() {
          return expect(promise).to.be.fulfilled;
        });
      }
    );

    context(
      'when attempting to delete an access token that does not currently exist',
      function() {
        let auth0WebAuth;
        let promise;

        beforeEach(function() {
          auth0WebAuth = new Auth0WebAuth(sdk);
          auth0WebAuth._tokenPromises = Object.keys(
            sdk.config.audiences
          ).reduce((memo, audienceName) => {
            memo[audienceName] = Promise.resolve(faker.internet.password());

            return memo;
          }, {});

          promise = auth0WebAuth.clearCurrentApiToken(faker.hacker.adjective());
        });

        it('returns a resolved promise', function() {
          return expect(promise).to.be.fulfilled;
        });
      }
    );
  });

  describe('getCurrentAccessToken', function() {
    context('when the user is authenticaed', function() {
      let expectedAccessToken;
      let promise;

      beforeEach(function() {
        isAuthenticated.restore();
        isAuthenticated = sinon
          .stub(Auth0WebAuth.prototype, 'isAuthenticated')
          .returns(true);

        const auth0WebAuth = new Auth0WebAuth(sdk);

        expectedAccessToken = faker.internet.password();
        auth0WebAuth._sessionInfo.accessToken = expectedAccessToken;

        promise = auth0WebAuth.getCurrentAccessToken();
      });

      it('returns the current access token', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.equal(
          expectedAccessToken
        );
      });
    });

    context('when the user is not authenticated', function() {
      let expectedError;
      let generateUnauthorizedError;
      let promise;

      beforeEach(function() {
        expectedError = new Error(faker.hacker.phrase());

        generateUnauthorizedError = sinon
          .stub(Auth0WebAuth.prototype, '_generateUnauthorizedError')
          .returns(expectedError);

        const auth0WebAuth = new Auth0WebAuth(sdk);

        isAuthenticated.restore();
        isAuthenticated = sinon
          .stub(Auth0WebAuth.prototype, 'isAuthenticated')
          .returns(false);

        promise = auth0WebAuth.getCurrentAccessToken();
      });

      it('checks if the session has a valid token', function() {
        return promise.then(expect.fail).catch(() => {
          expect(isAuthenticated).to.be.calledOnce;
        });
      });

      it('gets a generated `unauthorized` error', function() {
        return promise.then(expect.fail).catch(() => {
          expect(generateUnauthorizedError).to.be.calledOnce;
        });
      });

      it('throws an error', function() {
        return expect(promise).to.be.rejectedWith(expectedError);
      });
    });
  });

  describe('getCurrentApiToken', function() {
    let expectedAudienceName;

    beforeEach(function() {
      expectedAudienceName = faker.random.arrayElement(
        Object.keys(sdk.config.audiences)
      );
    });

    context(
      "when there is no existing request for an audience's token",
      function() {
        let auth0WebAuth;
        let expectedAccessToken;
        let expectedApiToken;
        let post;
        let promise;

        beforeEach(function() {
          expectedAccessToken = faker.internet.password();
          expectedApiToken = faker.internet.password();

          post = sinon
            .stub(axios, 'post')
            .resolves({ data: { access_token: expectedApiToken } });

          auth0WebAuth = new Auth0WebAuth(sdk);
          auth0WebAuth._sessionInfo.accessToken = expectedAccessToken;

          promise = auth0WebAuth.getCurrentApiToken(expectedAudienceName);
        });

        it('requests a token from contxt-auth', function() {
          expect(post).to.be.calledWith(
            `${sdk.config.audiences.contxtAuth.host}/v1/token`,
            {
              audiences: [sdk.config.audiences[expectedAudienceName].clientId],
              nonce: 'nonce'
            },
            {
              headers: {
                Authorization: `Bearer ${expectedAccessToken}`
              }
            }
          );
        });

        it('resolves with the token', function() {
          return expect(promise).to.be.fulfilled.and.to.eventually.equal(
            expectedApiToken
          );
        });
      }
    );

    context(
      "when there is an existing request for an audience's token",
      function() {
        let auth0WebAuth;
        let expectedPromise;
        let promise;

        beforeEach(function() {
          expectedPromise = new Promise(function() {});

          auth0WebAuth = new Auth0WebAuth(sdk);
          auth0WebAuth._tokenPromises[expectedAudienceName] = expectedPromise;

          promise = auth0WebAuth.getCurrentApiToken(expectedAudienceName);
        });

        it('returns the existing promise', function() {
          expect(promise).to.equal(expectedPromise);
        });
      }
    );

    context('when the user is not authenticated', function() {
      let expectedError;
      let generateUnauthorizedError;
      let promise;

      beforeEach(function() {
        expectedError = new Error(faker.hacker.phrase());

        generateUnauthorizedError = sinon
          .stub(Auth0WebAuth.prototype, '_generateUnauthorizedError')
          .returns(expectedError);

        const auth0WebAuth = new Auth0WebAuth(sdk);

        isAuthenticated.restore();
        isAuthenticated = sinon
          .stub(Auth0WebAuth.prototype, 'isAuthenticated')
          .returns(false);

        promise = auth0WebAuth.getCurrentApiToken(expectedAudienceName);
      });

      it('checks if the audience already has a valid token', function() {
        return promise.then(expect.fail).catch(() => {
          expect(isAuthenticated).to.be.calledOnce;
        });
      });

      it('gets a generated `unauthorized` error', function() {
        return promise.then(expect.fail).catch(() => {
          expect(generateUnauthorizedError).to.be.calledOnce;
        });
      });

      it('returns a rejected promise with an error', function() {
        return expect(promise).to.be.rejectedWith(expectedError);
      });
    });

    context('when a valid audience is not provided', function() {
      it('returns a rejected promise with an error when there is no audience with that name', function() {
        const auth0WebAuth = new Auth0WebAuth(sdk);

        return expect(
          auth0WebAuth.getCurrentApiToken(faker.hacker.noun())
        ).to.be.rejectedWith('No valid audience found');
      });

      it('returns a rejected promise with an error when there is no client ID for the chosen audenice', function() {
        const invalidAudience = faker.lorem.word();
        const auth0WebAuth = new Auth0WebAuth({
          ...sdk,
          config: {
            ...sdk.config,
            audiences: {
              ...sdk.config.audiences,
              [invalidAudience]: {}
            }
          }
        });

        return expect(
          auth0WebAuth.getCurrentApiToken(invalidAudience)
        ).to.be.rejectedWith('No valid audience found');
      });
    });
  });

  describe('getProfile', function() {
    context("the user's profile is successfully retrieved", function() {
      let auth0WebAuth;
      let expectedAccessToken;
      let expectedProfile;
      let profile;
      let promise;

      beforeEach(function() {
        expectedAccessToken = faker.internet.password();
        profile = fixture.build('userProfile', null, { fromServer: true });
        expectedProfile = omit({ ...profile, updatedAt: profile.updated_at }, [
          'updated_at'
        ]);

        webAuthSession.client = {
          userInfo: sinon.stub().callsFake((accessToken, cb) => {
            cb(null, profile);
          })
        };

        auth0WebAuth = new Auth0WebAuth(sdk);
        auth0WebAuth._sessionInfo.accessToken = expectedAccessToken;

        promise = auth0WebAuth.getProfile();
      });

      it("gets the user's profile", function() {
        return promise.then(() => {
          expect(webAuthSession.client.userInfo).to.be.calledWith(
            expectedAccessToken
          );
        });
      });

      it("returns a fulfilled promise with the users's profile", function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
          expectedProfile
        );
      });
    });

    context("there is an error getting a users's profile", function() {
      let expectedError;
      let promise;

      beforeEach(function() {
        expectedError = new Error(faker.hacker.phrase());
        webAuthSession.client = {
          userInfo: sinon.stub().callsFake((accessToken, cb) => {
            cb(expectedError);
          })
        };

        const auth0WebAuth = new Auth0WebAuth(sdk);
        auth0WebAuth._sessionInfo.accessToken = faker.internet.password();

        promise = auth0WebAuth.getProfile();
      });

      it('returns a rejected promise', function() {
        return expect(promise).to.be.rejectedWith(expectedError);
      });
    });
  });

  describe('handleAuthentication', function() {
    context('when successfully authenticating', function() {
      let expectedHash;
      let expectedRedirectPathname;
      let getRedirectPathname;
      let onRedirect;
      let parseHash;
      let promise;
      let storeSession;

      beforeEach(function() {
        const currentDate = new Date();
        expectedHash = {
          accessToken: faker.internet.password(),
          expiresIn:
            (faker.date.future().getTime() - currentDate.getTime()) / 1000
        };
        expectedRedirectPathname = `/${faker.hacker.adjective()}/${faker.hacker.adjective()}`;

        getRedirectPathname = sinon
          .stub(Auth0WebAuth.prototype, '_getRedirectPathname')
          .returns(expectedRedirectPathname);
        parseHash = sinon
          .stub(Auth0WebAuth.prototype, '_parseHash')
          .resolves(expectedHash);
        onRedirect = sinon.stub();
        storeSession = sinon.stub(Auth0WebAuth.prototype, '_storeSession');

        const auth0WebAuth = new Auth0WebAuth(sdk);
        auth0WebAuth._onRedirect = onRedirect;
        scheduleSessionRefresh.reset();

        promise = auth0WebAuth.handleAuthentication();
      });

      it('parses the previously retrieved web auth hash', function() {
        return promise.then(() => {
          expect(parseHash).to.be.calledOnce;
        });
      });

      it('stores the session', function() {
        return promise.then(() => {
          expect(storeSession).to.be.calledWith(expectedHash);
        });
      });

      it('schedules the session to refresh', function() {
        return promise.then(() => {
          expect(scheduleSessionRefresh).to.be.calledOnce;
        });
      });

      it('gets a stored (or default redirect pathname)', function() {
        return promise.then(() => {
          expect(getRedirectPathname).to.be.calledOnce;
        });
      });

      it("assigns the new redirect url to the browsers's location", function() {
        return promise.then(() => {
          expect(onRedirect).to.be.calledWith(expectedRedirectPathname);
        });
      });

      it('returns a resolved promise', function() {
        return expect(promise).to.be.fulfilled;
      });
    });

    context('when there is a problem parsing the hash', function() {
      let expectedError;
      let onRedirect;
      let promise;

      beforeEach(function() {
        expectedError = new Error(faker.hacker.phrase());

        sinon.stub(Auth0WebAuth.prototype, '_parseHash').rejects(expectedError);
        onRedirect = sinon.stub();

        const auth0WebAuth = new Auth0WebAuth(sdk);
        auth0WebAuth._onRedirect = onRedirect;

        promise = auth0WebAuth.handleAuthentication();
      });

      it("assigns the new redirect url to the browsers's location", function() {
        return promise.then(expect.fail).catch(() => {
          expect(onRedirect).to.be.calledWith('/');
        });
      });

      it('returns a rejected promise', function() {
        return expect(promise).to.be.rejectedWith(expectedError);
      });
    });
  });

  describe('isAuthenticated', function() {
    let auth0WebAuth;

    beforeEach(function() {
      auth0WebAuth = new Auth0WebAuth(sdk);
      isAuthenticated.restore();
    });

    it('returns true if the user is authenticated', function() {
      auth0WebAuth._sessionInfo = {
        accessToken: faker.internet.url(),
        expiresAt: faker.date.future().getTime()
      };

      const isAuthenticated = auth0WebAuth.isAuthenticated();

      expect(isAuthenticated).to.be.true;
    });

    it('returns false when there is no stored session info', function() {
      auth0WebAuth._sessionInfo = undefined;

      const isAuthenticated = auth0WebAuth.isAuthenticated();

      expect(isAuthenticated).to.be.false;
    });

    it('returns false when there is no stored access token', function() {
      auth0WebAuth._sessionInfo = {};

      const isAuthenticated = auth0WebAuth.isAuthenticated();

      expect(isAuthenticated).to.be.false;
    });

    it('returns false when there is no stored `expiresAt` value', function() {
      auth0WebAuth._sessionInfo = {
        accessToken: faker.internet.url()
      };

      const isAuthenticated = auth0WebAuth.isAuthenticated();

      expect(isAuthenticated).to.be.false;
    });

    it('returns false when the stored `expiresAt` value is in the past', function() {
      auth0WebAuth._sessionInfo = {
        accessToken: faker.internet.url(),
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
    let clearTimeout;
    let expectedOptions;
    let expectedTokenRenewalTimeout;
    let localStorage;

    beforeEach(function() {
      expectedOptions = {
        federated: true,
        returnTo: global.window.location,
        [faker.hacker.adjective()]: faker.hacker.phrase()
      };
      expectedTokenRenewalTimeout = faker.helpers.createTransaction();

      clearTimeout = sinon.stub(global, 'clearTimeout');
      localStorage = {
        removeItem: sinon.stub()
      };
      global.localStorage = localStorage;

      auth0WebAuth = new Auth0WebAuth(sdk);
      auth0WebAuth._sessionInfo = {
        accessToken: faker.internet.password(),
        apiToken: faker.internet.password(),
        expiresAt: faker.date.future().getTime()
      };
      auth0WebAuth._tokenPromises = {
        [faker.internet.password()]: Promise.resolve()
      };
      auth0WebAuth._sessionRenewalTimeout = expectedTokenRenewalTimeout;

      auth0WebAuth.logOut(omit(expectedOptions, ['returnTo']));
    });

    it('resets the session info stored in the auth module instance', function() {
      expect(auth0WebAuth._sessionInfo).to.deep.equal({});
    });

    it('resets any stored API tokens', function() {
      expect(auth0WebAuth._tokenPromises).to.deep.equal({});
    });

    it('deletes the `access_token` from local storage', function() {
      expect(localStorage.removeItem).to.be.calledWith('access_token');
    });

    it('deletes the `expires_at` from local storage', function() {
      expect(localStorage.removeItem).to.be.calledWith('expires_at');
    });

    it('clears the token renewal timeout', function() {
      expect(clearTimeout).to.be.calledWith(expectedTokenRenewalTimeout);
    });

    it('logs the user out from Auth0 and redirects to the project root', function() {
      expect(webAuthSession.logout).to.be.calledWith(expectedOptions);
    });
  });

  describe('_checkSession', function() {
    context('when the session is successfully checked', function() {
      let expectedOptions;
      let expectedSessionInfo;
      let promise;

      beforeEach(function() {
        expectedOptions = faker.helpers.createTransaction();
        expectedSessionInfo = {
          accessToken: faker.internet.password(),
          expiresAt: faker.date.future().getTime()
        };

        webAuthSession.checkSession = sinon.stub().callsFake((options, cb) => {
          cb(null, expectedSessionInfo);
        });

        const auth0WebAuth = new Auth0WebAuth(sdk);
        promise = auth0WebAuth._checkSession(expectedOptions);
      });

      it('checks for an up to date session', function() {
        expect(webAuthSession.checkSession).to.be.calledWith(expectedOptions);
      });

      it('resolves with the up to date session info', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.equal(
          expectedSessionInfo
        );
      });
    });

    context('when there is an issue checking the session', function() {
      let expectedError;
      let promise;

      beforeEach(function() {
        expectedError = new Error(faker.hacker.phrase());

        webAuthSession.checkSession = sinon.stub().callsFake((options, cb) => {
          cb(expectedError);
        });

        const auth0WebAuth = new Auth0WebAuth(sdk);
        promise = auth0WebAuth._checkSession();
      });

      it('returns with a rejected promise', function() {
        return expect(promise).to.be.rejectedWith(expectedError);
      });
    });
  });

  describe('_defaultOnRedirect', function() {
    let expectedPathname;

    beforeEach(function() {
      expectedPathname = `/${faker.hacker.adjective()}/${faker.hacker.adjective()}`;

      Auth0WebAuth.prototype._defaultOnRedirect(expectedPathname);
    });

    it("assigns the new redirect pathname to the browsers's location", function() {
      expect(global.window.location).to.equal(expectedPathname);
    });
  });

  describe('_getRedirectPathname', function() {
    afterEach(function() {
      delete global.localStorage;
    });

    context('when there is a saved redirect pathname', function() {
      let expectedPathname;
      let pathname;

      beforeEach(function() {
        expectedPathname = `/${faker.hacker.adjective()}/${faker.hacker.adjective()}`;

        global.localStorage = {
          getItem: sinon.stub().returns(expectedPathname),
          removeItem: sinon.stub()
        };

        const auth0WebAuth = new Auth0WebAuth(sdk);
        pathname = auth0WebAuth._getRedirectPathname();
      });

      it('gets the stored pathname from local storage', function() {
        expect(global.localStorage.getItem).to.be.calledWith(
          'redirect_pathname'
        );
      });

      it('removes the previously stored pathname from local storage', function() {
        expect(global.localStorage.removeItem).to.be.calledWith(
          'redirect_pathname'
        );
      });

      it('returns the stored pathname', function() {
        expect(pathname).to.equal(expectedPathname);
      });
    });

    context('when there is no saved redirect pathname', function() {
      let pathname;

      beforeEach(function() {
        global.localStorage = {
          getItem: sinon.stub(),
          removeItem: sinon.stub()
        };

        const auth0WebAuth = new Auth0WebAuth(sdk);
        pathname = auth0WebAuth._getRedirectPathname();
      });

      it('returns a root pathname', function() {
        expect(pathname).to.equal('/');
      });
    });
  });

  describe('_getStoredSession', function() {
    let auth0WebAuth;
    let expectedSessionInfo;
    let localStorage;
    let session;

    beforeEach(function() {
      expectedSessionInfo = {
        accessToken: faker.internet.password(),
        expiresAt: faker.date.future().getTime()
      };

      localStorage = {
        getItem: sinon.stub().callsFake((key) => {
          switch (key) {
            case 'access_token':
              return expectedSessionInfo.accessToken;
            case 'expires_at':
              return `${expectedSessionInfo.expiresAt}`;
          }
        })
      };
      global.localStorage = localStorage;

      auth0WebAuth = new Auth0WebAuth(sdk);
      getStoredSession.restore();

      session = auth0WebAuth._getStoredSession();
    });

    afterEach(function() {
      delete global.localStorage;
    });

    it('gets the access token out of local storage', function() {
      expect(localStorage.getItem).to.be.calledWith('access_token');
    });

    it('gets the expires at information out of local storage (and coreces it to be a number)', function() {
      expect(localStorage.getItem).to.be.calledWith('expires_at');
    });

    it('returns an object with the session info', function() {
      expect(session).to.deep.equal(expectedSessionInfo);
    });
  });

  describe('_getUpdatedSession', function() {
    context('when successfully updating the session', function() {
      let auth0WebAuth;
      let checkSession;
      let expectedSessionInfo;
      let storeSession;
      let promise;

      beforeEach(function() {
        expectedSessionInfo = {
          accessToken: faker.internet.password(),
          expiresAt: faker.date.future().getTime()
        };

        checkSession = sinon
          .stub(Auth0WebAuth.prototype, '_checkSession')
          .resolves(expectedSessionInfo);
        storeSession = sinon.stub(Auth0WebAuth.prototype, '_storeSession');

        auth0WebAuth = new Auth0WebAuth(sdk);
        auth0WebAuth._tokenPromises = {
          [faker.internet.password()]: Promise.resolve()
        };
        scheduleSessionRefresh.reset();

        promise = auth0WebAuth._getUpdatedSession();
      });

      it('checks the existing session for updated session info', function() {
        return promise.then(() => {
          expect(checkSession).to.be.calledOnce;
        });
      });

      it('stores the new session info', function() {
        return promise.then(() => {
          expect(storeSession).to.be.calledWith(expectedSessionInfo);
        });
      });

      it('resets any stored access tokens', function() {
        return promise.then(() => {
          expect(auth0WebAuth._tokenPromises).to.deep.equal({});
        });
      });

      it('schedules the session to refresh in the future', function() {
        return promise.then(() => {
          expect(scheduleSessionRefresh).to.be.calledOnce;
        });
      });
    });

    context('when there is a failure whileupdating the session', function() {
      let generateUnauthorizedError;
      let logOut;

      beforeEach(function() {
        logOut = sinon.stub(Auth0WebAuth.prototype, 'logOut');
      });

      it('throws a 401 and logs the user out if Auth0 requires the session to be re-authenticated', function() {
        const errorType = faker.random.arrayElement([
          'consent_required',
          'interaction_required',
          'login_required'
        ]);
        const originalError = {
          error: errorType,
          error_description: {
            consent_required: 'Consent required',
            interaction_required: 'Interaction required',
            login_required: 'Login required'
          }[errorType]
        };
        const expectedError = new Error('Unauthorized');
        expectedError.response = {
          data: {
            code: 401,
            error: originalError.error,
            error_description: originalError.error_description
          },
          status: 401
        };

        sinon
          .stub(Auth0WebAuth.prototype, '_checkSession')
          .rejects(originalError);
        generateUnauthorizedError = sinon
          .stub(Auth0WebAuth.prototype, '_generateUnauthorizedError')
          .returns(expectedError);

        const auth0WebAuth = new Auth0WebAuth(sdk);
        const promise = auth0WebAuth._getUpdatedSession();

        return promise.then(expect.fail).catch((error) => {
          expect(generateUnauthorizedError).to.be.calledWith(originalError);

          expect(error.message).to.equal('Unauthorized');
          expect(error.response).to.deep.equal(expectedError.response);

          expect(logOut).to.be.calledOnce;
        });
      });

      it('throws a human readable error when unable to reach the server', function() {
        const originalError = new Error(faker.hacker.phrase());
        const expectedError = new Error(
          'There was a problem getting new session info. Please check your configuration settings.'
        );
        expectedError.fromSdk = true;
        expectedError.originalError = originalError;

        sinon
          .stub(Auth0WebAuth.prototype, '_checkSession')
          .rejects(originalError);

        const auth0WebAuth = new Auth0WebAuth(sdk);
        const promise = auth0WebAuth._getUpdatedSession();

        return promise.then(expect.fail).catch((err) => {
          expect(err.message).to.equal(expectedError.message);
          expect(err.fromSdk).to.equal(expectedError.fromSdk);
          expect(err.originalError).to.equal(expectedError.originalError);
        });
      });

      it('throws the original error if it includes a status code', function() {
        const expectedError = new Error();
        expectedError.response = { status: faker.random.number() };

        sinon
          .stub(Auth0WebAuth.prototype, '_checkSession')
          .rejects(expectedError);

        const auth0WebAuth = new Auth0WebAuth(sdk);
        const promise = auth0WebAuth._getUpdatedSession();

        return expect(promise).to.be.rejectedWith(expectedError);
      });
    });
  });

  describe('_generateUnauthorizedError', function() {
    let auth0WebAuth;

    beforeEach(function() {
      auth0WebAuth = new Auth0WebAuth(sdk);
    });

    it('returns an error with a 401 status code', function() {
      const error = auth0WebAuth._generateUnauthorizedError();

      expect(error).to.be.an('error');
      expect(error).to.deep.include({
        message: 'Unauthorized',
        response: {
          data: {
            code: 401
          },
          status: 401
        }
      });
    });

    it("includes the original error's content if one is provided", function() {
      const expectedError = new Error(faker.hacker.phrase());
      expectedError[faker.hacker.noun()] = faker.helpers.createTransaction();

      const error = auth0WebAuth._generateUnauthorizedError(expectedError);

      expect(error.response.data).to.include(expectedError);
    });

    it('indicates the SDK originated the error if no original error is provided', function() {
      const error = auth0WebAuth._generateUnauthorizedError();

      expect(error.fromSdk).to.be.true;
    });
  });

  describe('_parseHash', function() {
    context('successfully parsing the hash', function() {
      let expectedHash;
      let promise;

      beforeEach(function() {
        expectedHash = faker.helpers.createTransaction();
        webAuthSession.parseHash = sinon
          .stub()
          .callsFake((cb) => cb(null, expectedHash));

        const auth0WebAuth = new Auth0WebAuth(sdk);
        promise = auth0WebAuth._parseHash();
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
        webAuthSession.parseHash = sinon
          .stub()
          .callsFake((cb) => cb(expectedError));

        auth0WebAuth = new Auth0WebAuth(sdk);
      });

      it('returns with a rejected promise', function() {
        return expect(auth0WebAuth._parseHash()).to.be.rejectedWith(
          expectedError
        );
      });
    });

    context('no valid token info returned from auth0', function() {
      let auth0WebAuth;

      beforeEach(function() {
        webAuthSession.parseHash = sinon
          .stub()
          .callsFake((cb) => cb(null, null));

        auth0WebAuth = new Auth0WebAuth(sdk);
      });

      it('returns with a rejected promise', function() {
        return expect(auth0WebAuth._parseHash()).to.be.rejectedWith(
          'No valid tokens returned from auth0'
        );
      });
    });
  });

  describe('_scheduleTokenRenewal', function() {
    let auth0WebAuth;
    let clock;
    let expectedDelay;
    let getUpdatedSession;
    let initialTimeout;

    beforeEach(function() {
      const currentDate = new Date();
      clock = sinon.useFakeTimers(currentDate);

      const expiresAt = faker.date.future().getTime();
      expectedDelay =
        expiresAt -
        sdk.config.auth.tokenExpiresAtBufferMs -
        currentDate.getTime();
      initialTimeout = clock.setTimeout(() => {}, 0);

      sinon.spy(clock, 'clearTimeout');
      getUpdatedSession = sinon.stub(
        Auth0WebAuth.prototype,
        '_getUpdatedSession'
      );
      sinon.spy(clock, 'setTimeout');

      auth0WebAuth = new Auth0WebAuth(sdk);
      auth0WebAuth._sessionInfo = { expiresAt };
      auth0WebAuth._sessionRenewalTimeout = initialTimeout;
      scheduleSessionRefresh.restore();

      auth0WebAuth._scheduleSessionRefresh();
    });

    afterEach(function() {
      clock.restore();
    });

    it('clears any existing renewal timeout', function() {
      expect(clock.clearTimeout).to.be.calledWith(initialTimeout);
    });

    it('sets up a renewal timeout', function() {
      expect(auth0WebAuth._sessionRenewalTimeout).to.not.equal(initialTimeout);
      expect(auth0WebAuth._sessionRenewalTimeout).to.be.an('object');
      expect(auth0WebAuth._sessionRenewalTimeout.id).to.be.a('number');

      expect(clock.setTimeout).to.be.calledOnce;
      const [cb, delay] = clock.setTimeout.firstCall.args;
      expect(cb).to.be.a('function');
      expect(delay).to.equal(expectedDelay);
    });

    it('updates the session info after the delay', function() {
      clock.tick(expectedDelay);

      expect(getUpdatedSession).to.be.calledOnce;
    });
  });

  describe('_storeSession', function() {
    let auth0WebAuth;
    let expectedSessionInfo;
    let localStorage;

    beforeEach(function() {
      expectedSessionInfo = {
        accessToken: faker.internet.password(),
        expiresAt: faker.date.future().getTime()
      };

      localStorage = {
        setItem: sinon.stub()
      };
      global.localStorage = localStorage;

      auth0WebAuth = new Auth0WebAuth(sdk);

      auth0WebAuth._storeSession({
        accessToken: expectedSessionInfo.accessToken,
        expiresIn: (expectedSessionInfo.expiresAt - Date.now()) / 1000
      });
    });

    afterEach(function() {
      delete global.localStorage;
    });

    it('saves the access token to local storage', function() {
      expect(localStorage.setItem).to.be.calledWith(
        'access_token',
        expectedSessionInfo.accessToken
      );
    });

    it('saves the `expiresAt` information to local storage (as a string)', function() {
      expect(localStorage.setItem).to.be.calledWith(
        'expires_at',
        `${expectedSessionInfo.expiresAt}`
      );
    });

    it('saves the access token in the auth module instance', function() {
      expect(auth0WebAuth._sessionInfo.accessToken).to.equal(
        expectedSessionInfo.accessToken
      );
    });

    it('saves the `expiresAt` information in the auth module instance', function() {
      expect(auth0WebAuth._sessionInfo.expiresAt).to.equal(
        expectedSessionInfo.expiresAt
      );
    });
  });
});

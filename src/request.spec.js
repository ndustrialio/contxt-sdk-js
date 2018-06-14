import axios from 'axios';
import times from 'lodash.times';
import Request from './request';

describe('Request', function() {
  let baseAxiosInstance;
  let baseSdk;

  beforeEach(function() {
    this.sandbox = sandbox.create();

    baseAxiosInstance = {
      interceptors: {
        request: {
          use: this.sandbox.stub()
        },
        response: {
          use: this.sandbox.stub()
        }
      }
    };
    baseSdk = {
      config: {
        interceptors: {}
      }
    };
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  describe('constructor', function() {
    let attachInterceptors;
    let create;
    let expectedAudienceName;
    let request;

    beforeEach(function() {
      expectedAudienceName = faker.hacker.noun();

      attachInterceptors = this.sandbox.stub(
        Request.prototype,
        '_attachInterceptors'
      );
      create = this.sandbox.stub(axios, 'create').returns(baseAxiosInstance);

      request = new Request(baseSdk, expectedAudienceName);
    });

    it('appends the audience name of the parent to the class instance', function() {
      expect(request._audienceName).to.equal(expectedAudienceName);
    });

    it('creates an axios instance and appends it to the class instance', function() {
      expect(create).to.be.calledOnce;
      expect(request._axios).to.equal(baseAxiosInstance);
    });

    it('binds and appends the `insertHeaders` method to the class instance', function() {
      expect(request._insertHeaders.name).to.equal('bound _insertHeaders');
    });

    it('appends the supplied sdk to the class instance', function() {
      expect(request._sdk).to.equal(baseSdk);
    });

    it("sets up axios's interceptors", function() {
      expect(attachInterceptors).to.be.calledWith(request._axios);
    });
  });

  [
    'delete',
    'get',
    'head',
    'options',
    'patch',
    'post',
    'put',
    'request'
  ].forEach(function(method) {
    describe(method, function() {
      let axiosInstance;
      let expectedArgs;
      let expectedResponse;
      let response;

      beforeEach(function() {
        expectedArgs = times(faker.random.number({ min: 1, max: 10 })).map(
          faker.hacker.phrase
        );
        expectedResponse = faker.hacker.phrase();
        axiosInstance = {
          ...baseAxiosInstance,
          [method]: this.sandbox
            .stub()
            .callsFake(() => Promise.resolve({ data: expectedResponse }))
        };

        this.sandbox.stub(axios, 'create').returns(axiosInstance);

        const request = new Request(baseSdk);
        response = request[method].apply(request, expectedArgs);
      });

      it(`invokes axio's ${method} with all the arguments passed`, function() {
        expect(axiosInstance[method]).to.be.calledWith(...expectedArgs);
      });

      it('returns the promise with the requested data', function() {
        return expect(response).to.be.fulfilled.and.to.eventually.equal(
          expectedResponse
        );
      });
    });
  });

  describe('_attachInterceptors', function() {
    let expectedRequestInterceptors;
    let expectedResponseInterceptors;
    let requestUse;
    let responseUse;

    beforeEach(function() {
      /* eslint-disable no-new-func */
      const requestInterceptors = times(
        faker.random.number({ min: 0, max: 10 }),
        () => {
          return {
            fulfilled: new Function(),
            rejected: new Function()
          };
        }
      );
      const responseInterceptors = times(
        faker.random.number({ min: 0, max: 10 }),
        () => {
          return {
            fulfilled: new Function(),
            rejected: new Function()
          };
        }
      );
      /* eslint-enable no-new-func */
      expectedRequestInterceptors = [
        { fulfilled: Request.prototype._insertHeaders }
      ].concat(requestInterceptors);
      expectedResponseInterceptors = responseInterceptors;

      requestUse = this.sandbox.stub();
      responseUse = this.sandbox.stub();

      Request.prototype._attachInterceptors.call({
        _axios: {
          interceptors: {
            request: { use: requestUse },
            response: { use: responseUse }
          }
        },
        _insertHeaders: Request.prototype._insertHeaders,
        _sdk: {
          config: {
            interceptors: {
              request: requestInterceptors,
              response: responseInterceptors
            }
          }
        }
      });
    });

    it('sets up the request interceptors', function() {
      expectedRequestInterceptors.forEach(({ fulfilled, rejected }) => {
        expect(requestUse).to.be.calledWith(fulfilled, rejected);
      });
    });

    it('sets up the response interceptors', function() {
      expectedResponseInterceptors.forEach(({ fulfilled, rejected }) => {
        expect(responseUse).to.be.calledWith(fulfilled, rejected);
      });
    });
  });

  describe('_insertHeaders', function() {
    let expectedAudienceName;
    let expectedToken;
    let initialConfig;
    let promise;
    let sdk;

    beforeEach(function() {
      expectedAudienceName = faker.hacker.noun();
      expectedToken = faker.internet.password();
      initialConfig = {
        headers: {
          common: {}
        }
      };
      sdk = {
        ...baseSdk,
        auth: {
          getCurrentApiToken: this.sandbox.stub().resolves(expectedToken)
        }
      };

      const request = new Request(sdk, expectedAudienceName);
      promise = request._insertHeaders(initialConfig);
    });

    it("gets a current token from the sdk's auth module", function() {
      expect(sdk.auth.getCurrentApiToken).to.be.calledWith(
        expectedAudienceName
      );
    });

    it('returns a resolved promise', function() {
      return expect(promise).to.fulfilled;
    });

    it('resolves a config with an Authorization header appended', function() {
      return promise.then((config) => {
        expect(config).to.equal(initialConfig);
        expect(config.headers.common.Authorization).to.equal(
          `Bearer ${expectedToken}`
        );
      });
    });
  });
});

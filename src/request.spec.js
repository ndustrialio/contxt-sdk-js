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
        }
      }
    };
    baseSdk = {};
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  describe('constructor', function() {
    let create;
    let request;

    beforeEach(function() {
      create = this.sandbox.stub(axios, 'create').returns(baseAxiosInstance);

      request = new Request(baseSdk);
    });

    it('appends the supplied sdk to the class instance', function() {
      expect(request.sdk).to.equal(baseSdk);
    });

    it('creates an axios instance and appends it to the class instance', function() {
      expect(create).to.be.calledOnce;
      expect(request.axios).to.equal(baseAxiosInstance);
    });

    it("sets up axios's interceptors", function() {
      expect(baseAxiosInstance.interceptors.request.use).to.be.calledOnce;
      const [requestInterceptor] = baseAxiosInstance.interceptors.request.use.firstCall.args;
      expect(requestInterceptor).to.be.a('function');
      expect(requestInterceptor).to.equal(request._insertHeaders);
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
        expectedArgs = times(faker.random.number({ min: 1, max: 10 })).map(faker.hacker.phrase);
        expectedResponse = faker.hacker.phrase();
        axiosInstance = {
          ...baseAxiosInstance,
          [method]: this.sandbox.stub().callsFake(() => Promise.resolve(expectedResponse))
        };

        this.sandbox.stub(axios, 'create').returns(axiosInstance);

        const request = new Request(baseSdk);
        response = request[method].apply(request, expectedArgs);
      });

      it(`invokes axio's ${method} with all the arguments passed`, function() {
        expect(axiosInstance[method]).to.be.calledWith(...expectedArgs);
      });

      it('returns the promise provided by axios', function() {
        return expect(response).to.be.fulfilled
          .and.to.eventually.equal(expectedResponse);
      });
    });
  });

  describe('_insertHeaders', function() {
    let config;
    let expectedToken;
    let initialConfig;
    let sdk;

    beforeEach(function() {
      expectedToken = faker.internet.password();
      initialConfig = {
        headers: {
          common: {}
        }
      };
      sdk = {
        ...baseSdk,
        auth: {
          getCurrentToken: this.sandbox.stub().returns(expectedToken)
        }
      };

      const request = new Request(sdk);
      config = request._insertHeaders(initialConfig);
    });

    it("gets a current token from the sdk's auth module", function() {
      expect(sdk.auth.getCurrentToken).to.be.calledOnce;
    });

    it('appends an Authorization header', function() {
      expect(config.headers.common.Authorization).to.equal(`Bearer ${expectedToken}`);
    });
  });
});

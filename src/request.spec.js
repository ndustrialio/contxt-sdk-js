import axios from 'axios';
import times from 'lodash.times';
import Request from './request';

describe('Request', function() {
  let axiosInstance;
  let create;
  let expectedResponse;
  let expectedToken;
  let request;
  let sdk;

  beforeEach(function() {
    this.sandbox = sandbox.create();

    expectedResponse = faker.hacker.phrase();
    expectedToken = faker.internet.password();
    axiosInstance = {
      delete: this.sandbox.stub().callsFake(() => Promise.resolve(expectedResponse)),
      get: this.sandbox.stub().callsFake(() => Promise.resolve(expectedResponse)),
      head: this.sandbox.stub().callsFake(() => Promise.resolve(expectedResponse)),
      interceptors: {
        request: {
          use: this.sandbox.stub()
        }
      },
      options: this.sandbox.stub().callsFake(() => Promise.resolve(expectedResponse)),
      patch: this.sandbox.stub().callsFake(() => Promise.resolve(expectedResponse)),
      post: this.sandbox.stub().callsFake(() => Promise.resolve(expectedResponse)),
      put: this.sandbox.stub().callsFake(() => Promise.resolve(expectedResponse)),
      request: this.sandbox.stub().callsFake(() => Promise.resolve(expectedResponse))
    };
    sdk = {
      auth: {
        getCurrentToken: this.sandbox.stub().returns(expectedToken)
      }
    };
    create = this.sandbox.stub(axios, 'create').returns(axiosInstance);

    request = new Request(sdk);
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  describe('constructor', function() {
    it('creates an axios instance and appends it to the class instance', function() {
      expect(create.calledOnce).to.be.true;
      expect(request.axios).to.equal(axiosInstance);
    });

    it('appends the supplied sdk to the class instance', function() {
      expect(request.sdk).to.equal(sdk);
    });

    it("sets up axios's interceptors", function() {
      expect(axiosInstance.interceptors.request.use.calledOnce).to.be.true;
      const [requestInterceptors] = axiosInstance.interceptors.request.use.firstCall.args;
      expect(requestInterceptors).to.equal(request.insertHeaders);
    });
  });

  describe('insertHeaders', function() {
    let config;
    let initialConfig;

    beforeEach(function() {
      initialConfig = {
        headers: {
          common: {}
        }
      };

      config = request.insertHeaders(initialConfig);
    });

    it('appends an Authorization header', function() {
      expect(config.headers.common.Authorization)
        .to.equal(`Bearer: ${expectedToken}`);
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
      let expectedArgs;
      let response;

      beforeEach(function() {
        expectedArgs = times(faker.random.number({ min: 1, max: 10 })).map(faker.hacker.phrase);
        response = request[method].apply(request, expectedArgs);
      });

      it(`invokes axios's ${method} with all the arguments passed`, function() {
        expect(request.axios[method].calledOnce).to.be.true;
        const args = request.axios[method].firstCall.args;
        expect(args).to.deep.equal(expectedArgs);
      });

      it('returns the promise provided by axios', function() {
        return expect(response).to.be.fulfilled
          .and.to.eventually.equal(expectedResponse);
      });
    });
  });
});

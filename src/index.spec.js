import ContxtSdk from './index';
import Request from './request';
import * as sessionTypes from './sessionTypes';

describe('ContxtSdk', function() {
  let baseConfig;

  beforeEach(function() {
    this.sandbox = sandbox.create();

    baseConfig = {};
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  describe('constructor', function() {
    let contxtSdk;
    let createAuthSession;
    let expectedAuthSession;

    beforeEach(function() {
      expectedAuthSession = faker.helpers.createTransaction();

      createAuthSession = this.sandbox.stub(ContxtSdk.prototype, 'createAuthSession')
        .returns(expectedAuthSession);

      contxtSdk = new ContxtSdk(baseConfig);
    });

    it('saves the provided config', function() {
      expect(contxtSdk.config).to.equal(baseConfig);
    });

    it('sets an instance of Auth', function() {
      expect(createAuthSession).to.be.calledOnce;
      expect(contxtSdk.auth).to.equal(expectedAuthSession);
    });

    it('sets an instance of Request', function() {
      expect(contxtSdk.request).to.be.an.instanceof(Request);
    });
  });

  describe('createAuthSession', function() {
    [
      { sessionType: 'clientOauth', moduleName: 'ClientOauth' }
    ].forEach(function(authSessionConfig) {
      it(`returns a new ${authSessionConfig.sessionType} session`, function() {
        const instance = {
          config: {
            ...baseConfig,
            sessionType: authSessionConfig.sessionType
          }
        };
        const expectedSession = faker.helpers.createTransaction();

        const authSessionStub = this.sandbox.stub(sessionTypes, authSessionConfig.moduleName)
          .returns(expectedSession);

        const authSession = ContxtSdk.prototype.createAuthSession.call(instance);

        expect(authSessionStub).to.be.calledWithNew;
        expect(authSessionStub).to.be.calledWith(instance);
        expect(authSession).to.equal(expectedSession);
      });
    });

    it('throws an error if an invalid session type is provided', function() {
      const config = {
        ...baseConfig,
        sessionType: faker.hacker.verb()
      };
      const fn = () => ContxtSdk.prototype.createAuthSession.call({ config });

      expect(fn).to.throw('Invalid sessionType provided');
    });

    it('throws an error if no session type is provided', function() {
      const fn = () => ContxtSdk.prototype.createAuthSession.call({ config: baseConfig });

      expect(fn).to.throw('Invalid sessionType provided');
    });
  });
});

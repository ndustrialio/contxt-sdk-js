import times from 'lodash.times';
import ContxtSdk from './index';
import Facilities from './facilities';
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
    let decorate;
    let expectedAdditionalModules;
    let expectedAuthSession;
    let expectedAuthSessionType;

    beforeEach(function() {
      expectedAdditionalModules = times(faker.random.number({ min: 1, max: 5 })).reduce((memo) => {
        const moduleName = faker.hacker.verb();
        memo[moduleName] = { module: this.sandbox.stub() };
        return memo;
      }, {});
      expectedAuthSession = faker.helpers.createTransaction();
      expectedAuthSessionType = faker.hacker.verb();

      createAuthSession = this.sandbox.stub(ContxtSdk.prototype, '_createAuthSession')
        .returns(expectedAuthSession);
      decorate = this.sandbox.stub(ContxtSdk.prototype, '_decorate');

      contxtSdk = new ContxtSdk({
        additionalModules: expectedAdditionalModules,
        config: baseConfig,
        sessionType: expectedAuthSessionType
      });
    });

    it('saves the provided config', function() {
      expect(contxtSdk.config).to.equal(baseConfig);
    });

    it('sets an instance of Auth', function() {
      expect(createAuthSession).to.be.calledWith(expectedAuthSessionType);
      expect(contxtSdk.auth).to.equal(expectedAuthSession);
    });

    it('sets an instance of Facilities', function() {
      expect(contxtSdk.facilities).to.be.an.instanceof(Facilities);
    });

    it('decorates the additional custom modules', function() {
      expect(decorate).to.be.calledWith(expectedAdditionalModules);
    });
  });

  describe('_createAuthSession', function() {
    [
      { sessionType: 'auth0WebAuth', moduleName: 'Auth0WebAuth' }
    ].forEach(function(authSessionConfig) {
      it(`returns a new ${authSessionConfig.sessionType} session`, function() {
        const instance = { config: baseConfig };
        const expectedSession = faker.helpers.createTransaction();

        const authSessionStub = this.sandbox.stub(sessionTypes, authSessionConfig.moduleName)
          .returns(expectedSession);

        const authSession = ContxtSdk.prototype._createAuthSession.call(instance, authSessionConfig.sessionType);

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
      const fn = () => ContxtSdk.prototype._createAuthSession.call({ config });

      expect(fn).to.throw('Invalid sessionType provided');
    });

    it('throws an error if no session type is provided', function() {
      const fn = () => ContxtSdk.prototype._createAuthSession.call({ config: baseConfig });

      expect(fn).to.throw('Invalid sessionType provided');
    });
  });

  describe('_decorate', function() {
    let additionalModules;
    let instance;

    beforeEach(function() {
      additionalModules = times(faker.random.number({ min: 1, max: 5 })).reduce((memo) => {
        const moduleName = faker.hacker.verb();
        memo[moduleName] = { module: this.sandbox.stub() };
        return memo;
      }, {});
      instance = {};

      ContxtSdk.prototype._decorate.call(instance, additionalModules);
    });

    it('creates new instances of the provided modules', function() {
      for (const module in additionalModules) {
        expect(additionalModules[module].module).to.be.calledWithNew;
        expect(additionalModules[module].module).to.be.calledWith(instance);
      }
    });

    it('sets the new instances of the provided modules to the sdk instance', function() {
      for (const module in additionalModules) {
        expect(instance[module]).to.be.an.instanceof(additionalModules[module].module);
      }
    });
  });
});

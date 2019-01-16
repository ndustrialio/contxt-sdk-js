import times from 'lodash.times';
import Bus from './bus';
import Config from './config';
import ContxtSdk from './index';
import Coordinator from './coordinator';
import Events from './events';
import Facilities from './facilities';
import Files from './files';
import Iot from './iot';
import Request from './request';
import * as sessionTypes from './sessionTypes';

describe('ContxtSdk', function() {
  let baseConfig;

  beforeEach(function() {
    this.sandbox = sandbox.create();

    baseConfig = {
      auth: {}
    };
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  describe('constructor', function() {
    let contxtSdk;
    let createAuthSession;
    let createRequest;
    let decorate;
    let expectedExternalModules;
    let expectedAuthSession;
    let expectedAuthSessionType;

    beforeEach(function() {
      expectedExternalModules = times(
        faker.random.number({ min: 1, max: 5 })
      ).reduce((memo) => {
        const moduleName = faker.hacker.verb();
        memo[moduleName] = {
          ...fixture.build('audience'),
          module: this.sandbox.stub()
        };
        return memo;
      }, {});
      expectedAuthSession = faker.helpers.createTransaction();
      expectedAuthSessionType = faker.hacker.verb();

      createAuthSession = this.sandbox
        .stub(ContxtSdk.prototype, '_createAuthSession')
        .returns(expectedAuthSession);
      createRequest = this.sandbox.stub(ContxtSdk.prototype, '_createRequest');
      decorate = this.sandbox.stub(ContxtSdk.prototype, '_decorate');

      contxtSdk = new ContxtSdk({
        config: baseConfig,
        externalModules: expectedExternalModules,
        sessionType: expectedAuthSessionType
      });
    });

    it('creates an instance of the request module for Bus', function() {
      expect(createRequest).to.be.calledWith('bus');
    });

    it('sets an instance of Bus', function() {
      expect(contxtSdk.bus).to.be.an.instanceof(Bus);
    });

    it('sets an instance of Config', function() {
      expect(contxtSdk.config).to.be.an.instanceof(Config);
    });

    it('creates an instance of the request module for Coordinator', function() {
      expect(createRequest).to.be.calledWith('coordinator');
    });

    it('sets an instance of Coordinator', function() {
      expect(contxtSdk.coordinator).to.be.an.instanceof(Coordinator);
    });

    it('sets an instance of Auth', function() {
      expect(createAuthSession).to.be.calledWith(expectedAuthSessionType);
      expect(contxtSdk.auth).to.equal(expectedAuthSession);
    });

    it('creates an instance of the request module for Events', function() {
      expect(createRequest).to.be.calledWith('events');
    });

    it('sets an instance of Events', function() {
      expect(contxtSdk.events).to.be.an.instanceof(Events);
    });

    it('creates an instance of the request module for Facilities', function() {
      expect(createRequest).to.be.calledWith('facilities');
    });

    it('sets an instance of Facilities', function() {
      expect(contxtSdk.facilities).to.be.an.instanceof(Facilities);
    });

    it('sets an instance of Files', function() {
      expect(contxtSdk.files).to.be.an.instanceof(Files);
    });

    it('creates an instance of the request module for IOT', function() {
      expect(createRequest).to.be.calledWith('iot');
    });

    it('sets an instance of IOT', function() {
      expect(contxtSdk.iot).to.be.an.instanceof(Iot);
    });

    it('decorates the additional custom modules', function() {
      expect(decorate).to.be.calledWith(expectedExternalModules);
    });
  });

  describe('_createAuthSession', function() {
    [
      { sessionType: 'auth0WebAuth', moduleName: 'Auth0WebAuth' },
      { sessionType: 'machineAuth', moduleName: 'MachineAuth' }
    ].forEach(function(authSessionConfig) {
      it(`returns a new ${authSessionConfig.sessionType} session`, function() {
        const instance = { config: baseConfig };
        const expectedSession = faker.helpers.createTransaction();

        const authSessionStub = this.sandbox
          .stub(sessionTypes, authSessionConfig.moduleName)
          .returns(expectedSession);

        const authSession = ContxtSdk.prototype._createAuthSession.call(
          instance,
          authSessionConfig.sessionType
        );

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
      const fn = () =>
        ContxtSdk.prototype._createAuthSession.call({ config: baseConfig });

      expect(fn).to.throw('Invalid sessionType provided');
    });
  });

  describe('_createRequest', function() {
    let expectedAudienceName;
    let expectedInstance;
    let request;

    beforeEach(function() {
      expectedAudienceName = faker.hacker.noun();
      expectedInstance = {
        config: {
          interceptors: {
            request: [],
            response: []
          }
        }
      };

      request = ContxtSdk.prototype._createRequest.call(
        expectedInstance,
        expectedAudienceName
      );
    });

    it('returns an instance of the Request module tied to the sdk and the passed audience name', function() {
      expect(request).to.be.an.instanceof(Request);
      expect(request._sdk).to.equal(expectedInstance);
      expect(request._audienceName).to.equal(expectedAudienceName);
    });
  });

  describe('_decorate', function() {
    let externalModules;
    let instance;

    beforeEach(function() {
      externalModules = times(faker.random.number({ min: 1, max: 5 })).reduce(
        (memo) => {
          const moduleName = faker.hacker.verb();
          memo[moduleName] = { module: this.sandbox.stub() };
          return memo;
        },
        {}
      );
      instance = {
        _createRequest: this.sandbox
          .stub()
          .callsFake((moduleName) => `request module for: ${moduleName}`)
      };

      ContxtSdk.prototype._decorate.call(instance, externalModules);
    });

    it('creates new request modules for the provided modules', function() {
      for (const module in externalModules) {
        expect(instance._createRequest).to.be.calledWith(module);
      }
    });

    it('creates new instances of the provided modules', function() {
      for (const module in externalModules) {
        expect(externalModules[module].module).to.be.calledWithNew;
        expect(externalModules[module].module).to.be.calledWith(
          instance,
          `request module for: ${module}`
        );
      }
    });

    it('sets the new instances of the provided modules to the sdk instance', function() {
      for (const module in externalModules) {
        expect(instance[module]).to.be.an.instanceof(
          externalModules[module].module
        );
      }
    });
  });
});

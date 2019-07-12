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
    baseConfig = {
      auth: {}
    };
  });

  afterEach(function() {
    sinon.restore();
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
          module: sinon.stub()
        };
        return memo;
      }, {});
      expectedAuthSession = faker.helpers.createTransaction();
      expectedAuthSessionType = faker.hacker.verb();

      createAuthSession = sinon
        .stub(ContxtSdk.prototype, '_createAuthSession')
        .returns(expectedAuthSession);
      createRequest = sinon.stub(ContxtSdk.prototype, '_createRequest');
      decorate = sinon.stub(ContxtSdk.prototype, '_decorate');

      contxtSdk = new ContxtSdk({
        config: baseConfig,
        externalModules: expectedExternalModules,
        sessionType: expectedAuthSessionType
      });
    });

    it('creates an empty array for keeping track of dynamic modules', function() {
      expect(contxtSdk._dynamicModuleNames).to.be.an('array');
      expect(contxtSdk._dynamicModuleNames).to.be.empty;
    });

    it('creates an empty object for keeping track of replaced modules', function() {
      expect(contxtSdk._replacedModules).to.be.an('object');
      expect(contxtSdk._replacedModules).to.be.empty;
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

  describe('mountDynamicModule', function() {
    context(
      'when mounting a dynamic module where there is no existing dynamic module',
      function() {
        let existingDynamicModuleNames;
        let existingStaticModule;
        let expectedAudience;
        let expectedExternalModule;
        let instance;
        let moduleName;

        beforeEach(function() {
          existingDynamicModuleNames = times(
            faker.random.number({ min: 1, max: 10 })
          ).map((index) => `${faker.hacker.adjective()}-${index}`);
          existingStaticModule = sinon.stub();
          expectedAudience = fixture.build('audience');
          expectedExternalModule = sinon.stub();
          moduleName = faker.hacker.verb();

          instance = {
            _createRequest: sinon
              .stub()
              .callsFake((moduleName) => `request module for: ${moduleName}`),
            _dynamicModuleNames: existingDynamicModuleNames,
            _replacedModules: {},
            config: {
              addDynamicAudience: sinon.stub()
            },
            [moduleName]: existingStaticModule
          };

          ContxtSdk.prototype.mountDynamicModule.call(instance, moduleName, {
            ...expectedAudience,
            module: expectedExternalModule
          });
        });

        it('adds the audience', function() {
          expect(instance.config.addDynamicAudience).to.be.calledWith(
            moduleName,
            expectedAudience
          );
        });

        it('adds the module to a list of mounted dynamic modules', function() {
          expect(instance._dynamicModuleNames).to.include(moduleName);
          expect(instance._dynamicModuleNames).to.include(
            ...existingDynamicModuleNames
          );
        });

        it('saves any existing non-dynamic module with the same namespace to be reattached when unmounting', function() {
          expect(instance._replacedModules[moduleName]).to.equal(
            existingStaticModule
          );
        });

        it('creates a request module for the provided module', function() {
          expect(instance._createRequest).to.be.calledWith(moduleName);
        });

        it('creates a new instance of the provided module', function() {
          expect(expectedExternalModule).to.be.calledWithNew;
          expect(expectedExternalModule).to.be.calledWith(
            instance,
            `request module for: ${moduleName}`
          );
        });

        it('sets the new instance of the provided module to the sdk instance', function() {
          expect(instance[moduleName]).to.be.an.instanceof(
            expectedExternalModule
          );
        });
      }
    );

    context(
      'when mounting an dynamic module where there is already an existing dynamic module',
      function() {
        let existingDynamicModule;
        let fn;
        let instance;
        let moduleName;
        let newDynamicModule;

        beforeEach(function() {
          existingDynamicModule = sinon.stub();
          moduleName = faker.hacker.verb();
          newDynamicModule = sinon.stub();

          instance = {
            _createRequest: sinon
              .stub()
              .callsFake((moduleName) => `request module for: ${moduleName}`),
            _dynamicModuleNames: [
              moduleName,
              times(faker.random.number({ min: 1, max: 10 })).map(
                (index) => `${faker.hacker.adjective()}-${index}`
              )
            ],
            _replacedModules: {
              [moduleName]: sinon.stub()
            },
            [moduleName]: existingDynamicModule
          };

          fn = () =>
            ContxtSdk.prototype.mountDynamicModule.call(instance, moduleName, {
              ...fixture.build('audience'),
              module: sinon.stub()
            });
        });

        it('does not create a request module for the provided module', function() {
          try {
            fn();
          } catch (e) {
            expect(instance._createRequest).to.not.be.called;
          }
        });

        it('does not create a new instance of the provided module', function() {
          try {
            fn();
          } catch (e) {
            expect(newDynamicModule).to.not.be.called;
          }
        });

        it('does not replace the existing external module', function() {
          try {
            fn();
          } catch (e) {
            expect(instance[moduleName]).to.equal(existingDynamicModule);
          }
        });

        it('throws an error', function() {
          expect(fn).to.throw(
            `An dynamic module of the name \`${moduleName}\` already exists. This problem can be rectified by using a different name for the new module.`
          );
        });
      }
    );

    context('when there is an error adding the audience', function() {
      let existingDynamicModuleNames;
      let existingStaticModule;
      let expectedAudience;
      let expectedError;
      let fn;
      let instance;
      let moduleName;
      let newDynamicModule;

      beforeEach(function() {
        existingDynamicModuleNames = times(
          faker.random.number({ min: 1, max: 10 })
        ).map((index) => `${faker.hacker.adjective()}-${index}`);
        existingStaticModule = sinon.stub();
        expectedAudience = fixture.build('audience');
        expectedError = new Error(faker.hacker.phrase());
        newDynamicModule = sinon.stub();
        moduleName = faker.hacker.verb();

        instance = {
          _createRequest: sinon
            .stub()
            .callsFake((moduleName) => `request module for: ${moduleName}`),
          _dynamicModuleNames: existingDynamicModuleNames,
          _replacedModules: {},
          config: {
            addDynamicAudience: sinon.stub().throws(expectedError)
          },
          [moduleName]: existingStaticModule
        };

        fn = () => {
          ContxtSdk.prototype.mountDynamicModule.call(instance, moduleName, {
            ...expectedAudience,
            module: newDynamicModule
          });
        };
      });

      it('does not add the module to a list of mounted dynamic modules', function() {
        try {
          fn();
        } catch (e) {
          expect(instance._dynamicModuleNames).to.not.include(moduleName);
        }
      });

      it('does not save the existing non-dynamic module with the same namespace to be reattached when unmounting', function() {
        try {
          fn();
        } catch (e) {
          expect(instance._replacedModules[moduleName]).to.be.undefined;
        }
      });

      it('does not create a request module for the provided module', function() {
        try {
          fn();
        } catch (e) {
          expect(instance._createRequest).to.not.be.called;
        }
      });

      it('does not create a new instance of the provided module', function() {
        try {
          fn();
        } catch (e) {
          expect(newDynamicModule).to.not.be.called;
        }
      });

      it('does not replace the existing internal module', function() {
        try {
          fn();
        } catch (e) {
          expect(instance[moduleName]).to.equal(existingStaticModule);
        }
      });

      it('throws an error', function() {
        expect(fn).to.throw(expectedError);
      });
    });
  });

  describe('unmountDynamicModule', function() {
    context('when unmounting an external module is successful', function() {
      let expectedRemountedModule;
      let expectedRemovedModule;
      let instance;
      let moduleName;
      let remainingDynamicModules;

      beforeEach(function() {
        expectedRemountedModule = sinon.stub();
        expectedRemovedModule = sinon.stub();
        moduleName = faker.hacker.verb();
        remainingDynamicModules = times(
          faker.random.number({ min: 1, max: 10 })
        ).reduce((memo, index) => {
          memo[`${faker.hacker.adjective()}-${index}`] = sinon.stub();

          return memo;
        }, {});

        instance = {
          ...remainingDynamicModules,
          _dynamicModuleNames: [
            moduleName,
            ...Object.keys(remainingDynamicModules)
          ],
          _replacedModules: {
            ...Object.keys(remainingDynamicModules).reduce(
              (memo, remainingModuleName) => {
                memo[remainingModuleName] = sinon.stub();

                return memo;
              },
              {}
            ),
            [moduleName]: expectedRemountedModule
          },
          auth: {
            clearCurrentApiToken: sinon.stub()
          },
          config: {
            removeDynamicAudience: sinon.stub()
          },
          [moduleName]: expectedRemovedModule
        };

        ContxtSdk.prototype.unmountDynamicModule.call(instance, moduleName);
      });

      it('clears the stored access token', function() {
        expect(instance.auth.clearCurrentApiToken).to.be.calledWith(moduleName);
      });

      it('removes the dynamic audience', function() {
        expect(instance.config.removeDynamicAudience).to.be.calledWith();
      });

      it('removes the module from the sdk instance', function() {
        expect(instance[moduleName]).to.not.equal(expectedRemovedModule);
      });

      it('remounts the replaced static module of the same name', function() {
        expect(instance[moduleName]).to.equal(expectedRemountedModule);
      });

      it('leaves the remaining static modules untouched', function() {
        for (const remainingModuleName in remainingDynamicModules) {
          expect(instance[remainingModuleName]).to.equal(
            remainingDynamicModules[remainingModuleName]
          );
        }
      });

      it('removes the remounted module from the list of replaced modules', function() {
        expect(instance._replacedModules[moduleName]).to.be.undefined;
      });

      it('removes the module from the list of mounted dynamic modules', function() {
        expect(instance._dynamicModuleNames).to.not.include(moduleName);
      });
    });

    context('when unmounting a module is unsuccessful', function() {
      let externalModules;
      let instance;
      let internalModule;
      let internalModuleName;

      beforeEach(function() {
        internalModule = sinon.stub();
        internalModuleName = faker.hacker.verb();
        externalModules = times(
          faker.random.number({ min: 1, max: 10 })
        ).reduce((memo, index) => {
          memo[`${faker.hacker.adjective()}-${index}`] = sinon.stub();

          return memo;
        }, {});

        instance = {
          ...externalModules,
          _dynamicModuleNames: Object.keys(externalModules),
          _replacedModules: {
            ...Object.keys(externalModules).reduce(
              (memo, remainingModuleName) => {
                memo[remainingModuleName] = sinon.stub();

                return memo;
              },
              {}
            )
          },
          auth: {
            clearCurrentApiToken: sinon.stub()
          },
          config: { removeDynamicAudience: sinon.stub() },
          [internalModuleName]: internalModule
        };
      });

      context(
        'when attempting to unmount a module that does not exist in the list of dynamic audiences',
        function() {
          let fn;

          beforeEach(function() {
            fn = () =>
              ContxtSdk.prototype.unmountDynamicModule.call(
                instance,
                faker.lorem.word()
              );
          });

          it('does not delete the current api token', function() {
            try {
              fn();
            } catch (e) {
              expect(instance.auth.clearCurrentApiToken).to.not.be.called;
            }
          });

          it('leaves the static modules untouched', function() {
            try {
              fn();
            } catch (e) {
              expect(instance[internalModuleName]).to.equal(internalModule);
            }
          });

          it('leaves the dynamic modules untouched', function() {
            try {
              fn();
            } catch (e) {
              for (const externalModuleName in externalModules) {
                expect(instance[externalModuleName]).to.equal(
                  externalModules[externalModuleName]
                );
              }
            }
          });

          it('throws an error', function() {
            expect(fn).to.throw('There is no external module to unmount.');
          });
        }
      );

      context('when removing the dynamic audience fails', function() {
        let expectedError;
        let fn;

        beforeEach(function() {
          expectedError = new Error(faker.hacker.phrase());
          instance.config.removeDynamicAudience.throws(expectedError);

          fn = () =>
            ContxtSdk.prototype.unmountDynamicModule.call(
              instance,
              faker.random.arrayElement(Object.keys(externalModules))
            );
        });

        it('leaves the static modules untouched', function() {
          try {
            fn();
          } catch (e) {
            expect(instance[internalModuleName]).to.equal(internalModule);
          }
        });

        it('leaves the dynamic modules untouched', function() {
          try {
            fn();
          } catch (e) {
            for (const externalModuleName in externalModules) {
              expect(instance[externalModuleName]).to.equal(
                externalModules[externalModuleName]
              );
            }
          }
        });

        it('throws an error', function() {
          expect(fn).to.throw(expectedError);
        });
      });
    });
  });

  describe('_createAuthSession', function() {
    [
      { sessionType: 'auth0WebAuth', moduleName: 'Auth0WebAuth' },
      { sessionType: 'machineAuth', moduleName: 'MachineAuth' },
      { sessionType: 'passwordGrantAuth', moduleName: 'PasswordGrantAuth' }
    ].forEach(function(authSessionConfig) {
      it(`returns a new ${authSessionConfig.sessionType} session`, function() {
        const instance = { config: baseConfig };
        const expectedSession = faker.helpers.createTransaction();

        const authSessionStub = sinon
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
        (memo, index) => {
          const moduleName = `${faker.hacker.verb()}-${index}`;
          memo[moduleName] = { module: sinon.stub() };
          return memo;
        },
        {}
      );

      instance = {
        _createRequest: sinon
          .stub()
          .callsFake((moduleName) => `request module for: ${moduleName}`)
      };

      ContxtSdk.prototype._decorate.call(instance, externalModules);
    });

    it('creates new request modules for the provided modules', function() {
      for (const moduleName in externalModules) {
        expect(instance._createRequest).to.be.calledWith(moduleName);
      }
    });

    it('creates new instances of the provided modules', function() {
      for (const moduleName in externalModules) {
        expect(externalModules[moduleName].module).to.be.calledWithNew;
        expect(externalModules[moduleName].module).to.be.calledWith(
          instance,
          `request module for: ${moduleName}`
        );
      }
    });

    it('sets the new instances of the provided modules to the sdk instance', function() {
      for (const moduleName in externalModules) {
        expect(instance[moduleName]).to.be.an.instanceof(
          externalModules[moduleName].module
        );
      }
    });
  });
});

import times from 'lodash.times';
import Config from './index';
import defaultAudiences from './audiences';
import defaultConfigs from './defaults';

describe('Config', function() {
  beforeEach(function() {
    this.sandbox = sandbox.create();
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  describe('constructor', function() {
    let baseAuthConfigs;
    let baseConfigs;
    let config;
    let expectedAudiences;
    let getAudiences;

    beforeEach(function() {
      baseAuthConfigs = {
        clientId: faker.internet.password()
      };
      baseConfigs = {
        customModuleConfig: {},
        env: faker.hacker.noun(),
        externalModules: {}
      };
      expectedAudiences = fixture.build('defaultAudiences');

      getAudiences = this.sandbox.stub(Config.prototype, '_getAudiences').returns(expectedAudiences);

      config = new Config({ ...baseConfigs, auth: baseAuthConfigs });
    });

    it('assigns the user provided configs to the new config', function() {
      expect(config).to.include(baseConfigs);
    });

    it('gets a list of audiences for the environment', function() {
      expect(getAudiences).to.be.calledWith({
        customModuleConfig: baseConfigs.customModuleConfig,
        env: baseConfigs.env,
        externalModules: baseConfigs.externalModules
      });
    });

    it('assigns the audiences to the new config', function() {
      expect(config.audiences).to.equal(expectedAudiences);
    });

    it('assigns the default auth configs to the new config', function() {
      expect(config.auth).to.include(defaultConfigs.auth);
    });

    it('assigns the provided user auth configurations to the new config', function() {
      expect(config.auth).to.include(baseAuthConfigs);
    });
  });

  describe('_getAudiences', function() {
    let env;
    let expectedExternalAudiences;
    let expectedInternalAudiences;
    let getExternalAudiences;
    let getInternalAudiences;

    beforeEach(function() {
      env = faker.hacker.noun();
      expectedExternalAudiences = {
        facilities: fixture.build('audience'),
        [env]: fixture.build('audience')
      };
      expectedInternalAudiences = fixture.build('defaultAudiences');

      getExternalAudiences = this.sandbox.stub(Config.prototype, '_getExternalAudiences')
        .returns(expectedExternalAudiences);
      getInternalAudiences = this.sandbox.stub(Config.prototype, '_getInternalAudiences')
        .returns(expectedInternalAudiences);
    });

    context('when all values are provided', function() {
      let audiences;
      let initialCustomModuleConfig;
      let initialExternalModules;

      beforeEach(function() {
        initialCustomModuleConfig = {
          [faker.hacker.noun()]: fixture.build('audience')
        };
        initialExternalModules = {
          [faker.hacker.noun()]: {
            ...fixture.build('audience'),
            module: function() {}
          }
        };

        audiences = Config.prototype._getAudiences({
          env,
          audiences: defaultAudiences,
          customModuleConfig: initialCustomModuleConfig,
          externalModules: initialExternalModules
        });
      });

      it('gets the internal audiences', function() {
        expect(getInternalAudiences).to.be.calledWith({
          env,
          audiences: defaultAudiences,
          customModuleConfig: initialCustomModuleConfig
        });
      });

      it('gets the external audiences', function() {
        expect(getExternalAudiences).to.be.calledWith({
          externalModules: initialExternalModules
        });
      });

      it('combines the internal and external audiences with external audiences being preferred', function() {
        expect(audiences).to.deep.equal({
          contxtAuth: expectedInternalAudiences.contxtAuth,
          facilities: expectedExternalAudiences.facilities,
          [env]: expectedExternalAudiences[env]
        });
      });
    });

    context('when relying on default values', function() {
      beforeEach(function() {
        Config.prototype._getAudiences();
      });

      it('gets the internal audiences using default values', function() {
        expect(getInternalAudiences).to.be.calledWith({
          audiences: defaultAudiences,
          customModuleConfig: {},
          env: 'production'
        });
      });

      it('gets the external audiences using default values', function() {
        expect(getExternalAudiences).to.be.calledWith({
          externalModules: {}
        });
      });
    });
  });

  describe('_getExternalAudiences', function() {
    context('when external modules are provided with a clientId and host', function() {
      let audiences;
      let expectedAudiences;

      beforeEach(function() {
        const externalModules = {};
        expectedAudiences = {};

        times(faker.random.number({ min: 1, max: 10 }))
          .map(() => faker.hacker.noun())
          .forEach((moduleName) => {
            const audience = fixture.build('audience');
            expectedAudiences[moduleName] = audience;
            externalModules[moduleName] = {
              ...audience,
              module: function() {}
            };
          });

        audiences = Config.prototype._getExternalAudiences({ externalModules });
      });

      it('provides an object with the hosts and clientIds of the external modules', function() {
        expect(audiences).to.deep.equal(expectedAudiences);
      });
    });

    context('when external modules are provided by are missing a clientId or host', function() {
      it('throws an error when the clientId is not provided', function() {
        const fn = () => {
          Config.prototype._getExternalAudiences({
            externalModules: {
              [faker.hacker.noun()]: {
                host: faker.internet.url()
              }
            }
          });
        };

        expect(fn).to.throw('External modules must contain `clientId` and `host` properties');
      });

      it('throws an error when the host is not provided', function() {
        const fn = () => {
          Config.prototype._getExternalAudiences({
            externalModules: {
              [faker.hacker.noun()]: {
                clientId: faker.internet.url()
              }
            }
          });
        };

        expect(fn).to.throw('External modules must contain `clientId` and `host` properties');
      });
    });
  });

  describe('_getInternalAudiences', function() {
    context('when using provided audience information across all services', function() {
      let audiences;
      let expectedAudiences;

      beforeEach(function() {
        const env = faker.hacker.noun();
        expectedAudiences = fixture.build('defaultAudiences');
        const initialAudiences = {
          contxtAuth: {
            [env]: expectedAudiences.contxtAuth,
            [faker.hacker.verb()]: fixture.build('audience')
          },
          facilities: {
            [env]: expectedAudiences.facilities,
            [faker.hacker.verb()]: fixture.build('audience')
          }
        };

        audiences = Config.prototype._getInternalAudiences({
          env,
          audiences: initialAudiences,
          customModuleConfig: {}
        });
      });

      it('provides audience information for the specified environment', function() {
        expect(audiences).to.deep.equal(expectedAudiences);
      });
    });

    context('when specifying a different environment for a specific module', function() {
      let audiences;
      let expectedAudiences;

      beforeEach(function() {
        const env = faker.hacker.noun();
        const facilitiesEnv = faker.hacker.verb();
        expectedAudiences = fixture.build('defaultAudiences');
        const initialAudiences = {
          contxtAuth: {
            [env]: expectedAudiences.contxtAuth,
            [faker.hacker.verb()]: fixture.build('audience')
          },
          facilities: {
            [env]: fixture.build('audience'),
            [facilitiesEnv]: expectedAudiences.facilities,
            [faker.hacker.verb()]: fixture.build('audience')
          }
        };

        audiences = Config.prototype._getInternalAudiences({
          env,
          audiences: initialAudiences,
          customModuleConfig: {
            facilities: {
              env: facilitiesEnv
            }
          }
        });
      });

      it('provides audience information that matches the specific module environments provided', function() {
        expect(audiences).to.deep.equal(expectedAudiences);
      });
    });

    context('when providing a custom environment for a module', function() {
      context('when all required custom configuration is provided in the right format', function() {
        let audiences;
        let expectedAudiences;

        beforeEach(function() {
          const env = faker.hacker.noun();
          expectedAudiences = fixture.build('defaultAudiences');
          const initialAudiences = {
            contxtAuth: {
              [env]: expectedAudiences.contxtAuth,
              [faker.hacker.verb()]: fixture.build('audience')
            },
            facilities: {
              [env]: fixture.build('audience'),
              [faker.hacker.verb()]: fixture.build('audience')
            }
          };

          audiences = Config.prototype._getInternalAudiences({
            env,
            audiences: initialAudiences,
            customModuleConfig: {
              facilities: expectedAudiences.facilities
            }
          });
        });

        it('provides audience information that matches the custom module environment provided', function() {
          expect(audiences).to.deep.equal(expectedAudiences);
        });
      });

      context('when there is missing or malformed custom configuration information', function() {
        it('throws an error when missing the clientId', function() {
          const fn = () => {
            const env = faker.hacker.noun();
            Config.prototype._getInternalAudiences({
              env,
              audiences: {
                facilities: {
                  [env]: fixture.build('audience')
                }
              },
              customModuleConfig: {
                facilities: {
                  host: faker.internet.url()
                }
              }
            });
          };

          expect(fn).to.throw('Custom module configurations must either contain a `host` and `clientId` or specify a specific target environment via the `env` property');
        });

        it('throws an error when missing the host', function() {
          const fn = () => {
            const env = faker.hacker.noun();
            Config.prototype._getInternalAudiences({
              env,
              audiences: {
                facilities: {
                  [env]: fixture.build('audience')
                }
              },
              customModuleConfig: {
                facilities: {
                  clientId: faker.internet.password()
                }
              }
            });
          };

          expect(fn).to.throw('Custom module configurations must either contain a `host` and `clientId` or specify a specific target environment via the `env` property');
        });

        it('throws an error when the configuration is malformed', function() {
          const fn = () => {
            const env = faker.hacker.noun();
            Config.prototype._getInternalAudiences({
              env,
              audiences: {
                facilities: {
                  [env]: fixture.build('audience')
                }
              },
              customModuleConfig: {
                facilities: [faker.internet.password(), faker.internet.url()]
              }
            });
          };

          expect(fn).to.throw('Custom module configurations must either contain a `host` and `clientId` or specify a specific target environment via the `env` property');
        });
      });
    });
  });
});

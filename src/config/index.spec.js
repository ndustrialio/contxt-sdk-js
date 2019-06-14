import times from 'lodash.times';
import Config from './index';
import defaultAudiences from './audiences';
import defaultConfigs from './defaults';

describe('Config', function() {
  beforeEach(function() {
    this.sandbox = sinon.createSandbox();
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  describe('constructor', function() {
    let authConfigs;
    let baseConfigs;
    let config;
    let expectedAudiences;
    let expectedExternalModules;
    let getAudiences;
    let interceptorConfigs;

    beforeEach(function() {
      authConfigs = {
        clientId: faker.internet.password(),
        customModuleConfigs: {
          [faker.hacker.adjective()]: fixture.build('audience')
        },
        env: faker.hacker.adjective()
      };
      baseConfigs = {
        [faker.lorem.word()]: faker.helpers.createTransaction()
      };
      expectedAudiences = fixture.build('defaultAudiences');
      expectedExternalModules = {
        [faker.hacker.verb()]: {
          ...fixture.build('audience'),
          module: function() {}
        }
      };
      interceptorConfigs = {
        [faker.lorem.word()]: [
          {
            fulfilled: function() {},
            rejected: function() {}
          }
        ]
      };

      getAudiences = this.sandbox
        .stub(Config.prototype, '_getAudiences')
        .returns(expectedAudiences);

      config = new Config(
        { ...baseConfigs, auth: authConfigs, interceptors: interceptorConfigs },
        expectedExternalModules
      );
    });

    it('assigns the user provided configs to the new config', function() {
      expect(config).to.include(baseConfigs);
    });

    it('gets a list of audiences for the environment', function() {
      expect(getAudiences).to.be.calledWith({
        customModuleConfigs: authConfigs.customModuleConfigs,
        env: authConfigs.env,
        externalModules: expectedExternalModules
      });
    });

    it('assigns the audiences to the new config', function() {
      expect(config.audiences).to.equal(expectedAudiences);
    });

    it('assigns the default auth configs to the new config', function() {
      expect(config.auth).to.include(defaultConfigs.auth);
    });

    it('assigns the provided user auth configurations to the new config', function() {
      expect(config.auth).to.include(authConfigs);
    });

    it('assigns the default interceptors to the new config', function() {
      expect(config.interceptors).to.include(defaultConfigs.interceptors);
    });

    it('assings the provided user interceptors to the new config', function() {
      expect(config.interceptors).to.include(interceptorConfigs);
    });
  });

  describe('_getAudienceFromCustomConfig', function() {
    context(
      'when providing a custom host and clientId for a module',
      function() {
        let audiences;
        let expectedAudience;

        beforeEach(function() {
          const env = faker.hacker.adjective();
          expectedAudience = fixture.build('audience');
          const config = { ...expectedAudience, env };
          const initialAudiences = {
            [env]: fixture.build('audience'),
            [faker.hacker.verb()]: fixture.build('audience')
          };

          audiences = Config.prototype._getAudienceFromCustomConfig(
            config,
            initialAudiences
          );
        });

        it('provides audience information that matches the custom information provided', function() {
          expect(audiences).to.deep.equal(expectedAudience);
        });
      }
    );

    context(
      'when providing a custom host, clientId, and webSocket for a module',
      function() {
        let audiences;
        let expectedAudience;

        beforeEach(function() {
          const env = faker.hacker.adjective();
          expectedAudience = fixture.build('audience', {
            webSocket: faker.internet.url()
          });
          const config = { ...expectedAudience, env };
          const initialAudiences = {
            [env]: fixture.build('audience'),
            [faker.hacker.verb()]: fixture.build('audience')
          };

          audiences = Config.prototype._getAudienceFromCustomConfig(
            config,
            initialAudiences
          );
        });

        it('provides audience information that matches the custom information provided', function() {
          expect(audiences).to.deep.equal(expectedAudience);
          expect(audiences).to.have.property('webSocket');
        });
      }
    );

    context(
      'when providing a custom host and clientId with a property we do not use',
      function() {
        let audiences;
        let expectedAudience;
        let invalidPropertyName;

        beforeEach(function() {
          const env = faker.hacker.adjective();
          invalidPropertyName = 'invalid';
          expectedAudience = fixture.build('audience', {
            [invalidPropertyName]: faker.internet.url()
          });
          const config = { ...expectedAudience, env };
          const initialAudiences = {
            [env]: fixture.build('audience'),
            [faker.hacker.verb()]: fixture.build('audience')
          };

          audiences = Config.prototype._getAudienceFromCustomConfig(
            config,
            initialAudiences
          );
        });

        it('provides audience information that has the host and clientId but no unused property', function() {
          expect(audiences.host).to.equal(expectedAudience.host);
          expect(audiences.clientId).to.equal(expectedAudience.clientId);
          expect(audiences).to.not.have.property(invalidPropertyName);
        });
      }
    );

    context('when providing an environment for a module', function() {
      let audiences;
      let expectedAudience;

      beforeEach(function() {
        const env = faker.hacker.adjective();
        expectedAudience = fixture.build('audience');
        const config = { env };
        const initialAudiences = {
          [env]: expectedAudience,
          [faker.hacker.verb()]: fixture.build('audience')
        };

        audiences = Config.prototype._getAudienceFromCustomConfig(
          config,
          initialAudiences
        );
      });

      it('provides audience information that matches the custom module environment provided', function() {
        expect(audiences).to.deep.equal(expectedAudience);
      });
    });

    context(
      'when there is missing or malformed custom configuration information',
      function() {
        let initialAudiences;

        beforeEach(function() {
          const env = faker.hacker.adjective();
          initialAudiences = {
            facilities: {
              [env]: fixture.build('audience')
            }
          };
        });

        it('throws an error when missing the clientId', function() {
          const fn = () => {
            const config = {
              facilities: {
                host: faker.internet.url()
              }
            };
            Config.prototype._getAudienceFromCustomConfig(
              config,
              initialAudiences
            );
          };

          expect(fn).to.throw(
            'Custom module configurations must either contain a `host` and `clientId` or specify a specific target environment via the `env` property'
          );
        });

        it('throws an error when missing the host', function() {
          const fn = () => {
            const config = {
              facilities: {
                clientId: faker.internet.password()
              }
            };
            Config.prototype._getAudienceFromCustomConfig(
              config,
              initialAudiences
            );
          };

          expect(fn).to.throw(
            'Custom module configurations must either contain a `host` and `clientId` or specify a specific target environment via the `env` property'
          );
        });

        it('throws an error when the configuration is malformed', function() {
          const fn = () => {
            const config = {
              facilities: [faker.internet.password(), faker.internet.url()]
            };
            Config.prototype._getAudienceFromCustomConfig(
              config,
              initialAudiences
            );
          };

          expect(fn).to.throw(
            'Custom module configurations must either contain a `host` and `clientId` or specify a specific target environment via the `env` property'
          );
        });
      }
    );
  });

  describe('_getAudiences', function() {
    let env;
    let expectedExternalAudiences;
    let expectedInternalAudiences;
    let getExternalAudiences;
    let getInternalAudiences;

    beforeEach(function() {
      env = faker.hacker.adjective();
      expectedExternalAudiences = {
        facilities: fixture.build('audience'),
        [env]: fixture.build('audience')
      };
      expectedInternalAudiences = fixture.build('defaultAudiences');

      getExternalAudiences = this.sandbox
        .stub(Config.prototype, '_getExternalAudiences')
        .returns(expectedExternalAudiences);
      getInternalAudiences = this.sandbox
        .stub(Config.prototype, '_getInternalAudiences')
        .returns(expectedInternalAudiences);
    });

    context('when all values are provided', function() {
      let audiences;
      let initialCustomModuleConfig;
      let initialExternalModules;

      beforeEach(function() {
        initialCustomModuleConfig = {
          [faker.hacker.adjective()]: fixture.build('audience')
        };
        initialExternalModules = {
          [faker.hacker.adjective()]: {
            ...fixture.build('audience'),
            module: function() {}
          }
        };

        audiences = Config.prototype._getAudiences({
          env,
          audiences: defaultAudiences,
          customModuleConfigs: initialCustomModuleConfig,
          externalModules: initialExternalModules
        });
      });

      it('gets the internal audiences', function() {
        expect(getInternalAudiences).to.be.calledWith({
          env,
          audiences: defaultAudiences,
          customModuleConfigs: initialCustomModuleConfig
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
          customModuleConfigs: {},
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
    context(
      'when external modules are provided with a clientId and host',
      function() {
        let audiences;
        let expectedAudiences;

        beforeEach(function() {
          const externalModules = {};
          expectedAudiences = {};

          times(faker.random.number({ min: 1, max: 10 }))
            .map(() => faker.hacker.adjective())
            .forEach((moduleName) => {
              const audience = fixture.build('audience');
              expectedAudiences[moduleName] = audience;
              externalModules[moduleName] = {
                ...audience,
                module: function() {}
              };
            });

          audiences = Config.prototype._getExternalAudiences({
            externalModules
          });
        });

        it('provides an object with the hosts and clientIds of the external modules', function() {
          expect(audiences).to.deep.equal(expectedAudiences);
        });
      }
    );

    context(
      'when external modules are provided with a null clientId and host',
      function() {
        let audiences;
        let expectedAudiences;

        beforeEach(function() {
          const externalModules = {};
          expectedAudiences = {};

          times(faker.random.number({ min: 1, max: 10 }))
            .map(() => faker.hacker.adjective())
            .forEach((moduleName) => {
              const audience = fixture.build('audience', {
                clientId: null,
                host: null
              });
              expectedAudiences[moduleName] = audience;
              externalModules[moduleName] = {
                ...audience,
                module: function() {}
              };
            });

          audiences = Config.prototype._getExternalAudiences({
            externalModules
          });
        });

        it('provides an object with the null hosts and clientIds of the external modules', function() {
          expect(audiences).to.deep.equal(expectedAudiences);
        });
      }
    );

    context(
      'when external modules are provided by are missing a clientId or host',
      function() {
        it('throws an error when the clientId is not provided', function() {
          const fn = () => {
            Config.prototype._getExternalAudiences({
              externalModules: {
                [faker.hacker.adjective()]: {
                  host: faker.internet.url()
                }
              }
            });
          };

          expect(fn).to.throw(
            'External modules must contain `clientId` and `host` properties'
          );
        });

        it('throws an error when the host is not provided', function() {
          const fn = () => {
            Config.prototype._getExternalAudiences({
              externalModules: {
                [faker.hacker.adjective()]: {
                  clientId: faker.internet.url()
                }
              }
            });
          };

          expect(fn).to.throw(
            'External modules must contain `clientId` and `host` properties'
          );
        });
      }
    );
  });

  describe('_getInternalAudiences', function() {
    context(
      'when using the same audience environment across all modules',
      function() {
        let audiences;
        let expectedAudiences;

        beforeEach(function() {
          const env = faker.hacker.adjective();
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
            customModuleConfigs: {}
          });
        });

        it('provides audience information for the specified environment', function() {
          expect(audiences).to.deep.equal(expectedAudiences);
        });
      }
    );

    context('when a module uses a custom configuration', function() {
      let audiences;
      let expectedAudiences;
      let expectedFacilitiesConfig;
      let expectedModuleAudiences;
      let getAudienceFromCustomConfig;

      beforeEach(function() {
        const env = faker.hacker.adjective();
        const facilitiesEnv = faker.lorem.word();
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
        expectedModuleAudiences = initialAudiences.facilities;
        expectedFacilitiesConfig = { env: facilitiesEnv };

        getAudienceFromCustomConfig = this.sandbox
          .stub(Config.prototype, '_getAudienceFromCustomConfig')
          .returns(expectedAudiences.facilities);

        audiences = Config.prototype._getInternalAudiences({
          env,
          audiences: initialAudiences,
          customModuleConfigs: {
            facilities: expectedFacilitiesConfig
          }
        });
      });

      it('gets the audience from the custom config', function() {
        expect(getAudienceFromCustomConfig).to.be.calledWith(
          expectedFacilitiesConfig,
          expectedModuleAudiences
        );
      });

      it('provides audience information that matches the specific module environments provided', function() {
        expect(audiences).to.deep.equal(expectedAudiences);
      });
    });
  });
});

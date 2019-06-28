import omit from 'lodash.omit';
import times from 'lodash.times';
import Config from './index';
import defaultAudiences from './audiences';
import defaultConfigs from './defaults';

describe('Config', function() {
  afterEach(function() {
    sinon.restore();
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

      getAudiences = sinon
        .stub(Config.prototype, '_getAudiences')
        .returns(expectedAudiences);

      config = new Config(
        { ...baseConfigs, auth: authConfigs, interceptors: interceptorConfigs },
        expectedExternalModules
      );
    });

    it('creates an empty array for keeping track of dynamic audiences', function() {
      expect(config._dynamicAudienceNames).to.be.an('array');
      expect(config._dynamicAudienceNames).to.be.empty;
    });

    it('creates an empty object for keeping track of replaced audiences', function() {
      expect(config._replacedAudiences).to.be.an('object');
      expect(config._replacedAudiences).to.be.empty;
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

  describe('addDynamicAudience', function() {
    context(
      'when providing a client ID and host for a new dynamic audience',
      function() {
        let audienceName;
        let config;
        let existingDynamicAudiences;
        let existingInternalAudience;
        let expectedDynamicAudience;

        beforeEach(function() {
          audienceName = faker.hacker.adjective();

          existingDynamicAudiences = times(
            faker.random.number({ min: 1, max: 3 })
          ).reduce((memo, index) => {
            memo[`${faker.lorem.word()}-${index}`] = fixture.build('audience');

            return memo;
          }, {});
          existingInternalAudience = fixture.build('audience');
          expectedDynamicAudience = fixture.build('audience');

          const userConfig = {
            auth: {
              clientId: faker.internet.password(),
              env: faker.hacker.adjective()
            }
          };
          config = new Config(userConfig);
          config._dynamicAudienceNames = Object.keys(existingDynamicAudiences);
          config.audiences = {
            ...config.audiences,
            [audienceName]: existingInternalAudience,
            ...existingDynamicAudiences
          };

          config.addDynamicAudience(audienceName, expectedDynamicAudience);
        });

        it('adds the audience to a list of dynamically added audiences', function() {
          expect(config._dynamicAudienceNames).to.include(audienceName);
          expect(config._dynamicAudienceNames).to.include(
            ...Object.keys(existingDynamicAudiences)
          );
        });

        it('saves any existing non-dynamic audience with the same name to be reattached later', function() {
          expect(config._replacedAudiences[audienceName]).to.equal(
            existingInternalAudience
          );
        });

        it('set the audience to the config object', function() {
          expect(config.audiences[audienceName]).to.deep.equal(
            expectedDynamicAudience
          );
        });
      }
    );

    context(
      'when providing a client ID and host for a dynamic audience that already exists',
      function() {
        let audienceName;
        let config;
        let existingAudience;
        let fn;

        beforeEach(function() {
          audienceName = faker.hacker.adjective();
          existingAudience = fixture.build('audience');

          const userConfig = {
            auth: {
              clientId: faker.internet.password(),
              env: faker.hacker.adjective()
            }
          };
          config = new Config(userConfig);
          config._dynamicAudienceNames = [audienceName];
          config.audiences = {
            ...config.audiences,
            [audienceName]: existingAudience
          };

          fn = () => {
            return config.addDynamicAudience(
              audienceName,
              fixture.build('audience')
            );
          };
        });

        it('does not replace the existing dynamic audience', function() {
          try {
            fn();
          } catch (e) {
            expect(config.audiences[audienceName]).to.equal(existingAudience);
          }
        });

        it('throws an error', function() {
          expect(fn).to.throw(
            `A dynamic audience of the name \`${audienceName}\` already exists. This problem can be rectified by using a different name for the audience.`
          );
        });
      }
    );

    context('when missing a clientId or host', function() {
      let audience;
      let audienceName;
      let config;

      beforeEach(function() {
        audienceName = faker.hacker.adjective();
        audience = fixture.build('audience');

        const userConfig = {
          auth: {
            clientId: faker.internet.password(),
            env: faker.hacker.adjective()
          }
        };
        config = new Config(userConfig);
      });

      ['clientId', 'host'].forEach(function(missingProperty) {
        it(`throws an error when the ${missingProperty} is not provided`, function() {
          const fn = () => {
            return config.addDynamicAudience(
              audienceName,
              omit(audience, [missingProperty])
            );
          };

          expect(fn).to.throw(
            'A dynamic audience must contain `clientId` and `host` properties'
          );
        });
      });
    });
  });

  describe('removeDynamicAudience', function() {
    context('when successfully removing a dynamic audience', function() {
      let audienceName;
      let config;
      let existingStaticAudiences;
      let expectedReaddedAudience;
      let expectedRemovedAudience;
      let remainingDynamicAudiences;

      beforeEach(function() {
        audienceName = faker.hacker.adjective();

        expectedReaddedAudience = fixture.build('audience');
        expectedRemovedAudience = fixture.build('audience');
        remainingDynamicAudiences = times(
          faker.random.number({ min: 1, max: 3 })
        ).reduce((memo, index) => {
          memo[`${faker.hacker.adjective()}-${index}`] = fixture.build(
            'audience'
          );

          return memo;
        }, {});

        const userConfig = {
          auth: {
            clientId: faker.internet.password(),
            env: faker.hacker.adjective()
          }
        };
        config = new Config(userConfig);
        existingStaticAudiences = { ...config.audiences };
        config._dynamicAudienceNames = [
          Object.keys(remainingDynamicAudiences),
          audienceName
        ];
        config._replacedAudiences = { [audienceName]: expectedReaddedAudience };
        config.audiences = {
          ...config.audiences,
          ...remainingDynamicAudiences,
          [audienceName]: expectedRemovedAudience
        };

        config.removeDynamicAudience(audienceName);
      });

      it('removes the dynamic audience from the audience object', function() {
        expect(config.audiences[audienceName]).to.not.equal(
          expectedRemovedAudience
        );
      });

      it('remounts the replaced static audience of the same name', function() {
        expect(config.audiences[audienceName]).to.equal(
          expectedReaddedAudience
        );
      });

      [
        { type: 'static', audiences: existingStaticAudiences },
        { type: 'dynamic', audiences: remainingDynamicAudiences }
      ].forEach(function({ audiences, type }) {
        it(`leaves the ${type} audiences untouched`, function() {
          for (const name in audiences) {
            expect(config.audiences[name]).to.equal(audiences[name]);
          }
        });
      });

      it('removes the readded static audience from the list of replaced audiences', function() {
        expect(config._replacedAudiences[audienceName]).to.be.undefined;
      });

      it('removes the dynamic audience from the list of dynamic audiences', function() {
        expect(config._dynamicAudienceNames).to.not.include(audienceName);
      });
    });

    context(
      'when attempting to removing an audience that does not exist in the list of dynamic audiences',
      function() {
        let config;
        let dynamicAudiences;
        let fn;
        let staticAudiences;

        beforeEach(function() {
          dynamicAudiences = times(
            faker.random.number({ min: 1, max: 3 })
          ).reduce((memo, index) => {
            memo[`${faker.hacker.adjective()}-${index}`] = fixture.build(
              'audience'
            );

            return memo;
          }, {});

          const userConfig = {
            auth: {
              clientId: faker.internet.password(),
              env: faker.hacker.adjective()
            }
          };
          config = new Config(userConfig);
          staticAudiences = { ...config.audiences };
          config._dynamicAudienceNames = Object.keys(dynamicAudiences);
          config.audiences = {
            ...config.audiences,
            ...dynamicAudiences
          };

          fn = () => {
            config.removeDynamicAudience(faker.lorem.word());
          };
        });

        [
          { type: 'static', audiences: staticAudiences },
          { type: 'dynamic', audiences: dynamicAudiences }
        ].forEach(function({ audiences, type }) {
          it(`leaves the ${type} audiences untouched`, function() {
            try {
              fn();
            } catch (e) {
              for (const name in audiences) {
                expect(config.audiences[name]).to.equal(audiences[name]);
              }
            }
          });
        });

        it('throws an error', function() {
          expect(fn).to.throw('There is no dynamic audience to remove.');
        });
      }
    );
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

      getExternalAudiences = sinon
        .stub(Config.prototype, '_getExternalAudiences')
        .returns(expectedExternalAudiences);
      getInternalAudiences = sinon
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

        getAudienceFromCustomConfig = sinon
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

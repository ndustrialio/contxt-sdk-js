import Config from './index';
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
        [faker.hacker.noun()]: faker.internet.password()
      };
      baseConfigs = {
        env: faker.hacker.noun(),
        customModuleConfig: {}
      };
      expectedAudiences = fixture.buildList('audience', faker.random.number({ min: 1, max: 10 }));

      getAudiences = this.sandbox.stub(Config.prototype, '_getAudiences').returns(expectedAudiences);

      config = new Config({ ...baseConfigs, auth: baseAuthConfigs });
    });

    it('assigns the user provided configs to the new config', function() {
      expect(config).to.include(baseConfigs);
    });

    it('gets a list of audiences for the environment', function() {
      expect(getAudiences).to.be.calledWith({
        env: baseConfigs.env,
        customModuleConfig: baseConfigs.customModuleConfig
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
    context('when no environment is provided', function() {
      it('provides an object with the hosts and clientIds of the production environment', function() {
        let audiences;
        let expectedAudiences;

        beforeEach(function() {
          expectedAudiences = {
            contxtAuth: fixture.build('audience'),
            facilities: fixture.build('audience')
          };
          const initialAudiences = {
            contxtAuth: {
              production: expectedAudiences.contxtAuth,
              [faker.hacker.verb()]: fixture.build('audience')
            },
            facilities: {
              production: expectedAudiences.facilities,
              [faker.hacker.verb()]: fixture.build('audience')
            }
          };

          audiences = Config.prototype._getAudiences({ audiences: initialAudiences });
        });

        it('provides an object with the hosts and clientIds of that environment', function() {
          expect(audiences).to.deep.equal(expectedAudiences);
        });
      });
    });

    context('when an environment is provided', function() {
      let audiences;
      let expectedAudiences;

      beforeEach(function() {
        const env = faker.hacker.noun();
        expectedAudiences = {
          contxtAuth: fixture.build('audience'),
          facilities: fixture.build('audience')
        };
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

        audiences = Config.prototype._getAudiences({ env, audiences: initialAudiences });
      });

      it('provides an object with the hosts and clientIds of that environment', function() {
        expect(audiences).to.deep.equal(expectedAudiences);
      });
    });

    context('when an environment is provided for an individual module', function() {
      let audiences;
      let expectedAudiences;

      beforeEach(function() {
        const env = faker.hacker.noun();
        expectedAudiences = {
          contxtAuth: fixture.build('audience'),
          facilities: fixture.build('audience')
        };
        const initialAudiences = {
          contxtAuth: {
            [env]: expectedAudiences.contxtAuth,
            production: fixture.build('audience')
          },
          facilities: {
            production: expectedAudiences.facilities,
            [faker.hacker.verb()]: fixture.build('audience')
          }
        };

        audiences = Config.prototype._getAudiences({
          audiences: initialAudiences,
          customModuleConfig: {
            contxtAuth: {
              env
            }
          }
        });
      });

      it('provides an object with the hosts and clientIds of that environment', function() {
        expect(audiences).to.deep.equal(expectedAudiences);
      });
    });

    context('when providing a custom envornment for a module', function() {
      context('when all required custom configuration is provided in the right format', function() {
        let audiences;
        let expectedAudiences;

        beforeEach(function() {
          expectedAudiences = {
            contxtAuth: fixture.build('audience'),
            facilities: fixture.build('audience')
          };
          const initialAudiences = {
            contxtAuth: {
              production: expectedAudiences.contxtAuth,
              [faker.hacker.verb()]: fixture.build('audience')
            },
            facilities: {
              production: fixture.build('audience'),
              [faker.hacker.verb()]: fixture.build('audience')
            }
          };

          audiences = Config.prototype._getAudiences({
            audiences: initialAudiences,
            customModuleConfig: {
              facilities: expectedAudiences.facilities
            }
          });
        });

        it('provides an object with the default hosts and clientIds combined with the custom host and clientId', function() {
          expect(audiences).to.deep.equal(expectedAudiences);
        });
      });

      context('when there is missing custom configuration or the custom configuration is not formatted correctly', function() {
        it('throws an error when missing the host', function() {
          const fn = () => {
            Config.prototype._getAudiences({
              customModuleConfig: {
                facilities: {
                  clientId: faker.internet.password()
                }
              }
            });
          };

          expect(fn).to.throw('Custom module configurations must either contain a `host` and `clientId` or specify a specific target environment via the `env` property');
        });

        it('throws an error when missing the clientId', function() {
          const fn = () => {
            Config.prototype._getAudiences({
              customModuleConfig: {
                facilities: {
                  host: faker.internet.url()
                }
              }
            });
          };

          expect(fn).to.throw('Custom module configurations must either contain a `host` and `clientId` or specify a specific target environment via the `env` property');
        });

        it('throws an error when in an unexpected format', function() {
          const fn = () => {
            Config.prototype._getAudiences({
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

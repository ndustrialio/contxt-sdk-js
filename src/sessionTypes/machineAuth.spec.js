import axios from 'axios';
import times from 'lodash.times';
import MachineAuth from './machineAuth';

describe('sessionTypes/MachineAuth', function() {
  let sdk;

  beforeEach(function() {
    sdk = {
      config: {
        audiences: {
          contxtAuth: fixture.build('audience')
        },
        auth: {
          clientId: faker.internet.password(),
          clientSecret: faker.internet.password()
        }
      }
    };
  });

  afterEach(function() {
    sinon.restore();
  });

  describe('constructor', function() {
    context('with all required config options', function() {
      let machineAuth;

      beforeEach(function() {
        machineAuth = new MachineAuth(sdk);
      });

      it('appends the supplied sdk to the class instance', function() {
        expect(machineAuth._sdk).to.equal(sdk);
      });

      it('sets an initial, empty session info state', function() {
        expect(machineAuth._sessionInfo).to.be.an('object');
        expect(machineAuth._sessionInfo).to.be.empty;
      });
    });

    context('without required config options', function() {
      it('throws an error when no clientId is provided', function() {
        delete sdk.config.auth.clientId;
        const fn = () => new MachineAuth(sdk);

        expect(fn).to.throw('clientId is required for the MachineAuth config');
      });

      it('throws an error when no clientSecret is provided', function() {
        delete sdk.config.auth.clientSecret;
        const fn = () => new MachineAuth(sdk);

        expect(fn).to.throw(
          'clientSecret is required for the MachineAuth config'
        );
      });
    });
  });

  describe('clearCurrentApiToken', function() {
    context(
      'when deleting an existing token where the request to acquire the token has completed',
      function() {
        let audienceNameToDelete;
        let machineAuth;
        let promise;

        beforeEach(function() {
          audienceNameToDelete = faker.random.arrayElement(
            Object.keys(sdk.config.audiences)
          );

          machineAuth = new MachineAuth(sdk);
          machineAuth._sessionInfo = Object.keys(sdk.config.audiences).reduce(
            (memo, audienceName) => {
              memo[audienceName] = {
                apiToken: faker.internet.password(),
                expiresAt: Date.now() + 7200 * 1000
              };

              return memo;
            },
            {}
          );

          promise = machineAuth.clearCurrentApiToken(audienceNameToDelete);
        });

        it('removes the session info', function() {
          return promise.then(() => {
            expect(machineAuth._sessionInfo[audienceNameToDelete]).to.be
              .undefined;
          });
        });

        it('returns a resolved promise', function() {
          return expect(promise).to.be.fulfilled;
        });
      }
    );

    context(
      'when deleting an token where the request to acquire the token has not yet completed',
      function() {
        let audienceNameToDelete;
        let machineAuth;
        let promise;

        beforeEach(function() {
          audienceNameToDelete = faker.random.arrayElement(
            Object.keys(sdk.config.audiences)
          );

          machineAuth = new MachineAuth(sdk);
          machineAuth._sessionInfo = Object.keys(sdk.config.audiences).reduce(
            (memo, audienceName) => {
              if (audienceName !== audienceNameToDelete) {
                memo[audienceName] = {
                  apiToken: faker.internet.password(),
                  expiresAt: Date.now() + 7200 * 1000
                };
              }

              return memo;
            },
            {}
          );
          machineAuth._tokenPromises = Object.keys(sdk.config.audiences).reduce(
            (memo, audienceName) => {
              if (audienceName === audienceNameToDelete) {
                memo[audienceName] = Promise.resolve({
                  apiToken: faker.internet.password(),
                  expiresAt: Date.now() + 7200 * 1000
                }).then(() => {
                  machineAuth._tokenPromises[audienceName] = null;
                });
              }

              return memo;
            },
            {}
          );

          promise = machineAuth.clearCurrentApiToken(audienceNameToDelete);
        });

        it('removes the session info', function() {
          return promise.then(() => {
            expect(machineAuth._sessionInfo[audienceNameToDelete]).to.be
              .undefined;
          });
        });

        it('returns a resolved promise', function() {
          return expect(promise).to.be.fulfilled;
        });
      }
    );

    context(
      'when attempting to delete an access token that does not currently exist',
      function() {
        let machineAuth;
        let promise;

        beforeEach(function() {
          machineAuth = new MachineAuth(sdk);
          machineAuth._sessionInfo = Object.keys(sdk.config.audiences).reduce(
            (memo, audienceName) => {
              memo[audienceName] = {
                apiToken: faker.internet.password(),
                expiresAt: Date.now() + 7200 * 1000
              };

              return memo;
            },
            {}
          );

          promise = machineAuth.clearCurrentApiToken(faker.hacker.adjective());
        });

        it('returns a resolved promise', function() {
          return expect(promise).to.be.fulfilled;
        });
      }
    );
  });

  describe('getCurrentApiToken', function() {
    let expectedApiToken;
    let expectedAudienceName;
    let expectedSessionInfo;
    let getNewSessionInfo;
    let isAuthenticated;
    let promise;

    beforeEach(function() {
      expectedApiToken = faker.internet.password();
      expectedAudienceName = faker.hacker.adjective();
      expectedSessionInfo = {
        apiToken: expectedApiToken,
        expiresAt: faker.date.future().getTime()
      };

      getNewSessionInfo = sinon
        .stub(MachineAuth.prototype, '_getNewSessionInfo')
        .resolves(expectedSessionInfo);
    });

    context('when getting a new token', function() {
      beforeEach(function() {
        isAuthenticated = sinon
          .stub(MachineAuth.prototype, 'isAuthenticated')
          .returns(false);

        const machineAuth = new MachineAuth(sdk);
        promise = machineAuth.getCurrentApiToken(expectedAudienceName);
      });

      it('checks if the audience already has a valid token', function() {
        expect(isAuthenticated).to.be.calledWith(expectedAudienceName);
      });

      it('gets new session info', function() {
        expect(getNewSessionInfo).to.be.calledWith(expectedAudienceName);
      });

      it('returns a promise with the new apiToken', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.equal(
          expectedApiToken
        );
      });
    });

    context('when using a previously acquired token', function() {
      beforeEach(function() {
        isAuthenticated = sinon
          .stub(MachineAuth.prototype, 'isAuthenticated')
          .returns(true);

        const machineAuth = new MachineAuth(sdk);
        machineAuth._sessionInfo = {
          [expectedAudienceName]: {
            apiToken: expectedApiToken,
            expiresAt: faker.date.future().getTime()
          }
        };
        promise = machineAuth.getCurrentApiToken(expectedAudienceName);
      });

      it('does not attempt to get a new token', function() {
        expect(getNewSessionInfo).to.not.be.called;
      });

      it('returns a promise with the previously acquired apiToken', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.equal(
          expectedApiToken
        );
      });
    });
  });

  describe('isAuthenticated', function() {
    let audienceName;
    let machineAuth;

    beforeEach(function() {
      audienceName = faker.hacker.adjective();
      machineAuth = new MachineAuth(sdk);
    });

    it('returns true when the expiresAt info is in the future', function() {
      machineAuth._sessionInfo = {
        [audienceName]: {
          apiToken: faker.internet.url(),
          expiresAt: faker.date.future().getTime()
        }
      };

      const isAuthenticated = machineAuth.isAuthenticated(audienceName);

      expect(isAuthenticated).to.be.true;
    });

    it('returns false when the expiresAt info is in the past', function() {
      machineAuth._sessionInfo = {
        [audienceName]: {
          apiToken: faker.internet.url(),
          expiresAt: faker.date.past().getTime()
        }
      };

      const isAuthenticated = machineAuth.isAuthenticated(audienceName);

      expect(isAuthenticated).to.be.false;
    });

    it('returns false when there is no expiresAt value', function() {
      machineAuth._sessionInfo = {
        [audienceName]: {
          apiToken: faker.internet.url()
        }
      };

      const isAuthenticated = machineAuth.isAuthenticated(audienceName);

      expect(isAuthenticated).to.be.false;
    });

    it('returns false when there is no apiToken value', function() {
      machineAuth._sessionInfo = {
        [audienceName]: {
          expiresAt: faker.date.future().getTime()
        }
      };

      const isAuthenticated = machineAuth.isAuthenticated(audienceName);

      expect(isAuthenticated).to.be.false;
    });

    it('returns false when there is no apiToken value', function() {
      machineAuth._sessionInfo = {
        [audienceName]: {
          expiresAt: faker.date.future().getTime()
        }
      };

      const isAuthenticated = machineAuth.isAuthenticated(audienceName);

      expect(isAuthenticated).to.be.false;
    });

    it('returns false when there is no session info for an audience', function() {
      machineAuth._sessionInfo = {};

      const isAuthenticated = machineAuth.isAuthenticated(audienceName);

      expect(isAuthenticated).to.be.false;
    });
  });

  describe('_getNewSessionInfo', function() {
    context('when successfully getting a new token', function() {
      let audienceName;
      let clock;
      let expectedAudience;
      let expectedPromise;
      let expectedSessionInfo;
      let expiresInMs;
      let machineAuth;
      let post;
      let promise;
      let saveSession;

      beforeEach(function() {
        const currentDate = new Date();
        audienceName = faker.hacker.adjective();
        expectedAudience = fixture.build('audience');
        expiresInMs = faker.random.number({ min: 1000, max: 100000 });
        expectedSessionInfo = {
          apiToken: faker.internet.password(),
          expiresAt: currentDate.getTime() + expiresInMs
        };

        sdk.config.audiences[audienceName] = expectedAudience;
        clock = sinon.useFakeTimers(currentDate);
        expectedPromise = Promise.resolve({
          data: {
            access_token: expectedSessionInfo.apiToken,
            expires_in: expiresInMs / 1000
          }
        });
        post = sinon.stub(axios, 'post').callsFake(() => expectedPromise);
        saveSession = sinon.stub(MachineAuth.prototype, '_saveSession');

        machineAuth = new MachineAuth(sdk);
        promise = machineAuth._getNewSessionInfo(audienceName);
      });

      afterEach(function() {
        clock.restore();
      });

      it('grabs a new token from the contxtAuth service', function() {
        expect(post).to.be.calledOnce;
        const [endpoint, credentials] = post.firstCall.args;
        expect(endpoint).to.equal(
          `${sdk.config.audiences.contxtAuth.host}/v1/oauth/token`
        );
        expect(credentials).to.deep.equal({
          audience: expectedAudience.clientId,
          client_id: sdk.config.auth.clientId,
          client_secret: sdk.config.auth.clientSecret,
          grant_type: 'client_credentials'
        });
      });

      it('saves the axios promise to the instance', function() {
        expect(machineAuth._tokenPromises[audienceName]).to.equal(promise);
      });

      it("saves the new session info the module's instance", function() {
        return promise.then(() => {
          expect(saveSession).to.be.calledWith(
            audienceName,
            expectedSessionInfo
          );
        });
      });

      it('clears out the reference to the axios promise when complete', function() {
        return promise.then(() => {
          expect(machineAuth._tokenPromises[audienceName]).to.be.null;
        });
      });

      it('returns a fulfilled promise with the api token and an expiration time', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
          expectedSessionInfo
        );
      });
    });

    context('when already in the process of getting a new token', function() {
      let expectedPromise;
      let promise;

      beforeEach(function() {
        const audienceName = faker.hacker.adjective();
        expectedPromise = Promise.resolve();
        sdk.config.audiences[audienceName] = fixture.build('audience');

        const machineAuth = new MachineAuth(sdk);
        machineAuth._tokenPromises = {
          [audienceName]: expectedPromise
        };
        promise = machineAuth._getNewSessionInfo(audienceName);
      });

      it('returns the already existing promise', function() {
        expect(promise).to.equal(expectedPromise);
      });
    });

    context(
      'when tokens are requested for two different audiences',
      function() {
        let expectedPromiseOne;
        let expectedPromiseTwo;
        let promiseOne;
        let promiseTwo;

        beforeEach(function() {
          const audienceNameOne = faker.hacker.adjective();
          const audienceNameTwo = faker.lorem.word();
          expectedPromiseOne = Promise.resolve();
          expectedPromiseTwo = Promise.resolve();
          sdk.config.audiences[audienceNameOne] = fixture.build('audience');
          sdk.config.audiences[audienceNameTwo] = fixture.build('audience');

          const machineAuth = new MachineAuth(sdk);
          machineAuth._tokenPromises = {
            [audienceNameOne]: expectedPromiseOne,
            [audienceNameTwo]: expectedPromiseTwo
          };
          promiseOne = machineAuth._getNewSessionInfo(audienceNameOne);
          promiseTwo = machineAuth._getNewSessionInfo(audienceNameTwo);
        });

        it('should return two different promises', function() {
          expect(promiseOne).to.equal(expectedPromiseOne);
          expect(promiseTwo).to.equal(expectedPromiseTwo);
        });
      }
    );

    context(
      'when there is not a configuration for chosen audience',
      function() {
        let promise;

        beforeEach(function() {
          const audienceName = faker.hacker.adjective();

          sinon.stub(axios, 'post');

          const machineAuth = new MachineAuth(sdk);
          promise = machineAuth._getNewSessionInfo(audienceName);
        });

        it('returns a rejected promise', function() {
          return expect(promise).to.be.rejectedWith('No valid audience found');
        });
      }
    );

    context('when there is an error getting a token', function() {
      it('throws a human readable error when unable to reach the server', function() {
        const audienceName = faker.hacker.adjective();
        sdk.config.audiences[audienceName] = fixture.build('audience');

        sinon.stub(axios, 'post').rejects(new Error());

        const machineAuth = new MachineAuth(sdk);
        const promise = machineAuth._getNewSessionInfo(audienceName);

        return expect(promise).to.be.rejectedWith(
          'There was a problem getting a token from the ContxtAuth server. Please check your configuration settings.'
        );
      });

      it('throws the original error if it has a status code', function() {
        const audienceName = faker.hacker.adjective();
        sdk.config.audiences[audienceName] = fixture.build('audience');
        const expectedError = new Error();
        expectedError.response = { status: faker.random.number() };

        sinon.stub(axios, 'post').rejects(expectedError);

        const machineAuth = new MachineAuth(sdk);
        const promise = machineAuth._getNewSessionInfo(audienceName);

        return expect(promise).to.be.rejectedWith(expectedError);
      });
    });
  });

  describe('_saveSession', function() {
    let audienceName;
    let expectedSessionInfo;
    let initialSessionInfo;
    let machineAuth;

    beforeEach(function() {
      audienceName = faker.hacker.adjective();
      expectedSessionInfo = {
        apiToken: faker.internet.password(),
        expiresAt: faker.date.future().getTime()
      };
      initialSessionInfo = times(
        faker.random.number({ min: 1, max: 10 })
      ).reduce((memo) => {
        memo[faker.hacker.verb()] = {
          apiToken: faker.internet.password(),
          expiresAt: faker.date.future().getTime()
        };

        return memo;
      }, {});

      machineAuth = new MachineAuth(sdk);
      machineAuth._sessionInfo = initialSessionInfo;
      machineAuth._saveSession(audienceName, expectedSessionInfo);
    });

    it('retains existing session info', function() {
      expect(machineAuth._sessionInfo).to.include(initialSessionInfo);
    });

    it("saves the new session info the auth module's instance", function() {
      expect(machineAuth._sessionInfo[audienceName]).to.include(
        expectedSessionInfo
      );
    });
  });
});

import axios from 'axios';
import times from 'lodash.times';
import sinon from 'sinon';
import MachineAuth from './machineAuth';

describe('sessionTypes/MachineAuth', function() {
  let sdk;

  beforeEach(function() {
    this.sandbox = sandbox.create();

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
    this.sandbox.restore();
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

        expect(fn).to.throw('clientSecret is required for the MachineAuth config');
      });
    });
  });

  describe('getCurrentApiToken', function() {
    let expectedApiToken;
    let expectedAudienceName;
    let expectedSessionInfo;
    let getNewSessionInfo;
    let isAuthenticated;
    let promise;
    let saveSession;

    beforeEach(function() {
      expectedApiToken = faker.internet.password();
      expectedAudienceName = faker.hacker.adjective();
      expectedSessionInfo = {
        apiToken: expectedApiToken,
        expiresAt: faker.date.future().getTime()
      };

      getNewSessionInfo = this.sandbox.stub(MachineAuth.prototype, '_getNewSessionInfo')
        .resolves(expectedSessionInfo);
      saveSession = this.sandbox.stub(MachineAuth.prototype, '_saveSession');
    });

    context('when getting a new token', function() {
      beforeEach(function() {
        isAuthenticated = this.sandbox.stub(MachineAuth.prototype, 'isAuthenticated')
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

      it("saves the new session info the module's instance", function() {
        return promise.then(() => {
          expect(saveSession).to.be.calledWith(expectedAudienceName, expectedSessionInfo);
        });
      });

      it('returns a promise with the new apiToken', function() {
        return expect(promise).to.be.fulfilled
          .and.to.eventually.equal(expectedApiToken);
      });
    });

    context('when using a previously acquired token', function() {
      beforeEach(function() {
        isAuthenticated = this.sandbox.stub(MachineAuth.prototype, 'isAuthenticated')
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
        return expect(promise).to.be.fulfilled
          .and.to.eventually.equal(expectedApiToken);
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
      let expectedSessionInfo;
      let expiresInMs;
      let post;
      let promise;

      beforeEach(function() {
        const currentDate = new Date();
        audienceName = faker.hacker.adjective();
        expectedAudience = fixture.build('audience');
        expiresInMs = faker.random.number({ min: 1000, max: 100000 });
        expectedSessionInfo = {
          apiToken: faker.internet.password(),
          expiresAt: currentDate.getTime() + expiresInMs
        };

        clock = sinon.useFakeTimers(currentDate);
        post = this.sandbox.stub(axios, 'post').resolves({
          data: {
            access_token: expectedSessionInfo.apiToken,
            expires_in: expiresInMs / 1000
          }
        });
        sdk.config.audiences[audienceName] = expectedAudience;

        const machineAuth = new MachineAuth(sdk);
        promise = machineAuth._getNewSessionInfo(audienceName);
      });

      afterEach(function() {
        clock.restore();
      });

      it('grabs a new token from the contxtAuth service', function() {
        expect(post).to.be.calledOnce;
        const [endpoint, credentials] = post.firstCall.args;
        expect(endpoint).to.equal(`${sdk.config.audiences.contxtAuth.host}/v1/oauth/token`);
        expect(credentials).to.deep.equal({
          audience: expectedAudience.clientId,
          client_id: sdk.config.auth.clientId,
          client_secret: sdk.config.auth.clientSecret,
          grant_type: 'client_credentials'
        });
      });

      it('returns a fulfilled promise with the api token and an expiration time', function() {
        return expect(promise).to.be.fulfilled
          .and.to.eventually.deep.equal(expectedSessionInfo);
      });
    });

    context('when there is not a configuration for chosen audience', function() {
      let promise;

      beforeEach(function() {
        const audienceName = faker.hacker.adjective();

        this.sandbox.stub(axios, 'post');

        const machineAuth = new MachineAuth(sdk);
        promise = machineAuth._getNewSessionInfo(audienceName);
      });

      it('returns a rejected promise', function() {
        return expect(promise).to.be.rejectedWith('No valid audience found');
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
      initialSessionInfo = times(faker.random.number({ min: 1, max: 10 })).reduce((memo) => {
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
      expect(machineAuth._sessionInfo[audienceName]).to.include(expectedSessionInfo);
    });
  });
});

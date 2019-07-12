import auth0 from 'auth0-js';
import Auth0WebAuth from './auth0WebAuth';
import PasswordGrantAuth from './passwordGrantAuth';
import MachineAuth from './machineAuth';
import * as sessionTypes from './index';

describe('sessionTypes', function() {
  afterEach(function() {
    sinon.restore();
  });

  describe('Auth0WebAuth', function() {
    let auth;
    let originalWindow;

    beforeEach(function() {
      const sdk = {
        config: {
          audiences: {
            contxtAuth: fixture.build('audience'),
            facilities: fixture.build('audience')
          },
          auth: {
            authorizationPath: faker.hacker.noun(),
            clientId: faker.internet.password(),
            tokenExpiresAtBufferMs: faker.random.number()
          }
        }
      };

      originalWindow = global.window;
      global.window = {
        location: faker.internet.url()
      };

      sinon.stub(Auth0WebAuth.prototype, 'isAuthenticated').returns(false);
      sinon.stub(Auth0WebAuth.prototype, '_getStoredSession');
      sinon.stub(Auth0WebAuth.prototype, '_scheduleSessionRefresh');
      sinon.stub(auth0, 'WebAuth');

      auth = new sessionTypes.Auth0WebAuth(sdk);
    });

    afterEach(function() {
      global.window = originalWindow;
    });

    it('instatiates a new instance of Auth0WebAuth', function() {
      expect(auth).to.be.an.instanceOf(Auth0WebAuth);
    });
  });

  describe('MachineAuth', function() {
    let auth;

    beforeEach(function() {
      const sdk = {
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

      auth = new sessionTypes.MachineAuth(sdk);
    });

    it('instatiates a new instance of MachineAuth', function() {
      expect(auth).to.be.an.instanceOf(MachineAuth);
    });
  });

  describe('PasswordGrantAuth', function() {
    let auth;

    beforeEach(function() {
      const sdk = {
        config: {
          audiences: {
            contxtAuth: fixture.build('audience'),
            facilities: fixture.build('audience')
          },
          auth: {
            clientId: faker.internet.password()
          }
        }
      };

      sinon.stub(auth0, 'Authentication');

      auth = new sessionTypes.PasswordGrantAuth(sdk);
    });

    it('instatiates a new instance of PasswordGrantAuth', function() {
      expect(auth).to.be.an.instanceOf(PasswordGrantAuth);
    });
  });
});

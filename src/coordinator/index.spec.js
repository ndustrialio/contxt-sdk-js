import Coordinator from './index';
import * as coordinatorUtils from '../utils/coordinator';

describe('Coordinator', function() {
  let baseRequest;
  let baseSdk;
  let expectedHost;

  beforeEach(function() {
    this.sandbox = sandbox.create();

    baseRequest = {
      delete: this.sandbox.stub().resolves(),
      get: this.sandbox.stub().resolves(),
      post: this.sandbox.stub().resolves(),
      put: this.sandbox.stub().resolves()
    };
    baseSdk = {
      config: {
        audiences: {
          coordinator: fixture.build('audience')
        }
      }
    };
    expectedHost = faker.internet.url();
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  describe('constructor', function() {
    let coordinator;

    beforeEach(function() {
      coordinator = new Coordinator(baseSdk, baseRequest);
    });

    it('sets a base url for the class instance', function() {
      expect(coordinator._baseUrl).to.equal(
        `${baseSdk.config.audiences.coordinator.host}/v1`
      );
    });

    it('appends the supplied request module to the class instance', function() {
      expect(coordinator._request).to.deep.equal(baseRequest);
    });

    it('appends the supplied sdk to the class instance', function() {
      expect(coordinator._sdk).to.deep.equal(baseSdk);
    });
  });

  describe('getOrganization', function() {
    context('the organization ID is provided', function() {
      let organizationFromServerAfterFormat;
      let organizationFromServerBeforeFormat;
      let expectedOrganizationId;
      let formatOrganizationFromServer;
      let promise;
      let request;

      beforeEach(function() {
        expectedOrganizationId = faker.random.uuid();
        organizationFromServerAfterFormat = fixture.build(
          'contxtOrganization',
          {
            id: expectedOrganizationId
          }
        );
        organizationFromServerBeforeFormat = fixture.build(
          'event',
          { id: expectedOrganizationId },
          { fromServer: true }
        );

        formatOrganizationFromServer = this.sandbox
          .stub(coordinatorUtils, 'formatOrganizationFromServer')
          .returns(organizationFromServerAfterFormat);

        request = {
          ...baseRequest,
          get: this.sandbox.stub().resolves(organizationFromServerBeforeFormat)
        };

        const coordinator = new Coordinator(baseSdk, request);
        coordinator._baseUrl = expectedHost;

        promise = coordinator.getOrganization(expectedOrganizationId);
      });

      it('gets the organization from the server', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/organizations/${expectedOrganizationId}`
        );
      });

      it('formats the organization object', function() {
        return promise.then(() => {
          expect(formatOrganizationFromServer).to.be.calledWith(
            organizationFromServerBeforeFormat
          );
        });
      });

      it('returns the requested organization', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
          organizationFromServerAfterFormat
        );
      });
    });

    context('the organization ID is not provided', function() {
      it('throws an error', function() {
        const coordinator = new Coordinator(baseSdk, baseRequest);
        const promise = coordinator.getOrganization();

        return expect(promise).to.be.rejectedWith(
          'An organization ID is required for getting information about an organization'
        );
      });
    });
  });

  describe('getUser', function() {
    context('the user ID is provided', function() {
      let userFromServerAfterFormat;
      let userFromServerBeforeFormat;
      let expectedUserId;
      let formatUserFromServer;
      let promise;
      let request;

      beforeEach(function() {
        expectedUserId = faker.random.uuid();
        userFromServerAfterFormat = fixture.build('contxtUser', {
          id: expectedUserId
        });
        userFromServerBeforeFormat = fixture.build(
          'event',
          { id: expectedUserId },
          { fromServer: true }
        );

        formatUserFromServer = this.sandbox
          .stub(coordinatorUtils, 'formatUserFromServer')
          .returns(userFromServerAfterFormat);

        request = {
          ...baseRequest,
          get: this.sandbox.stub().resolves(userFromServerBeforeFormat)
        };

        const coordinator = new Coordinator(baseSdk, request);
        coordinator._baseUrl = expectedHost;

        promise = coordinator.getUser(expectedUserId);
      });

      it('gets the user from the server', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/users/${expectedUserId}`
        );
      });

      it('formats the user object', function() {
        return promise.then(() => {
          expect(formatUserFromServer).to.be.calledWith(
            userFromServerBeforeFormat
          );
        });
      });

      it('returns the requested user', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
          userFromServerAfterFormat
        );
      });
    });

    context('the user ID is not provided', function() {
      it('throws an error', function() {
        const coordinator = new Coordinator(baseSdk, baseRequest);
        const promise = coordinator.getUser();

        return expect(promise).to.be.rejectedWith(
          'A user ID is required for getting information about a user'
        );
      });
    });
  });
});

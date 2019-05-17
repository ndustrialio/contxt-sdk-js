import Permissions from './permissions';
import * as objectUtils from '../utils/objects';

describe('Coordinator/Permissions', function() {
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
    let permissions;

    beforeEach(function() {
      permissions = new Permissions(baseSdk, baseRequest, expectedHost);
    });

    it('sets a base url for the class instance', function() {
      expect(permissions._baseUrl).to.equal(expectedHost);
    });

    it('appends the supplied request module to the class instance', function() {
      expect(permissions._request).to.deep.equal(baseRequest);
    });

    it('appends the supplied sdk to the class instance', function() {
      expect(permissions._sdk).to.deep.equal(baseSdk);
    });
  });

  describe('getByOrganizationId', function() {
    context('when the organization ID is provided', function() {
      let expectedUsersPermissions;
      let userPermissionFromServer;
      let expectedOrganizationId;
      let promise;
      let request;
      let toCamelCase;

      beforeEach(function() {
        expectedOrganizationId = fixture.build('contxtOrganization').id;
        expectedUsersPermissions = fixture.buildList(
          'contxtUserPermissions',
          faker.random.number({
            min: 1,
            max: 10
          }),
          {
            organizationId: expectedOrganizationId
          }
        );
        userPermissionFromServer = expectedUsersPermissions.map((app) =>
          fixture.build('contxtUserPermissions', app, {
            fromServer: true
          })
        );

        request = {
          ...baseRequest,
          get: this.sandbox.stub().resolves(userPermissionFromServer)
        };
        toCamelCase = this.sandbox
          .stub(objectUtils, 'toCamelCase')
          .returns(expectedUsersPermissions);

        const permissions = new Permissions(baseSdk, request, expectedHost);
        promise = permissions.getByOrganizationId(expectedOrganizationId);
      });

      it('gets the list of users permissions from the server', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/organizations/${expectedOrganizationId}/users/permissions`
        );
      });

      it('formats the list of users permissions', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.calledWith(userPermissionFromServer);
        });
      });

      it('returns a fulfilled promise with the users permissions', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
          expectedUsersPermissions
        );
      });
    });

    context('when the organization ID is not provided', function() {
      it('throws an error', function() {
        const permissions = new Permissions(baseSdk, baseRequest, expectedHost);
        const promise = permissions.getByOrganizationId();

        return expect(promise).to.be.rejectedWith(
          'An organization ID is required for getting users permissions for an organization'
        );
      });
    });
  });

  describe('getByUserId', function() {
    context('the user ID is provided', function() {
      let expectedPermissionsMap;
      let expectedUserId;
      let promise;
      let request;
      let toCamelCase;

      beforeEach(function() {
        expectedPermissionsMap = fixture.build('userPermissionsMap');
        expectedUserId = faker.random.uuid();

        request = {
          ...baseRequest,
          get: this.sandbox.stub().resolves(expectedPermissionsMap)
        };
        toCamelCase = this.sandbox.stub(objectUtils, 'toCamelCase');

        const permissions = new Permissions(baseSdk, request, expectedHost);
        promise = permissions.getByUserId(expectedUserId);
      });

      it('gets the user from the server', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/users/${expectedUserId}/permissions`
        );
      });

      it('does not format the returned permissions map to avoid mangling the service ID (keys)', function() {
        return promise.then(() => {
          expect(toCamelCase).to.not.be.called;
        });
      });

      it('returns the requested permissions map', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
          expectedPermissionsMap
        );
      });
    });

    context('the user ID is not provided', function() {
      it('throws an error', function() {
        const permissions = new Permissions(baseSdk, baseRequest, expectedHost);
        const promise = permissions.getByUserId();

        return expect(promise).to.be.rejectedWith(
          "A user ID is required for getting information about a user's permissions map"
        );
      });
    });
  });
});

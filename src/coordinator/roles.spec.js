import Roles from './roles';
import * as objectUtils from '../utils/objects';

describe('Coordinator/Roles', function() {
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
    let roles;

    beforeEach(function() {
      roles = new Roles(baseSdk, baseRequest, expectedHost);
    });

    it('sets a base url for the class instance', function() {
      expect(roles._baseUrl).to.equal(expectedHost);
    });

    it('appends the supplied request module to the class instance', function() {
      expect(roles._request).to.deep.equal(baseRequest);
    });

    it('appends the supplied sdk to the class instance', function() {
      expect(roles._sdk).to.deep.equal(baseSdk);
    });
  });

  describe('getByOrganizationId', function() {
    context('when the organization ID is provided', function() {
      let expectedRoles;
      let rolesFromTheServer;
      let expectedOrganizationId;
      let promise;
      let request;
      let toCamelCase;

      beforeEach(function() {
        expectedOrganizationId = fixture.build('contxtOrganization').id;
        expectedRoles = fixture.buildList(
          'contxtRole',
          faker.random.number({
            min: 1,
            max: 10
          }),
          {
            organizationId: expectedOrganizationId
          }
        );
        rolesFromTheServer = expectedRoles.map((role) =>
          fixture.build('contxtRole', role, {
            fromServer: true
          })
        );

        request = {
          ...baseRequest,
          get: this.sandbox.stub().resolves(rolesFromTheServer)
        };
        toCamelCase = this.sandbox
          .stub(objectUtils, 'toCamelCase')
          .returns(expectedRoles);

        const roles = new Roles(baseSdk, request, expectedHost);
        promise = roles.getByOrganizationId(expectedOrganizationId);
      });

      it('gets the list of roles from the server', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/organizations/${expectedOrganizationId}/roles`
        );
      });

      it('formats the list of roles', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.calledWith(rolesFromTheServer);
        });
      });

      it('returns a fulfilled promise with the roles', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
          expectedRoles
        );
      });
    });

    context('when the organization ID is not provided', function() {
      it('throws an error', function() {
        const roles = new Roles(baseSdk, baseRequest, expectedHost);
        const promise = roles.getByOrganizationId();

        return expect(promise).to.be.rejectedWith(
          'An organization ID is required for getting roles for an organization'
        );
      });
    });
  });
});

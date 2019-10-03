import Roles from './roles';
import * as objectUtils from '../utils/objects';

describe('Coordinator/Roles', function() {
  let baseRequest;
  let baseSdk;
  let expectedHost;

  beforeEach(function() {
    baseRequest = {
      delete: sinon.stub().resolves(),
      get: sinon.stub().resolves(),
      post: sinon.stub().resolves(),
      put: sinon.stub().resolves()
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
    sinon.restore();
  });

  describe('constructor', function() {
    context('when an organization ID is provided', function() {
      let organizationId;
      let roles;

      beforeEach(function() {
        organizationId = fixture.build('organization').id;

        roles = new Roles(baseSdk, baseRequest, expectedHost, organizationId);
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

      it('sets the organization ID for the class instance', function() {
        expect(roles._organizationId).to.equal(organizationId);
      });
    });

    context('when an organization ID is not provided', function() {
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

      it('sets the organization ID for the class instance to null', function() {
        expect(roles._organizationId).to.equal(null);
      });
    });
  });

  describe('addApplication', function() {
    context('when all the required parameters are provided', function() {
      let expectedRoleApplication;
      let promise;
      let request;
      let application;
      let role;
      let roleApplicationFromServer;
      let toCamelCase;

      beforeEach(function() {
        application = fixture.build('contxtApplication');
        role = fixture.build('contxtRole');

        expectedRoleApplication = fixture.build('contxtRoleApplication');
        roleApplicationFromServer = fixture.build(
          'contxtRoleApplication',
          expectedRoleApplication,
          {
            fromServer: true
          }
        );

        request = {
          ...baseRequest,
          post: sinon.stub().resolves(roleApplicationFromServer)
        };
        toCamelCase = sinon
          .stub(objectUtils, 'toCamelCase')
          .callsFake((app) => expectedRoleApplication);

        const roles = new Roles(baseSdk, request, expectedHost);
        promise = roles.addApplication(role.id, application.id);
      });

      it('posts the role application to the server', function() {
        expect(request.post).to.be.calledWith(
          `${expectedHost}/applications/${application.id}/roles/${role.id}`
        );
      });

      it('formats the returned role application', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.calledWith(roleApplicationFromServer);
        });
      });

      it('returns a fulfilled promise', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
          expectedRoleApplication
        );
      });
    });

    context('when the role ID is not provided', function() {
      it('throws an error', function() {
        const application = fixture.build('contxtApplication');

        const roles = new Roles(baseSdk, baseRequest, expectedHost);
        const promise = roles.addApplication(null, application.id);

        return expect(promise).to.be.rejectedWith(
          'A roleId is required for adding an application to a role'
        );
      });
    });

    context('when the application ID is not provided', function() {
      it('throws an error', function() {
        const role = fixture.build('contxtRole');

        const roles = new Roles(baseSdk, baseRequest, expectedHost);
        const promise = roles.addApplication(role.id, null);

        return expect(promise).to.be.rejectedWith(
          'An applicationId is required for adding an application to a role'
        );
      });
    });
  });

  describe('addStack', function() {
    context(
      'when all the required parameters are provided and valid',
      function() {
        let expectedRoleStack;
        let promise;
        let request;
        let stack;
        let role;
        let roleStackFromServer;
        let toCamelCase;

        beforeEach(function() {
          stack = fixture.build('contxtStack');
          role = fixture.build('contxtRole');

          expectedRoleStack = fixture.build('contxtRoleStack');
          roleStackFromServer = fixture.build(
            'contxtRoleStack',
            expectedRoleStack,
            {
              fromServer: true
            }
          );

          request = {
            ...baseRequest,
            post: sinon.stub().resolves(roleStackFromServer)
          };
          toCamelCase = sinon
            .stub(objectUtils, 'toCamelCase')
            .callsFake((app) => expectedRoleStack);

          const roles = new Roles(baseSdk, request, expectedHost);
          promise = roles.addStack(
            role.id,
            stack.id,
            expectedRoleStack.accessType
          );
        });

        it('posts the role stack to the server', function() {
          expect(request.post).to.be.calledWith(
            `${expectedHost}/stacks/${stack.id}/roles/${role.id}`,
            {
              access_type: expectedRoleStack.accessType
            }
          );
        });

        it('formats the returned role stack', function() {
          return promise.then(() => {
            expect(toCamelCase).to.be.calledWith(roleStackFromServer);
          });
        });

        it('returns a fulfilled promise', function() {
          return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
            expectedRoleStack
          );
        });
      }
    );

    context('when the role ID is not provided', function() {
      it('throws an error', function() {
        const stack = fixture.build('contxtStack');
        const roleStack = fixture.build('contxtRoleStack');

        const roles = new Roles(baseSdk, baseRequest, expectedHost);
        const promise = roles.addStack(null, stack.id, roleStack.accessType);

        return expect(promise).to.be.rejectedWith(
          'A roleId is required for adding a stack to a role.'
        );
      });
    });

    context('when the stack ID is not provided', function() {
      it('throws an error', function() {
        const role = fixture.build('contxtRole');
        const roleStack = fixture.build('contxtRoleStack');
        const roles = new Roles(baseSdk, baseRequest, expectedHost);
        const promise = roles.addStack(role.id, null, roleStack.accessType);

        return expect(promise).to.be.rejectedWith(
          'A stackId is required for adding a stack to a role.'
        );
      });
    });

    context('when the access type is not provided', function() {
      it('throws an error', function() {
        const role = fixture.build('contxtRole');
        const stack = fixture.build('contxtStack');

        const roles = new Roles(baseSdk, baseRequest, expectedHost);
        const promise = roles.addStack(role.id, stack.id, null);

        return expect(promise).to.be.rejectedWith(
          'An accessType of "reader", "collaborator", or "owner" is required for adding a stack to a role.'
        );
      });
    });

    context('when the access type is not a valid value', function() {
      it('throws an error', function() {
        const role = fixture.build('contxtRole');
        const stack = fixture.build('contxtStack');

        const roles = new Roles(baseSdk, baseRequest, expectedHost);
        const promise = roles.addStack(role.id, stack.id, faker.random.word());

        return expect(promise).to.be.rejectedWith(
          'An accessType of "reader", "collaborator", or "owner" is required for adding a stack to a role.'
        );
      });
    });
  });

  describe('create', function() {
    context('legacy API', function() {
      context('when the required information is provided', function() {
        let roles;
        let organization;
        let expectedRole;
        let expectedRoleFromServer;
        let newRolePayload;
        let newRolePayloadToServer;
        let promise;
        let request;
        let toCamelCase;
        let toSnakeCase;

        beforeEach(function() {
          organization = fixture.build('contxtOrganization');
          expectedRole = fixture.build('contxtRole');
          expectedRoleFromServer = fixture.build('contxtRole', expectedRole, {
            fromServer: true
          });
          newRolePayload = {
            name: expectedRole.name,
            description: expectedRole.description
          };

          newRolePayloadToServer = {
            name: newRolePayload.name,
            description: newRolePayload.description
          };

          request = {
            ...baseRequest,
            post: sinon.stub().resolves(expectedRoleFromServer)
          };
          toCamelCase = sinon
            .stub(objectUtils, 'toCamelCase')
            .callsFake(() => expectedRole);

          toSnakeCase = sinon
            .stub(objectUtils, 'toSnakeCase')
            .callsFake(() => newRolePayloadToServer);

          roles = new Roles(baseSdk, request, expectedHost);
          promise = roles.create(organization.id, newRolePayload);
        });

        it('formats the role payload', function() {
          return promise.then(() => {
            expect(toSnakeCase).to.be.calledWith(newRolePayload);
          });
        });

        it('posts the role to the server', function() {
          expect(request.post).to.be.calledOnce;
          expect(request.post).to.be.calledWith(
            `${expectedHost}/organizations/${organization.id}/roles`,
            newRolePayloadToServer
          );
        });

        it('returns a fulfilled promise', function() {
          return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
            expectedRole
          );
        });

        it('formats the role response', function() {
          return promise.then(() => {
            expect(toCamelCase).to.be.calledWith(expectedRoleFromServer);
          });
        });
      });

      context('when the organizationId is not provided', function() {
        it('returns a rejected promise', function() {
          const roles = new Roles(baseSdk, baseRequest, expectedHost);
          const promise = roles.create();

          return expect(promise).to.be.rejectedWith(
            'An organizationId is required for creating roles for an organization.'
          );
        });
      });

      context('when the role does not have required properties', function() {
        it('without name it returns a rejected promise', function() {
          const roles = new Roles(baseSdk, baseRequest, expectedHost);
          const organization = fixture.build('contxtOrganization');
          const promise = roles.create(organization.id, {
            description: 'winning'
          });

          return expect(promise).to.be.rejectedWith(
            `A name is required to create a new role.`
          );
        });
        it('without description it returns a rejected promise', function() {
          const roles = new Roles(baseSdk, baseRequest, expectedHost);
          const organization = fixture.build('contxtOrganization');
          const promise = roles.create(organization.id, { name: 'winning' });

          return expect(promise).to.be.rejectedWith(
            `A description is required to create a new role.`
          );
        });
      });
    });

    context('tenant API', function() {
      let roles;
      let organization;
      let expectedRole;
      let expectedRoleFromServer;
      let newRolePayload;
      let newRolePayloadToServer;
      let promise;
      let request;
      let toCamelCase;
      let toSnakeCase;

      beforeEach(function() {
        organization = fixture.build('contxtOrganization');
        expectedRole = fixture.build('contxtRole');
        expectedRoleFromServer = fixture.build('contxtRole', expectedRole, {
          fromServer: true
        });
        newRolePayload = {
          name: expectedRole.name,
          description: expectedRole.description
        };

        newRolePayloadToServer = {
          name: newRolePayload.name,
          description: newRolePayload.description
        };

        request = {
          ...baseRequest,
          post: sinon.stub().resolves(expectedRoleFromServer)
        };
        toCamelCase = sinon
          .stub(objectUtils, 'toCamelCase')
          .callsFake(() => expectedRole);

        toSnakeCase = sinon
          .stub(objectUtils, 'toSnakeCase')
          .callsFake(() => newRolePayloadToServer);

        roles = new Roles(baseSdk, request, expectedHost, organization.id);
      });

      context(
        'when an organization ID and role information are both provided',
        function() {
          beforeEach(function() {
            promise = roles.create(organization.id, newRolePayload);
          });

          it('formats the role payload', function() {
            return promise.then(() => {
              expect(toSnakeCase).to.be.calledWith(newRolePayload);
            });
          });

          it('posts the role to the server', function() {
            expect(request.post).to.be.calledOnce;
            expect(request.post).to.be.calledWith(
              `${expectedHost}/roles`,
              newRolePayloadToServer
            );
          });

          it('returns a fulfilled promise', function() {
            return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
              expectedRole
            );
          });

          it('formats the role response', function() {
            return promise.then(() => {
              expect(toCamelCase).to.be.calledWith(expectedRoleFromServer);
            });
          });
        }
      );

      context('when the organization ID is not provided', function() {
        beforeEach(function() {
          promise = roles.create(null, newRolePayload);
        });

        it('formats the role payload', function() {
          return promise.then(() => {
            expect(toSnakeCase).to.be.calledWith(newRolePayload);
          });
        });

        it('posts the role to the server', function() {
          expect(request.post).to.be.calledOnce;
          expect(request.post).to.be.calledWith(
            `${expectedHost}/roles`,
            newRolePayloadToServer
          );
        });

        it('returns a fulfilled promise', function() {
          return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
            expectedRole
          );
        });

        it('formats the role response', function() {
          return promise.then(() => {
            expect(toCamelCase).to.be.calledWith(expectedRoleFromServer);
          });
        });
      });

      context('when the role does not have required properties', function() {
        it('without name it returns a rejected promise', function() {
          const organization = fixture.build('organization');
          const roles = new Roles(
            baseSdk,
            baseRequest,
            expectedHost,
            organization.id
          );
          const promise = roles.create(null, {
            description: 'winning'
          });

          return expect(promise).to.be.rejectedWith(
            `A name is required to create a new role.`
          );
        });

        it('without description it returns a rejected promise', function() {
          const organization = fixture.build('organization');
          const roles = new Roles(
            baseSdk,
            baseRequest,
            expectedHost,
            organization.id
          );
          const promise = roles.create(null, { name: 'winning' });

          return expect(promise).to.be.rejectedWith(
            `A description is required to create a new role.`
          );
        });
      });
    });
  });

  describe('delete', function() {
    context('legacy API', function() {
      context('when the required information is provided', function() {
        let role;
        let organization;
        let promise;

        beforeEach(function() {
          organization = fixture.build('contxtOrganization');
          role = fixture.build('contxtRole');

          const roles = new Roles(baseSdk, baseRequest, expectedHost);
          promise = roles.delete(organization.id, role.id);
        });

        it('returns a fulfilled promise', function() {
          return expect(promise).to.be.fulfilled;
        });

        it('sends a delete request to delete the role', function() {
          expect(baseRequest.delete).to.be.calledWith(
            `${expectedHost}/organizations/${organization.id}/roles/${role.id}`
          );
        });
      });

      context('when the roleId is not provided', function() {
        it('returns rejected promise', function() {
          const roles = new Roles(baseSdk, baseRequest, expectedHost);
          const organization = fixture.build('contxtOrganization');
          const promise = roles.delete(organization.id);

          return expect(promise).to.be.rejectedWith(
            'A roleId is required for deleting a role.'
          );
        });
      });

      context('when the organizationId is not provided', function() {
        it('returns rejected promise', function() {
          const roles = new Roles(baseSdk, baseRequest, expectedHost);
          const promise = roles.delete();

          return expect(promise).to.be.rejectedWith(
            'An organizationId is required for deleting a role'
          );
        });
      });
    });

    context('tenant API', function() {
      let role;
      let roles;
      let organization;
      let promise;

      beforeEach(function() {
        organization = fixture.build('organization');
        role = fixture.build('contxtRole');

        roles = new Roles(baseSdk, baseRequest, expectedHost, organization.id);
      });

      context(
        'when the the organization ID and role ID are both provided',
        function() {
          beforeEach(function() {
            promise = roles.delete(organization.id, role.id);
          });

          it('returns a fulfilled promise', function() {
            return expect(promise).to.be.fulfilled;
          });

          it('sends a delete request to delete the role', function() {
            expect(baseRequest.delete).to.be.calledWith(
              `${expectedHost}/roles/${role.id}`
            );
          });
        }
      );

      context('when the organization ID is not provided', function() {
        beforeEach(function() {
          promise = roles.delete(null, role.id);
        });

        it('returns a fulfilled promise', function() {
          return expect(promise).to.be.fulfilled;
        });

        it('sends a delete request to delete the role', function() {
          expect(baseRequest.delete).to.be.calledWith(
            `${expectedHost}/roles/${role.id}`
          );
        });
      });

      context('when the roleId is not provided', function() {
        it('returns rejected promise', function() {
          const organization = fixture.build('organization');
          const roles = new Roles(
            baseSdk,
            baseRequest,
            expectedHost,
            organization.id
          );
          const promise = roles.delete(organization.id);

          return expect(promise).to.be.rejectedWith(
            'A roleId is required for deleting a role.'
          );
        });
      });
    });
  });

  describe('getByOrganizationId', function() {
    context('legacy API', function() {
      context('when the organizationId is provided', function() {
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
            get: sinon.stub().resolves(rolesFromTheServer)
          };
          toCamelCase = sinon
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

      context('when the organizationId is not provided', function() {
        it('returns a rejected promise', function() {
          const roles = new Roles(baseSdk, baseRequest, expectedHost);
          const promise = roles.getByOrganizationId();

          return expect(promise).to.be.rejectedWith(
            'An organizationId is required for getting roles for an organization.'
          );
        });
      });
    });

    context('tenant API', function() {
      let expectedRoles;
      let rolesFromTheServer;
      let expectedOrganizationId;
      let promise;
      let request;
      let roles;
      let toCamelCase;

      beforeEach(function() {
        expectedOrganizationId = fixture.build('organization').id;
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
          get: sinon.stub().resolves(rolesFromTheServer)
        };
        toCamelCase = sinon
          .stub(objectUtils, 'toCamelCase')
          .returns(expectedRoles);

        roles = new Roles(
          baseSdk,
          request,
          expectedHost,
          expectedOrganizationId
        );
      });

      context('when the organization ID is provided', function() {
        beforeEach(function() {
          promise = roles.getByOrganizationId(expectedOrganizationId);
        });

        it('gets the list of roles from the server', function() {
          expect(request.get).to.be.calledWith(`${expectedHost}/roles`);
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
        beforeEach(function() {
          promise = roles.getByOrganizationId();
        });

        it('gets the list of roles from the server', function() {
          expect(request.get).to.be.calledWith(`${expectedHost}/roles`);
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
    });
  });

  describe('removeApplication', function() {
    context('when all required parameters are provided', function() {
      let application;
      let role;
      let promise;

      beforeEach(function() {
        application = fixture.build('contxtApplication');
        role = fixture.build('contxtRole');

        const roles = new Roles(baseSdk, baseRequest, expectedHost);
        promise = roles.removeApplication(role.id, application.id);
      });

      it('sends a request to removeApplication from the role', function() {
        expect(baseRequest.delete).to.be.calledWith(
          `${expectedHost}/applications/${application.id}/roles/${role.id}`
        );
      });

      it('returns a resolved promise', function() {
        return expect(promise).to.be.fulfilled;
      });
    });

    context('when the role ID is not provided', function() {
      it('throws an error', function() {
        const application = fixture.build('contxtApplication');
        const roles = new Roles(baseSdk, baseRequest, expectedHost);
        const promise = roles.removeApplication(null, application.id);

        return expect(promise).to.be.rejectedWith(
          'A roleId is required for removing an application from a role.'
        );
      });
    });

    context('when the application ID is not provided', function() {
      it('throws an error', function() {
        const role = fixture.build('contxtRole');
        const roles = new Roles(baseSdk, baseRequest, expectedHost);
        const promise = roles.removeApplication(role.id, null);

        return expect(promise).to.be.rejectedWith(
          'An applicationId is required for removing an application from a role.'
        );
      });
    });
  });

  describe('removeStack', function() {
    context('when all required parameters are provided', function() {
      let stack;
      let role;
      let promise;

      beforeEach(function() {
        stack = fixture.build('contxtStack');
        role = fixture.build('contxtRole');

        const roles = new Roles(baseSdk, baseRequest, expectedHost);
        promise = roles.removeStack(role.id, stack.id);
      });

      it('sends a request to removeStack the role from the organization', function() {
        expect(baseRequest.delete).to.be.calledWith(
          `${expectedHost}/stacks/${stack.id}/roles/${role.id}`
        );
      });

      it('returns a resolved promise', function() {
        return expect(promise).to.be.fulfilled;
      });
    });

    context('when the role ID is not provided', function() {
      it('throws an error', function() {
        const stack = fixture.build('contxtStack');
        const roles = new Roles(baseSdk, baseRequest, expectedHost);
        const promise = roles.removeStack(null, stack.id);

        return expect(promise).to.be.rejectedWith(
          'A roleId is required for removing a stack from a role.'
        );
      });
    });

    context('when the stack ID is not provided', function() {
      it('throws an error', function() {
        const role = fixture.build('contxtRole');
        const roles = new Roles(baseSdk, baseRequest, expectedHost);
        const promise = roles.removeStack(role.id, null);

        return expect(promise).to.be.rejectedWith(
          'A stackId is required for removing a stack from a role.'
        );
      });
    });
  });
});

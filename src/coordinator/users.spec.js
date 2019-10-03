import axios from 'axios';
import omit from 'lodash.omit';

import Users from './users';
import * as objectUtils from '../utils/objects';

describe('Coordinator/Users', function() {
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
      let users;

      beforeEach(function() {
        organizationId = fixture.build('organization').id;

        users = new Users(baseSdk, baseRequest, expectedHost, organizationId);
      });

      it('sets a base url for the class instance', function() {
        expect(users._baseUrl).to.equal(expectedHost);
      });

      it('appends the supplied request module to the class instance', function() {
        expect(users._request).to.deep.equal(baseRequest);
      });

      it('appends the supplied sdk to the class instance', function() {
        expect(users._sdk).to.deep.equal(baseSdk);
      });

      it('sets the organization ID for the class instance', function() {
        expect(users._organizationId).to.equal(organizationId);
      });
    });

    context('when an organization ID is not provided', function() {
      let users;

      beforeEach(function() {
        users = new Users(baseSdk, baseRequest, expectedHost);
      });

      it('sets a base url for the class instance', function() {
        expect(users._baseUrl).to.equal(expectedHost);
      });

      it('appends the supplied request module to the class instance', function() {
        expect(users._request).to.deep.equal(baseRequest);
      });

      it('appends the supplied sdk to the class instance', function() {
        expect(users._sdk).to.deep.equal(baseSdk);
      });

      it('sets the organization ID for the class instance to null', function() {
        expect(users._organizationId).to.equal(null);
      });
    });
  });

  describe('activate', function() {
    context('when all the required parameters are provided', function() {
      let user;
      let userActivationPayload;
      let userActivationPayloadToServer;
      let promise;
      let request;
      let toSnakeCase;

      beforeEach(function() {
        user = fixture.build('contxtUser');

        userActivationPayload = {
          email: user.email,
          password: faker.internet.password(),
          userToken: faker.random.uuid()
        };

        userActivationPayloadToServer = {
          email: userActivationPayload.email,
          password: userActivationPayload.password,
          user_token: userActivationPayload.userToken
        };

        request = {
          ...baseRequest,
          post: sinon.stub().resolves()
        };

        sinon.stub(axios, 'post').resolves();

        toSnakeCase = sinon
          .stub(objectUtils, 'toSnakeCase')
          .callsFake(() => userActivationPayloadToServer);

        const users = new Users(baseSdk, request, expectedHost);
        promise = users.activate(user.id, userActivationPayload);
      });

      it('formats the user payload', function() {
        return promise.then(() => {
          expect(toSnakeCase).to.be.calledWith(userActivationPayload);
        });
      });

      it('posts the new user to the server', function() {
        expect(axios.post).to.be.calledWith(
          `${expectedHost}/users/${user.id}/activate`,
          userActivationPayloadToServer
        );
      });

      it('returns a fulfilled promise', function() {
        return expect(promise).to.be.fulfilled;
      });
    });

    context('when the organization ID is not provided', function() {
      it('throws an error', function() {
        const users = new Users(baseSdk, baseRequest, expectedHost);
        const promise = users.activate();

        return expect(promise).to.be.rejectedWith(
          'A user ID is required for activating a user'
        );
      });
    });

    context('when there is missing required user information', function() {
      const requiredFields = ['email', 'password', 'userToken'];

      requiredFields.forEach((field) => {
        it(`it throws an error when ${field} is missing`, function() {
          const payload = {
            email: faker.internet.email(),
            password: faker.internet.password(),
            userToken: faker.random.uuid()
          };

          const users = new Users(baseSdk, baseRequest, expectedHost);
          const promise = users.activate(
            faker.random.uuid(),
            omit(payload, [field])
          );

          return expect(promise).to.be.rejectedWith(
            `A ${field} is required to activate a user.`
          );
        });
      });
    });
  });

  describe('addApplication', function() {
    context('when all the required parameters are provided', function() {
      let expectedUserApplication;
      let promise;
      let request;
      let application;
      let user;
      let userApplicationFromServer;
      let toCamelCase;

      beforeEach(function() {
        application = fixture.build('contxtApplication');
        user = fixture.build('contxtUser');

        expectedUserApplication = fixture.build('contxtUserApplication');
        userApplicationFromServer = fixture.build(
          'contxtUserApplication',
          expectedUserApplication,
          {
            fromServer: true
          }
        );

        request = {
          ...baseRequest,
          post: sinon.stub().resolves(userApplicationFromServer)
        };
        toCamelCase = sinon
          .stub(objectUtils, 'toCamelCase')
          .callsFake((app) => expectedUserApplication);

        const users = new Users(baseSdk, request, expectedHost);
        promise = users.addApplication(user.id, application.id);
      });

      it('posts the user application to the server', function() {
        expect(request.post).to.be.calledWith(
          `${expectedHost}/users/${user.id}/applications/${application.id}`
        );
      });

      it('formats the returned user application', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.calledWith(userApplicationFromServer);
        });
      });

      it('returns a fulfilled promise', function() {
        return expect(promise).to.be.fulfilled;
      });
    });

    context('when the user ID is not provided', function() {
      it('throws an error', function() {
        const application = fixture.build('contxtApplication');

        const users = new Users(baseSdk, baseRequest, expectedHost);
        const promise = users.addApplication(null, application.id);

        return expect(promise).to.be.rejectedWith(
          'A user ID is required for adding a application to a user'
        );
      });
    });

    context('when the application ID is not provided', function() {
      it('throws an error', function() {
        const user = fixture.build('contxtUser');

        const users = new Users(baseSdk, baseRequest, expectedHost);
        const promise = users.addApplication(user.id, null);

        return expect(promise).to.be.rejectedWith(
          'An application ID is required for adding a application to a user'
        );
      });
    });
  });

  describe('addRole', function() {
    context('when all the required parameters are provided', function() {
      let expectedUserRole;
      let promise;
      let request;
      let role;
      let user;
      let userRoleFromServer;
      let toCamelCase;

      beforeEach(function() {
        role = fixture.build('contxtRole');
        user = fixture.build('contxtUser');

        expectedUserRole = fixture.build('contxtUserRole');
        userRoleFromServer = fixture.build('contxtUserRole', expectedUserRole, {
          fromServer: true
        });

        request = {
          ...baseRequest,
          post: sinon.stub().resolves(userRoleFromServer)
        };
        toCamelCase = sinon
          .stub(objectUtils, 'toCamelCase')
          .callsFake((app) => expectedUserRole);

        const users = new Users(baseSdk, request, expectedHost);
        promise = users.addRole(user.id, role.id);
      });

      it('posts the user role to the server', function() {
        expect(request.post).to.be.calledWith(
          `${expectedHost}/users/${user.id}/roles/${role.id}`
        );
      });

      it('formats the returned user role', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.calledWith(userRoleFromServer);
        });
      });

      it('returns a fulfilled promise', function() {
        return expect(promise).to.be.fulfilled;
      });
    });

    context('when the user ID is not provided', function() {
      it('throws an error', function() {
        const role = fixture.build('contxtRole');

        const users = new Users(baseSdk, baseRequest, expectedHost);
        const promise = users.addRole(null, role.id);

        return expect(promise).to.be.rejectedWith(
          'A user ID is required for adding a role to a user'
        );
      });
    });

    context('when the role ID is not provided', function() {
      it('throws an error', function() {
        const user = fixture.build('contxtUser');

        const users = new Users(baseSdk, baseRequest, expectedHost);
        const promise = users.addRole(user.id, null);

        return expect(promise).to.be.rejectedWith(
          'A role ID is required for adding a role to a user'
        );
      });
    });
  });

  describe('addStack', function() {
    context(
      'when all the required parameters are provided and valid',
      function() {
        let expectedUserStack;
        let promise;
        let request;
        let stack;
        let user;
        let userStackFromServer;
        let toCamelCase;

        beforeEach(function() {
          stack = fixture.build('contxtStack');
          user = fixture.build('contxtUser');

          expectedUserStack = fixture.build('contxtUserStack');
          userStackFromServer = fixture.build(
            'contxtUserStack',
            expectedUserStack,
            {
              fromServer: true
            }
          );

          request = {
            ...baseRequest,
            post: sinon.stub().resolves(userStackFromServer)
          };
          toCamelCase = sinon
            .stub(objectUtils, 'toCamelCase')
            .callsFake((app) => expectedUserStack);

          const users = new Users(baseSdk, request, expectedHost);
          promise = users.addStack(
            user.id,
            stack.id,
            expectedUserStack.accessType
          );
        });

        it('posts the user stack to the server', function() {
          expect(request.post).to.be.calledWith(
            `${expectedHost}/users/${user.id}/stacks/${stack.id}`,
            {
              access_type: expectedUserStack.accessType
            }
          );
        });

        it('formats the returned user stack', function() {
          return promise.then(() => {
            expect(toCamelCase).to.be.calledWith(userStackFromServer);
          });
        });

        it('returns a fulfilled promise', function() {
          return expect(promise).to.be.fulfilled;
        });
      }
    );

    context('when the user ID is not provided', function() {
      it('throws an error', function() {
        const stack = fixture.build('contxtStack');
        const userStack = fixture.build('contxtUserStack');

        const users = new Users(baseSdk, baseRequest, expectedHost);
        const promise = users.addStack(null, stack.id, userStack.accessType);

        return expect(promise).to.be.rejectedWith(
          'A user ID is required for adding a stack to a user'
        );
      });
    });

    context('when the stack ID is not provided', function() {
      it('throws an error', function() {
        const user = fixture.build('contxtUser');
        const userStack = fixture.build('contxtUserStack');
        const users = new Users(baseSdk, baseRequest, expectedHost);
        const promise = users.addStack(user.id, null, userStack.accessType);

        return expect(promise).to.be.rejectedWith(
          'A stack ID is required for adding a stack to a user'
        );
      });
    });

    context('when the access type is not provided', function() {
      it('throws an error', function() {
        const user = fixture.build('contxtUser');
        const stack = fixture.build('contxtStack');

        const users = new Users(baseSdk, baseRequest, expectedHost);
        const promise = users.addStack(user.id, stack.id, null);

        return expect(promise).to.be.rejectedWith(
          'An access type of "reader", "collaborator", or "owner" is required for adding a stack to a user'
        );
      });
    });

    context('when the access type is not a valid value', function() {
      it('throws an error', function() {
        const user = fixture.build('contxtUser');
        const stack = fixture.build('contxtStack');

        const users = new Users(baseSdk, baseRequest, expectedHost);
        const promise = users.addStack(user.id, stack.id, faker.random.word());

        return expect(promise).to.be.rejectedWith(
          'An access type of "reader", "collaborator", or "owner" is required for adding a stack to a user'
        );
      });
    });
  });

  describe('get', function() {
    context('the user ID is provided', function() {
      let userFromServerAfterFormat;
      let userFromServerBeforeFormat;
      let expectedUserId;
      let promise;
      let request;
      let toCamelCase;

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

        request = {
          ...baseRequest,
          get: sinon.stub().resolves(userFromServerBeforeFormat)
        };
        toCamelCase = sinon
          .stub(objectUtils, 'toCamelCase')
          .returns(userFromServerAfterFormat);

        const users = new Users(baseSdk, request, expectedHost);
        promise = users.get(expectedUserId);
      });

      it('gets the user from the server', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/users/${expectedUserId}`
        );
      });

      it('formats the user object', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.calledWith(userFromServerBeforeFormat);
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
        const users = new Users(baseSdk, baseRequest, expectedHost);
        const promise = users.get();

        return expect(promise).to.be.rejectedWith(
          'A user ID is required for getting information about a user'
        );
      });
    });
  });

  describe('getByOrganizationId', function() {
    context('legacy API', function() {
      context('the organization ID is provided', function() {
        let expectedOrganizationId;
        let expectedOrganizationUsers;
        let organizationUsersFromServer;
        let promise;
        let request;
        let toCamelCase;

        beforeEach(function() {
          expectedOrganizationId = faker.random.uuid();

          expectedOrganizationUsers = fixture.buildList(
            'contxtUser',
            faker.random.number({ min: 1, max: 10 })
          );

          organizationUsersFromServer = expectedOrganizationUsers.map((user) =>
            fixture.build('contxtUser', user, { fromServer: true })
          );

          request = {
            ...baseRequest,
            get: sinon.stub().resolves(organizationUsersFromServer)
          };

          toCamelCase = sinon
            .stub(objectUtils, 'toCamelCase')
            .returns(expectedOrganizationUsers);

          const users = new Users(baseSdk, request, expectedHost);
          promise = users.getByOrganizationId(expectedOrganizationId);
        });

        it('gets the user list from the server', function() {
          expect(request.get).to.be.calledWith(
            `${expectedHost}/organizations/${expectedOrganizationId}/users`
          );
        });

        it('formats the list of organization users', function() {
          return promise.then(() => {
            expect(toCamelCase).to.be.calledWith(organizationUsersFromServer);
          });
        });

        it('returns the list of users by requested organization', function() {
          return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
            expectedOrganizationUsers
          );
        });
      });

      context('the organization ID is not provided', function() {
        it('throws an error', function() {
          const users = new Users(baseSdk, baseRequest, expectedHost);
          const promise = users.getByOrganizationId();

          return expect(promise).to.be.rejectedWith(
            'An organization ID is required for getting a list of users for an organization'
          );
        });
      });
    });

    context('tenant API', function() {
      let expectedOrganizationId;
      let expectedOrganizationUsers;
      let organizationUsersFromServer;
      let promise;
      let request;
      let toCamelCase;
      let users;

      beforeEach(function() {
        expectedOrganizationId = faker.random.uuid();

        expectedOrganizationUsers = fixture.buildList(
          'contxtUser',
          faker.random.number({ min: 1, max: 10 })
        );

        organizationUsersFromServer = expectedOrganizationUsers.map((user) =>
          fixture.build('contxtUser', user, { fromServer: true })
        );

        request = {
          ...baseRequest,
          get: sinon.stub().resolves(organizationUsersFromServer)
        };

        toCamelCase = sinon
          .stub(objectUtils, 'toCamelCase')
          .returns(expectedOrganizationUsers);

        users = new Users(
          baseSdk,
          request,
          expectedHost,
          expectedOrganizationId
        );
      });

      context('the organization ID is provided', function() {
        beforeEach(function() {
          promise = users.getByOrganizationId(expectedOrganizationId);
        });

        it('gets the user list from the server', function() {
          expect(request.get).to.be.calledWith(`${expectedHost}/users`);
        });

        it('formats the list of organization users', function() {
          return promise.then(() => {
            expect(toCamelCase).to.be.calledWith(organizationUsersFromServer);
          });
        });

        it('returns the list of users by requested organization', function() {
          return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
            expectedOrganizationUsers
          );
        });
      });

      context('the organization ID is not provided', function() {
        beforeEach(function() {
          promise = users.getByOrganizationId();
        });

        it('gets the user list from the server', function() {
          expect(request.get).to.be.calledWith(`${expectedHost}/users`);
        });

        it('formats the list of organization users', function() {
          return promise.then(() => {
            expect(toCamelCase).to.be.calledWith(organizationUsersFromServer);
          });
        });

        it('returns the list of users by requested organization', function() {
          return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
            expectedOrganizationUsers
          );
        });
      });
    });
  });

  describe('invite', function() {
    context('legacy API', function() {
      context('when all the required parameters are provided', function() {
        let organization;
        let newUserPayload;
        let newUserPayloadToServer;
        let expectedNewUser;
        let newUserFromServer;
        let promise;
        let request;
        let toCamelCase;
        let toSnakeCase;

        beforeEach(function() {
          organization = fixture.build('contxtOrganization');

          expectedNewUser = fixture.build('contxtUser');
          newUserFromServer = fixture.build('contxtUser', expectedNewUser, {
            fromServer: true
          });

          newUserPayload = {
            email: expectedNewUser.email,
            firstName: expectedNewUser.firstName,
            lastName: expectedNewUser.lastName,
            redirectUrl: faker.internet.url()
          };

          newUserPayloadToServer = {
            email: newUserPayload.email,
            first_name: newUserPayload.firstName,
            last_name: newUserPayload.lastName,
            redirect_url: newUserPayload.redirectUrl
          };

          request = {
            ...baseRequest,
            post: sinon.stub().resolves(newUserFromServer)
          };
          toCamelCase = sinon
            .stub(objectUtils, 'toCamelCase')
            .callsFake(() => expectedNewUser);

          toSnakeCase = sinon
            .stub(objectUtils, 'toSnakeCase')
            .callsFake(() => newUserPayloadToServer);

          const users = new Users(baseSdk, request, expectedHost);
          promise = users.invite(organization.id, newUserPayload);
        });

        it('formats the user payload', function() {
          return promise.then(() => {
            expect(toSnakeCase).to.be.calledWith(newUserPayload);
          });
        });

        it('posts the new user to the server', function() {
          expect(request.post).to.be.calledWith(
            `${expectedHost}/organizations/${organization.id}/users`,
            newUserPayloadToServer
          );
        });

        it('formats the user response', function() {
          return promise.then(() => {
            expect(toCamelCase).to.be.calledWith(newUserFromServer);
          });
        });

        it('returns a fulfilled promise with the new user', function() {
          return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
            expectedNewUser
          );
        });
      });

      context('when the organization ID is not provided', function() {
        it('throws an error', function() {
          const users = new Users(baseSdk, baseRequest, expectedHost);
          const promise = users.invite();

          return expect(promise).to.be.rejectedWith(
            'An organization ID is required for inviting a new user'
          );
        });
      });

      context('when there is missing required user information', function() {
        const requiredFields = [
          'email',
          'firstName',
          'lastName',
          'redirectUrl'
        ];

        requiredFields.forEach((field) => {
          it(`it throws an error when ${field} is missing`, function() {
            const newUserPayload = {
              email: faker.internet.email(),
              firstName: faker.name.firstName(),
              lastName: faker.name.lastName(),
              redirectUrl: faker.internet.url()
            };

            const users = new Users(baseSdk, baseRequest, expectedHost);
            const promise = users.invite(
              faker.random.uuid(),
              omit(newUserPayload, [field])
            );

            return expect(promise).to.be.rejectedWith(
              `A ${field} is required to create a new user.`
            );
          });
        });
      });
    });

    context('tenant API', function() {
      let organization;
      let newUserPayload;
      let newUserPayloadToServer;
      let expectedNewUser;
      let newUserFromServer;
      let promise;
      let request;
      let toCamelCase;
      let toSnakeCase;
      let users;

      beforeEach(function() {
        organization = fixture.build('organization');

        expectedNewUser = fixture.build('contxtUser');
        newUserFromServer = fixture.build('contxtUser', expectedNewUser, {
          fromServer: true
        });

        newUserPayload = {
          email: expectedNewUser.email,
          firstName: expectedNewUser.firstName,
          lastName: expectedNewUser.lastName,
          redirectUrl: faker.internet.url()
        };

        newUserPayloadToServer = {
          email: newUserPayload.email,
          first_name: newUserPayload.firstName,
          last_name: newUserPayload.lastName,
          redirect_url: newUserPayload.redirectUrl
        };

        request = {
          ...baseRequest,
          post: sinon.stub().resolves(newUserFromServer)
        };
        toCamelCase = sinon
          .stub(objectUtils, 'toCamelCase')
          .callsFake(() => expectedNewUser);

        toSnakeCase = sinon
          .stub(objectUtils, 'toSnakeCase')
          .callsFake(() => newUserPayloadToServer);

        users = new Users(baseSdk, request, expectedHost, organization.id);
      });

      context('when all the parameters are provided', function() {
        beforeEach(function() {
          promise = users.invite(organization.id, newUserPayload);
        });

        it('formats the user payload', function() {
          return promise.then(() => {
            expect(toSnakeCase).to.be.calledWith(newUserPayload);
          });
        });

        it('posts the new user to the server', function() {
          expect(request.post).to.be.calledWith(
            `${expectedHost}/users`,
            newUserPayloadToServer
          );
        });

        it('formats the user response', function() {
          return promise.then(() => {
            expect(toCamelCase).to.be.calledWith(newUserFromServer);
          });
        });

        it('returns a fulfilled promise with the new user', function() {
          return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
            expectedNewUser
          );
        });
      });

      context('when the organization ID is not provided', function() {
        beforeEach(function() {
          promise = users.invite(null, newUserPayload);
        });

        it('formats the user payload', function() {
          return promise.then(() => {
            expect(toSnakeCase).to.be.calledWith(newUserPayload);
          });
        });

        it('posts the new user to the server', function() {
          expect(request.post).to.be.calledWith(
            `${expectedHost}/users`,
            newUserPayloadToServer
          );
        });

        it('formats the user response', function() {
          return promise.then(() => {
            expect(toCamelCase).to.be.calledWith(newUserFromServer);
          });
        });

        it('returns a fulfilled promise with the new user', function() {
          return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
            expectedNewUser
          );
        });
      });

      context('when there is missing required user information', function() {
        const requiredFields = [
          'email',
          'firstName',
          'lastName',
          'redirectUrl'
        ];

        requiredFields.forEach((field) => {
          it(`it throws an error when ${field} is missing`, function() {
            const organization = fixture.build('organization');
            const newUserPayload = {
              email: faker.internet.email(),
              firstName: faker.name.firstName(),
              lastName: faker.name.lastName(),
              redirectUrl: faker.internet.url()
            };

            const users = new Users(
              baseSdk,
              baseRequest,
              expectedHost,
              organization.id
            );
            const promise = users.invite(
              faker.random.uuid(),
              omit(newUserPayload, [field])
            );

            return expect(promise).to.be.rejectedWith(
              `A ${field} is required to create a new user.`
            );
          });
        });
      });
    });
  });

  describe('remove', function() {
    context('legacy API', function() {
      context('when all required parameters are provided', function() {
        let organization;
        let user;
        let promise;

        beforeEach(function() {
          organization = fixture.build('contxtOrganization');
          user = fixture.build('contxtUser');

          const users = new Users(baseSdk, baseRequest, expectedHost);
          promise = users.remove(organization.id, user.id);
        });

        it('sends a request to remove the user from the organization', function() {
          expect(baseRequest.delete).to.be.calledWith(
            `${expectedHost}/organizations/${organization.id}/users/${user.id}`
          );
        });

        it('returns a resolved promise', function() {
          return expect(promise).to.be.fulfilled;
        });
      });

      context('when the organization ID is not provided', function() {
        it('throws an error', function() {
          const users = new Users(baseSdk, baseRequest, expectedHost);
          const promise = users.remove(null, faker.random.uuid());

          return expect(promise).to.be.rejectedWith(
            'An organization ID is required for removing a user from an organization'
          );
        });
      });

      context('when the user ID is not provided', function() {
        it('throws an error', function() {
          const users = new Users(baseSdk, baseRequest, expectedHost);
          const promise = users.remove(faker.random.uuid(), null);

          return expect(promise).to.be.rejectedWith(
            'A user ID is required for removing a user from an organization'
          );
        });
      });
    });

    context('tenant API', function() {
      let organization;
      let user;
      let users;
      let promise;

      beforeEach(function() {
        organization = fixture.build('organization');
        user = fixture.build('contxtUser');

        users = new Users(baseSdk, baseRequest, expectedHost, organization.id);
      });

      context('when all parameters are provided', function() {
        beforeEach(function() {
          promise = users.remove(organization.id, user.id);
        });

        it('sends a request to remove the user from the organization', function() {
          expect(baseRequest.delete).to.be.calledWith(
            `${expectedHost}/users/${user.id}`
          );
        });

        it('returns a resolved promise', function() {
          return expect(promise).to.be.fulfilled;
        });
      });

      context('when the organization ID is not provided', function() {
        beforeEach(function() {
          promise = users.remove(null, user.id);
        });

        it('sends a request to remove the user from the organization', function() {
          expect(baseRequest.delete).to.be.calledWith(
            `${expectedHost}/users/${user.id}`
          );
        });

        it('returns a resolved promise', function() {
          return expect(promise).to.be.fulfilled;
        });
      });

      context('when the user ID is not provided', function() {
        it('throws an error', function() {
          const organization = fixture.build('organization');
          const users = new Users(
            baseSdk,
            baseRequest,
            expectedHost,
            organization.id
          );
          const promise = users.remove(organization.id, null);

          return expect(promise).to.be.rejectedWith(
            'A user ID is required for removing a user from an organization'
          );
        });
      });
    });
  });

  describe('removeApplication', function() {
    context('when all required parameters are provided', function() {
      let application;
      let user;
      let promise;

      beforeEach(function() {
        application = fixture.build('contxtApplication');
        user = fixture.build('contxtUser');

        const users = new Users(baseSdk, baseRequest, expectedHost);
        promise = users.removeApplication(user.id, application.id);
      });

      it('sends a request to removeApplication the user from the organization', function() {
        expect(baseRequest.delete).to.be.calledWith(
          `${expectedHost}/users/${user.id}/applications/${application.id}`
        );
      });

      it('returns a resolved promise', function() {
        return expect(promise).to.be.fulfilled;
      });
    });

    context('when the user ID is not provided', function() {
      it('throws an error', function() {
        const application = fixture.build('contxtApplication');
        const users = new Users(baseSdk, baseRequest, expectedHost);
        const promise = users.removeApplication(null, application.id);

        return expect(promise).to.be.rejectedWith(
          'A user ID is required for removing a application from a user'
        );
      });
    });

    context('when the application ID is not provided', function() {
      it('throws an error', function() {
        const user = fixture.build('contxtUser');
        const users = new Users(baseSdk, baseRequest, expectedHost);
        const promise = users.removeApplication(user.id, null);

        return expect(promise).to.be.rejectedWith(
          'An application ID is required for removing a application from a user'
        );
      });
    });
  });

  describe('removeRole', function() {
    context('when all required parameters are provided', function() {
      let role;
      let user;
      let promise;

      beforeEach(function() {
        role = fixture.build('contxtRole');
        user = fixture.build('contxtUser');

        const users = new Users(baseSdk, baseRequest, expectedHost);
        promise = users.removeRole(user.id, role.id);
      });

      it('sends a request to removeRole the user from the organization', function() {
        expect(baseRequest.delete).to.be.calledWith(
          `${expectedHost}/users/${user.id}/roles/${role.id}`
        );
      });

      it('returns a resolved promise', function() {
        return expect(promise).to.be.fulfilled;
      });
    });

    context('when the user ID is not provided', function() {
      it('throws an error', function() {
        const role = fixture.build('contxtRole');
        const users = new Users(baseSdk, baseRequest, expectedHost);
        const promise = users.removeRole(null, role.id);

        return expect(promise).to.be.rejectedWith(
          'A user ID is required for removing a role from a user'
        );
      });
    });

    context('when the role ID is not provided', function() {
      it('throws an error', function() {
        const user = fixture.build('contxtUser');
        const users = new Users(baseSdk, baseRequest, expectedHost);
        const promise = users.removeRole(user.id, null);

        return expect(promise).to.be.rejectedWith(
          'A role ID is required for removing a role from a user'
        );
      });
    });
  });

  describe('removeStack', function() {
    context('when all required parameters are provided', function() {
      let stack;
      let user;
      let promise;

      beforeEach(function() {
        stack = fixture.build('contxtStack');
        user = fixture.build('contxtUser');

        const users = new Users(baseSdk, baseRequest, expectedHost);
        promise = users.removeStack(user.id, stack.id);
      });

      it('sends a request to removeStack the user from the organization', function() {
        expect(baseRequest.delete).to.be.calledWith(
          `${expectedHost}/users/${user.id}/stacks/${stack.id}`
        );
      });

      it('returns a resolved promise', function() {
        return expect(promise).to.be.fulfilled;
      });
    });

    context('when the user ID is not provided', function() {
      it('throws an error', function() {
        const stack = fixture.build('contxtStack');
        const users = new Users(baseSdk, baseRequest, expectedHost);
        const promise = users.removeStack(null, stack.id);

        return expect(promise).to.be.rejectedWith(
          'A user ID is required for removing a stack from a user'
        );
      });
    });

    context('when the stack ID is not provided', function() {
      it('throws an error', function() {
        const user = fixture.build('contxtUser');
        const users = new Users(baseSdk, baseRequest, expectedHost);
        const promise = users.removeStack(user.id, null);

        return expect(promise).to.be.rejectedWith(
          'A stack ID is required for removing a stack from a user'
        );
      });
    });
  });

  describe('sync', function() {
    context('when all required parameters are present', function() {
      let user;
      let promise;

      beforeEach(function() {
        user = fixture.build('contxtUser');

        const users = new Users(baseSdk, baseRequest, expectedHost);
        promise = users.sync(user.id);
      });

      it('sends a request to sync user permissions', function() {
        expect(baseRequest.get).to.be.calledWith(
          `${expectedHost}/users/${user.id}/sync`
        );
      });

      it('returns a resolved promise', function() {
        return expect(promise).to.be.fulfilled;
      });
    });

    context('when the user ID is not provided', function() {
      it('throws an error', function() {
        const users = new Users(baseSdk, baseRequest, expectedHost);
        const promise = users.sync(null);

        return expect(promise).to.be.rejectedWith(
          'A user ID is required for syncing user permissions'
        );
      });
    });
  });
});

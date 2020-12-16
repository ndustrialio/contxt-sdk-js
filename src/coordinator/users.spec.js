import axios from 'axios';
import omit from 'lodash.omit';

import Users from './users';
import * as objectUtils from '../utils/objects';
import { expect } from 'chai';

describe('Coordinator/Users', function() {
  let baseRequest;
  let baseSdk;
  let expectedBaseUrl;
  let expectedTenantBaseUrl;
  let expectedLegacyBaseUrl;

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
    expectedBaseUrl = faker.internet.url();
    expectedTenantBaseUrl = faker.internet.url();
    expectedLegacyBaseUrl = faker.internet.url();
  });

  afterEach(function() {
    sinon.restore();
  });

  describe('constructor', function() {
    context(
      'when an organization ID and additional base URLs provided',
      function() {
        let organizationId;
        let users;

        beforeEach(function() {
          organizationId = fixture.build('organization').id;

          users = new Users(
            baseSdk,
            baseRequest,
            expectedBaseUrl,
            expectedTenantBaseUrl,
            expectedLegacyBaseUrl,
            organizationId
          );
        });

        it('sets a base url for the class instance', function() {
          expect(users._baseUrl).to.equal(expectedBaseUrl);
        });

        it('sets a tenant base url for the class instance', function() {
          expect(users._tenantBaseUrl).to.equal(expectedTenantBaseUrl);
        });

        it('sets a legacy base url for the class instance', function() {
          expect(users._legacyBaseUrl).to.equal(expectedLegacyBaseUrl);
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
      }
    );

    context(
      'when an organization ID and additional base URLs are not provided',
      function() {
        let users;

        beforeEach(function() {
          users = new Users(baseSdk, baseRequest, expectedLegacyBaseUrl);
        });

        it('sets a base url for the class instance', function() {
          expect(users._baseUrl).to.equal(expectedLegacyBaseUrl);
        });

        it('sets the tenant base url for the class instance to null', function() {
          expect(users._tenantBaseUrl).to.equal(null);
        });

        it('sets the legacy base url for the class instance to null', function() {
          expect(users._legacyBaseUrl).to.equal(null);
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
      }
    );
  });

  describe('_getBaseUrl', function() {
    context('when additional base URLs are provided', function() {
      let users;

      beforeEach(function() {
        const organizationId = fixture.build('organization').id;

        users = new Users(
          baseSdk,
          baseRequest,
          expectedBaseUrl,
          expectedTenantBaseUrl,
          expectedLegacyBaseUrl,
          organizationId
        );
      });

      it('returns the legacy base URL when requesting', function() {
        expect(users._getBaseUrl('legacy')).to.equal(expectedLegacyBaseUrl);
      });

      it('returns the access base URL', function() {
        expect(users._getBaseUrl('access')).to.equal(expectedBaseUrl);
      });

      it('returns the tenant base URL', function() {
        expect(users._getBaseUrl()).to.equal(expectedTenantBaseUrl);
      });
    });

    context('when only a legacy base URL is provided', function() {
      let users;

      beforeEach(function() {
        users = new Users(baseSdk, baseRequest, expectedLegacyBaseUrl);
      });

      it('returns the legacy base URL', function() {
        expect(users._getBaseUrl('legacy')).to.equal(expectedLegacyBaseUrl);
      });

      it('returns the legacy base URL when requesting an access base URL', function() {
        expect(users._getBaseUrl('access')).to.equal(expectedLegacyBaseUrl);
      });

      it('returns the legacy base URL when requesting a tenant base URL', function() {
        expect(users._getBaseUrl()).to.equal(expectedLegacyBaseUrl);
      });
    });
  });

  describe('activate', function() {
    context('when all the required parameters are provided', function() {
      let getBaseUrl;
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

        const users = new Users(baseSdk, request, expectedBaseUrl);

        getBaseUrl = sinon.stub(users, '_getBaseUrl').returns(expectedBaseUrl);

        promise = users.activate(user.id, userActivationPayload);
      });

      it('formats the user payload', function() {
        return promise.then(() => {
          expect(toSnakeCase).to.be.calledWith(userActivationPayload);
        });
      });

      it('gets the base URL', function() {
        return promise.then(() => {
          expect(getBaseUrl).to.be.calledOnceWith('access');
        });
      });

      it('posts the new user to the server', function() {
        expect(axios.post).to.be.calledWith(
          `${expectedBaseUrl}/users/${user.id}/activate`,
          userActivationPayloadToServer
        );
      });

      it('returns a fulfilled promise', function() {
        return expect(promise).to.be.fulfilled;
      });
    });

    context('when the organization ID is not provided', function() {
      it('throws an error', function() {
        const users = new Users(baseSdk, baseRequest, expectedBaseUrl);
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

          const users = new Users(baseSdk, baseRequest, expectedBaseUrl);
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
      let getBaseUrl;
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

        const users = new Users(baseSdk, request, expectedTenantBaseUrl);

        getBaseUrl = sinon
          .stub(users, '_getBaseUrl')
          .returns(expectedTenantBaseUrl);

        promise = users.addApplication(user.id, application.id);
      });

      it('gets the base url', function() {
        expect(getBaseUrl).to.be.calledOnceWith();
      });

      it('posts the user application to the server', function() {
        expect(request.post).to.be.calledWith(
          `${expectedTenantBaseUrl}/users/${user.id}/applications/${
            application.id
          }`
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

        const users = new Users(baseSdk, baseRequest, expectedTenantBaseUrl);
        const promise = users.addApplication(null, application.id);

        return expect(promise).to.be.rejectedWith(
          'A user ID is required for adding a application to a user'
        );
      });
    });

    context('when the application ID is not provided', function() {
      it('throws an error', function() {
        const user = fixture.build('contxtUser');

        const users = new Users(baseSdk, baseRequest, expectedTenantBaseUrl);
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
      let getBaseUrl;
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

        const users = new Users(baseSdk, request, expectedTenantBaseUrl);

        getBaseUrl = sinon
          .stub(users, '_getBaseUrl')
          .returns(expectedTenantBaseUrl);

        promise = users.addRole(user.id, role.id);
      });

      it('gets the base url', function() {
        expect(getBaseUrl).to.be.calledOnceWith();
      });

      it('posts the user role to the server', function() {
        expect(request.post).to.be.calledWith(
          `${expectedTenantBaseUrl}/users/${user.id}/roles/${role.id}`
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

        const users = new Users(baseSdk, baseRequest, expectedTenantBaseUrl);
        const promise = users.addRole(null, role.id);

        return expect(promise).to.be.rejectedWith(
          'A user ID is required for adding a role to a user'
        );
      });
    });

    context('when the role ID is not provided', function() {
      it('throws an error', function() {
        const user = fixture.build('contxtUser');

        const users = new Users(baseSdk, baseRequest, expectedTenantBaseUrl);
        const promise = users.addRole(user.id, null);

        return expect(promise).to.be.rejectedWith(
          'A role ID is required for adding a role to a user'
        );
      });
    });
  });

  describe('addProject', function() {
    context(
      'when all the required parameters are provided and valid',
      function() {
        let expectedUserProject;
        let getBaseUrl;
        let promise;
        let request;
        let project;
        let user;
        let userProjectFromServer;
        let toCamelCase;

        beforeEach(function() {
          project = fixture.build('contxtProject');
          user = fixture.build('contxtUser');

          expectedUserProject = fixture.build('contxtUserProject');
          userProjectFromServer = fixture.build(
            'contxtUserProject',
            expectedUserProject,
            {
              fromServer: true
            }
          );

          request = {
            ...baseRequest,
            post: sinon.stub().resolves(userProjectFromServer)
          };
          toCamelCase = sinon
            .stub(objectUtils, 'toCamelCase')
            .callsFake((app) => expectedUserProject);

          const users = new Users(baseSdk, request, expectedTenantBaseUrl);

          getBaseUrl = sinon
            .stub(users, '_getBaseUrl')
            .returns(expectedTenantBaseUrl);

          promise = users.addProject(
            user.id,
            project.slug,
            expectedUserProject.accessType
          );
        });

        it('gets the base url', function() {
          expect(getBaseUrl).to.be.calledOnceWith();
        });

        it('posts the user project to the server', function() {
          expect(request.post).to.be.calledWith(
            `${expectedTenantBaseUrl}/users/${user.id}/projects/${
              project.slug
            }`,
            {
              access_type: expectedUserProject.accessType
            }
          );
        });

        it('formats the returned user project', function() {
          return promise.then(() => {
            expect(toCamelCase).to.be.calledWith(userProjectFromServer);
          });
        });

        it('returns a fulfilled promise', function() {
          return expect(promise).to.be.fulfilled;
        });
      }
    );

    context('when the user ID is not provided', function() {
      it('throws an error', function() {
        const project = fixture.build('contxtProject');
        const userProject = fixture.build('contxtUserProject');

        const users = new Users(baseSdk, baseRequest, expectedTenantBaseUrl);
        const promise = users.addProject(
          null,
          project.slug,
          userProject.accessType
        );

        return expect(promise).to.be.rejectedWith(
          'A user ID is required for adding a project to a user'
        );
      });
    });

    context('when the project slug is not provided', function() {
      it('throws an error', function() {
        const user = fixture.build('contxtUser');
        const userProject = fixture.build('contxtUserProject');
        const users = new Users(baseSdk, baseRequest, expectedTenantBaseUrl);
        const promise = users.addProject(user.id, null, userProject.accessType);

        return expect(promise).to.be.rejectedWith(
          'A project slug is required for adding a project to a user'
        );
      });
    });

    context('when the access type is not provided', function() {
      it('throws an error', function() {
        const user = fixture.build('contxtUser');
        const project = fixture.build('contxtProject');

        const users = new Users(baseSdk, baseRequest, expectedTenantBaseUrl);
        const promise = users.addProject(user.id, project.slug, null);

        return expect(promise).to.be.rejectedWith(
          'An access type of "reader" or "admin" is required for adding a project to a user'
        );
      });
    });

    context('when the access type is not a valid value', function() {
      it('throws an error', function() {
        const user = fixture.build('contxtUser');
        const project = fixture.build('contxtProject');

        const users = new Users(baseSdk, baseRequest, expectedTenantBaseUrl);
        const promise = users.addProject(
          user.id,
          project.slug,
          faker.random.word()
        );

        return expect(promise).to.be.rejectedWith(
          'An access type of "reader" or "admin" is required for adding a project to a user'
        );
      });
    });
  });

  describe('get', function() {
    context('the user ID is provided', function() {
      let userFromServerAfterFormat;
      let userFromServerBeforeFormat;
      let expectedUserId;
      let getBaseUrl;
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

        const users = new Users(baseSdk, request, expectedBaseUrl);

        getBaseUrl = sinon.stub(users, '_getBaseUrl').returns(expectedBaseUrl);

        promise = users.get(expectedUserId);
      });

      it('gets the base url', function() {
        expect(getBaseUrl).to.be.calledOnceWith('access');
      });

      it('gets the user from the server', function() {
        expect(request.get).to.be.calledWith(
          `${expectedBaseUrl}/users/${expectedUserId}`
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
        const users = new Users(baseSdk, baseRequest, expectedBaseUrl);
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
        let getBaseUrl;
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

          const users = new Users(baseSdk, request, expectedLegacyBaseUrl);

          getBaseUrl = sinon
            .stub(users, '_getBaseUrl')
            .returns(expectedLegacyBaseUrl);

          promise = users.getByOrganizationId(expectedOrganizationId);
        });

        it('gets the base url', function() {
          expect(getBaseUrl).to.be.calledOnceWith('legacy');
        });

        it('gets the user list from the server', function() {
          expect(request.get).to.be.calledWith(
            `${expectedLegacyBaseUrl}/organizations/${expectedOrganizationId}/users`
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
          const users = new Users(baseSdk, baseRequest, expectedLegacyBaseUrl);
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
      let getBaseUrl;
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
          expectedBaseUrl,
          expectedTenantBaseUrl,
          expectedLegacyBaseUrl,
          expectedOrganizationId
        );

        getBaseUrl = sinon
          .stub(users, '_getBaseUrl')
          .returns(expectedTenantBaseUrl);
      });

      context('the organization ID is provided', function() {
        beforeEach(function() {
          promise = users.getByOrganizationId(expectedOrganizationId);
        });

        it('gets the base url', function() {
          expect(getBaseUrl).to.be.calledOnceWith();
        });

        it('gets the user list from the server', function() {
          expect(request.get).to.be.calledWith(
            `${expectedTenantBaseUrl}/users`
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
    });
  });

  describe('invite', function() {
    context('legacy API', function() {
      context('when all the required parameters are provided', function() {
        let organization;
        let newUserPayload;
        let newUserPayloadToServer;
        let expectedNewUser;
        let getBaseUrl;
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

          const users = new Users(baseSdk, request, expectedLegacyBaseUrl);

          getBaseUrl = sinon
            .stub(users, '_getBaseUrl')
            .returns(expectedLegacyBaseUrl);

          promise = users.invite(organization.id, newUserPayload);
        });

        it('formats the user payload', function() {
          return promise.then(() => {
            expect(toSnakeCase).to.be.calledWith(newUserPayload);
          });
        });

        it('gets the base url', function() {
          expect(getBaseUrl).to.be.calledOnceWith('legacy');
        });

        it('posts the new user to the server', function() {
          expect(request.post).to.be.calledWith(
            `${expectedLegacyBaseUrl}/organizations/${organization.id}/users`,
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
          const users = new Users(baseSdk, baseRequest, expectedLegacyBaseUrl);
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

            const users = new Users(
              baseSdk,
              baseRequest,
              expectedLegacyBaseUrl
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

    context('tenant API', function() {
      let organization;
      let newUserPayload;
      let newUserPayloadToServer;
      let expectedNewUser;
      let getBaseUrl;
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

        users = new Users(
          baseSdk,
          request,
          expectedBaseUrl,
          expectedTenantBaseUrl,
          expectedLegacyBaseUrl,
          organization.id
        );

        getBaseUrl = sinon
          .stub(users, '_getBaseUrl')
          .returns(expectedTenantBaseUrl);
      });

      context('when all the parameters are provided', function() {
        beforeEach(function() {
          promise = users.invite(organization.id, newUserPayload);
        });

        it('gets the base url', function() {
          expect(getBaseUrl).to.be.calledOnceWith();
        });

        it('formats the user payload', function() {
          return promise.then(() => {
            expect(toSnakeCase).to.be.calledWith(newUserPayload);
          });
        });

        it('posts the new user to the server', function() {
          expect(request.post).to.be.calledWith(
            `${expectedTenantBaseUrl}/users`,
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
              request,
              expectedBaseUrl,
              expectedTenantBaseUrl,
              expectedLegacyBaseUrl,
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
        let getBaseUrl;
        let organization;
        let user;
        let promise;

        beforeEach(function() {
          organization = fixture.build('contxtOrganization');
          user = fixture.build('contxtUser');

          const users = new Users(baseSdk, baseRequest, expectedLegacyBaseUrl);

          getBaseUrl = sinon
            .stub(users, '_getBaseUrl')
            .returns(expectedLegacyBaseUrl);

          promise = users.remove(organization.id, user.id);
        });

        it('gets the base url', function() {
          expect(getBaseUrl).to.be.calledOnceWith('legacy');
        });

        it('sends a request to remove the user from the organization', function() {
          expect(baseRequest.delete).to.be.calledWith(
            `${expectedLegacyBaseUrl}/organizations/${organization.id}/users/${
              user.id
            }`
          );
        });

        it('returns a resolved promise', function() {
          return expect(promise).to.be.fulfilled;
        });
      });

      context('when the organization ID is not provided', function() {
        it('throws an error', function() {
          const users = new Users(baseSdk, baseRequest, expectedLegacyBaseUrl);
          const promise = users.remove(null, faker.random.uuid());

          return expect(promise).to.be.rejectedWith(
            'An organization ID is required for removing a user from an organization'
          );
        });
      });

      context('when the user ID is not provided', function() {
        it('throws an error', function() {
          const users = new Users(baseSdk, baseRequest, expectedLegacyBaseUrl);
          const promise = users.remove(faker.random.uuid(), null);

          return expect(promise).to.be.rejectedWith(
            'A user ID is required for removing a user from an organization'
          );
        });
      });
    });

    context('tenant API', function() {
      let getBaseUrl;
      let organization;
      let user;
      let users;
      let promise;

      beforeEach(function() {
        organization = fixture.build('organization');
        user = fixture.build('contxtUser');

        users = new Users(
          baseSdk,
          baseRequest,
          expectedBaseUrl,
          expectedTenantBaseUrl,
          expectedLegacyBaseUrl,
          organization.id
        );

        getBaseUrl = sinon
          .stub(users, '_getBaseUrl')
          .returns(expectedTenantBaseUrl);
      });

      context('when all parameters are provided', function() {
        beforeEach(function() {
          promise = users.remove(organization.id, user.id);
        });

        it('gets the base url', function() {
          expect(getBaseUrl).to.be.calledOnceWith();
        });

        it('sends a request to remove the user from the organization', function() {
          expect(baseRequest.delete).to.be.calledWith(
            `${expectedTenantBaseUrl}/users/${user.id}`
          );
        });

        it('returns a resolved promise', function() {
          return expect(promise).to.be.fulfilled;
        });
      });
    });
  });

  describe('removeApplication', function() {
    context('when all required parameters are provided', function() {
      let application;
      let getBaseUrl;
      let user;
      let promise;

      beforeEach(function() {
        application = fixture.build('contxtApplication');
        user = fixture.build('contxtUser');

        const users = new Users(baseSdk, baseRequest, expectedLegacyBaseUrl);

        getBaseUrl = sinon
          .stub(users, '_getBaseUrl')
          .returns(expectedLegacyBaseUrl);

        promise = users.removeApplication(user.id, application.id);
      });

      it('gets the base url', function() {
        expect(getBaseUrl).to.be.calledOnceWith();
      });

      it('sends a request to removeApplication the user from the organization', function() {
        expect(baseRequest.delete).to.be.calledWith(
          `${expectedLegacyBaseUrl}/users/${user.id}/applications/${
            application.id
          }`
        );
      });

      it('returns a resolved promise', function() {
        return expect(promise).to.be.fulfilled;
      });
    });

    context('when the user ID is not provided', function() {
      it('throws an error', function() {
        const application = fixture.build('contxtApplication');
        const users = new Users(baseSdk, baseRequest, expectedLegacyBaseUrl);
        const promise = users.removeApplication(null, application.id);

        return expect(promise).to.be.rejectedWith(
          'A user ID is required for removing a application from a user'
        );
      });
    });

    context('when the application ID is not provided', function() {
      it('throws an error', function() {
        const user = fixture.build('contxtUser');
        const users = new Users(baseSdk, baseRequest, expectedLegacyBaseUrl);
        const promise = users.removeApplication(user.id, null);

        return expect(promise).to.be.rejectedWith(
          'An application ID is required for removing a application from a user'
        );
      });
    });
  });

  describe('removeRole', function() {
    context('when all required parameters are provided', function() {
      let getBaseUrl;
      let role;
      let user;
      let promise;

      beforeEach(function() {
        role = fixture.build('contxtRole');
        user = fixture.build('contxtUser');

        const users = new Users(baseSdk, baseRequest, expectedTenantBaseUrl);

        getBaseUrl = sinon
          .stub(users, '_getBaseUrl')
          .returns(expectedTenantBaseUrl);

        promise = users.removeRole(user.id, role.id);
      });

      it('gets the base url', function() {
        expect(getBaseUrl).to.be.calledOnceWith();
      });

      it('sends a request to removeRole the user from the organization', function() {
        expect(baseRequest.delete).to.be.calledWith(
          `${expectedTenantBaseUrl}/users/${user.id}/roles/${role.id}`
        );
      });

      it('returns a resolved promise', function() {
        return expect(promise).to.be.fulfilled;
      });
    });

    context('when the user ID is not provided', function() {
      it('throws an error', function() {
        const role = fixture.build('contxtRole');
        const users = new Users(baseSdk, baseRequest, expectedTenantBaseUrl);
        const promise = users.removeRole(null, role.id);

        return expect(promise).to.be.rejectedWith(
          'A user ID is required for removing a role from a user'
        );
      });
    });

    context('when the role ID is not provided', function() {
      it('throws an error', function() {
        const user = fixture.build('contxtUser');
        const users = new Users(baseSdk, baseRequest, expectedTenantBaseUrl);
        const promise = users.removeRole(user.id, null);

        return expect(promise).to.be.rejectedWith(
          'A role ID is required for removing a role from a user'
        );
      });
    });
  });

  describe('removeProject', function() {
    context('when all required parameters are provided', function() {
      let getBaseUrl;
      let project;
      let user;
      let promise;

      beforeEach(function() {
        project = fixture.build('contxtProject');
        user = fixture.build('contxtUser');

        const users = new Users(baseSdk, baseRequest, expectedTenantBaseUrl);

        getBaseUrl = sinon
          .stub(users, '_getBaseUrl')
          .returns(expectedTenantBaseUrl);

        promise = users.removeProject(user.id, project.slug);
      });

      it('gets the base url', function() {
        expect(getBaseUrl).to.be.calledOnceWith();
      });

      it('sends a request to removeProject the user from the organization', function() {
        expect(baseRequest.delete).to.be.calledWith(
          `${expectedTenantBaseUrl}/users/${user.id}/projects/${project.slug}`
        );
      });

      it('returns a resolved promise', function() {
        return expect(promise).to.be.fulfilled;
      });
    });

    context('when the user ID is not provided', function() {
      it('throws an error', function() {
        const project = fixture.build('contxtProject');
        const users = new Users(baseSdk, baseRequest, expectedTenantBaseUrl);
        const promise = users.removeProject(null, project.slug);

        return expect(promise).to.be.rejectedWith(
          'A user ID is required for removing a project from a user'
        );
      });
    });

    context('when the project slug is not provided', function() {
      it('throws an error', function() {
        const user = fixture.build('contxtUser');
        const users = new Users(baseSdk, baseRequest, expectedTenantBaseUrl);
        const promise = users.removeProject(user.id, null);

        return expect(promise).to.be.rejectedWith(
          'A project slug is required for removing a project from a user'
        );
      });
    });
  });

  describe('sync', function() {
    context('when all required parameters are present', function() {
      let getBaseUrl;
      let user;
      let promise;

      beforeEach(function() {
        user = fixture.build('contxtUser');

        const users = new Users(baseSdk, baseRequest, expectedBaseUrl);

        getBaseUrl = sinon.stub(users, '_getBaseUrl').returns(expectedBaseUrl);

        promise = users.sync(user.id);
      });

      it('gets the base url', function() {
        expect(getBaseUrl).to.be.calledOnceWith('access');
      });

      it('sends a request to sync user permissions', function() {
        expect(baseRequest.get).to.be.calledWith(
          `${expectedBaseUrl}/users/${user.id}/sync`
        );
      });

      it('returns a resolved promise', function() {
        return expect(promise).to.be.fulfilled;
      });
    });

    context('when the user ID is not provided', function() {
      it('throws an error', function() {
        const users = new Users(baseSdk, baseRequest, expectedBaseUrl);
        const promise = users.sync(null);

        return expect(promise).to.be.rejectedWith(
          'A user ID is required for syncing user permissions'
        );
      });
    });
  });
});

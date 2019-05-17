import omit from 'lodash.omit';

import Users from './users';
import * as objectUtils from '../utils/objects';

describe('Coordinator/Users', function() {
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
          post: this.sandbox.stub().resolves()
        };

        toSnakeCase = this.sandbox
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
        expect(request.post).to.be.calledWith(
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
          get: this.sandbox.stub().resolves(userFromServerBeforeFormat)
        };
        toCamelCase = this.sandbox
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
          get: this.sandbox.stub().resolves(organizationUsersFromServer)
        };

        toCamelCase = this.sandbox
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

  describe('invite', function() {
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
          post: this.sandbox.stub().resolves(newUserFromServer)
        };
        toCamelCase = this.sandbox
          .stub(objectUtils, 'toCamelCase')
          .callsFake(() => expectedNewUser);

        toSnakeCase = this.sandbox
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
      const requiredFields = ['email', 'firstName', 'lastName', 'redirectUrl'];

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

  describe('remove', function() {
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
});

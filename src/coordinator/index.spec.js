import omit from 'lodash.omit';

import Coordinator from './index';
import * as objectUtils from '../utils/objects';

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

  describe('activateNewUser', function() {
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

        const coordinator = new Coordinator(baseSdk, request);
        coordinator._baseUrl = expectedHost;

        promise = coordinator.activateNewUser(user.id, userActivationPayload);
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
        const coordinator = new Coordinator(baseSdk, baseRequest);
        const promise = coordinator.activateNewUser();

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

          const coordinator = new Coordinator(baseSdk, baseRequest);
          const promise = coordinator.activateNewUser(
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

  describe('createFavoriteApplication', function() {
    context('when the application ID is provided', function() {
      let application;
      let expectedApplicationFavorite;
      let applicationFavoriteFromServer;
      let promise;
      let request;
      let toCamelCase;

      beforeEach(function() {
        application = fixture.build('contxtApplication');

        expectedApplicationFavorite = fixture.build(
          'contxtUserFavoriteApplication'
        );
        applicationFavoriteFromServer = fixture.build(
          'contxtUserFavoriteApplication',
          expectedApplicationFavorite,
          {
            fromServer: true
          }
        );

        request = {
          ...baseRequest,
          post: this.sandbox.stub().resolves(applicationFavoriteFromServer)
        };
        toCamelCase = this.sandbox
          .stub(objectUtils, 'toCamelCase')
          .callsFake((app) => expectedApplicationFavorite);

        const coordinator = new Coordinator(baseSdk, request);
        coordinator._baseUrl = expectedHost;
        promise = coordinator.createFavoriteApplication(application.id);
      });

      it('posts the new application favorite to the server', function() {
        expect(request.post).to.be.calledWith(
          `${expectedHost}/applications/${application.id}/favorites`
        );
      });

      it('formats the application favorite', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.calledWith(applicationFavoriteFromServer);
        });
      });

      it('returns a fulfilled promise with the application favorite', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
          expectedApplicationFavorite
        );
      });
    });

    context('when the application ID is not provided', function() {
      it('throws an error', function() {
        const coordinator = new Coordinator(baseSdk, baseRequest);
        const promise = coordinator.createFavoriteApplication();

        return expect(promise).to.be.rejectedWith(
          'An application ID is required for creating a favorite application'
        );
      });
    });
  });

  describe('deleteFavoriteApplication', function() {
    context('when the application ID is provided', function() {
      let application;
      let promise;

      beforeEach(function() {
        application = fixture.build('contxtApplication');

        const coordinator = new Coordinator(baseSdk, baseRequest);
        coordinator._baseUrl = expectedHost;

        promise = coordinator.deleteFavoriteApplication(application.id);
      });

      it('requests to delete the application favorite', function() {
        expect(baseRequest.delete).to.be.calledWith(
          `${expectedHost}/applications/${application.id}/favorites`
        );
      });

      it('returns a resolved promise', function() {
        return expect(promise).to.be.fulfilled;
      });
    });

    context('when the application ID is not provided', function() {
      it('throws an error', function() {
        const coordinator = new Coordinator(baseSdk, baseRequest);
        const promise = coordinator.deleteFavoriteApplication();

        return expect(promise).to.be.rejectedWith(
          'An application ID is required for deleting a favorite application'
        );
      });
    });
  });

  describe('getAllApplications', function() {
    let expectedApplications;
    let applicationsFromServer;
    let promise;
    let request;
    let toCamelCase;

    beforeEach(function() {
      const numberOfApplications = faker.random.number({
        min: 1,
        max: 10
      });
      expectedApplications = fixture.buildList(
        'contxtApplication',
        numberOfApplications
      );
      applicationsFromServer = expectedApplications.map((app) =>
        fixture.build('contxtApplication', app, { fromServer: true })
      );

      request = {
        ...baseRequest,
        get: this.sandbox.stub().resolves(applicationsFromServer)
      };
      toCamelCase = this.sandbox
        .stub(objectUtils, 'toCamelCase')
        .callsFake((app) =>
          expectedApplications.find(({ id }) => id === app.id)
        );

      const coordinator = new Coordinator(baseSdk, request);
      coordinator._baseUrl = expectedHost;
      promise = coordinator.getAllApplications();
    });

    it('gets the list of applications from the server', function() {
      expect(request.get).to.be.calledWith(`${expectedHost}/applications`);
    });

    it('formats the list of applications', function() {
      return promise.then(() => {
        expect(toCamelCase).to.have.callCount(applicationsFromServer.length);
        applicationsFromServer.forEach((app) => {
          expect(toCamelCase).to.be.calledWith(app);
        });
      });
    });

    it('returns a fulfilled promise with the applications', function() {
      return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
        expectedApplications
      );
    });
  });

  describe('getAllOrganizations', function() {
    let expectedOrganizations;
    let organizationsFromServer;
    let promise;
    let request;
    let toCamelCase;

    beforeEach(function() {
      const numberOfOrganizations = faker.random.number({
        min: 1,
        max: 10
      });
      expectedOrganizations = fixture.buildList(
        'contxtOrganization',
        numberOfOrganizations
      );
      organizationsFromServer = expectedOrganizations.map((org) =>
        fixture.build('contxtOrganization', org, { fromServer: true })
      );

      request = {
        ...baseRequest,
        get: this.sandbox.stub().resolves(organizationsFromServer)
      };
      toCamelCase = this.sandbox
        .stub(objectUtils, 'toCamelCase')
        .callsFake(
          (org) => expectedOrganizations.filter(({ id }) => id === org.id)[0]
        );

      const coordinator = new Coordinator(baseSdk, request);
      coordinator._baseUrl = expectedHost;
      promise = coordinator.getAllOrganizations();
    });

    it('gets the list of organizations from the server', function() {
      expect(request.get).to.be.calledWith(`${expectedHost}/organizations`);
    });

    it('formats the list of organizations', function() {
      return promise.then(() => {
        expect(toCamelCase).to.have.callCount(organizationsFromServer.length);
        organizationsFromServer.forEach((org) => {
          expect(toCamelCase).to.be.calledWith(org);
        });
      });
    });

    it('returns a fulfilled promise with the organizations', function() {
      return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
        expectedOrganizations
      );
    });
  });

  describe('getFavoriteApplications', function() {
    let expectedFavoriteApplications;
    let favoritesFromServer;
    let promise;
    let request;
    let toCamelCase;

    beforeEach(function() {
      expectedFavoriteApplications = fixture.buildList(
        'contxtUserFavoriteApplication',
        faker.random.number({
          min: 1,
          max: 10
        })
      );
      favoritesFromServer = expectedFavoriteApplications.map((app) =>
        fixture.build('contxtUserFavoriteApplication', app, {
          fromServer: true
        })
      );

      request = {
        ...baseRequest,
        get: this.sandbox.stub().resolves(favoritesFromServer)
      };
      toCamelCase = this.sandbox
        .stub(objectUtils, 'toCamelCase')
        .returns(expectedFavoriteApplications);

      const coordinator = new Coordinator(baseSdk, request);
      coordinator._baseUrl = expectedHost;
      promise = coordinator.getFavoriteApplications();
    });

    it('gets the list of favorite applications from the server', function() {
      expect(request.get).to.be.calledWith(
        `${expectedHost}/applications/favorites`
      );
    });

    it('formats the list of favorite applications', function() {
      return promise.then(() => {
        expect(toCamelCase).to.be.calledWith(favoritesFromServer);
      });
    });

    it('returns a fulfilled promise with the favorite applications', function() {
      return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
        expectedFavoriteApplications
      );
    });
  });

  describe('getFeaturedApplications', function() {
    context('when the organization ID is provided', function() {
      let expectedFeaturedApplications;
      let featuredApplicationsFromServer;
      let expectedOrganizationId;
      let promise;
      let request;
      let toCamelCase;

      beforeEach(function() {
        expectedOrganizationId = faker.random.uuid();
        expectedFeaturedApplications = fixture.buildList(
          'contxtOrganizationFeaturedApplication',
          faker.random.number({
            min: 1,
            max: 10
          }),
          {
            organizationId: expectedOrganizationId
          }
        );
        featuredApplicationsFromServer = expectedFeaturedApplications.map(
          (app) =>
            fixture.build('contxtOrganizationFeaturedApplication', app, {
              fromServer: true
            })
        );

        request = {
          ...baseRequest,
          get: this.sandbox.stub().resolves(featuredApplicationsFromServer)
        };
        toCamelCase = this.sandbox
          .stub(objectUtils, 'toCamelCase')
          .returns(expectedFeaturedApplications);

        const coordinator = new Coordinator(baseSdk, request);
        coordinator._baseUrl = expectedHost;
        promise = coordinator.getFeaturedApplications(expectedOrganizationId);
      });

      it('gets the list of featured applications from the server', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/organizations/${expectedOrganizationId}/applications/featured`
        );
      });

      it('formats the list of featured applications', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.calledWith(featuredApplicationsFromServer);
        });
      });

      it('returns a fulfilled promise with the featured applications', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
          expectedFeaturedApplications
        );
      });
    });

    context('when the organization ID is not provided', function() {
      it('throws an error', function() {
        const coordinator = new Coordinator(baseSdk, baseRequest);
        const promise = coordinator.getFeaturedApplications();

        return expect(promise).to.be.rejectedWith(
          'An organization ID is required for getting featured applications for an organization'
        );
      });
    });
  });

  describe('getOrganizationById', function() {
    context('the organization ID is provided', function() {
      let organizationFromServerAfterFormat;
      let organizationFromServerBeforeFormat;
      let expectedOrganizationId;
      let promise;
      let request;
      let toCamelCase;

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

        request = {
          ...baseRequest,
          get: this.sandbox.stub().resolves(organizationFromServerBeforeFormat)
        };
        toCamelCase = this.sandbox
          .stub(objectUtils, 'toCamelCase')
          .returns(organizationFromServerAfterFormat);

        const coordinator = new Coordinator(baseSdk, request);
        coordinator._baseUrl = expectedHost;

        promise = coordinator.getOrganizationById(expectedOrganizationId);
      });

      it('gets the organization from the server', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/organizations/${expectedOrganizationId}`
        );
      });

      it('formats the organization object', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.calledWith(
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
        const promise = coordinator.getOrganizationById();

        return expect(promise).to.be.rejectedWith(
          'An organization ID is required for getting information about an organization'
        );
      });
    });
  });

  describe('getUsersByOrganization', function() {
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

        const coordinator = new Coordinator(baseSdk, request);
        coordinator._baseUrl = expectedHost;

        promise = coordinator.getUsersByOrganization(expectedOrganizationId);
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
        const coordinator = new Coordinator(baseSdk, baseRequest);
        const promise = coordinator.getOrganizationById();

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
        const coordinator = new Coordinator(baseSdk, baseRequest);
        const promise = coordinator.getUser();

        return expect(promise).to.be.rejectedWith(
          'A user ID is required for getting information about a user'
        );
      });
    });
  });

  describe('getUserPermissionsMap', function() {
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

        const coordinator = new Coordinator(baseSdk, request);
        coordinator._baseUrl = expectedHost;

        promise = coordinator.getUserPermissionsMap(expectedUserId);
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
        const coordinator = new Coordinator(baseSdk, baseRequest);
        const promise = coordinator.getUserPermissionsMap();

        return expect(promise).to.be.rejectedWith(
          "A user ID is required for getting information about a user's permissions map"
        );
      });
    });
  });

  describe('inviteNewUserToOrganization', function() {
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

        const coordinator = new Coordinator(baseSdk, request);
        coordinator._baseUrl = expectedHost;

        promise = coordinator.inviteNewUserToOrganization(
          organization.id,
          newUserPayload
        );
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
        const coordinator = new Coordinator(baseSdk, baseRequest);
        const promise = coordinator.inviteNewUserToOrganization();

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

          const coordinator = new Coordinator(baseSdk, baseRequest);
          const promise = coordinator.inviteNewUserToOrganization(
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

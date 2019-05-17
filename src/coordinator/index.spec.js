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
});

import Applications from './applications';
import * as objectUtils from '../utils/objects';

describe.only('Coordinator/Applications', function() {
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
    let applications;

    beforeEach(function() {
      applications = new Applications(baseSdk, baseRequest, expectedHost);
    });

    it('sets a base url for the class instance', function() {
      expect(applications._baseUrl).to.equal(expectedHost);
    });

    it('appends the supplied request module to the class instance', function() {
      expect(applications._request).to.deep.equal(baseRequest);
    });

    it('appends the supplied sdk to the class instance', function() {
      expect(applications._sdk).to.deep.equal(baseSdk);
    });
  });

  describe('addFavorite', function() {
    context(
      'when the organizationID and application ID are provided',
      function() {
        let application;
        let expectedApplicationFavorite;
        let applicationFavoriteFromServer;
        let organization;
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

          organization = fixture.build('organization');

          request = {
            ...baseRequest,
            post: sinon.stub().resolves(applicationFavoriteFromServer)
          };
          toCamelCase = sinon
            .stub(objectUtils, 'toCamelCase')
            .callsFake((app) => expectedApplicationFavorite);

          const applications = new Applications(baseSdk, request, expectedHost);
          promise = applications.addFavorite(organization.id, application.id);
        });

        it('posts the new application favorite to the server', function() {
          expect(request.post).to.be.calledWith(
            `${expectedHost}/${organization.id}/applications/${
              application.id
            }/favorites`
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
      }
    );

    context('when the organization ID is not provided', function() {
      it('throws an error', function() {
        const applications = new Applications(
          baseSdk,
          baseRequest,
          expectedHost
        );
        const application = fixture.build('contxtApplication');

        const promise = applications.addFavorite(undefined, application.id);

        return expect(promise).to.be.rejectedWith(
          'An organization ID is required for creating a favorite application'
        );
      });
    });

    context('when the application ID is not provided', function() {
      it('throws an error', function() {
        const applications = new Applications(
          baseSdk,
          baseRequest,
          expectedHost
        );
        const organization = fixture.build('organization');

        const promise = applications.addFavorite(organization);

        return expect(promise).to.be.rejectedWith(
          'An application ID is required for creating a favorite application'
        );
      });
    });
  });

  describe('getAll', function() {
    context('when the organization ID is provided', function() {
      let expectedApplications;
      let applicationsFromServer;
      let organization;
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

        organization = fixture.build('organization');

        request = {
          ...baseRequest,
          get: sinon.stub().resolves(applicationsFromServer)
        };
        toCamelCase = sinon
          .stub(objectUtils, 'toCamelCase')
          .callsFake((app) =>
            expectedApplications.find(({ id }) => id === app.id)
          );

        const applications = new Applications(baseSdk, request, expectedHost);
        promise = applications.getAll(organization.id);
      });

      it('gets the list of applications from the server', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/${organization.id}/applications`
        );
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

    context('when the organization ID is not provided', function() {
      it('throws an error', function() {
        const applications = new Applications(
          baseSdk,
          baseRequest,
          expectedHost
        );

        const promise = applications.getAll();

        return expect(promise).to.be.rejectedWith(
          'An organization ID is required for getting all applications'
        );
      });
    });
  });

  describe('getFavorites', function() {
    context('when the organization ID is provided', function() {
      let expectedFavoriteApplications;
      let favoritesFromServer;
      let organization;
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
        organization = fixture.build('organization');

        request = {
          ...baseRequest,
          get: sinon.stub().resolves(favoritesFromServer)
        };
        toCamelCase = sinon
          .stub(objectUtils, 'toCamelCase')
          .returns(expectedFavoriteApplications);

        const applications = new Applications(baseSdk, request, expectedHost);
        promise = applications.getFavorites(organization.id);
      });

      it('gets the list of favorite applications from the server', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/${organization.id}/applications/favorites`
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

    context('when the organization ID is not provided', function() {
      it('throws an error', function() {
        const applications = new Applications(
          baseSdk,
          baseRequest,
          expectedHost
        );

        const promise = applications.getFavorites();

        return expect(promise).to.be.rejectedWith(
          "An organization ID is required for getting a user's list of favorited applications"
        );
      });
    });
  });

  describe('getFeatured', function() {
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
          get: sinon.stub().resolves(featuredApplicationsFromServer)
        };
        toCamelCase = sinon
          .stub(objectUtils, 'toCamelCase')
          .returns(expectedFeaturedApplications);

        const applications = new Applications(baseSdk, request, expectedHost);
        promise = applications.getFeatured(expectedOrganizationId);
      });

      it('gets the list of featured applications from the server', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/${expectedOrganizationId}/applications/featured`
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
        const applications = new Applications(
          baseSdk,
          baseRequest,
          expectedHost
        );
        const promise = applications.getFeatured();

        return expect(promise).to.be.rejectedWith(
          'An organization ID is required for getting featured applications for an organization'
        );
      });
    });
  });

  describe('getGroupings', function() {
    context(
      'when the organization ID and application ID are provided',
      function() {
        let expectedApplicationId;
        let expectedGroupings;
        let groupingsFromServer;
        let organization;
        let promise;
        let request;
        let toCamelCase;

        beforeEach(function() {
          expectedApplicationId = faker.random.uuid();
          expectedGroupings = fixture.buildList(
            'applicationGrouping',
            faker.random.number({ min: 1, max: 10 })
          );
          groupingsFromServer = expectedGroupings.map((grouping) =>
            fixture.build('applicationGrouping', grouping, { fromServer: true })
          );
          organization = fixture.build('organization');

          request = {
            ...baseRequest,
            get: sinon.stub().resolves(groupingsFromServer)
          };
          toCamelCase = sinon
            .stub(objectUtils, 'toCamelCase')
            .returns(expectedGroupings);

          const applications = new Applications(baseSdk, request, expectedHost);
          promise = applications.getGroupings(
            organization.id,
            expectedApplicationId
          );
        });

        it('gets the list of application groupings', function() {
          expect(request.get).to.be.calledWith(
            `${expectedHost}/${
              organization.id
            }/applications/${expectedApplicationId}/groupings`
          );
        });

        it('formats the list of application groupings', function() {
          return promise.then(() => {
            expect(toCamelCase).to.be.calledWith(groupingsFromServer);
          });
        });

        it('returns a fulfilled promise with the application groupings', function() {
          return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
            expectedGroupings
          );
        });
      }
    );

    context('when the organization ID is not provided', function() {
      it('throws an error', function() {
        const applications = new Applications(
          baseSdk,
          baseRequest,
          expectedHost
        );
        const application = fixture.build('contxtApplication');
        const promise = applications.getGroupings(undefined, application.id);

        return expect(promise).to.be.rejectedWith(
          'An organization ID is required for getting application groupings of an application'
        );
      });
    });

    context('when the application ID is not provided', function() {
      it('throws an error', function() {
        const applications = new Applications(
          baseSdk,
          baseRequest,
          expectedHost
        );
        const organization = fixture.build('organization');
        const promise = applications.getGroupings(organization.id);

        return expect(promise).to.be.rejectedWith(
          'An application ID is required for getting application groupings of an application'
        );
      });
    });
  });

  describe('removeFavorite', function() {
    context(
      'when the organization ID and application ID are provided',
      function() {
        let application;
        let organization;
        let promise;

        beforeEach(function() {
          application = fixture.build('contxtApplication');
          organization = fixture.build('organization');

          const applications = new Applications(
            baseSdk,
            baseRequest,
            expectedHost
          );
          promise = applications.removeFavorite(
            organization.id,
            application.id
          );
        });

        it('requests to delete the application favorite', function() {
          expect(baseRequest.delete).to.be.calledWith(
            `${expectedHost}/${organization.id}/applications/${
              application.id
            }/favorites`
          );
        });

        it('returns a resolved promise', function() {
          return expect(promise).to.be.fulfilled;
        });
      }
    );

    context('when the organization ID is not provided', function() {
      it('throws an error', function() {
        const applications = new Applications(
          baseSdk,
          baseRequest,
          expectedHost
        );
        const application = fixture.build('contxtApplication');
        const promise = applications.removeFavorite(undefined, application.id);

        return expect(promise).to.be.rejectedWith(
          'An organization ID is required for deleting a favorite application'
        );
      });
    });

    context('when the application ID is not provided', function() {
      it('throws an error', function() {
        const applications = new Applications(
          baseSdk,
          baseRequest,
          expectedHost
        );
        const organization = fixture.build('organization');
        const promise = applications.removeFavorite(organization.id);

        return expect(promise).to.be.rejectedWith(
          'An application ID is required for deleting a favorite application'
        );
      });
    });
  });
});

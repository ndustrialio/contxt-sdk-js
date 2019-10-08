import Organizations from './organizations';
import * as objectUtils from '../utils/objects';

describe('Coordinator/Organizations', function() {
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
      let organizations;

      beforeEach(function() {
        organizationId = fixture.build('organization').id;

        organizations = new Organizations(
          baseSdk,
          baseRequest,
          expectedHost,
          organizationId
        );
      });

      it('sets a base url for the class instance', function() {
        expect(organizations._baseUrl).to.equal(expectedHost);
      });

      it('appends the supplied request module to the class instance', function() {
        expect(organizations._request).to.deep.equal(baseRequest);
      });

      it('appends the supplied sdk to the class instance', function() {
        expect(organizations._sdk).to.deep.equal(baseSdk);
      });

      it('sets the organization ID for the class instance', function() {
        expect(organizations._organizationId).to.equal(organizationId);
      });
    });

    context('when an organization ID is not provided', function() {
      let organizations;

      beforeEach(function() {
        organizations = new Organizations(baseSdk, baseRequest, expectedHost);
      });

      it('sets a base url for the class instance', function() {
        expect(organizations._baseUrl).to.equal(expectedHost);
      });

      it('appends the supplied request module to the class instance', function() {
        expect(organizations._request).to.deep.equal(baseRequest);
      });

      it('appends the supplied sdk to the class instance', function() {
        expect(organizations._sdk).to.deep.equal(baseSdk);
      });

      it('sets the organization ID for the class instance to null', function() {
        expect(organizations._organizationId).to.equal(null);
      });
    });
  });

  describe('get', function() {
    context('legacy API', function() {
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
            get: sinon.stub().resolves(organizationFromServerBeforeFormat)
          };
          toCamelCase = sinon
            .stub(objectUtils, 'toCamelCase')
            .returns(organizationFromServerAfterFormat);

          const organizations = new Organizations(
            baseSdk,
            request,
            expectedHost
          );
          promise = organizations.get(expectedOrganizationId);
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
          const organizations = new Organizations(
            baseSdk,
            baseRequest,
            expectedHost
          );
          const promise = organizations.get();

          return expect(promise).to.be.rejectedWith(
            'An organization ID is required for getting information about an organization'
          );
        });
      });
    });

    context('tenant API', function() {
      let organizationFromServerAfterFormat;
      let organizationFromServerBeforeFormat;
      let expectedOrganizationId;
      let organizations;
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
          get: sinon.stub().resolves(organizationFromServerBeforeFormat)
        };
        toCamelCase = sinon
          .stub(objectUtils, 'toCamelCase')
          .returns(organizationFromServerAfterFormat);

        organizations = new Organizations(
          baseSdk,
          request,
          expectedHost,
          expectedOrganizationId
        );
      });

      context('the organization ID is provided', function() {
        beforeEach(function() {
          promise = organizations.get(expectedOrganizationId);
        });

        it('gets the organization from the server and does not use the organization ID provided', function() {
          expect(request.get).to.be.calledWith(`${expectedHost}`);
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
        beforeEach(function() {
          promise = organizations.get();
        });

        it('gets the organization from the server', function() {
          expect(request.get).to.be.calledWith(`${expectedHost}`);
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
    });
  });

  describe('getAll', function() {
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
        get: sinon.stub().resolves(organizationsFromServer)
      };
      toCamelCase = sinon
        .stub(objectUtils, 'toCamelCase')
        .callsFake(
          (org) => expectedOrganizations.filter(({ id }) => id === org.id)[0]
        );

      const organizations = new Organizations(baseSdk, request, expectedHost);
      promise = organizations.getAll();
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
});

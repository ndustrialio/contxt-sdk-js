import omit from 'lodash.omit';
import Facilities from './facilities';

describe('Facilities', function() {
  let baseRequest;
  let baseSdk;

  beforeEach(function() {
    this.sandbox = sandbox.create();

    baseRequest = {
      get: this.sandbox.stub(),
      post: this.sandbox.stub()
    };
    baseSdk = {
      config: {
        audiences: {
          facilities: fixture.build('audience')
        }
      }
    };
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  describe('constructor', function() {
    let facilities;

    beforeEach(function() {
      facilities = new Facilities(baseSdk, baseRequest);
    });

    it('sets a base url for the class instance', function() {
      expect(facilities._baseUrl).to.equal(`${baseSdk.config.audiences.facilities.host}/v1`);
    });

    it('appends the supplied request module to the class instance', function() {
      expect(facilities._request).to.equal(baseRequest);
    });

    it('appends the supplied sdk to the class instance', function() {
      expect(facilities._sdk).to.equal(baseSdk);
    });
  });

  describe('create', function() {
    context('when all required information is supplied', function() {
      context('when the facility is successfully created', function() {
        let expectedFacility;
        let expectedHost;
        let promise;
        let request;

        beforeEach(function() {
          expectedFacility = fixture.build('facility');
          expectedHost = faker.internet.url();

          request = {
            ...baseRequest,
            post: this.sandbox.stub().resolves(expectedFacility)
          };

          const facilities = new Facilities(baseSdk, request);
          facilities._baseUrl = expectedHost;

          promise = facilities.create({
            address1: expectedFacility.address1,
            address2: expectedFacility.address2,
            city: expectedFacility.city,
            geometryId: expectedFacility.geometry_id,
            name: expectedFacility.name,
            organizationId: expectedFacility.organization_id,
            state: expectedFacility.state,
            timezone: expectedFacility.timezone,
            weatherLocationId: expectedFacility.weather_location_id,
            zip: expectedFacility.zip
          });
        });

        it('creates a new facility', function() {
          expect(request.post).to.be.deep.calledWith(
            `${expectedHost}/facilities`,
            omit(expectedFacility, ['id', 'Info', 'Organization', 'tags'])
          );
        });

        it('returns a fulfilled promise with the new facility information', function() {
          return expect(promise).to.be.fulfilled
            .and.to.eventually.equal(expectedFacility);
        });
      });
    });

    context('when there is missing required information', function() {
      ['organizationId', 'name', 'timezone'].forEach(function(field) {
        it(`it throws an error when ${field} is missing`, function() {
          const fn = () => {
            const facility = fixture.build('facility');
            const initialFacility = {
              ...facility,
              organizationId: facility.organization_id
            };
            const facilities = new Facilities(baseSdk, baseRequest);
            facilities.create(omit(initialFacility, [field]));
          };

          expect(fn).to.throw(`A ${field} is required to create a new facility.`);
        });
      });
    });
  });

  describe('get', function() {
    let expectedFacility;
    let expectedFacilityId;
    let expectedHost;
    let promise;
    let request;

    beforeEach(function() {
      expectedFacilityId = faker.random.number();
      expectedFacility = fixture.build('facility', { id: expectedFacilityId });
      expectedHost = faker.internet.url();
      request = {
        ...baseRequest,
        get: this.sandbox.stub().resolves(expectedFacility)
      };

      const facilities = new Facilities(baseSdk, request);
      facilities._baseUrl = expectedHost;

      promise = facilities.get(expectedFacilityId);
    });

    it('gets a list of facilities from the server', function() {
      expect(request.get).to.be.calledWith(`${expectedHost}/facilities/${expectedFacilityId}`);
    });

    it('returns the requested facility', function() {
      return expect(promise).to.be.fulfilled
        .and.to.eventually.equal(expectedFacility);
    });
  });

  describe('getAll', function() {
    let expectedFacilities;
    let expectedHost;
    let promise;
    let request;

    beforeEach(function() {
      expectedFacilities = fixture.buildList('facility', faker.random.number({ min: 1, max: 10 }));
      expectedHost = faker.internet.url();
      request = {
        ...baseRequest,
        get: this.sandbox.stub().resolves(expectedFacilities)
      };

      const facilities = new Facilities(baseSdk, request);
      facilities._baseUrl = expectedHost;

      promise = facilities.getAll();
    });

    it('gets a list of facilities from the server', function() {
      expect(request.get).to.be.calledWith(`${expectedHost}/facilities`);
    });

    it('returns a list of facilities', function() {
      return expect(promise).to.be.fulfilled
        .and.to.eventually.equal(expectedFacilities);
    });
  });

  describe('getAllByOrganizationId', function() {
    let expectedFacilities;
    let expectedHost;
    let expectedOrganizationId;
    let promise;
    let request;

    beforeEach(function() {
      expectedFacilities = fixture.buildList('facility', faker.random.number({ min: 1, max: 10 }));
      expectedHost = faker.internet.url();
      expectedOrganizationId = faker.random.number();
      request = {
        ...baseRequest,
        get: this.sandbox.stub().resolves(expectedFacilities)
      };

      const facilities = new Facilities(baseSdk, request);
      facilities._baseUrl = expectedHost;

      promise = facilities.getAllByOrganizationId(expectedOrganizationId);
    });

    it('gets a list of facilities for an organization from the server', function() {
      expect(request.get).to.be.calledWith(
        `${expectedHost}/organizations/${expectedOrganizationId}/facilities`
      );
    });

    it('returns a list of facilities', function() {
      return expect(promise).to.be.fulfilled
        .and.to.eventually.equal(expectedFacilities);
    });
  });
});

import omit from 'lodash.omit';
import Facilities from './index';
import * as facilitiesUtils from '../utils/facilities';
import * as objectUtils from '../utils/objects';

describe('Facilities', function() {
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
          facilities: fixture.build('audience')
        }
      }
    };
    expectedHost = faker.internet.url();
  });

  afterEach(function() {
    sinon.restore();
  });

  describe('constructor', function() {
    let facilities;

    beforeEach(function() {
      facilities = new Facilities(baseSdk, baseRequest);
    });

    it('sets a base url for the class instance', function() {
      expect(facilities._baseUrl).to.equal(
        `${baseSdk.config.audiences.facilities.host}/v1`
      );
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
      let expectedFacility;
      let formattedFacility;
      let initialFacility;
      let promise;
      let rawFacility;
      let request;
      let toCamelCase;
      let toSnakeCase;

      beforeEach(function() {
        expectedFacility = fixture.build('facility', null, {
          fromServer: true
        });
        formattedFacility = fixture.build('facility', null, {
          fromServer: true
        });
        initialFacility = fixture.build('facility');
        rawFacility = fixture.build('facility', null, {
          fromServer: true
        });

        request = {
          ...baseRequest,
          post: sinon.stub().resolves(rawFacility)
        };
        toCamelCase = sinon
          .stub(objectUtils, 'toCamelCase')
          .returns(expectedFacility);
        toSnakeCase = sinon
          .stub(objectUtils, 'toSnakeCase')
          .returns(formattedFacility);

        const facilities = new Facilities(baseSdk, request);
        facilities._baseUrl = expectedHost;

        promise = facilities.create(initialFacility);
      });

      it('formats the submitted facility object to send to the server', function() {
        expect(toSnakeCase).to.be.calledWith(initialFacility);
      });

      it('creates a new facility', function() {
        expect(request.post).to.be.deep.calledWith(
          `${expectedHost}/facilities`,
          formattedFacility
        );
      });

      it('formats the returned facility object', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.calledWith(rawFacility);
        });
      });

      it('returns a fulfilled promise with the new facility information', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.equal(
          expectedFacility
        );
      });
    });

    context('when there is missing required information', function() {
      ['organizationId', 'name', 'timezone'].forEach(function(field) {
        it(`it throws an error when ${field} is missing`, function() {
          const facility = fixture.build('facility');
          const initialFacility = {
            ...facility,
            organizationId: facility.organizationId
          };
          const facilities = new Facilities(baseSdk, baseRequest);
          const promise = facilities.create(omit(initialFacility, [field]));

          return expect(promise).to.be.rejectedWith(
            `A ${field} is required to create a new facility.`
          );
        });
      });
    });
  });

  describe('createOrUpdateInfo', function() {
    context('when all required information is available', function() {
      let facilityId;
      let facilityInfoUpdate;
      let promise;

      beforeEach(function() {
        facilityId = fixture.build('facility').id;
        facilityInfoUpdate = fixture.build('facilityInfo');

        const facilities = new Facilities(baseSdk, baseRequest);
        facilities._baseUrl = expectedHost;

        promise = facilities.createOrUpdateInfo(facilityId, facilityInfoUpdate);
      });

      it('updates the facility', function() {
        expect(baseRequest.post).to.be.calledWith(
          `${expectedHost}/facilities/${facilityId}/info`,
          facilityInfoUpdate,
          {
            params: {
              should_update: true
            }
          }
        );
      });

      it('returns a fulfilled promise', function() {
        return expect(promise).to.be.fulfilled;
      });
    });

    context(
      'when there is missing or malformed required information',
      function() {
        let facilities;

        beforeEach(function() {
          facilities = new Facilities(baseSdk, baseRequest);
        });

        it('throws an error when there is no provided facility ID', function() {
          const facilityInfoUpdate = fixture.build('facilityInfo');
          const promise = facilities.createOrUpdateInfo(
            null,
            facilityInfoUpdate
          );

          return expect(promise).to.be.rejectedWith(
            "A facility ID is required to update a facility's info."
          );
        });

        it('throws an error when there is no update provided', function() {
          const facility = fixture.build('facility');
          const promise = facilities.createOrUpdateInfo(facility.id);

          return expect(promise).to.be.rejectedWith(
            "An update is required to update a facility's info."
          );
        });

        it('throws an error when the update is not an object', function() {
          const facility = fixture.build('facility');
          const promise = facilities.createOrUpdateInfo(facility.id, [
            facility.info
          ]);

          return expect(promise).to.be.rejectedWith(
            'The facility info update must be a well-formed object with the data you wish to update.'
          );
        });
      }
    );
  });

  describe('delete', function() {
    context('the facility ID is provided', function() {
      let facility;
      let promise;

      beforeEach(function() {
        facility = fixture.build('facility');

        const facilities = new Facilities(baseSdk, baseRequest);
        facilities._baseUrl = expectedHost;

        promise = facilities.delete(facility.id);
      });

      it('requests to delete the facility', function() {
        expect(baseRequest.delete).to.be.calledWith(
          `${expectedHost}/facilities/${facility.id}`
        );
      });

      it('returns a resolved promise', function() {
        return expect(promise).to.be.fulfilled;
      });
    });

    context('the facility ID is not provided', function() {
      it('throws an error', function() {
        const facilities = new Facilities(baseSdk, baseRequest);
        const promise = facilities.delete();

        return expect(promise).to.be.rejectedWith(
          'A facility ID is required for deleting a facility'
        );
      });
    });
  });

  describe('get', function() {
    context('the facility ID is provided', function() {
      let expectedFacilityId;
      let formatFacilityWithInfoFromServer;
      let formattedFacility;
      let promise;
      let rawFacility;
      let request;

      beforeEach(function() {
        expectedFacilityId = faker.random.number();
        rawFacility = fixture.build('facility', null, {
          fromServer: true
        });
        formattedFacility = fixture.build('facility', {
          id: rawFacility.id
        });

        formatFacilityWithInfoFromServer = sinon
          .stub(facilitiesUtils, 'formatFacilityWithInfoFromServer')
          .returns(formattedFacility);
        request = {
          ...baseRequest,
          get: sinon.stub().resolves(rawFacility)
        };

        const facilities = new Facilities(baseSdk, request);
        facilities._baseUrl = expectedHost;

        promise = facilities.get(expectedFacilityId);
      });

      it('gets the facility from the server', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/facilities/${expectedFacilityId}`
        );
      });

      it('formats the facility object', function() {
        return promise.then(() => {
          expect(formatFacilityWithInfoFromServer).to.be.calledWith(
            rawFacility
          );
        });
      });

      it('returns the requested facility', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.equal(
          formattedFacility
        );
      });
    });

    context('the facility ID is not provided', function() {
      it('throws an error', function() {
        const facilities = new Facilities(baseSdk, baseRequest);
        const promise = facilities.get();

        return expect(promise).to.be.rejectedWith(
          'A facility ID is required for getting information about a facility'
        );
      });
    });
  });

  describe('getAll', function() {
    let formatFacilityWithInfoFromServer;
    let formattedFacilities;
    let promise;
    let rawFacilities;
    let request;

    beforeEach(function() {
      const numberOfFacilities = faker.random.number({
        min: 1,
        max: 10
      });
      formattedFacilities = fixture.buildList('facility', numberOfFacilities);
      rawFacilities = fixture.buildList('facility', numberOfFacilities, null, {
        fromServer: true
      });

      formatFacilityWithInfoFromServer = sinon
        .stub(facilitiesUtils, 'formatFacilityWithInfoFromServer')
        .callsFake((facility) => {
          const index = rawFacilities.indexOf(facility);
          return formattedFacilities[index];
        });
      request = {
        ...baseRequest,
        get: sinon.stub().resolves(rawFacilities)
      };

      const facilities = new Facilities(baseSdk, request);
      facilities._baseUrl = expectedHost;

      promise = facilities.getAll();
    });

    it('gets a list of facilities from the server', function() {
      expect(request.get).to.be.calledWith(`${expectedHost}/facilities`);
    });

    it('formats the facility object', function() {
      return promise.then(() => {
        expect(formatFacilityWithInfoFromServer).to.have.callCount(
          rawFacilities.length
        );

        rawFacilities.forEach((facility) => {
          expect(formatFacilityWithInfoFromServer).to.be.calledWith(facility);
        });
      });
    });

    it('returns a list of facilities', function() {
      return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
        formattedFacilities
      );
    });
  });

  describe('getAllByOrganizationId', function() {
    context('the organization ID is provided', function() {
      let expectedOrganizationId;
      let formatFacilityWithInfoFromServer;
      let formattedFacilities;
      let initialOptions;
      let promise;
      let rawFacilities;
      let rawFacilityOptions;
      let request;
      let toSnakeCase;

      beforeEach(function() {
        expectedOrganizationId = faker.random.number();
        const numberOfFacilities = faker.random.number({
          min: 1,
          max: 10
        });
        formattedFacilities = fixture.buildList('facility', numberOfFacilities);
        rawFacilities = fixture.buildList(
          'facility',
          numberOfFacilities,
          null,
          {
            fromServer: true
          }
        );
        initialOptions = faker.helpers.createTransaction();
        rawFacilityOptions = faker.helpers.createTransaction();

        formatFacilityWithInfoFromServer = sinon
          .stub(facilitiesUtils, 'formatFacilityWithInfoFromServer')
          .callsFake((facility) => {
            const index = rawFacilities.indexOf(facility);
            return formattedFacilities[index];
          });
        request = {
          ...baseRequest,
          get: sinon.stub().resolves(rawFacilities)
        };
        toSnakeCase = sinon
          .stub(objectUtils, 'toSnakeCase')
          .returns(rawFacilityOptions);

        const facilities = new Facilities(baseSdk, request);
        facilities._baseUrl = expectedHost;

        promise = facilities.getAllByOrganizationId(
          expectedOrganizationId,
          initialOptions
        );
      });

      it('gets options that are in a format suitable for the API', function() {
        expect(toSnakeCase).to.be.calledWith(initialOptions);
      });

      it('gets a list of facilities for an organization from the server', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/organizations/${expectedOrganizationId}/facilities`,
          {
            params: rawFacilityOptions
          }
        );
      });

      it('formats the facility object', function() {
        return promise.then(() => {
          expect(formatFacilityWithInfoFromServer).to.have.callCount(
            rawFacilities.length
          );

          rawFacilities.forEach((facility) => {
            expect(formatFacilityWithInfoFromServer).to.be.calledWith(facility);
          });
        });
      });

      it('returns a list of facilities', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
          formattedFacilities
        );
      });
    });

    context('the organization id is not provided', function() {
      it('throws an error', function() {
        const facilities = new Facilities(baseSdk, baseRequest);
        const promise = facilities.getAllByOrganizationId();

        return expect(promise).to.be.rejectedWith(
          "An organization ID is required for getting a list of an organization's facilities"
        );
      });
    });
  });

  describe('update', function() {
    context('when all required information is available', function() {
      let facilityUpdate;
      let formattedFacility;
      let promise;
      let toSnakeCase;

      beforeEach(function() {
        facilityUpdate = fixture.build('facility');
        formattedFacility = fixture.build('facility', null, {
          fromServer: true
        });

        toSnakeCase = sinon
          .stub(objectUtils, 'toSnakeCase')
          .returns(formattedFacility);

        const facilities = new Facilities(baseSdk, baseRequest);
        facilities._baseUrl = expectedHost;

        promise = facilities.update(facilityUpdate.id, facilityUpdate);
      });

      it('formats the data into the right format', function() {
        expect(toSnakeCase).to.be.calledWith(facilityUpdate, {
          excludeKeys: ['id', 'organizationId']
        });
      });

      it('updates the facility', function() {
        expect(baseRequest.put).to.be.calledWith(
          `${expectedHost}/facilities/${facilityUpdate.id}`,
          formattedFacility
        );
      });

      it('returns a fulfilled promise', function() {
        return expect(promise).to.be.fulfilled;
      });
    });

    context(
      'when there is missing or malformed required information',
      function() {
        let facilities;

        beforeEach(function() {
          facilities = new Facilities(baseSdk, baseRequest);
        });

        it('throws an error when there is no provided facility id', function() {
          const facilityUpdate = fixture.build('facility');
          const promise = facilities.update(null, facilityUpdate);

          return expect(promise).to.be.rejectedWith(
            'A facility ID is required to update a facility.'
          );
        });

        it('throws an error when there is no update provided', function() {
          const facilityUpdate = fixture.build('facility');
          const promise = facilities.update(facilityUpdate.id);

          return expect(promise).to.be.rejectedWith(
            'An update is required to update a facility.'
          );
        });

        it('throws an error when the update is not an object', function() {
          const facilityUpdate = fixture.build('facility');
          const promise = facilities.update(facilityUpdate.id, [
            facilityUpdate
          ]);

          return expect(promise).to.be.rejectedWith(
            'The facility update must be a well-formed object with the data you wish to update.'
          );
        });
      }
    );
  });
});

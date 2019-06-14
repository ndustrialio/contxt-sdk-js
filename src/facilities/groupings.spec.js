import omit from 'lodash.omit';
import FacilityGroupings from './groupings';
import * as objectUtils from '../utils/objects';

describe('Facilities/Groupings', function() {
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
    let facilityGroupings;

    beforeEach(function() {
      facilityGroupings = new FacilityGroupings(
        baseSdk,
        baseRequest,
        expectedHost
      );
    });

    it('sets a base url for the class instance', function() {
      expect(facilityGroupings._baseUrl).to.equal(expectedHost);
    });

    it('appends the supplied request module to the class instance', function() {
      expect(facilityGroupings._request).to.equal(baseRequest);
    });

    it('appends the supplied sdk to the class instance', function() {
      expect(facilityGroupings._sdk).to.equal(baseSdk);
    });
  });

  describe('addFacility', function() {
    context('when all required information is supplied', function() {
      let expectedFacilityId;
      let expectedGroupingFacility;
      let expectedGroupingId;
      let promise;
      let rawGroupingFacility;
      let request;
      let toCamelCase;

      beforeEach(function() {
        expectedGroupingFacility = fixture.build('facilityGroupingFacility');
        expectedFacilityId = expectedGroupingFacility.facilityId;
        expectedGroupingId = expectedGroupingFacility.facilityGroupingId;
        rawGroupingFacility = fixture.build('facilityGroupingFacility', {
          fromServer: true
        });

        request = {
          ...baseRequest,
          post: sinon.stub().resolves(rawGroupingFacility)
        };
        toCamelCase = sinon
          .stub(objectUtils, 'toCamelCase')
          .returns(expectedGroupingFacility);

        const facilityGroupings = new FacilityGroupings(
          baseSdk,
          request,
          expectedHost
        );

        promise = facilityGroupings.addFacility(
          expectedGroupingId,
          expectedFacilityId
        );
      });

      it('creates the new facility grouping <--> facility relationship', function() {
        expect(request.post).to.be.calledWith(
          `${expectedHost}/groupings/${expectedGroupingId}/facility/${expectedFacilityId}`
        );
      });

      it('formats the returning facility grouping facility object', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.calledWith(rawGroupingFacility);
        });
      });

      it('returns a fulfilled promise with the new facility information', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.equal(
          expectedGroupingFacility
        );
      });
    });

    context('when there is missing required information', function() {
      ['facilityGroupingId', 'facilityId'].forEach(function(field) {
        it(`it throws an error when ${field} is missing`, function() {
          const groupingFacility = fixture.build('facilityGroupingFacility');
          delete groupingFacility[field];

          const facilityGroupings = new FacilityGroupings(
            baseSdk,
            baseRequest,
            expectedHost
          );
          const promise = facilityGroupings.addFacility(
            groupingFacility.facilityGroupingId,
            groupingFacility.facilityId
          );

          return expect(promise).to.be.rejectedWith(
            `A ${field} is required to create a relationship between a facility grouping and a facility.`
          );
        });
      });
    });
  });

  describe('create', function() {
    context('when all required information is supplied', function() {
      let expectedGrouping;
      let formattedGroupingFromServer;
      let formattedGroupingToServer;
      let initialGrouping;
      let promise;
      let request;
      let toCamelCase;
      let toSnakeCase;

      beforeEach(function() {
        initialGrouping = fixture.build('facilityGrouping');
        formattedGroupingToServer = fixture.build('facilityGrouping', null, {
          fromServer: true
        });
        formattedGroupingFromServer = fixture.build('facilityGrouping', null, {
          fromServer: true
        });
        expectedGrouping = fixture.build('facilityGrouping', null, {
          fromServer: true
        });

        request = {
          ...baseRequest,
          post: sinon.stub().resolves(formattedGroupingFromServer)
        };
        toCamelCase = sinon
          .stub(objectUtils, 'toCamelCase')
          .returns(expectedGrouping);
        toSnakeCase = sinon
          .stub(objectUtils, 'toSnakeCase')
          .returns(formattedGroupingToServer);

        const facilityGroupings = new FacilityGroupings(
          baseSdk,
          request,
          expectedHost
        );

        promise = facilityGroupings.create(initialGrouping);
      });

      it('formats the submitted facility grouping object to send to the server', function() {
        expect(toSnakeCase).to.be.calledWith(initialGrouping);
      });

      it('creates a new facility grouping', function() {
        expect(request.post).to.be.deep.calledWith(
          `${expectedHost}/groupings`,
          formattedGroupingToServer
        );
      });

      it('formats the returned facility grouping object', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.calledWith(formattedGroupingFromServer);
        });
      });

      it('returns a fulfilled promise with the new facility grouping information', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.equal(
          expectedGrouping
        );
      });
    });

    context('when there is missing required information', function() {
      ['name', 'organizationId'].forEach(function(field) {
        it(`it throws an error when ${field} is missing`, function() {
          const facilityGrouping = fixture.build('facilityGrouping');
          const facilityGroupings = new FacilityGroupings(
            baseSdk,
            baseRequest,
            expectedHost
          );
          const promise = facilityGroupings.create(
            omit(facilityGrouping, [field])
          );

          return expect(promise).to.be.rejectedWith(
            `A ${field} is required to create a new facility grouping.`
          );
        });
      });
    });
  });

  describe('delete', function() {
    context('when all required information is supplied', function() {
      let expectedFacilityGroupingId;
      let promise;

      beforeEach(function() {
        expectedFacilityGroupingId = fixture.build('facilityGrouping').id;

        const facilityGroupings = new FacilityGroupings(
          baseSdk,
          baseRequest,
          expectedHost
        );
        promise = facilityGroupings.delete(expectedFacilityGroupingId);
      });

      it('requests to delete the facility grouping', function() {
        expect(baseRequest.delete).to.be.calledWith(
          `${expectedHost}/groupings/${expectedFacilityGroupingId}`
        );
      });

      it('returns a fulfilled promise', function() {
        return expect(promise).to.be.fulfilled;
      });
    });

    context('when there is missing required information', function() {
      it(`it throws an error when the facility grouping id is missing`, function() {
        const expectedErrorMessage = `A facility grouping id is required for deleting a facility grouping.`;

        const facilityGroupings = new FacilityGroupings(
          baseSdk,
          baseRequest,
          expectedHost
        );
        const promise = facilityGroupings.delete();

        return expect(promise).to.be.rejectedWith(expectedErrorMessage);
      });
    });
  });

  describe('getAll', function() {
    let expectedGrouping;
    let toCamelCase;
    let groupingsFromServer;
    let promise;
    let request;

    beforeEach(function() {
      const numberOfGroupings = faker.random.number({ min: 1, max: 10 });
      expectedGrouping = fixture.buildList(
        'facilityGrouping',
        numberOfGroupings
      );
      groupingsFromServer = fixture.buildList(
        'facilityGrouping',
        numberOfGroupings
      );

      request = {
        ...baseRequest,
        get: sinon.stub().resolves(groupingsFromServer)
      };
      toCamelCase = sinon
        .stub(objectUtils, 'toCamelCase')
        .returns(expectedGrouping);

      const facilityGroupings = new FacilityGroupings(
        baseSdk,
        request,
        expectedHost
      );
      promise = facilityGroupings.getAll();
    });

    it('gets a list of facility groupings', function() {
      expect(request.get).to.be.calledWith(`${expectedHost}/groupings`);
    });

    it('formats the list of facility groupings', function() {
      return promise.then(() => {
        expect(toCamelCase).to.be.calledWith(groupingsFromServer);
      });
    });

    it('returns a fulfilled promise with the facility groupings', function() {
      return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
        expectedGrouping
      );
    });
  });

  describe('getAllByOrganizationId', function() {
    context('when all required information is provided', function() {
      let expectedGrouping;
      let expectedOrganizationId;
      let toCamelCase;
      let groupingsFromServer;
      let promise;
      let request;

      beforeEach(function() {
        const numberOfGroupings = faker.random.number({ min: 1, max: 10 });
        expectedGrouping = fixture.buildList(
          'facilityGrouping',
          numberOfGroupings
        );
        groupingsFromServer = fixture.buildList(
          'facilityGrouping',
          numberOfGroupings
        );
        expectedOrganizationId = fixture.build('organization').id;

        request = {
          ...baseRequest,
          get: sinon.stub().resolves(groupingsFromServer)
        };
        toCamelCase = sinon
          .stub(objectUtils, 'toCamelCase')
          .returns(expectedGrouping);

        const facilityGroupings = new FacilityGroupings(
          baseSdk,
          request,
          expectedHost
        );
        promise = facilityGroupings.getAllByOrganizationId(
          expectedOrganizationId
        );
      });

      it('gets a list of facility groupings', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/organizations/${expectedOrganizationId}/groupings`
        );
      });

      it('formats the list of facility groupings', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.calledWith(groupingsFromServer);
        });
      });

      it('returns a fulfilled promise with the facility groupings', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
          expectedGrouping
        );
      });
    });

    context('when there is missing required information', function() {
      it('returns a rejected promise with an error when no organizationId is provided', function() {
        const facilityGroupings = new FacilityGroupings(
          baseSdk,
          baseRequest,
          expectedHost
        );
        const promise = facilityGroupings.getAllByOrganizationId();

        return expect(promise).to.be.rejectedWith(
          `An organization id is required for getting a list of an organization's facility groupings`
        );
      });
    });
  });

  describe('removeFacility', function() {
    context('when all required information is supplied', function() {
      let facilityGroupingFacility;
      let promise;

      beforeEach(function() {
        facilityGroupingFacility = fixture.build('facilityGroupingFacility');

        const facilityGroupings = new FacilityGroupings(
          baseSdk,
          baseRequest,
          expectedHost
        );
        promise = facilityGroupings.removeFacility(
          facilityGroupingFacility.facilityGroupingId,
          facilityGroupingFacility.facilityId
        );
      });

      it('requests to remove the facility', function() {
        const facilityGroupingId = facilityGroupingFacility.facilityGroupingId;
        const facilityId = facilityGroupingFacility.facilityId;

        expect(baseRequest.delete).to.be.calledWith(
          `${expectedHost}/groupings/${facilityGroupingId}/facility/${facilityId}`
        );
      });

      it('returns a fulfilled promise', function() {
        return expect(promise).to.be.fulfilled;
      });
    });

    context('when there is missing required information', function() {
      ['facilityGroupingId', 'facilityId'].forEach(function(field) {
        it(`it throws an error when ${field} is missing`, function() {
          const expectedErrorMessage = `A ${field} is required to remove a relationship between a facility grouping and a facility.`;
          const groupingFacility = fixture.build('facilityGroupingFacility');
          delete groupingFacility[field];

          const facilityGroupings = new FacilityGroupings(
            baseSdk,
            baseRequest,
            expectedHost
          );
          const promise = facilityGroupings.removeFacility(
            groupingFacility.facilityGroupingId,
            groupingFacility.facilityId
          );

          return expect(promise).to.be.rejectedWith(expectedErrorMessage);
        });
      });
    });
  });

  describe('update', function() {
    context('when all required information is available', function() {
      let toSnakeCase;
      let formattedGroupingFromServer;
      let formattedUpdateToServer;
      let groupingFromServer;
      let promise;
      let request;
      let toCamelCase;
      let update;

      beforeEach(function() {
        formattedGroupingFromServer = fixture.build('facilityGrouping');
        groupingFromServer = fixture.build(
          'facilityGrouping',
          formattedGroupingFromServer,
          {
            fromServer: true
          }
        );
        update = omit(formattedGroupingFromServer, [
          'createdAt',
          'id',
          'organizationId',
          'ownerId',
          'updatedAt'
        ]);
        formattedUpdateToServer = fixture.build('facilityGrouping', update, {
          fromServer: true
        });

        request = {
          ...baseRequest,
          put: sinon.stub().resolves(groupingFromServer)
        };
        toCamelCase = sinon
          .stub(objectUtils, 'toCamelCase')
          .returns(formattedGroupingFromServer);
        toSnakeCase = sinon
          .stub(objectUtils, 'toSnakeCase')
          .returns(formattedUpdateToServer);

        const facilityGroupings = new FacilityGroupings(
          baseSdk,
          request,
          expectedHost
        );
        promise = facilityGroupings.update(
          formattedGroupingFromServer.id,
          update
        );
      });

      it('formats the facility grouping update for the server', function() {
        expect(toSnakeCase).to.be.calledWith(update, {
          excludeKeys: ['id', 'organizationId', 'ownerId']
        });
      });

      it('updates the facility groupings', function() {
        expect(request.put).to.be.calledWith(
          `${expectedHost}/groupings/${formattedGroupingFromServer.id}`,
          formattedUpdateToServer
        );
      });

      it('formats the returned facility grouping', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.calledWith(groupingFromServer);
        });
      });

      it('returns a fulfilled promise with the updated facility grouping', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.equal(
          formattedGroupingFromServer
        );
      });
    });

    context(
      'when there is missing or malformed required information',
      function() {
        let facilityGroupings;

        beforeEach(function() {
          facilityGroupings = new FacilityGroupings(baseSdk, baseRequest);
        });

        it('throws an error when there is no provided facility grouping id', function() {
          const groupingUpdate = fixture.build('facilityGrouping');
          const promise = facilityGroupings.update(null, groupingUpdate);

          return expect(promise).to.be.rejectedWith(
            'A facility grouping id is required to update a facility grouping.'
          );
        });

        it('throws an error when there is no update provided', function() {
          const groupingUpdate = fixture.build('facilityGrouping');
          const promise = facilityGroupings.update(groupingUpdate.id);

          return expect(promise).to.be.rejectedWith(
            'An update is required to update a facility grouping'
          );
        });

        it('throws an error when the update is not an object', function() {
          const groupingUpdate = fixture.build('facilityGrouping');
          const promise = facilityGroupings.update(groupingUpdate.id, [
            groupingUpdate
          ]);

          return expect(promise).to.be.rejectedWith(
            'The facility grouping update must be a well-formed object with the data you wish to update.'
          );
        });
      }
    );
  });
});

import omit from 'lodash.omit';
import CostCenters from './costCenters';
import * as objectUtils from '../utils/objects';

describe('Facilities/CostCenters', function() {
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
    let costCenters;

    beforeEach(function() {
      costCenters = new CostCenters(baseSdk, baseRequest, expectedHost);
    });

    it('sets a base url for the class instance', function() {
      expect(costCenters._baseUrl).to.equal(expectedHost);
    });

    it('appends the supplied request module to the class instance', function() {
      expect(costCenters._request).to.equal(baseRequest);
    });

    it('appends the supplied sdk to the class instance', function() {
      expect(costCenters._sdk).to.equal(baseSdk);
    });
  });

  describe('addFacility', function() {
    context('when all required information is supplied', function() {
      let expectedFacilityId;
      let expectedCostCenterFacility;
      let expectedCostCenterId;
      let promise;
      let rawCostCenterFacility;
      let request;
      let toCamelCase;

      beforeEach(function() {
        expectedCostCenterFacility = fixture.build('costCenterFacility');
        expectedFacilityId = expectedCostCenterFacility.facilityId;
        expectedCostCenterId = expectedCostCenterFacility.costCenterId;
        rawCostCenterFacility = fixture.build('costCenterFacility', null, {
          fromServer: true
        });

        request = {
          ...baseRequest,
          post: sinon.stub().resolves(rawCostCenterFacility)
        };
        toCamelCase = sinon
          .stub(objectUtils, 'toCamelCase')
          .returns(expectedCostCenterFacility);
        const costCenters = new CostCenters(baseSdk, request, expectedHost);

        promise = costCenters.addFacility(
          expectedCostCenterId,
          expectedFacilityId
        );
      });

      it('creates the new cost center <--> facility relationship', function() {
        expect(request.post).to.be.calledWith(
          `${expectedHost}/costcenters/${expectedCostCenterId}/facility/${expectedFacilityId}`
        );
      });

      it('formats the returning cost center facility object', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.calledWith(rawCostCenterFacility);
        });
      });

      it('returns a fulfilled promise with the new facility information', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.equal(
          expectedCostCenterFacility
        );
      });
    });

    context('when there is missing required information', function() {
      ['costCenterId', 'facilityId'].forEach(function(field) {
        it(`it throws an error when ${field} is missing`, function() {
          const costCenterFacility = fixture.build('costCenterFacility');
          delete costCenterFacility[field];

          const costCenters = new CostCenters(
            baseSdk,
            baseRequest,
            expectedHost
          );
          const promise = costCenters.addFacility(
            costCenterFacility.costCenterId,
            costCenterFacility.facilityId
          );

          return expect(promise).to.be.rejectedWith(
            `A ${field} is required to create a relationship between a cost center and a facility.`
          );
        });
      });
    });
  });

  describe('create', function() {
    context('when all required information is supplied', function() {
      let formattedCostCenterFromServer;
      let formattedCostCenterToServer;
      let initialCostCenter;
      let promise;
      let request;
      let toCamelCase;
      let toSnakeCase;

      beforeEach(function() {
        initialCostCenter = fixture.build('costCenter');
        formattedCostCenterToServer = fixture.build('costCenter');
        formattedCostCenterFromServer = fixture.build('costCenter', null, {
          fromServer: true
        });

        request = {
          ...baseRequest,
          post: sinon.stub().resolves(formattedCostCenterFromServer)
        };
        toCamelCase = sinon
          .stub(objectUtils, 'toCamelCase')
          .returns(formattedCostCenterFromServer);
        toSnakeCase = sinon
          .stub(objectUtils, 'toSnakeCase')
          .returns(formattedCostCenterToServer);

        const costCenters = new CostCenters(baseSdk, request, expectedHost);

        promise = costCenters.create(initialCostCenter);
      });

      it('formats the submitted cost center object to send to the server', function() {
        expect(toSnakeCase).to.be.calledWith(initialCostCenter);
      });

      it('creates a new cost center', function() {
        expect(request.post).to.be.calledWith(
          `${expectedHost}/costcenters`,
          formattedCostCenterToServer
        );
      });

      it('formats the returned cost center object', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.calledWith(formattedCostCenterFromServer);
        });
      });

      it('returns a fulfilled promise with the new cost center information', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.equal(
          formattedCostCenterFromServer
        );
      });
    });

    context('when there is missing required information', function() {
      ['name', 'organizationId'].forEach(function(field) {
        it(`it throws an error when ${field} is missing`, function() {
          const costCenter = fixture.build('costCenter');
          const costCenters = new CostCenters(
            baseSdk,
            baseRequest,
            expectedHost
          );
          const promise = costCenters.create(omit(costCenter, [field]));

          return expect(promise).to.be.rejectedWith(
            `A ${field} is required to create a new cost center.`
          );
        });
      });
    });
  });

  describe('delete', function() {
    context('when all required information is supplied', function() {
      let expectedCostCenterId;
      let promise;

      beforeEach(function() {
        expectedCostCenterId = fixture.build('costCenter').id;

        const costCenters = new CostCenters(baseSdk, baseRequest, expectedHost);
        promise = costCenters.delete(expectedCostCenterId);
      });

      it('requests to delete the cost center', function() {
        expect(baseRequest.delete).to.be.calledWith(
          `${expectedHost}/costcenters/${expectedCostCenterId}`
        );
      });

      it('returns a fulfilled promise', function() {
        return expect(promise).to.be.fulfilled;
      });
    });

    context('when there is missing required information', function() {
      it('throws an error when the cost center id is missing', function() {
        const expectedErrorMessage =
          'A cost center id is required for deleting a cost center.';

        const costCenters = new CostCenters(baseSdk, baseRequest, expectedHost);
        const promise = costCenters.delete();

        return expect(promise).to.be.rejectedWith(expectedErrorMessage);
      });
    });
  });

  describe('getAll', function() {
    let expectedCostCenters;
    let costCentersFromServer;
    let promise;
    let request;
    let toCamelCase;

    beforeEach(function() {
      const numberOfCostCenters = faker.random.number({
        min: 1,
        max: 10
      });
      expectedCostCenters = fixture.buildList(
        'costCenter',
        numberOfCostCenters
      );
      costCentersFromServer = fixture.buildList(
        'costCenter',
        numberOfCostCenters,
        null,
        {
          fromServer: true
        }
      );

      request = {
        ...baseRequest,
        get: sinon.stub().resolves(costCentersFromServer)
      };
      toCamelCase = sinon
        .stub(objectUtils, 'toCamelCase')
        .returns(expectedCostCenters);

      const costCenters = new CostCenters(baseSdk, request, expectedHost);
      promise = costCenters.getAll();
    });

    it('gets a list of cost centers', function() {
      expect(request.get).to.be.calledWith(`${expectedHost}/costcenters`);
    });

    it('formats the list of cost centers', function() {
      return promise.then(() => {
        expect(toCamelCase).to.be.calledWith(costCentersFromServer);
      });
    });

    it('returns a fulfilled promise with the cost centers', function() {
      return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
        expectedCostCenters
      );
    });
  });

  describe('getAllByOrganizationId', function() {
    context('when all required information is provided', function() {
      let expectedCostCenters;
      let expectedOrganizationId;
      let costCentersFromServer;
      let promise;
      let request;
      let toCamelCase;

      beforeEach(function() {
        const numberOfCostCenters = faker.random.number({
          min: 1,
          max: 10
        });
        expectedCostCenters = fixture.buildList(
          'costCenter',
          numberOfCostCenters
        );

        expectedOrganizationId = fixture.build('organization').id;

        costCentersFromServer = fixture.buildList(
          'costCenter',
          numberOfCostCenters,
          {
            organizationId: expectedOrganizationId
          },
          {
            fromServer: true
          }
        );

        request = {
          ...baseRequest,
          get: sinon.stub().resolves(costCentersFromServer)
        };
        toCamelCase = sinon
          .stub(objectUtils, 'toCamelCase')
          .returns(expectedCostCenters);

        const costCenters = new CostCenters(baseSdk, request, expectedHost);
        promise = costCenters.getAllByOrganizationId(expectedOrganizationId);
      });

      it('gets a list of cost centers', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/organizations/${expectedOrganizationId}/costcenters`
        );
      });

      it('formats the list of cost centers', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.calledWith(costCentersFromServer);
        });
      });

      it('returns a fulfilled promise with the cost centers', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
          expectedCostCenters
        );
      });
    });

    context('when there is missing required information', function() {
      it('returns a rejected promise with an error when no organizationId is provided', function() {
        const costCenters = new CostCenters(baseSdk, baseRequest, expectedHost);
        const promise = costCenters.getAllByOrganizationId();

        return expect(promise).to.be.rejectedWith(
          `An organization id is required for getting a list of an organization's cost centers.`
        );
      });
    });
  });

  describe('removeFacility', function() {
    context('when all required information is supplied', function() {
      let costCenterFacility;
      let promise;

      beforeEach(function() {
        costCenterFacility = fixture.build('costCenterFacility');

        const costCenters = new CostCenters(baseSdk, baseRequest, expectedHost);
        promise = costCenters.removeFacility(
          costCenterFacility.costCenterId,
          costCenterFacility.facilityId
        );
      });

      it('requests to remove the facility', function() {
        const costCenterId = costCenterFacility.costCenterId;
        const facilityId = costCenterFacility.facilityId;

        expect(baseRequest.delete).to.be.calledWith(
          `${expectedHost}/costcenters/${costCenterId}/facility/${facilityId}`
        );
      });

      it('returns a fulfilled promise', function() {
        return expect(promise).to.be.fulfilled;
      });
    });

    context('when there is missing required information', function() {
      ['costCenterId', 'facilityId'].forEach(function(field) {
        it(`it throws an error when ${field} is missing`, function() {
          const expectedErrorMessage = `A ${field} is required to remove a relationship between a cost center and a facility.`;
          const costCenterFacility = fixture.build('costCenterFacility');
          delete costCenterFacility[field];

          const costCenters = new CostCenters(
            baseSdk,
            baseRequest,
            expectedHost
          );
          const promise = costCenters.removeFacility(
            costCenterFacility.costCenterId,
            costCenterFacility.facilityId
          );

          return expect(promise).to.be.rejectedWith(expectedErrorMessage);
        });
      });
    });
  });

  describe('update', function() {
    context('when all required information is available', function() {
      let formattedCostCenterFromServer;
      let formattedUpdateToServer;
      let costCenterFromServer;
      let promise;
      let request;
      let update;
      let toCamelCase;
      let toSnakeCase;

      beforeEach(function() {
        formattedCostCenterFromServer = fixture.build('costCenter');
        costCenterFromServer = fixture.build(
          'costCenter',
          formattedCostCenterFromServer,
          {
            fromServer: true
          }
        );
        update = omit(formattedCostCenterFromServer, [
          'createdAt',
          'id',
          'organizationId',
          'updatedAt'
        ]);
        formattedUpdateToServer = fixture.build('costCenter', update, {
          fromServer: true
        });

        request = {
          ...baseRequest,
          put: sinon.stub().resolves(costCenterFromServer)
        };
        toCamelCase = sinon
          .stub(objectUtils, 'toCamelCase')
          .returns(formattedCostCenterFromServer);
        toSnakeCase = sinon
          .stub(objectUtils, 'toSnakeCase')
          .returns(formattedUpdateToServer);

        const costCenters = new CostCenters(baseSdk, request, expectedHost);
        promise = costCenters.update(formattedCostCenterFromServer.id, update);
      });

      it('formats the cost center update for the server', function() {
        expect(toSnakeCase).to.be.calledWith(update);
      });

      it('updates the cost center', function() {
        expect(request.put).to.be.calledWith(
          `${expectedHost}/costcenters/${formattedCostCenterFromServer.id}`,
          formattedUpdateToServer
        );
      });

      it('formats the returned cost center', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.calledWith(costCenterFromServer);
        });
      });

      it('returns a fulfilled promise with the updated cost center', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.equal(
          formattedCostCenterFromServer
        );
      });
    });

    context(
      'when there is missing or malformed required information',
      function() {
        let costCenters;

        beforeEach(function() {
          costCenters = new CostCenters(baseSdk, baseRequest);
        });

        it('throws an error when there is no provided cost center id', function() {
          const costCenterUpdate = fixture.build('costCenter');
          const promise = costCenters.update(null, costCenterUpdate);

          return expect(promise).to.be.rejectedWith(
            'A cost center id is required to update a cost center.'
          );
        });

        it('throws an error when there is no update provided', function() {
          const costCenterUpdate = fixture.build('costCenter');
          const promise = costCenters.update(costCenterUpdate.id, null);

          return expect(promise).to.be.rejectedWith(
            'An update is required to update a cost center'
          );
        });

        it('throws an error when the update is not an object', function() {
          const costCenterUpdate = fixture.build('costCenter');
          const promise = costCenters.update(costCenterUpdate.id, [
            costCenterUpdate
          ]);

          return expect(promise).to.be.rejectedWith(
            'The cost center update must be a well-formed object with the data you wish to update.'
          );
        });
      }
    );
  });
});

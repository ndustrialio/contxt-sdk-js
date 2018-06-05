import omit from 'lodash.omit';
import CostCenters from './costCenters';
import * as facilitiesUtils from '../utils/facilities';

describe('Facilities/CostCenters', function() {
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
          facilities: fixture.build('audience')
        }
      }
    };
    expectedHost = faker.internet.url();
  });

  afterEach(function() {
    this.sandbox.restore();
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
      let formatCostCenterFacilityFromServer;
      let promise;
      let rawCostCenterFacility;
      let request;

      beforeEach(function() {
        expectedCostCenterFacility = fixture.build('costCenterFacility');
        expectedFacilityId = expectedCostCenterFacility.facilityId;
        expectedCostCenterId = expectedCostCenterFacility.costCenterId;
        rawCostCenterFacility = fixture.build('costCenterFacility', {
          fromServer: true
        });

        formatCostCenterFacilityFromServer = this.sandbox
          .stub(facilitiesUtils, 'formatCostCenterFacilityFromServer')
          .returns(expectedCostCenterFacility);
        request = {
          ...baseRequest,
          post: this.sandbox.stub().resolves(rawCostCenterFacility)
        };

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
          expect(formatCostCenterFacilityFromServer).to.be.calledWith(
            rawCostCenterFacility
          );
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
      let expectedCostCenter;
      let formatCostCenterFromServer;
      let formatCostCenterToServer;
      let formattedCostCenterFromServer;
      let formattedCostCenterToServer;
      let initialCostCenter;
      let promise;
      let request;

      beforeEach(function() {
        initialCostCenter = fixture.build('costCenter');
        formattedCostCenterToServer = fixture.build('costCenter', null, {
          fromServer: false
        });
        formattedCostCenterFromServer = fixture.build('costCenter', null, {
          fromServer: true
        });
        expectedCostCenter = fixture.build('costCenter', null, {
          fromServer: true
        });

        formatCostCenterFromServer = this.sandbox
          .stub(facilitiesUtils, 'formatCostCenterFromServer')
          .returns(expectedCostCenter);
        formatCostCenterToServer = this.sandbox
          .stub(facilitiesUtils, 'formatCostCenterToServer')
          .returns(formattedCostCenterToServer);
        request = {
          ...baseRequest,
          post: this.sandbox.stub().resolves(formattedCostCenterFromServer)
        };

        const costCenters = new CostCenters(baseSdk, request, expectedHost);

        promise = costCenters.create(initialCostCenter);
      });

      it('formats the submitted cost center object to send to the server', function() {
        expect(formatCostCenterToServer).to.be.calledWith(initialCostCenter);
      });

      it('creates a new cost center', function() {
        expect(request.post).to.be.deep.calledWith(
          `${expectedHost}/costcenters`,
          formattedCostCenterToServer
        );
      });

      it('formats the returned cost center object', function() {
        return promise.then(() => {
          expect(formatCostCenterFromServer).to.be.calledWith(
            formattedCostCenterFromServer
          );
        });
      });

      it('returns a fulfilled promise with the new cost center information', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.equal(
          expectedCostCenter
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
      it(`it throws an error when the cost center id is missing`, function() {
        const expectedErrorMessage = `A cost center id is required for deleting a cost center.`;

        const costCenters = new CostCenters(baseSdk, baseRequest, expectedHost);
        const promise = costCenters.delete();

        return expect(promise).to.be.rejectedWith(expectedErrorMessage);
      });
    });
  });

  describe('getAll', function() {
    let expectedCostCenter;
    let formatCostCenterFromServer;
    let costCentersFromServer;
    let promise;
    let request;

    beforeEach(function() {
      const numberOfCostCenters = faker.random.number({
        min: 1,
        max: 10
      });
      expectedCostCenter = fixture.buildList('costCenter', numberOfCostCenters);
      costCentersFromServer = fixture.buildList(
        'costCenter',
        numberOfCostCenters
      );

      formatCostCenterFromServer = this.sandbox
        .stub(facilitiesUtils, 'formatCostCenterFromServer')
        .callsFake((costCenter, index) => expectedCostCenter[index]);
      request = {
        ...baseRequest,
        get: this.sandbox.stub().resolves(costCentersFromServer)
      };

      const costCenters = new CostCenters(baseSdk, request, expectedHost);
      promise = costCenters.getAll();
    });

    it('gets a list of cost centers', function() {
      expect(request.get).to.be.calledWith(`${expectedHost}/costcenters`);
    });

    it('formats the list of cost centers', function() {
      return promise.then(() => {
        expect(formatCostCenterFromServer).to.have.callCount(
          costCentersFromServer.length
        );
        costCentersFromServer.forEach((costCenter) => {
          expect(formatCostCenterFromServer).to.be.calledWith(costCenter);
        });
      });
    });

    it('returns a fulfilled promise with the cost centers', function() {
      return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
        expectedCostCenter
      );
    });
  });

  describe('getAllByOrganizationId', function() {
    context('when all required information is provided', function() {
      let expectedCostCenter;
      let expectedOrganizationId;
      let formatCostCenterFromServer;
      let costCentersFromServer;
      let promise;
      let request;

      beforeEach(function() {
        const numberOfCostCenters = faker.random.number({
          min: 1,
          max: 10
        });
        expectedCostCenter = fixture.buildList(
          'costCenter',
          numberOfCostCenters,
          false
        );
        costCentersFromServer = fixture.buildList(
          'costCenter',
          numberOfCostCenters,
          true
        );
        expectedOrganizationId = fixture.build('organization').id;

        formatCostCenterFromServer = this.sandbox
          .stub(facilitiesUtils, 'formatCostCenterFromServer')
          .callsFake((costCenter, index) => expectedCostCenter[index]);
        request = {
          ...baseRequest,
          get: this.sandbox.stub().resolves(costCentersFromServer)
        };

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
          expect(formatCostCenterFromServer).to.have.callCount(
            costCentersFromServer.length
          );
          costCentersFromServer.forEach((costCenter) => {
            expect(formatCostCenterFromServer).to.be.calledWith(costCenter);
          });
        });
      });

      it('returns a fulfilled promise with the cost centers', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
          expectedCostCenter
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
      let formatCostCenterFromServer;
      let formatCostCenterToServer;
      let formattedCostCenterFromServer;
      let formattedUpdateToServer;
      let costCenterFromServer;
      let promise;
      let request;
      let update;

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

        formatCostCenterFromServer = this.sandbox
          .stub(facilitiesUtils, 'formatCostCenterFromServer')
          .returns(formattedCostCenterFromServer);
        formatCostCenterToServer = this.sandbox
          .stub(facilitiesUtils, 'formatCostCenterToServer')
          .returns(formattedUpdateToServer);
        request = {
          ...baseRequest,
          put: this.sandbox.stub().resolves(costCenterFromServer)
        };

        const costCenters = new CostCenters(baseSdk, request, expectedHost);
        promise = costCenters.update(formattedCostCenterFromServer.id, update);
      });

      it('formats the cost center update for the server', function() {
        expect(formatCostCenterToServer).to.be.calledWith(update);
      });

      it('updates the cost center', function() {
        expect(request.put).to.be.calledWith(
          `${expectedHost}/costcenters/${formattedCostCenterFromServer.id}`,
          formattedUpdateToServer
        );
      });

      it('formats the returned cost center', function() {
        return promise.then(() => {
          expect(formatCostCenterFromServer).to.be.calledWith(
            costCenterFromServer
          );
        });
      });

      it('returns a fulfilled promise with the updated cost center', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.equal(
          formattedCostCenterFromServer
        );
      });
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
        const promise = costCenters.update(costCenterUpdate.id);

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

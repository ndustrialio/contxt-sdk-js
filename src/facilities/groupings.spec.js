import omit from 'lodash.omit';
import FacilityGroupings from './groupings';
import * as facilitiesUtils from '../utils/facilities';

describe('Facilities/Groupings', function() {
  let baseRequest;
  let baseSdk;
  let expectedHost;

  beforeEach(function() {
    this.sandbox = sandbox.create();

    baseRequest = {
      delete: this.sandbox.stub().resolves(),
      get: this.sandbox.stub().resolves(),
      post: this.sandbox.stub().resolves()
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
      let formatGroupingFacilityFromServer;
      let promise;
      let rawGroupingFacility;
      let request;

      beforeEach(function() {
        expectedGroupingFacility = fixture.build('facilityGroupingFacility');
        expectedFacilityId = expectedGroupingFacility.facilityId;
        expectedGroupingId = expectedGroupingFacility.facilityGroupingId;
        rawGroupingFacility = fixture.build('facilityGroupingFacility', {
          fromServer: true
        });

        formatGroupingFacilityFromServer = this.sandbox
          .stub(facilitiesUtils, 'formatGroupingFacilityFromServer')
          .returns(expectedGroupingFacility);
        request = {
          ...baseRequest,
          post: this.sandbox.stub().resolves(rawGroupingFacility)
        };

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
          expect(formatGroupingFacilityFromServer).to.be.calledWith(
            rawGroupingFacility
          );
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
      let formatGroupingFromServer;
      let formatGroupingToServer;
      let formattedGroupingFromServer;
      let formattedGroupingToServer;
      let initialGrouping;
      let promise;
      let request;

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

        formatGroupingFromServer = this.sandbox
          .stub(facilitiesUtils, 'formatGroupingFromServer')
          .returns(expectedGrouping);
        formatGroupingToServer = this.sandbox
          .stub(facilitiesUtils, 'formatGroupingToServer')
          .returns(formattedGroupingToServer);
        request = {
          ...baseRequest,
          post: this.sandbox.stub().resolves(formattedGroupingFromServer)
        };

        const facilityGroupings = new FacilityGroupings(
          baseSdk,
          request,
          expectedHost
        );

        promise = facilityGroupings.create(initialGrouping);
      });

      it('formats the submitted facility grouping object to send to the server', function() {
        expect(formatGroupingToServer).to.be.calledWith(initialGrouping);
      });

      it('creates a new facility grouping', function() {
        expect(request.post).to.be.deep.calledWith(
          `${expectedHost}/groupings`,
          formattedGroupingToServer
        );
      });

      it('formats the returned facility grouping object', function() {
        return promise.then(() => {
          expect(formatGroupingFromServer).to.be.calledWith(
            formattedGroupingFromServer
          );
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
    let formatGroupingFromServer;
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

      formatGroupingFromServer = this.sandbox
        .stub(facilitiesUtils, 'formatGroupingFromServer')
        .callsFake((grouping, index) => expectedGrouping[index]);
      request = {
        ...baseRequest,
        get: this.sandbox.stub().resolves(groupingsFromServer)
      };

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
        expect(formatGroupingFromServer).to.have.callCount(
          groupingsFromServer.length
        );
        groupingsFromServer.forEach(grouping => {
          expect(formatGroupingFromServer).to.be.calledWith(grouping);
        });
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
      let formatGroupingFromServer;
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

        formatGroupingFromServer = this.sandbox
          .stub(facilitiesUtils, 'formatGroupingFromServer')
          .callsFake((grouping, index) => expectedGrouping[index]);
        request = {
          ...baseRequest,
          get: this.sandbox.stub().resolves(groupingsFromServer)
        };

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
          expect(formatGroupingFromServer).to.have.callCount(
            groupingsFromServer.length
          );
          groupingsFromServer.forEach(grouping => {
            expect(formatGroupingFromServer).to.be.calledWith(grouping);
          });
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
});

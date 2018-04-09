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
      facilityGroupings = new FacilityGroupings(baseSdk, baseRequest, expectedHost);
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
        rawGroupingFacility = fixture.build('facilityGroupingFacility', { fromServer: true });

        formatGroupingFacilityFromServer = this.sandbox.stub(facilitiesUtils, 'formatGroupingFacilityFromServer')
          .returns(expectedGroupingFacility);
        request = {
          ...baseRequest,
          post: this.sandbox.stub().resolves(rawGroupingFacility)
        };

        const facilityGroupings = new FacilityGroupings(baseSdk, request, expectedHost);

        promise = facilityGroupings.addFacility(expectedGroupingId, expectedFacilityId);
      });

      it('creates the new facility grouping <--> facility relationship', function() {
        expect(request.post).to.be.calledWith(
          `${expectedHost}/groupings/${expectedGroupingId}/facility/${expectedFacilityId}`
        );
      });

      it('formats the returning facility grouping facility object', function() {
        return promise.then(() => {
          expect(formatGroupingFacilityFromServer).to.be.calledWith(rawGroupingFacility);
        });
      });

      it('returns a fulfilled promise with the new facility information', function() {
        return expect(promise).to.be.fulfilled
          .and.to.eventually.equal(expectedGroupingFacility);
      });
    });

    context('when there is missing required information', function() {
      ['facilityGroupingId', 'facilityId'].forEach(function(field) {
        it(`it throws an error when ${field} is missing`, function() {
          const groupingFacility = fixture.build('facilityGroupingFacility');
          delete groupingFacility[field];

          const facilityGroupings = new FacilityGroupings(baseSdk, baseRequest);
          const promise = facilityGroupings.addFacility(
            groupingFacility.facilityGroupingId,
            groupingFacility.facilityId
          );

          return expect(promise).to.be
            .rejectedWith(`A ${field} is required to create a between a facility grouping and a facility.`);
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
        formattedGroupingToServer = fixture.build('facilityGrouping', null, { fromServer: true });
        formattedGroupingFromServer = fixture.build('facilityGrouping', null, { fromServer: true });
        expectedGrouping = fixture.build('facilityGrouping', null, { fromServer: true });

        formatGroupingFromServer = this.sandbox.stub(facilitiesUtils, 'formatGroupingFromServer')
          .returns(expectedGrouping);
        formatGroupingToServer = this.sandbox.stub(facilitiesUtils, 'formatGroupingToServer')
          .returns(formattedGroupingToServer);
        request = {
          ...baseRequest,
          post: this.sandbox.stub().resolves(formattedGroupingFromServer)
        };

        const facilityGroupings = new FacilityGroupings(baseSdk, request, expectedHost);

        promise = facilityGroupings.create(initialGrouping);
      });

      it('formats the submitted facility grouping object to send to the server', function() {
        expect(formatGroupingToServer).to.be.calledWith(initialGrouping);
      });

      it('creates a new facility grouping', function() {
        expect(request.post)
          .to.be.deep.calledWith(`${expectedHost}/groupings`, formattedGroupingToServer);
      });

      it('formats the returned facility grouping object', function() {
        return promise.then(() => {
          expect(formatGroupingFromServer).to.be.calledWith(formattedGroupingFromServer);
        });
      });

      it('returns a fulfilled promise with the new facility grouping information', function() {
        return expect(promise).to.be.fulfilled
          .and.to.eventually.equal(expectedGrouping);
      });
    });

    context('when there is missing required information', function() {
      ['name', 'organizationId'].forEach(function(field) {
        it(`it throws an error when ${field} is missing`, function() {
          const facilityGrouping = fixture.build('facilityGrouping');
          const facilityGroupings = new FacilityGroupings(baseSdk, baseRequest, expectedHost);
          const promise = facilityGroupings.create(omit(facilityGrouping, [field]));

          return expect(promise).to.be
            .rejectedWith(`A ${field} is required to create a new facility grouping.`);
        });
      });
    });
  });
});

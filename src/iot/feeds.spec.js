import Feeds from './feeds';
import * as objectUtils from '../utils/objects';

describe('Iot/Feeds', function() {
  let baseRequest;
  let baseSdk;
  let expectedHost;

  beforeEach(function() {
    baseRequest = {
      get: sinon.stub().resolves()
    };
    baseSdk = {
      config: {
        audiences: {
          iot: fixture.build('audience')
        }
      }
    };
    expectedHost = faker.internet.url();
  });

  afterEach(function() {
    sinon.restore();
  });

  describe('constructor', function() {
    let feeds;

    beforeEach(function() {
      feeds = new Feeds(baseSdk, baseRequest, expectedHost);
    });

    it('sets a base url for the class instance', function() {
      expect(feeds._baseUrl).to.equal(expectedHost);
    });

    it('appends the supplied request module to the class instance', function() {
      expect(feeds._request).to.equal(baseRequest);
    });

    it('appends the supplied sdk to the class instance', function() {
      expect(feeds._sdk).to.equal(baseSdk);
    });
  });

  describe('getByFacilityId', function() {
    context('the facility ID is provided', function() {
      let expectedFeeds;
      let promise;
      let rawFeeds;
      let request;
      let toCamelCase;
      let toSnakeCase;
      let facilityId;

      beforeEach(function() {
        facilityId = fixture.build('facility').id;
        expectedFeeds = fixture.buildList(
          'feed',
          faker.random.number({
            min: 1,
            max: 10
          })
        );
        rawFeeds = expectedFeeds.map((feed) =>
          fixture.build('feed', feed, { fromServer: true })
        );

        request = {
          ...baseRequest,
          get: sinon.stub().resolves(rawFeeds)
        };
        toCamelCase = sinon
          .stub(objectUtils, 'toCamelCase')
          .returns(expectedFeeds);
        toSnakeCase = sinon
          .stub(objectUtils, 'toSnakeCase')
          .returns({ facility_id: facilityId });

        const feeds = new Feeds(baseSdk, request);
        feeds._baseUrl = expectedHost;

        promise = feeds.getByFacilityId(facilityId);
      });

      it('formats the submitted facility id to send to the server', function() {
        expect(toSnakeCase).to.be.calledWith({ facilityId });
      });

      it('gets feeds from provided facility from the server', function() {
        expect(request.get).to.be.calledWith(`${expectedHost}/feeds`, {
          params: { facility_id: facilityId }
        });
      });

      it('formats feeds', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.calledWith(rawFeeds);
        });
      });

      it('returns the requested feeds', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.equal(
          expectedFeeds
        );
      });
    });

    context('the facility ID is not provided', function() {
      it('throws an error', function() {
        const feeds = new Feeds(baseSdk, baseRequest);
        const promise = feeds.getByFacilityId();

        return expect(promise).to.be.rejectedWith(
          'A facilityId is required to get feeds.'
        );
      });
    });
  });

  describe('getStatusForFacility', function() {
    context('the facility ID is provided', function() {
      let expectedResult;
      let promise;
      let rawResult;
      let request;
      let toCamelCase;
      let facilityId;

      beforeEach(function() {
        facilityId = fixture.build('facility').id;
        expectedResult = {
          feeds: fixture.buildList(
            'feed',
            faker.random.number({
              min: 1,
              max: 10
            })
          )
        };

        expectedResult.feeds.forEach((feed) => {
          feed.groupings = fixture.buildList(
            'fieldGroupingStatus',
            faker.random.number({ min: 1, max: 4 })
          );
        });

        rawResult = {
          feeds: expectedResult.feeds.map((feed) =>
            fixture.build('feed', feed, { fromServer: true })
          )
        };

        rawResult.feeds.forEach((feed) => {
          feed.groupings = feed.groupings.map((groupingStatus) => {
            fixture.build('fieldGroupingStatus', groupingStatus, {
              fromServer: true
            });
          });
        });

        request = {
          ...baseRequest,
          get: sinon.stub().resolves(rawResult)
        };

        toCamelCase = sinon
          .stub(objectUtils, 'toCamelCase')
          .returns(expectedResult);

        const feeds = new Feeds(baseSdk, request);
        feeds._baseUrl = expectedHost;

        promise = feeds.getStatusForFacility(facilityId);
      });

      it('gets feeds from provided facility from the server', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/facilities/${facilityId}/status`
        );
      });

      it('formats the status response', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.calledWith(rawResult);
        });
      });

      it('returns the requested feed status', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.equal(
          expectedResult
        );
      });
    });

    context('the facility ID is not provided', function() {
      it('throws an error', function() {
        const feeds = new Feeds(baseSdk, baseRequest);
        const promise = feeds.getStatusForFacility();

        return expect(promise).to.be.rejectedWith(
          'A facilityId is required to get facility feed status.'
        );
      });
    });
  });
});

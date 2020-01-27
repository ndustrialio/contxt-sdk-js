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
      let facilityId;

      beforeEach(function() {
        facilityId = fixture.build('facility').id;
        expectedFeeds = fixture.build('feed');
        rawFeeds = fixture.build('feed', expectedFeeds, {
          fromServer: true
        });

        request = {
          ...baseRequest,
          get: sinon.stub().resolves(rawFeeds)
        };
        toCamelCase = sinon
          .stub(objectUtils, 'toCamelCase')
          .returns(expectedFeeds);

        const feeds = new Feeds(baseSdk, request);
        feeds._baseUrl = expectedHost;

        promise = feeds.getByFacilityId(facilityId);
      });

      it('gets feeds from provided facility from the server', function() {
        expect(request.get).to.be.calledWith(`${expectedHost}/feeds`, {
          facilityId: facilityId
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
          'A facilityId is required get feeds.'
        );
      });
    });
  });
});

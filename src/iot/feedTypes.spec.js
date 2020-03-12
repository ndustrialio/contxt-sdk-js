import FeedTypes from './feedTypes';

describe('Iot/FeedTypes', function() {
  let baseRequest;
  let baseSdk;
  let expectedHost;
  let feedTypes;
  let expectedFeedTypes;

  beforeEach(function() {
    expectedFeedTypes = fixture.buildList(
      'feedType',
      3,
      {},
      { fromServer: true }
    );
    baseRequest = {
      get: sinon.stub().resolves(expectedFeedTypes)
    };
    baseSdk = {
      config: {
        audiences: {
          iot: fixture.build('audience')
        }
      }
    };
    expectedHost = faker.internet.url();

    feedTypes = new FeedTypes(baseSdk, baseRequest, expectedHost);
  });

  afterEach(function() {
    sinon.restore();
  });

  describe('getAll', function() {
    it('returns feed types', function() {
      return feedTypes.getAll().then((feedTypes) => {
        expect(feedTypes.length).to.equal(expectedFeedTypes.length);
        expectedFeedTypes.forEach((expectedFeedType) => {
          expect(
            feedTypes.findIndex((feed) => feed.id === expectedFeedType.id)
          ).to.not.equal(-1);
        });
      });
    });

    it('returns camel-cased properties', function() {
      return feedTypes.getAll().then((feedTypes) => {
        feedTypes.forEach((feedType) => {
          Object.keys(feedType).forEach((key) => {
            expect(key).to.not.contain('_');
          });
        });
      });
    });
  });
});

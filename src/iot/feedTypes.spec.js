import FeedTypes from './feedTypes';

describe('Iot/FeedTypes', function() {
  let baseRequest;
  let baseSdk;
  let expectedHost;
  let feedTypes;
  let expectedFeedTypes;

  beforeEach(function() {
    expectedFeedTypes = fixture.buildList('feedType', 3);

    const serverFeedTypes = expectedFeedTypes.map((feedType) =>
      fixture.build('feedType', feedType, { fromServer: true })
    );

    baseRequest = {
      get: sinon.stub().resolves(serverFeedTypes)
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
          const outputFeedType = feedTypes.find(
            (feedType) => feedType.id === expectedFeedType.id
          );
          expect(outputFeedType).to.deep.equal(expectedFeedType);
        });
      });
    });
  });
});

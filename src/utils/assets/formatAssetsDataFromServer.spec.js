import formatAssetsDataFromServer from './formatAssetsDataFromServer';
import * as assetsUtils from './index';

describe('utils/assets/formatAssetsDataFromServer', function() {
  let assetsData;
  let assetsFromServerBeforeFormat;
  let assetsFromServerAfterFormat;
  let expectedAssetsData;
  let formatAssetFromServer;
  let formattedAssetsData;
  let offset;
  let totalRecords;

  beforeEach(function() {
    this.sandbox = sandbox.create();

    offset = faker.random.number({ min: 0, max: 100 });
    totalRecords = faker.random.number({ min: 1, max: 10 });

    assetsFromServerAfterFormat = fixture.buildList('asset', totalRecords);
    assetsFromServerBeforeFormat = fixture.buildList(
      'asset',
      totalRecords,
      null,
      { fromServer: true }
    );

    assetsData = {
      _metadata: {
        offset,
        totalRecords
      },
      records: assetsFromServerBeforeFormat
    };

    expectedAssetsData = {
      ...assetsData,
      records: assetsFromServerAfterFormat
    };

    formatAssetFromServer = this.sandbox
      .stub(assetsUtils, 'formatAssetFromServer')
      .callsFake((asset) => {
        const index = assetsFromServerBeforeFormat.findIndex(
          (assetBeforeFormat) => {
            return assetBeforeFormat.id === asset.id;
          }
        );

        return assetsFromServerAfterFormat[index];
      });

    formattedAssetsData = formatAssetsDataFromServer(assetsData);
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  it('formats the asset object', function() {
    expect(formatAssetFromServer).to.have.callCount(
      assetsFromServerBeforeFormat.length
    );

    assetsFromServerBeforeFormat.forEach((asset) => {
      expect(formatAssetFromServer).to.be.deep.calledWith(asset);
    });
  });

  it('returns the formatted data', function() {
    expect(formattedAssetsData).to.deep.equal(expectedAssetsData);
  });
});

import formatAssetTypesDataFromServer from './formatAssetTypesDataFromServer';
import * as assetsUtils from './index';

describe('utils/assets/formatAssetTypesDataFromServer', function() {
  let assetTypesData;
  let assetTypesFromServerBeforeFormat;
  let assetTypesFromServerAfterFormat;
  let expectedAssetTypesData;
  let formatAssetTypeFromServer;
  let formattedAssetTypesData;
  let offset;
  let totalRecords;

  beforeEach(function() {
    this.sandbox = sandbox.create();

    offset = faker.random.number({ min: 0, max: 100 });
    totalRecords = faker.random.number({ min: 1, max: 10 });

    assetTypesFromServerAfterFormat = fixture.buildList(
      'assetType',
      totalRecords
    );
    assetTypesFromServerBeforeFormat = fixture.buildList(
      'assetType',
      totalRecords,
      null,
      { fromServer: true }
    );

    assetTypesData = {
      _metadata: {
        offset,
        totalRecords
      },
      records: assetTypesFromServerBeforeFormat
    };

    expectedAssetTypesData = {
      ...assetTypesData,
      records: assetTypesFromServerAfterFormat
    };

    formatAssetTypeFromServer = this.sandbox
      .stub(assetsUtils, 'formatAssetTypeFromServer')
      .callsFake((asset) => {
        const index = assetTypesFromServerBeforeFormat.findIndex(
          (assetBeforeFormat) => {
            return assetBeforeFormat.id === asset.id;
          }
        );

        return assetTypesFromServerAfterFormat[index];
      });

    formattedAssetTypesData = formatAssetTypesDataFromServer(assetTypesData);
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  it('formats the asset object', function() {
    expect(formatAssetTypeFromServer).to.have.callCount(
      assetTypesFromServerBeforeFormat.length
    );

    assetTypesFromServerBeforeFormat.forEach((asset) => {
      expect(formatAssetTypeFromServer).to.be.deep.calledWith(asset);
    });
  });

  it('returns the formatted data', function() {
    expect(formattedAssetTypesData).to.deep.equal(expectedAssetTypesData);
  });
});

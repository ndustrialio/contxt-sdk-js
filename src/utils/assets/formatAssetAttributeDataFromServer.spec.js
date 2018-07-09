import formatAssetAttributeDataFromServer from './formatAssetAttributeDataFromServer';
import * as assetsUtils from './index';

describe('utils/assets/formatAssetAttributeDataFromServer', function() {
  let assetAttributesData;
  let assetAttributesFromServerBeforeFormat;
  let assetAttributesFromServerAfterFormat;
  let expectedAssetAttributesData;
  let formatAssetAttributeFromServer;
  let formattedAssetAttributesData;
  let offset;
  let totalRecords;

  beforeEach(function() {
    this.sandbox = sandbox.create();

    offset = faker.random.number({ min: 0, max: 100 });
    totalRecords = faker.random.number({ min: 1, max: 10 });

    assetAttributesFromServerAfterFormat = fixture.buildList(
      'assetAttribute',
      totalRecords
    );
    assetAttributesFromServerBeforeFormat = fixture.buildList(
      'assetAttribute',
      totalRecords,
      null,
      { fromServer: true }
    );

    assetAttributesData = {
      _metadata: {
        offset,
        totalRecords
      },
      records: assetAttributesFromServerBeforeFormat
    };

    expectedAssetAttributesData = {
      ...assetAttributesData,
      records: assetAttributesFromServerAfterFormat
    };

    formatAssetAttributeFromServer = this.sandbox
      .stub(assetsUtils, 'formatAssetAttributeFromServer')
      .callsFake((asset) => {
        const index = assetAttributesFromServerBeforeFormat.findIndex(
          (assetBeforeFormat) => {
            return assetBeforeFormat.id === asset.id;
          }
        );

        return assetAttributesFromServerAfterFormat[index];
      });

    formattedAssetAttributesData = formatAssetAttributeDataFromServer(
      assetAttributesData
    );
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  it('formats the asset attribute object', function() {
    expect(formatAssetAttributeFromServer).to.have.callCount(
      assetAttributesFromServerBeforeFormat.length
    );

    assetAttributesFromServerBeforeFormat.forEach((asset) => {
      expect(formatAssetAttributeFromServer).to.be.deep.calledWith(asset);
    });
  });

  it('returns the formatted data', function() {
    expect(formattedAssetAttributesData).to.deep.equal(
      expectedAssetAttributesData
    );
  });
});

import omit from 'lodash.omit';
import formatAssetAttributeValueToServer from './formatAssetAttributeValueToServer';

describe('utils/assets/formatAssetAttributeValueToServer', function() {
  let assetAttributeValue;
  let expectedAssetAttributeValue;
  let formattedAssetAttributeValue;

  beforeEach(function() {
    assetAttributeValue = fixture.build('assetAttributeValue');
    expectedAssetAttributeValue = omit(
      {
        ...assetAttributeValue,
        asset_attribute_id: assetAttributeValue.assetAttributeId,
        asset_id: assetAttributeValue.assetId,
        effective_date: assetAttributeValue.effectiveDate
      },
      [
        'assetAttributeId',
        'assetId',
        'createdAt',
        'effectiveDate',
        'id',
        'updatedAt'
      ]
    );

    formattedAssetAttributeValue = formatAssetAttributeValueToServer(
      assetAttributeValue
    );
  });

  it('converts the object keys to snake case', function() {
    expect(formattedAssetAttributeValue).to.deep.equal(
      expectedAssetAttributeValue
    );
  });
});

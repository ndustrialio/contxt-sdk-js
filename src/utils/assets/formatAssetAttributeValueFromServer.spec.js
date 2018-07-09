import omit from 'lodash.omit';
import formatAssetAttributeValueFromServer from './formatAssetAttributeValueFromServer';

describe('utils/assets/formatAssetAttributeValueFromServer', function() {
  let assetAttributeValue;
  let expectedAssetAttributeValue;
  let formattedAssetAttributeValue;

  beforeEach(function() {
    assetAttributeValue = fixture.build('assetAttributeValue', null, {
      fromServer: true
    });
    expectedAssetAttributeValue = omit(
      {
        ...assetAttributeValue,
        assetAttributeId: assetAttributeValue.asset_attribute_id,
        assetId: assetAttributeValue.asset_id,
        createdAt: assetAttributeValue.created_at,
        effectiveDate: assetAttributeValue.effective_date,
        updatedAt: assetAttributeValue.updated_at
      },
      [
        'asset_attribute_id',
        'asset_id',
        'created_at',
        'effective_date',
        'updated_at'
      ]
    );

    formattedAssetAttributeValue = formatAssetAttributeValueFromServer(
      assetAttributeValue
    );
  });

  it('converts the object keys to camel case', function() {
    expect(formattedAssetAttributeValue).to.deep.equal(
      expectedAssetAttributeValue
    );
  });
});

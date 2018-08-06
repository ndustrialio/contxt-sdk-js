import omit from 'lodash.omit';
import formatAssetAttributeValueFromServer from './formatAssetAttributeValueFromServer';

describe('utils/assets/formatAssetAttributeValueFromServer', function() {
  let expectedValue;
  let formattedValue;

  beforeEach(function() {
    const initialValue = fixture.build('assetAttributeValue', null, {
      fromServer: true
    });
    expectedValue = omit(
      {
        ...initialValue,
        assetAttributeId: initialValue.asset_attribute_id,
        assetId: initialValue.asset_id,
        assetLabel: initialValue.asset_label,
        createdAt: initialValue.created_at,
        effectiveDate: initialValue.effective_date,
        updatedAt: initialValue.updated_at
      },
      [
        'asset_attribute_id',
        'asset_id',
        'asset_label',
        'created_at',
        'effective_date',
        'updated_at'
      ]
    );

    formattedValue = formatAssetAttributeValueFromServer(initialValue);
  });

  it('converts the object keys to camel case', function() {
    expect(formattedValue).to.deep.equal(expectedValue);
  });
});

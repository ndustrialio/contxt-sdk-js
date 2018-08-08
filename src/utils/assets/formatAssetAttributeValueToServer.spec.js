import omit from 'lodash.omit';
import formatAssetAttributeValueToServer from './formatAssetAttributeValueToServer';

describe('utils/assets/formatAssetAttributeValueToServer', function() {
  let expectedValue;
  let formattedValue;

  beforeEach(function() {
    const initialValue = fixture.build('assetAttributeValue');
    expectedValue = omit(
      {
        ...initialValue,
        asset_attribute_id: initialValue.assetAttributeId,
        asset_id: initialValue.assetId,
        asset_label: initialValue.assetLabel,
        effective_date: initialValue.effectiveDate
      },
      [
        'assetAttributeId',
        'assetId',
        'assetLabel',
        'createdAt',
        'effectiveDate',
        'id',
        'updatedAt'
      ]
    );

    formattedValue = formatAssetAttributeValueToServer(initialValue);
  });

  it('converts the object keys to snake case', function() {
    expect(formattedValue).to.deep.equal(expectedValue);
  });
});

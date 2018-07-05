import omit from 'lodash.omit';
import formatAssetAttributeFromServer from './formatAssetAttributeFromServer';

describe('utils/assets/formatAssetAttributeFromServer', function() {
  let assetAttribute;
  let expectedAssetAttribute;
  let formattedAssetAttribute;

  beforeEach(function() {
    assetAttribute = fixture.build('assetAttribute', null, {
      fromServer: true
    });
    expectedAssetAttribute = omit(
      {
        ...assetAttribute,
        assetTypeId: assetAttribute.asset_type_id,
        createdAt: assetAttribute.created_at,
        isRequired: assetAttribute.is_required,
        organizationId: assetAttribute.organization_id,
        updatedAt: assetAttribute.updated_at
      },
      [
        'asset_type_id',
        'created_at',
        'is_required',
        'organization_id',
        'updated_at'
      ]
    );

    formattedAssetAttribute = formatAssetAttributeFromServer(assetAttribute);
  });

  it('converts the object keys to camel case', function() {
    expect(formattedAssetAttribute).to.deep.equal(expectedAssetAttribute);
  });
});

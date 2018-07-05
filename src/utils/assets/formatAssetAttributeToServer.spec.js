import omit from 'lodash.omit';
import formatAssetAttributeToServer from './formatAssetAttributeToServer';

describe('utils/assets/formatAssetAttributeToServer', function() {
  let assetAttribute;
  let expectedAssetAttribute;
  let formattedAssetAttribute;

  beforeEach(function() {
    assetAttribute = fixture.build('assetAttribute');
    expectedAssetAttribute = omit(
      {
        ...assetAttribute,
        is_required: assetAttribute.isRequired,
        organization_id: assetAttribute.organizationId
      },
      [
        'assetTypeId',
        'createdAt',
        'id',
        'isRequired',
        'organizationId',
        'updatedAt'
      ]
    );

    formattedAssetAttribute = formatAssetAttributeToServer(assetAttribute);
  });

  it('converts the object keys to snake case', function() {
    expect(formattedAssetAttribute).to.deep.equal(expectedAssetAttribute);
  });
});

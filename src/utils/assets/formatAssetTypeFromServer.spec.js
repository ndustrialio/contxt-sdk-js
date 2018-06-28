import omit from 'lodash.omit';
import formatAssetTypeFromServer from './formatAssetTypeFromServer';

describe('utils/assets/formatAssetTypeFromServer', function() {
  let assetType;
  let expectedAssetType;
  let formattedAssetType;

  beforeEach(function() {
    assetType = fixture.build('assetType', null, { fromServer: true });
    expectedAssetType = omit(
      {
        ...assetType,
        createdAt: assetType.created_at,
        organizationId: assetType.organization_id,
        updatedAt: assetType.updated_at
      },
      ['created_at', 'organization_id', 'updated_at']
    );

    formattedAssetType = formatAssetTypeFromServer(assetType);
  });

  it('converts the object keys to camel case', function() {
    expect(formattedAssetType).to.deep.equal(expectedAssetType);
  });
});

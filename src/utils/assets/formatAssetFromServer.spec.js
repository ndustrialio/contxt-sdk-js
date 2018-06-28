import omit from 'lodash.omit';
import formatAssetFromServer from './formatAssetFromServer';

describe('utils/assets/formatAssetFromServer', function() {
  let asset;
  let expectedAsset;
  let formattedAsset;

  beforeEach(function() {
    asset = fixture.build('asset', null, { fromServer: true });
    expectedAsset = omit(
      {
        ...asset,
        assetTypeId: asset.asset_type_id,
        createdAt: asset.created_at,
        organizationId: asset.organization_id,
        updatedAt: asset.updated_at
      },
      ['asset_type_id', 'created_at', 'organization_id', 'updated_at']
    );

    formattedAsset = formatAssetFromServer(asset);
  });

  it('converts the object keys to camel case', function() {
    expect(formattedAsset).to.deep.equal(expectedAsset);
  });
});

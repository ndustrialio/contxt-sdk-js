import omit from 'lodash.omit';
import formatAssetToServer from './formatAssetToServer';

describe('utils/assets/formatAssetToServer', function() {
  let asset;
  let expectedAsset;
  let formattedAsset;

  beforeEach(function() {
    asset = fixture.build('asset');
    expectedAsset = omit(
      {
        ...asset,
        asset_type_id: asset.assetTypeId,
        organization_id: asset.organizationId
      },
      ['assetTypeId', 'createdAt', 'id', 'organizationId', 'updatedAt']
    );

    formattedAsset = formatAssetToServer(asset);
  });

  it('converts the object keys to snake case', function() {
    expect(formattedAsset).to.deep.equal(expectedAsset);
  });
});

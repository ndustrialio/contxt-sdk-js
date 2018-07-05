import omit from 'lodash.omit';
import formatAssetTypeToServer from './formatAssetTypeToServer';

describe('utils/assets/formatAssetTypeToServer', function() {
  let assetType;
  let expectedAssetType;
  let formattedAssetType;

  beforeEach(function() {
    assetType = fixture.build('assetType');
    expectedAssetType = omit(
      {
        ...assetType,
        organization_id: assetType.organizationId
      },
      ['createdAt', 'id', 'organizationId', 'updatedAt']
    );

    formattedAssetType = formatAssetTypeToServer(assetType);
  });

  it('converts the object keys to snake case', function() {
    expect(formattedAssetType).to.deep.equal(expectedAssetType);
  });
});

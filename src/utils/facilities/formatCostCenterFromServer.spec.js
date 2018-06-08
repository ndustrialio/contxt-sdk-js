import omit from 'lodash.omit';
import formatCostCenterFromServer from './formatCostCenterFromServer';

describe('utils/facilities/formatCostCenterFromServer', function() {
  let expectedCostCenter;
  let formattedCostCenter;
  let costCenter;

  beforeEach(function() {
    costCenter = fixture.build('costCenter', null, {
      fromServer: true
    });
    expectedCostCenter = omit(
      {
        ...costCenter,
        createdAt: costCenter.created_at,
        organizationId: costCenter.organization_id,
        updatedAt: costCenter.updated_at
      },
      ['created_at', 'organization_id', 'updated_at']
    );

    formattedCostCenter = formatCostCenterFromServer(costCenter);
  });

  it('converts the object keys to camelCase', function() {
    console.log('formattedCostCenter');
    console.log(formattedCostCenter);
    console.log('expectedCostCenter');
    console.log(expectedCostCenter);
    expect(formattedCostCenter).to.deep.equal(expectedCostCenter);
  });
});

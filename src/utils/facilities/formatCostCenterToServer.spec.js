import omit from 'lodash.omit';
import formatCostCenterToServer from './formatCostCenterToServer';

describe('utils/facilities/formatCostCenterToServer', function() {
  let expectedCostCenter;
  let formattedCostCenter;
  let costCenter;

  beforeEach(function() {
    costCenter = fixture.build('costCenter');
    expectedCostCenter = omit(
      {
        ...costCenter,
        organization_id: costCenter.organizationId
      },
      ['createdAt', 'id', 'facilities', 'organizationId', 'updatedAt']
    );

    formattedCostCenter = formatCostCenterToServer(costCenter);
  });

  it('converts the object keys to snake case', function() {
    expect(formattedCostCenter).to.deep.equal(expectedCostCenter);
  });
});

import omit from 'lodash.omit';
import formatCostCenterFacilityFromServer from './formatCostCenterFacilityFromServer';

describe('utils/facilities/formatCostCenterFacilityFromServer', function() {
  let expectedCostCenterFacility;
  let formattedCostCenterFacility;
  let costCenterFacility;

  beforeEach(function() {
    costCenterFacility = fixture.build('costCenterFacility', null, {
      fromServer: true
    });
    expectedCostCenterFacility = omit(
      {
        ...costCenterFacility,
        costCenterId: costCenterFacility.cost_center_id,
        createdAt: costCenterFacility.created_at,
        facilityId: costCenterFacility.facility_id,
        updatedAt: costCenterFacility.updated_at
      },
      ['created_at', 'cost_center_id', 'facility_id', 'updated_at']
    );

    formattedCostCenterFacility = formatCostCenterFacilityFromServer(
      costCenterFacility
    );
  });

  it('converts the object keys to camelCase', function() {
    expect(formattedCostCenterFacility).to.deep.equal(
      expectedCostCenterFacility
    );
  });
});

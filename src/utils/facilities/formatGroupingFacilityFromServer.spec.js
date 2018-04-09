import omit from 'lodash.omit';
import formatGroupingFacilityFromServer from './formatGroupingFacilityFromServer';

describe('utils/facilities/formatGroupingFacilityFromServer', function() {
  let expectedGroupingFacility;
  let formattedGroupingFacility;
  let groupingFacility;

  beforeEach(function() {
    groupingFacility = fixture.build('facilityGroupingFacility', null, { fromServer: true });
    expectedGroupingFacility = omit(
      {
        ...groupingFacility,
        createdAt: groupingFacility.created_at,
        facilityGroupingId: groupingFacility.facility_grouping_id,
        facilityId: groupingFacility.facility_id,
        updatedAt: groupingFacility.updated_at
      },
      ['created_at', 'facility_grouping_id', 'facility_id', 'updated_at']
    );

    formattedGroupingFacility = formatGroupingFacilityFromServer(groupingFacility);
  });

  it('converts the object keys to camelCase', function() {
    expect(formattedGroupingFacility).to.deep.equal(expectedGroupingFacility);
  });
});

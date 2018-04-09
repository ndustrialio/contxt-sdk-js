import omit from 'lodash.omit';
import formatGroupingToServer from './formatGroupingToServer';

describe('utils/facilities/formatGroupingToServer', function() {
  let expectedGrouping;
  let formattedGrouping;
  let grouping;

  beforeEach(function() {
    grouping = fixture.build('facilityGrouping');
    expectedGrouping = omit(
      {
        ...grouping,
        is_private: grouping.isPrivate,
        organization_id: grouping.organizationId,
        owner_id: grouping.ownerId,
        parent_grouping_id: grouping.parentGroupingId
      },
      ['createdAt', 'id', 'isPrivate', 'organizationId', 'ownerId', 'parentGroupingId', 'updatedAt']
    );

    formattedGrouping = formatGroupingToServer(grouping);
  });

  it('converts the object keys to snake case and capitalizes certain keys', function() {
    expect(formattedGrouping).to.deep.equal(expectedGrouping);
  });
});

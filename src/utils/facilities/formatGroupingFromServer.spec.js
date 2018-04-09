import omit from 'lodash.omit';
import formatGroupingFromServer from './formatGroupingFromServer';

describe('utils/facilities/formatGroupingFromServer', function() {
  let expectedGrouping;
  let formattedGrouping;
  let grouping;

  beforeEach(function() {
    grouping = fixture.build('facilityGrouping', null, { fromServer: true });
    expectedGrouping = omit(
      {
        ...grouping,
        createdAt: grouping.created_at,
        isPrivate: grouping.is_private,
        organizationId: grouping.organization_id,
        ownerId: grouping.owner_id,
        parentGroupingId: grouping.parent_grouping_id,
        updatedAt: grouping.updated_at
      },
      ['created_at', 'is_private', 'organization_id', 'owner_id', 'parent_grouping_id', 'updated_at']
    );

    formattedGrouping = formatGroupingFromServer(grouping);
  });

  it('converts the object keys to camelCase', function() {
    expect(formattedGrouping).to.deep.equal(expectedGrouping);
  });
});

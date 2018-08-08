import omit from 'lodash.omit';
import formatOrganizationFromServer from './formatOrganizationFromServer';

describe('utils/coordinator/formatOrganizationFromServer', function() {
  let expectedOrg;
  let formattedOrg;
  let org;

  beforeEach(function() {
    org = fixture.build('contxtOrganization', null, { fromServer: true });
    expectedOrg = omit(
      {
        ...org,
        createdAt: org.created_at,
        legacyOrganizationId: org.legacy_organization_id,
        updatedAt: org.updated_at
      },
      ['created_at', 'legacy_organization_id', 'updated_at']
    );

    formattedOrg = formatOrganizationFromServer(org);
  });

  it('converts the object keys to camelCase', function() {
    expect(formattedOrg).to.deep.equal(expectedOrg);
  });
});

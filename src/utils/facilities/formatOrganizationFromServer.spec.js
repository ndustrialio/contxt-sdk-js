import omit from 'lodash.omit';
import formatOrganizationFromServer from './formatOrganizationFromServer';

describe('utils/facilities/formatOrganizationFromServer', function() {
  let expectedOrganization;
  let formattedOrganization;
  let organization;

  beforeEach(function() {
    organization = fixture.build('organization', null, { fromServer: true });
    expectedOrganization = omit(
      {
        ...organization,
        createdAt: organization.created_at,
        updatedAt: organization.updated_at
      },
      ['created_at', 'updated_at']
    );

    formattedOrganization = formatOrganizationFromServer(organization);
  });

  it('converts the object keys to camelCase', function() {
    expect(formattedOrganization).to.deep.equal(expectedOrganization);
  });
});

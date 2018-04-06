import omit from 'lodash.omit';
import formatFacilityFromServer from './formatFacilityFromServer';
import * as facilitiesUtils from './index';

describe('utils/facilities/formatFacilityFromServer', function() {
  let expectedFacility;
  let facility;
  let formatOrganizationFromServer;
  let formatTagsFromServer;
  let formattedFacility;

  beforeEach(function() {
    this.sandbox = sandbox.create();

    facility = fixture.build('facility', null, { fromServer: true });
    expectedFacility = omit(
      {
        ...facility,
        createdAt: facility.created_at,
        geometryId: facility.geometry_id,
        info: facility.Info,
        organization: facility.Organization,
        organizationId: facility.organization_id,
        weatherLocationId: facility.weather_location_id
      },
      [
        'created_at',
        'geometry_id',
        'Info',
        'Organization',
        'organization_id',
        'weather_location_id'
      ]
    );

    formatOrganizationFromServer = this.sandbox.stub(facilitiesUtils, 'formatOrganizationFromServer')
      .callsFake((organization) => organization);
    formatTagsFromServer = this.sandbox.stub(facilitiesUtils, 'formatTagsFromServer')
      .callsFake((tags) => tags);

    formattedFacility = formatFacilityFromServer(facility);
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  it('formats the necessary children objects', function() {
    expect(formatOrganizationFromServer).to.be.calledWith(facility.Organization);
    expect(formatTagsFromServer).to.be.calledWith(facility.tags);
  });

  it('converts the object keys to the camelCase', function() {
    expect(formattedFacility).to.deep.equal(expectedFacility);
  });
});

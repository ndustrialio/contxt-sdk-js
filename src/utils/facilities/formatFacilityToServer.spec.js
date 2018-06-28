import omit from 'lodash.omit';
import formatFacilityToServer from './formatFacilityToServer';

describe('utils/facilities/formatFacilityToServer', function() {
  let expectedFacility;
  let facility;
  let formattedFacility;

  beforeEach(function() {
    facility = fixture.build('facility');
    expectedFacility = omit(
      {
        ...facility,
        geometry_id: facility.geometryId,
        Info: facility.info,
        organization_id: facility.organizationId,
        weather_location_id: facility.weatherLocationId,
        asset_id: facility.assetId
      },
      [
        'createdAt',
        'facility_groupings',
        'geometryId',
        'id',
        'info',
        'organization',
        'organizationId',
        'tags',
        'weatherLocationId',
        'assetId'
      ]
    );

    formattedFacility = formatFacilityToServer(facility);
  });

  it('converts the object keys to snake case and capitalizes certain keys', function() {
    expect(formattedFacility).to.deep.equal(expectedFacility);
  });
});

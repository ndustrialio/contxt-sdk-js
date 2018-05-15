import omit from 'lodash.omit';
import formatFacilityFromServer from './formatFacilityFromServer';
import * as facilitiesUtils from './index';

describe('utils/facilities/formatFacilityFromServer', function () {
  let formatOrganizationFromServer;
  let formatTagsFromServer;
  let formatGroupingFromServer;

  beforeEach(function () {
    this.sandbox = sandbox.create();

    formatOrganizationFromServer = this.sandbox.stub(facilitiesUtils, 'formatOrganizationFromServer')
      .callsFake((organization) => organization);
    formatTagsFromServer = this.sandbox.stub(facilitiesUtils, 'formatTagsFromServer')
      .callsFake((tags) => tags);
    formatGroupingFromServer = this.sandbox.stub(facilitiesUtils, 'formatGroupingFromServer')
      .callsFake((grouping) => grouping);
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  context('when all possible fields are in the facility object', function () {
    let expectedFacility;
    let facility;
    let formattedFacility;

    beforeEach(function () {
      facility = fixture.build('facility', null, {
        fromServer: true
      });
      expectedFacility = omit({
        ...facility,
        createdAt: facility.created_at,
        geometryId: facility.geometry_id,
        info: facility.Info,
        organization: facility.Organization,
        organizationId: facility.organization_id,
        weatherLocationId: facility.weather_location_id
      }, [
        'created_at',
        'geometry_id',
        'Info',
        'Organization',
        'organization_id',
        'weather_location_id'
      ]);

      formattedFacility = formatFacilityFromServer(facility);
    });

    it('formats the necessary children objects', function () {
      expect(formatOrganizationFromServer).to.be.calledWith(facility.Organization);
      expect(formatTagsFromServer).to.be.calledWith(facility.tags);
      facility.facility_groupings.forEach((grouping) =>
        expect(formatGroupingFromServer).to.be.calledWith(grouping)
      );
    });

    it('converts the object keys to the camelCase', function () {
      expect(formattedFacility).to.deep.equal(expectedFacility);
    });
  });

  context('when the facilities object does not have all possible keys', function () {
    it('does not include the facility info if facility info is in the initial data', function () {
      const facility = fixture.build('facility', null, {
        fromServer: true
      });
      delete facility.Info;
      const formattedFacility = formatFacilityFromServer(facility);

      expect(formattedFacility).to.not.include.keys(['info']);
    });

    it('does not include the organization if organization info is not in the initial data', function () {
      const facility = fixture.build('facility', null, {
        fromServer: true
      });
      delete facility.Organization;
      const formattedFacility = formatFacilityFromServer(facility);

      expect(formatOrganizationFromServer).to.be.not.called;
      expect(formattedFacility).to.not.include.keys(['organization']);
    });

    it('does not include the tags if tags are not in the initial data', function () {
      const facility = fixture.build('facility', null, {
        fromServer: true
      });
      delete facility.tags;
      const formattedFacility = formatFacilityFromServer(facility);

      expect(formatTagsFromServer).to.be.not.called;
      expect(formattedFacility).to.not.include.keys(['tags']);
    });

    it('does not include the facilities groupings if groupings are not in the initial data', function () {
      const facility = fixture.build('facility', null, {
        fromServer: true
      });
      delete facility.facilitiesGroupings;
      const formattedFacility = formatFacilityFromServer(facility);

      expect(formatGroupingFromServer).to.be.not.called;
      expect(formattedFacility).to.not.include.keys(['facility_groupings']);
    });
  });
});

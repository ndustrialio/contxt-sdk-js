import {
  formatCostCenterFromServer,
  formatGroupingFromServer,
  formatOrganizationFromServer,
  formatTagsFromServer
} from './index';

/**
 * Normalizes the facility object returned from the API server
 *
 * @param {Object} input
 * @param {string} input.address1
 * @param {string} input.address2
 * @param {string} [input.asset_id] UUID corresponding with an asset
 * @param {string} input.city
 * @param {Object[]} [input.cost_centers]
 * @param {string} [input.cost_centers[].created_at] ISO 8601 Extended Format date/time string
 * @param {string} [input.cost_centers[].description]
 * @param {string} [input.cost_centers[].id]
 * @param {string} [input.cost_centers[].name]
 * @param {string} [input.cost_centers[].organization_id] UUID corresponding with an organization
 * @param {string} [input.cost_centers[].updated_at] ISO 8601 Extended Format date/time string
 * @param {string} input.created_at ISO 8601 Extended Format date/time string
 * @param {Object[]}[input.facility_groupings]
 * @param {string} [input.facility_groupings[].created_at] ISO 8601 Extended Format date/time string
 * @param {number} [input.facility_groupings[].facility_id] ID corresponding with the parent facility
 * @param {number} [input.facility_groupings[].id]
 * @param {string} [input.facility_groupings[].name]
 * @param {string} [input.facility_groupings[].updated_at] ISO 8601 Extended Format date/time string
 * @param {string} input.geometry_id UUID corresponding with a geometry
 * @param {number} input.id
 * @param {Object} [input.Info] User declared information
 * @param {string} input.name
 * @param {Object} [input.Organization]
 * @param {string} [input.Organization.created_at] ISO 8601 Extended Format date/time string
 * @param {string} [input.Organization.id] UUID
 * @param {string} [input.Organization.name]
 * @param {string} input.Organization.updated_at
 * @param {string} input.organization_id UUID corresponding with an organization
 * @param {string} input.state
 * @param {Object[]} [input.tags]
 * @param {string} [input.tags[].created_at] ISO 8601 Extended Format date/time string
 * @param {number} [input.tags[].facility_id] ID corresponding with the parent facility
 * @param {number} [input.tags[].id]
 * @param {string} [input.tags[].name]
 * @param {string} [input.tags[].updated_at] ISO 8601 Extended Format date/time string
 * @param {string} input.timezone An IANA Time Zone Database string, i.e. America/Los_Angeles
 * @param {string} input.weather_location_id
 * @param {string} input.zip
 *
 * @returns {Facility}
 *
 * @private
 */
function formatFacilityFromServer(input = {}) {
  const facility = {
    address1: input.address1,
    address2: input.address2,
    assetId: input.asset_id,
    city: input.city,
    createdAt: input.created_at,
    geometryId: input.geometry_id,
    id: input.id,
    name: input.name,
    organizationId: input.organization_id,
    state: input.state,
    timezone: input.timezone,
    weatherLocationId: input.weather_location_id,
    zip: input.zip
  };

  if (input.Info) {
    facility.info = input.Info;
  }

  if (input.Organization) {
    facility.organization = formatOrganizationFromServer(input.Organization);
  }

  if (input.tags) {
    facility.tags = formatTagsFromServer(input.tags);
  }

  if (input.facility_groupings) {
    facility.facility_groupings = input.facility_groupings.map(
      formatGroupingFromServer
    );
  }

  if (input.cost_centers) {
    facility.costCenters = input.cost_centers.map(formatCostCenterFromServer);
  }

  return facility;
}

export default formatFacilityFromServer;

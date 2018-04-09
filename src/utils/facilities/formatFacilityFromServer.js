import {
  formatOrganizationFromServer,
  formatTagsFromServer
} from './index';

/**
 * Normalizes the facility object returned from the API server
 *
 * @param {Object} input
 * @param {string} input.address1
 * @param {string} input.address2
 * @param {string} input.city
 * @param {string} input.created_at ISO 8601 Extended Format date/time string
 * @param {string} input.geometry_id UUID corresponding with a geometry
 * @param {number} input.id
 * @param {Object} input.Info User declared information
 * @param {string} input.name
 * @param {Object} input.Organization
 * @param {string} input.Organization.created_at ISO 8601 Extended Format date/time string
 * @param {string} input.Organization.id UUID
 * @param {string} input.Organization.name
 * @param {string} input.Organization.updated_at
 * @param {string} input.organization_id UUID corresponding with an organization
 * @param {string} input.state
 * @param {Object[]} input.tags
 * @param {string} input.tags[].created_at ISO 8601 Extended Format date/time string
 * @param {number} input.tags[].facility_id Id corresponding with the parent facility
 * @param {number} input.tags[].id
 * @param {string} input.tags[].name
 * @param {string} input.tags[].updated_at ISO 8601 Extended Format date/time string
 * @param {string} input.timezone An IANA Time Zone Database string, i.e. America/Los_Angeles
 * @param {string} input.weather_location_id
 * @param {string} input.zip
 *
 * @returns {Facility}
 *
 * @private
 */
function formatFacilityFromServer(input = {}) {
  return {
    address1: input.address1,
    address2: input.address2,
    city: input.city,
    createdAt: input.created_at,
    geometryId: input.geometry_id,
    id: input.id,
    info: input.Info,
    name: input.name,
    organization: formatOrganizationFromServer(input.Organization),
    organizationId: input.organization_id,
    state: input.state,
    tags: formatTagsFromServer(input.tags),
    timezone: input.timezone,
    weatherLocationId: input.weather_location_id,
    zip: input.zip
  };
}

export default formatFacilityFromServer;

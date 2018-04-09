/**
 * Normalizes the facility object being sent to the API server
 *
 * @param {Facility} input
 *
 * @returns {Object} output
 * @returns {string} output.address1
 * @returns {string} output.address2
 * @returns {string} output.city
 * @returns {string} output.geometry_id UUID corresponding with a geometry
 * @returns {Object} output.Info User declared information
 * @returns {string} output.name
 * @returns {string} output.organization_id UUID corresponding with an organization
 * @returns {string} output.state
 * @returns {string} output.timezone An IANA Time Zone Database string, i.e. America/Los_Angeles
 * @returns {string} output.weather_location_id
 * @returns {string} output.zip
 *
 * @private
 */
function formatFacilityToServer(input = {}) {
  return {
    address1: input.address1,
    address2: input.address2,
    city: input.city,
    geometry_id: input.geometryId,
    Info: input.info,
    name: input.name,
    organization_id: input.organizationId,
    state: input.state,
    timezone: input.timezone,
    weather_location_id: input.weatherLocationId,
    zip: input.zip
  };
}

export default formatFacilityToServer;

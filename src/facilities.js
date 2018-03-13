/**
 * @typedef {Object} Facility
 * @property {string} address1
 * @property {string} address2
 * @property {string} city
 * @property {string} created_at ISO 8601 Extended Format date/time string
 * @property {number} id
 * @property {Object} Info
 * @property {string} name
 * @property {Object} Organization
 * @property {string} Organization.id UUID formatted id
 * @property {string} Organization.name
 * @property {string} Organization.created_at ISO 8601 Extended Format date/time string
 * @property {string} Organization.updated_at ISO 8601 Extended Format date/time string
 * @property {string} state
 * @property {Object[]} tags
 * @property {number} tags[].id
 * @property {number} tags[].facility_id
 * @property {string} tags[].name
 * @property {string} tags[].created_at ISO 8601 Extended Format date/time string
 * @property {string} tags[].updated_at ISO 8601 Extended Format date/time string
 * @property {string} timezone An IANA Time Zone Database string, i.e. America/Los_Angeles
 * @property {number} weather_location_id
 * @property {string} zip US Zip Code
 */

/**
 * Module that provides access to, and the manipulation
 * of, information about different facilities
 *
 * @typicalname contxtSdk.facilities
 */
class Facilities {
  /**
   * @param {Object} sdk An instance of the SDK so the module can communicate with other modules
   * @param {Object} request An instance of the request module tied to this module's audience.
   */
  constructor(sdk, request) {
    this._baseUrl = `${sdk.config.audiences.facilities.host}/v1`;
    this._request = request;
    this._sdk = sdk;
  }

  /**
   * Creates a new facility
   *
   * API Endpoint: '/facilities'
   * Method: POST
   *
   * @param {Object} options
   * @param {string} [options.address1]
   * @param {string} [options.address2]
   * @param {string} [options.city]
   * @param {string} [options.geometryId] UUID corresponding with a geometry
   * @param {string} options.name
   * @param {string} options.organizationId UUID corresponding with an organzation
   * @param {string} [options.state]
   * @param {string} options.timezone
   * @param {number} [options.weatherLocationId]
   * @param {string} [options.zip]
   *
   * @returns {Promise}
   * @fulfill {Facility} Information about the new facility
   * @reject {Error}
   * @throws {Error}
   *
   * @example
   * contxtSdk.facilities
   *   .create({
   *     address: '221 B Baker St, London, England',
   *     name: 'Sherlock Homes Museum',
   *     organizationId: 25
   *   })
   *   .then((facilities) => console.log(facilities));
   *   .catch((err) => console.log(err));
   */
  create(facility) {
    const requiredFields = ['organizationId', 'name', 'timezone'];

    requiredFields.forEach((field) => {
      if (!facility[field]) {
        throw new Error(`A ${field} is required to create a new facility.`);
      }
    });

    const data = {
      address1: facility.address1,
      address2: facility.address2,
      city: facility.city,
      geometry_id: facility.geometryId,
      name: facility.name,
      organization_id: facility.organizationId,
      state: facility.state,
      timezone: facility.timezone,
      weather_location_id: facility.weatherLocationId,
      zip: facility.zip
    };

    return this._request.post(`${this._baseUrl}/facilities`, data);
  }

  /**
   * Gets information about a facility
   *
   * API Endpoint: '/facilities/:facilityId'
   * Method: GET
   *
   * @param {number} facilityId The id of the facility
   *
   * @returns {Promise}
   * @fulfill {Facility} Information about a facility
   * @reject {Error}
   *
   * @example
   * contxtSdk.facilities.get(25)
   *   .then((facility) => console.log(facility));
   *   .catch((err) => console.log(err));
   */
  get(facilityId) {
    return this._request.get(`${this._baseUrl}/facilities/${facilityId}`);
  }

  /**
   * Gets a list of all facilities
   *
   * API Endpoint: '/facilities'
   * Method: GET
   *
   * @returns {Promise}
   * @fulfill {Facility[]} Information about all facilities
   * @reject {Error}
   *
   * @example
   * contxtSdk.facilities.getAll()
   *   .then((facilities) => console.log(facilities));
   *   .catch((err) => console.log(err));
   */
  getAll() {
    return this._request.get(`${this._baseUrl}/facilities`);
  }

  /**
   * Gets a list of all facilities that belong to a particular organization
   *
   * API Endpoint: '/organizations/:organizationId/facilities'
   * Method: GET
   *
   * @param {string} organizationId UUID corresponding with an organzation
   *
   * @returns {Promise}
   * @fulfill {Facility[]} Information about all facilities
   * @reject {Error}
   *
   * @example
   * contxtSdk.facilities.getAllByOrganizationId(25)
   *   .then((facilities) => console.log(facilities));
   *   .catch((err) => console.log(err));
   */
  getAllByOrganizationId(organizationId) {
    return this._request.get(`${this._baseUrl}/organizations/${organizationId}/facilities`);
  }
}

export default Facilities;

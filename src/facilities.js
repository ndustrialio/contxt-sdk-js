/**
 * @typedef {object} Facility
 * @property {string} address1
 * @property {string} address2
 * @property {string} city
 * @property {string} created_at ISO 8601 Extended Format date/time string
 * @property {number} id
 * @property {object} Info
 * @property {string} name
 * @property {object} Organization
 * @property {string} Organization.id UUID formatted id
 * @property {string} Organization.name
 * @property {string} Organization.created_at ISO 8601 Extended Format date/time string
 * @property {string} Organization.updated_at ISO 8601 Extended Format date/time string
 * @property {string} organization.id UUID formatted id
 * @property {string} state
 * @property {object[]} tags
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
   * @param {object} sdk An instance of the SDK so the module can communicate with other modules
   * @param {object} request An instance of the request module tied to this module's audience.
   */
  constructor(sdk, request) {
    this._baseUrl = `${sdk.config.audiences.facilities.host}/v1`;
    this._request = request;
    this._sdk = sdk;
  }

  /**
   * Gets information about a facility
   *
   * API Endpoint: '/facilities/:facilityId'
   * Method: GET
   *
   * @param {object} facilityId The id of the facility
   *
   * @returns {Promise}
   * @fulfill {Facility} Information about a facility
   * @reject {Error}
   *
   * @example
   * contxtSdk.facilities.get(25)
   *   .then((facility) => console.log(facility)});
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
   *   .then((facilities) => console.log(facilities)});
   *   .catch((err) => console.log(err));
   */
  getAll() {
    return this._request.get(`${this._baseUrl}/facilities`);
  }
}

export default Facilities;

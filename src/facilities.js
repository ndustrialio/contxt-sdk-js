import isPlainObject from 'lodash.isplainobject';

/**
 * @typedef {Object} Facility
 * @property {string} address1
 * @property {string} address2
 * @property {string} city
 * @property {string} createdAt ISO 8601 Extended Format date/time string
 * @property {string} geometryId UUID corresponding with a geometry
 * @property {number} id
 * @property {Object} Info User declared information
 * @property {string} name
 * @property {Object} Organization
 * @property {string} Organization.createdAt ISO 8601 Extended Format date/time string
 * @property {string} Organization.id UUID formatted id
 * @property {string} Organization.name
 * @property {string} Organization.updatedAt ISO 8601 Extended Format date/time string
 * @property {string} state
 * @property {Object[]} tags
 * @property {string} tags[].createdAt ISO 8601 Extended Format date/time string
 * @property {number} tags[].id
 * @property {number} tags[].facilityId
 * @property {string} tags[].name
 * @property {string} tags[].updatedAt ISO 8601 Extended Format date/time string
 * @property {string} timezone An IANA Time Zone Database string, i.e. America/Los_Angeles
 * @property {number} weatherLocationId
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
   * @param {string} options.organizationId UUID corresponding with an organization
   * @param {string} [options.state]
   * @param {string} options.timezone
   * @param {number} [options.weatherLocationId]
   * @param {string} [options.zip]
   *
   * @returns {Promise}
   * @fulfill {Facility} Information about the new facility
   * @reject {Error}
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
  create(facility = {}) {
    const requiredFields = ['organizationId', 'name', 'timezone'];

    for (let i = 0; requiredFields.length > i; i++) {
      const field = requiredFields[i];

      if (!facility[field]) {
        return Promise.reject(new Error(`A ${field} is required to create a new facility.`));
      }
    }

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

    return this._request.post(`${this._baseUrl}/facilities`, data)
      .then((facility) => this._formatFacilityFromServer(facility));
  }

  /**
   * Deletes a facility
   *
   * API Endpoint: '/facilities/:facilityId'
   * Method: DELETE
   *
   * @param {number} facilityId The id of the facility
   *
   * @fulfill {undefined}
   * @reject {Error}
   *
   * @example
   * contxtSdk.facilities.delete(25)
   */
  delete(facilityId) {
    if (!facilityId) {
      return Promise.reject(new Error('A facility id is required for deleting a facility'));
    }

    return this._request.delete(`${this._baseUrl}/facilities/${facilityId}`);
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
    if (!facilityId) {
      return Promise.reject(
        new Error('A facility id is required for getting information about a facility')
      );
    }

    return this._request.get(`${this._baseUrl}/facilities/${facilityId}`)
      .then((facility) => this._formatFacilityFromServer(facility));
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
    return this._request.get(`${this._baseUrl}/facilities`)
      .then((facilities) => facilities.map((facility) => this._formatFacilityFromServer(facility)));
  }

  /**
   * Gets a list of all facilities that belong to a particular organization
   *
   * API Endpoint: '/organizations/:organizationId/facilities'
   * Method: GET
   *
   * @param {string} organizationId UUID corresponding with an organization
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
    if (!organizationId) {
      return Promise.reject(
        new Error("An organization id is required for getting a list of an organization's facilities")
      );
    }

    return this._request.get(`${this._baseUrl}/organizations/${organizationId}/facilities`)
      .then((facilities) => facilities.map((facility) => this._formatFacilityFromServer(facility)));
  }

  /**
   * Updates a facility's specifics
   *
   * API Endpoint: '/facilities/:facilityId'
   * Method: PUT
   *
   * @param {number} facilityId The id of the facility to update
   * @param {Object} update An object containing the updated data for the facility
   *
   * @returns {Promise}
   * @fulfill {undefined}
   * @reject {Error}
   *
   * @example
   * contxtSdk.facilities.update(25, {
   *   address: '221 B Baker St, London, England',
   *   name: 'Sherlock Homes Museum',
   *   organizationId: 25
   * });
   */
  update(facilityId, update) {
    if (!facilityId) {
      return Promise.reject(new Error('A facility id is required to update a facility.'));
    }

    if (!update) {
      return Promise.reject(new Error('An update is required to update a facility.'));
    }

    if (!isPlainObject(update)) {
      return Promise.reject(
        new Error('The facility update must be a well-formed object with the data you wish to update.')
      );
    }

    const formattedUpdate = this._formatFacilityToServer(update);

    return this._request.put(`${this._baseUrl}/facilities/${facilityId}`, formattedUpdate);
  }

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
  _formatFacilityFromServer(input = {}) {
    return {
      address1: input.address1,
      address2: input.address2,
      city: input.city,
      createdAt: input.created_at,
      geometryId: input.geometry_id,
      id: input.id,
      info: input.Info,
      name: input.name,
      organization: this._formatOrganizationFromServer(input.Organization),
      organizationId: input.organization_id,
      state: input.state,
      tags: this._formatTagsFromServer(input.tags),
      timezone: input.timezone,
      weatherLocationId: input.weather_location_id,
      zip: input.zip
    };
  }

  /**
   * Normalizes the facility object returned from the API server
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
  _formatFacilityToServer(input = {}) {
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

  /**
   * Normalizes the organization object returned from the API server
   *
   * @param {Object} input
   * @param {string} input.created_at ISO 8601 Extended Format date/time string
   * @param {string} input.id UUID
   * @param {string} input.name
   * @param {string} input.updated_at
   * @param {string} input.organization_id UUID corresponding with an organization
   *
   * @returns {Object} output
   * @returns {string} output.createdAt ISO 8601 Extended Format date/time string
   * @returns {string} output.id UUID formatted id
   * @returns {string} output.name
   * @returns {string} output.updatedAt ISO 8601 Extended Format date/time string
   *
   * @private
   */
  _formatOrganizationFromServer(input = {}) {
    return {
      createdAt: input.created_at,
      id: input.id,
      name: input.name,
      updatedAt: input.updated_at
    };
  }

  /**
   * Normalizes the tags array returned from the API server
   *
   * @param {Object[]} input
   * @param {string} input[].created_at ISO 8601 Extended Format date/time string
   * @param {number} input[].facility_id Id corresponding with the parent facility
   * @param {number} input[].id
   * @param {string} input[].name
   * @param {string} input[].updated_at ISO 8601 Extended Format date/time string
   *
   * @returns {Object[]} output
   * @returns {string} output[].createdAt ISO 8601 Extended Format date/time string
   * @returns {number} output[].id
   * @returns {number} output[].facilityId
   * @returns {string} output[].name
   * @returns {string} output[].updatedAt ISO 8601 Extended Format date/time string
   *
   * @private
   */
  _formatTagsFromServer(input = []) {
    return input.map((tag) => {
      return {
        createdAt: tag.created_at,
        facilityId: tag.facility_id,
        id: tag.id,
        name: tag.name,
        updatedAt: tag.updated_at
      };
    });
  }
}

export default Facilities;

import isPlainObject from 'lodash.isplainobject';
import FacilityGroupings from './groupings';
import CostCenters from './costCenters';
import { formatFacilityWithInfoFromServer } from '../utils/facilities';
import { toCamelCase, toSnakeCase } from '../utils/objects';

/**
 * @typedef {Object} Facility
 * @property {string} [address1]
 * @property {string} [address2]
 * @property {string} [assetId] UUID corresponding with an asset
 * @property {string} [city]
 * @property {string} createdAt ISO 8601 Extended Format date/time string
 * @property {string} [geometryId] UUID corresponding with a geometry
 * @property {number} id
 * @property {Object} [Info] User declared information
 * @property {string} name
 * @property {Object} [Organization]
 * @property {string} [Organization.createdAt] ISO 8601 Extended Format date/time string
 * @property {string} [Organization.id] UUID formatted ID
 * @property {string} [Organization.name]
 * @property {string} [Organization.updatedAt] ISO 8601 Extended Format date/time string
 * @property {string} [state]
 * @property {Object[]} [tags]
 * @property {string} [tags[].createdAt] ISO 8601 Extended Format date/time string
 * @property {number} [tags[].id]
 * @property {number} [tags[].facilityId]
 * @property {string} [tags[].name]
 * @property {string} [tags[].updatedAt] ISO 8601 Extended Format date/time string
 * @property {string} timezone An IANA Time Zone Database string, i.e. America/Los_Angeles
 * @property {number} [weatherLocationId]
 * @property {string} [zip] US Zip Code
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
    const baseUrl = `${sdk.config.audiences.facilities.host}/v1`;

    this._baseUrl = baseUrl;
    this._request = request;
    this._sdk = sdk;

    this.groupings = new FacilityGroupings(sdk, request, baseUrl);
    this.costCenters = new CostCenters(sdk, request, baseUrl);
  }

  /**
   * Creates a new facility
   *
   * API Endpoint: '/facilities'
   * Method: POST
   *
   * @param {Object} facility
   * @param {string} [facility.address1]
   * @param {string} [facility.address2]
   * @param {string} [facility.assetId] UUID corresponding with an asset
   * @param {string} [facility.city]
   * @param {string} [facility.geometryId] UUID corresponding with a geometry
   * @param {string} facility.name
   * @param {string} facility.organizationId UUID corresponding with an organization
   * @param {string} [facility.state]
   * @param {string} facility.timezone
   * @param {number} [facility.weatherLocationId]
   * @param {string} [facility.zip]
   *
   * @returns {Promise}
   * @fulfill {Facility} Information about the new facility
   * @reject {Error}
   *
   * @example
   * contxtSdk.facilities
   *   .create({
   *     address: '221 B Baker St, London, England',
   *     name: 'Sherlock Holmes Museum',
   *     organizationId: 25
   *   })
   *   .then((facilities) => console.log(facilities))
   *   .catch((err) => console.log(err));
   */
  create(facility = {}) {
    const requiredFields = ['organizationId', 'name', 'timezone'];

    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];

      if (!facility[field]) {
        return Promise.reject(
          new Error(`A ${field} is required to create a new facility.`)
        );
      }
    }

    return this._request
      .post(`${this._baseUrl}/facilities`, toSnakeCase(facility))
      .then((facility) => toCamelCase(facility));
  }

  /**
   * Creates or updates a facility's info (NOTE: This refers to the facility_info model)
   *
   * API Endpoint: '/facilities/:facilityId/info?should_update=true'
   * Method: POST
   *
   * @param {number} facilityId The ID of the facility to update
   * @param {Object} update An object containing the facility info for the facility
   *
   * @returns {Promise}
   * @fulfill {undefined}
   * @reject {Error}
   *
   * @example
   * contxtSdk.facilities.createOrUpdateInfo(25, {
   *   square_feet: '10000'
   * });
   */
  createOrUpdateInfo(facilityId, update) {
    if (!facilityId) {
      return Promise.reject(
        new Error("A facility ID is required to update a facility's info.")
      );
    }

    if (!update) {
      return Promise.reject(
        new Error("An update is required to update a facility's info.")
      );
    }

    if (!isPlainObject(update)) {
      return Promise.reject(
        new Error(
          'The facility info update must be a well-formed object with the data you wish to update.'
        )
      );
    }

    const options = {
      params: {
        should_update: true
      }
    };

    return this._request.post(
      `${this._baseUrl}/facilities/${facilityId}/info`,
      update,
      options
    );
  }

  /**
   * Deletes a facility
   *
   * API Endpoint: '/facilities/:facilityId'
   * Method: DELETE
   *
   * @param {number} facilityId The ID of the facility
   *
   * @returns {Promise}
   * @fulfill {undefined}
   * @reject {Error}
   *
   * @example
   * contxtSdk.facilities.delete(25);
   */
  delete(facilityId) {
    if (!facilityId) {
      return Promise.reject(
        new Error('A facility ID is required for deleting a facility')
      );
    }

    return this._request.delete(`${this._baseUrl}/facilities/${facilityId}`);
  }

  /**
   * Gets information about a facility
   *
   * API Endpoint: '/facilities/:facilityId'
   * Method: GET
   *
   * @param {number} facilityId The ID of the facility
   *
   * @returns {Promise}
   * @fulfill {Facility} Information about a facility
   * @reject {Error}
   *
   * @example
   * contxtSdk.facilities
   *   .get(25)
   *   .then((facility) => console.log(facility))
   *   .catch((err) => console.log(err));
   */
  get(facilityId) {
    if (!facilityId) {
      return Promise.reject(
        new Error(
          'A facility ID is required for getting information about a facility'
        )
      );
    }

    return this._request
      .get(`${this._baseUrl}/facilities/${facilityId}`)
      .then((facility) => formatFacilityWithInfoFromServer(facility));
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
   * contxtSdk.facilities
   *   .getAll()
   *   .then((facilities) => console.log(facilities))
   *   .catch((err) => console.log(err));
   */
  getAll() {
    return this._request
      .get(`${this._baseUrl}/facilities`)
      .then((facilities) =>
        facilities.map((facility) => formatFacilityWithInfoFromServer(facility))
      );
  }

  /**
   * Gets a list of all facilities that belong to a particular organization
   *
   * API Endpoint: '/organizations/:organizationId/facilities'
   * Method: GET
   *
   * @param {string} organizationId UUID corresponding with an organization
   * @param {object} [options] Object containing parameters to be called with the request
   * @param {boolean} [options.includeGroupings] Boolean flag for including groupings data with each facility
   *
   * @returns {Promise}
   * @fulfill {Facility[]} Information about all facilities
   * @reject {Error}
   *
   * @example
   * contxtSdk.facilities
   *   .getAllByOrganizationId(25, { includeGroupings: true })
   *   .then((facilities) => console.log(facilities))
   *   .catch((err) => console.log(err));
   */
  getAllByOrganizationId(organizationId, options) {
    if (!organizationId) {
      return Promise.reject(
        new Error(
          "An organization ID is required for getting a list of an organization's facilities"
        )
      );
    }

    return this._request
      .get(`${this._baseUrl}/organizations/${organizationId}/facilities`, {
        params: toSnakeCase(options)
      })
      .then((facilities) =>
        facilities.map((facility) => formatFacilityWithInfoFromServer(facility))
      );
  }

  /**
   * Updates a facility's specifics
   *
   * API Endpoint: '/facilities/:facilityId'
   * Method: PUT
   *
   * @param {number} facilityId The ID of the facility to update
   * @param {Object} update An object containing the updated data for the facility
   * @param {string} [update.address1]
   * @param {string} [update.address2]
   * @param {string} [update.assetId] UUID corresponding with an asset
   * @param {string} [update.city]
   * @param {string} [update.geometryId] UUID corresponding with a geometry
   * @param {Object} [update.info] User declared information
   * @param {string} [update.name]
   * @param {string} [update.organizationId] UUID corresponding with an organization
   * @param {string} [update.state]
   * @param {string} [update.timezone]
   * @param {number} [update.weatherLocationId]
   * @param {string} [update.zip]
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
      return Promise.reject(
        new Error('A facility ID is required to update a facility.')
      );
    }

    if (!update) {
      return Promise.reject(
        new Error('An update is required to update a facility.')
      );
    }

    if (!isPlainObject(update)) {
      return Promise.reject(
        new Error(
          'The facility update must be a well-formed object with the data you wish to update.'
        )
      );
    }

    const formattedUpdate = toSnakeCase(update, {
      excludeKeys: ['id', 'organizationId']
    });

    return this._request.put(
      `${this._baseUrl}/facilities/${facilityId}`,
      formattedUpdate
    );
  }
}

export default Facilities;

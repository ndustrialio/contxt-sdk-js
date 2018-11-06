import isPlainObject from 'lodash.isplainobject';
import { toCamelCase, toSnakeCase } from '../utils/objects';

/**
 * @typedef {Object} FacilityGrouping
 * @param {string} createdAt ISO 8601 Extended Format date/time string
 * @param {string} [description]
 * @param {Facility[]} [facilities]
 * @param {string} id UUID
 * @param {boolean} isPrivate
 * @param {string} name
 * @param {string} organizationId UUID
 * @param {string} ownerId Auth0 identifer of the user
 * @param {string} [parentGroupingId] UUID
 * @param {string} updatedAt ISO 8601 Extended Format date/time string
 */

/**
 * @typedef {Object} FacilityGroupingFacility
 * @param {string} createdAt ISO 8601 Extended Format date/time string
 * @param {string} facilityGroupingId UUID
 * @param {number} facilityId
 * @param {string} id UUID
 * @param {string} updatedAt ISO 8601 Extended Format date/time string
 */

/**
 * Module that provides access to facility groupings, and helps manage
 * the relationship between those groupings and facilities
 *
 * @typicalname contxtSdk.facilities.groupings
 */
class FacilityGroupings {
  /**
   * @param {Object} sdk An instance of the SDK so the module can communicate with other modules
   * @param {Object} request An instance of the request module tied to this module's audience.
   * @param {string} baseUrl The base URL provided by the parent module
   */
  constructor(sdk, request, baseUrl) {
    this._baseUrl = baseUrl;
    this._request = request;
    this._sdk = sdk;
  }

  /**
   * Adds a facility to a facility grouping
   *
   * API Endpoint: '/groupings/:facilityGroupingId/facilities/:facilityId'
   * Method: POST
   *
   * @param {string} facilityGroupingId UUID corresponding with a facility grouping
   * @param {number} facilityId
   *
   * @returns {Promise}
   * @fulfill {FacilityGroupingFacility} Information about the new facility/grouping relationship
   * @reject {Error}
   *
   * @example
   * contxtSdk.facilities.groupings
   *   .addFacility('b3dbaae3-25dd-475b-80dc-66296630a8d0', 4)
   *   .then((grouping) => console.log(grouping))
   *   .catch((err) => console.log(err));
   */
  addFacility(facilityGroupingId, facilityId) {
    let errorMsg;

    if (!facilityGroupingId) {
      errorMsg =
        'A facilityGroupingId is required to create a relationship between a facility grouping and a facility.';
    } else if (!facilityId) {
      errorMsg =
        'A facilityId is required to create a relationship between a facility grouping and a facility.';
    }

    if (errorMsg) {
      return Promise.reject(new Error(errorMsg));
    }

    return this._request
      .post(
        `${
          this._baseUrl
        }/groupings/${facilityGroupingId}/facility/${facilityId}`
      )
      .then((groupingFacility) => toCamelCase(groupingFacility));
  }

  /**
   * Creates a new facility grouping
   *
   * API Endpoint: '/groupings'
   * Method: POST
   *
   * @param {Object} facilityGrouping
   * @param {string} [facilityGrouping.description]
   * @param {boolean} [facilityGrouping.isPrivate = false]
   * @param {string} facilityGrouping.name
   * @param {string} facilityGrouping.organizationId UUID
   * @param {string} [facilityGrouping.parentGroupingId] UUID
   *
   * @returns {Promise}
   * @fulfill {FacilityGrouping} Information about the new facility grouping
   * @reject {Error}
   *
   * @example
   * contxtSdk.facilities.groupings
   *   .create({
   *     description: 'US States of CT, MA, ME, NH, RI, VT',
   *     isPrivate: false,
   *     name: 'New England, USA',
   *     organizationId: '61f5fe1d-d202-4ae7-af76-8f37f5bbeec5',
   *     parentGroupingId: 'e9f8f89c-609c-4c83-8ebc-cea928af661e'
   *   })
   *   .then((grouping) => console.log(grouping))
   *   .catch((err) => console.log(err));
   */
  create(grouping = {}) {
    const requiredFields = ['name', 'organizationId'];

    for (let i = 0; requiredFields.length > i; i++) {
      const field = requiredFields[i];

      if (!grouping[field]) {
        return Promise.reject(
          new Error(`A ${field} is required to create a new facility grouping.`)
        );
      }
    }

    return this._request
      .post(`${this._baseUrl}/groupings`, toSnakeCase(grouping))
      .then((grouping) => toCamelCase(grouping));
  }

  /**
   * Delete a facility groupings
   *
   * API Endpoint: '/groupings/:facilityGroupingId'
   * Method: DELETE
   *
   * @param {string} facilityGroupingId The id of the facility grouping (formatted as a UUID)
   *
   * @returns {Promise}
   * @fulfill {undefined}
   * @reject {Error}
   *
   * @example
   * contxtSdk.facilities.groupings.delete(
   *   'e4fec739-56aa-4b50-8dab-e9d6b9c91a5d'
   * );
   */
  delete(facilityGroupingId) {
    if (!facilityGroupingId) {
      return Promise.reject(
        new Error(
          'A facility grouping id is required for deleting a facility grouping.'
        )
      );
    }

    return this._request.delete(
      `${this._baseUrl}/groupings/${facilityGroupingId}`
    );
  }

  /**
   * Get a listing of all facility groupings available to a user. Includes public groupings across
   * any organization the user has access to and the user's private groupings.
   *
   * API Endpoint: '/groupings'
   * Method: GET
   *
   * @returns {Promise}
   * @fulfill {FacilityGrouping[]}
   * @reject {Error}
   *
   * @example
   * contxtSdk.facilites.groupings
   *   .getAll()
   *   .then((groupings) => console.log(groupings))
   *   .catch((err) => console.log(err));
   */
  getAll() {
    return this._request
      .get(`${this._baseUrl}/groupings`)
      .then((groupings) => toCamelCase(groupings));
  }

  /**
   * Get a listing of all facility groupings for an organization. Includes public groupings
   * across that specific organization and the user's private groupings for that organization.
   *
   * API Endpoint: '/organizations/:organizationId/groupings'
   * Method: GET
   *
   * @param {string} organizationId UUID corresponding with an organization
   *
   * @returns {Promise}
   * @fulfill {FacilityGrouping[]}
   * @reject {Error}
   *
   * @example
   * contxtSdk.facilites.groupings
   *   .getAllByOrganizationId('349dbd36-5dca-4a10-b54d-d0f71c3c8709')
   *   .then((groupings) => console.log(groupings))
   *   .catch((err) => console.log(err));
   */
  getAllByOrganizationId(organizationId) {
    if (!organizationId) {
      return Promise.reject(
        new Error(
          "An organization id is required for getting a list of an organization's facility groupings"
        )
      );
    }

    return this._request
      .get(`${this._baseUrl}/organizations/${organizationId}/groupings`)
      .then((groupings) => toCamelCase(groupings));
  }

  /**
   * Removes a facility from a facility grouping
   *
   * API Endpoint: '/groupings/:facilityGroupingId/facilities/:facilityId'
   * Method: DELETE
   *
   * @param {string} facilityGroupingId UUID corresponding with a facility grouping
   * @param {number} facilityId
   *
   * @returns {Promise}
   * @reject {Error}
   *
   * @example
   * contxtSdk.facilities.groupings
   *   .removeFacility('b3dbaae3-25dd-475b-80dc-66296630a8d0', 4)
   *   .catch((err) => console.log(err));
   */
  removeFacility(facilityGroupingId, facilityId) {
    let errorMsg;

    if (!facilityGroupingId) {
      errorMsg =
        'A facilityGroupingId is required to remove a relationship between a facility grouping and a facility.';
    } else if (!facilityId) {
      errorMsg =
        'A facilityId is required to remove a relationship between a facility grouping and a facility.';
    }

    if (errorMsg) {
      return Promise.reject(new Error(errorMsg));
    }

    return this._request.delete(
      `${this._baseUrl}/groupings/${facilityGroupingId}/facility/${facilityId}`
    );
  }

  /**
   * Updates an existing facility grouping
   *
   * API Endpoint: '/groupings/:facilityGroupingId'
   * Method: PUT
   *
   * @param {String} facilityGroupingId
   * @param {Object} update
   * @param {string} [update.description]
   * @param {boolean} [update.isPrivate]
   * @param {string} [update.name]
   * @param {string} [update.parentGroupingId] UUID corresponding with another facility grouping
   *
   * @returns {Promise}
   * @fulfill {FacilityGrouping} Information about the updated facility grouping
   * @reject {Error}
   *
   * @example
   * contxtSdk.facilities.groupings
   *   .update('b3dbaae3-25dd-475b-80dc-66296630a8d0', {
   *     description: 'US States of CT, MA, ME, NH, RI, VT',
   *     isPrivate: false,
   *     name: 'New England, USA',
   *     parentGroupingId: 'e9f8f89c-609c-4c83-8ebc-cea928af661e'
   *   })
   *   .then((grouping) => console.log(grouping))
   *   .catch((err) => console.log(err));
   */
  update(facilityGroupingId, update) {
    if (!facilityGroupingId) {
      return Promise.reject(
        new Error(
          'A facility grouping id is required to update a facility grouping.'
        )
      );
    }

    if (!update) {
      return Promise.reject(
        new Error('An update is required to update a facility grouping')
      );
    }

    if (!isPlainObject(update)) {
      return Promise.reject(
        new Error(
          'The facility grouping update must be a well-formed object with the data you wish to update.'
        )
      );
    }

    const formattedUpdate = toSnakeCase(update, {
      excludeKeys: ['id', 'organizationId', 'ownerId']
    });

    return this._request
      .put(`${this._baseUrl}/groupings/${facilityGroupingId}`, formattedUpdate)
      .then((grouping) => toCamelCase(grouping));
  }
}

export default FacilityGroupings;

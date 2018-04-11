import {
  formatGroupingFacilityFromServer,
  formatGroupingFromServer,
  formatGroupingToServer
} from '../utils/facilities';

/**
 * @typedef {Object} FacilityGrouping
 * @param {string} createdAt ISO 8601 Extended Format date/time string
 * @param {string} description
 * @param {string} id UUID
 * @param {boolean} isPrivate
 * @param {string} name
 * @param {string} organizationId UUID
 * @param {string} ownerId Auth0 identifer of the user
 * @param {string} parentGroupingId UUID
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
   * contxtSdk.facilities.groupings.addFacility('b3dbaae3-25dd-475b-80dc-66296630a8d0', 4)
   *   .then((grouping) => console.log(grouping));
   *   .catch((err) => console.log(err));
   */
  addFacility(facilityGroupingId, facilityId) {
    let errorMsg;

    if (!facilityGroupingId) {
      errorMsg = 'A facilityGroupingId is required to create a relationship between a facility grouping and a facility.';
    } else if (!facilityId) {
      errorMsg = 'A facilityId is required to create a relationship between a facility grouping and a facility.';
    }

    if (errorMsg) {
      return Promise.reject(new Error(errorMsg));
    }

    return this._request.post(`${this._baseUrl}/groupings/${facilityGroupingId}/facility/${facilityId}`)
      .then((groupingFacility) => formatGroupingFacilityFromServer(groupingFacility));
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
   *     organizationId: '61f5fe1d-d202-4ae7-af76-8f37f5bbeec5'
   *     parentGroupingId: 'e9f8f89c-609c-4c83-8ebc-cea928af661e'
   *   })
   *   .then((grouping) => console.log(grouping));
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

    const data = formatGroupingToServer(grouping);

    return this._request.post(`${this._baseUrl}/groupings`, data)
      .then((grouping) => formatGroupingFromServer(grouping));
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
   * contxtSdk.facilities.groupings.removeFacility('b3dbaae3-25dd-475b-80dc-66296630a8d0', 4)
   *   .catch((err) => console.log(err));
   */
  removeFacility(facilityGroupingId, facilityId) {
    let errorMsg;

    if (!facilityGroupingId) {
      errorMsg = 'A facilityGroupingId is required to remove a relationship between a facility grouping and a facility.';
    } else if (!facilityId) {
      errorMsg = 'A facilityId is required to remove a relationship between a facility grouping and a facility.';
    }

    if (errorMsg) {
      return Promise.reject(new Error(errorMsg));
    }

    return this._request.delete(
      `${this._baseUrl}/groupings/${facilityGroupingId}/facility/${facilityId}`
    );
  }
}

export default FacilityGroupings;

import isPlainObject from 'lodash.isplainobject';
import { toCamelCase, toSnakeCase } from '../utils/objects';

/**
 * @typedef {Object} CostCenter
 * @param {string} createdAt ISO 8601 Extended Format date/time string
 * @param {string} [description]
 * @param {string} id UUID
 * @param {string} name
 * @param {string} organizationId UUID
 * @param {string} updatedAt ISO 8601 Extended Format date/time string
 */

/**
 * @typedef {Object} CostCenterFacility
 * @param {string} costCenterId UUID
 * @param {string} createdAt ISO 8601 Extended Format date/time string
 * @param {number} facilityId
 * @param {string} id UUID
 * @param {string} updatedAt ISO 8601 Extended Format date/time string
 */

/**
 * Module that provides access to cost centers, and helps manage
 * the relationship between those cost centers and facilities
 *
 * @typicalname contxtSdk.facilities.costCenters
 */
class CostCenters {
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
   * Adds a facility to a cost center
   *
   * API Endpoint: '/costcenters/:costCenterId/facility/:facilityId'
   * Method: POST
   *
   * @param {string} costCenterId UUID corresponding with a cost center
   * @param {number} facilityId The ID of a facility
   *
   * @returns {Promise}
   * @fulfill {CostCenterFacility} Information about the new cost center facility relationship
   * @reject {Error}
   *
   * @example
   * contxtSdk.facilities.costCenters
   *   .addFacility('b3dbaae3-25dd-475b-80dc-66296630a8d0', 4)
   *   .then((costCenter) => console.log(costCenter))
   *   .catch((err) => console.log(err));
   */
  addFacility(costCenterId, facilityId) {
    let errorMsg;

    if (!costCenterId) {
      errorMsg =
        'A costCenterId is required to create a relationship between a cost center and a facility.';
    } else if (!facilityId) {
      errorMsg =
        'A facilityId is required to create a relationship between a cost center and a facility.';
    }

    if (errorMsg) {
      return Promise.reject(new Error(errorMsg));
    }

    return this._request
      .post(
        `${this._baseUrl}/costcenters/${costCenterId}/facility/${facilityId}`
      )
      .then((costCenterFacility) => toCamelCase(costCenterFacility));
  }

  /**
   * Creates a new cost center
   *
   * API Endpoint: '/costcenters'
   * Method: POST
   *
   * @param {Object} costCenter
   * @param {string} [costCenter.description]
   * @param {string} costCenter.name
   * @param {string} costCenter.organizationId UUID
   *
   * @returns {Promise}
   * @fulfill {CostCenter} Information about the new cost center
   * @reject {Error}
   *
   * @example
   * contxtSdk.facilities.costCenters
   *   .create({
   *     decsription: 'Cost center number 1',
   *     name: 'North Carolina, USA',
   *     organizationId: '61f5fe1d-d202-4ae7-af76-8f37f5bbeec5'
   *   })
   *   .then((costCenter) => console.log(costCenter))
   *   .catch((err) => console.log(err));
   */
  create(costCenter = {}) {
    const requiredFields = ['name', 'organizationId'];

    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];

      if (!costCenter[field]) {
        return Promise.reject(
          new Error(`A ${field} is required to create a new cost center.`)
        );
      }
    }

    return this._request
      .post(`${this._baseUrl}/costcenters`, toSnakeCase(costCenter))
      .then((costCenter) => toCamelCase(costCenter));
  }

  /**
   * Delete a cost center
   *
   * API Endpoint: '/costcenters/:costCenterId'
   * Method: DELETE
   *
   * @param {string} costCenterId The ID of the cost center (formatted as a UUID)
   *
   * @returns {Promise}
   * @fulfill {undefined}
   * @reject {Error}
   *
   * @example
   * contxtSdk.facilities.costCenters.delete(
   *   'e4fec739-56aa-4b50-8dab-e9d6b9c91a5d'
   * );
   */
  delete(costCenterId) {
    if (!costCenterId) {
      return Promise.reject(
        new Error('A cost center id is required for deleting a cost center.')
      );
    }

    return this._request.delete(`${this._baseUrl}/costcenters/${costCenterId}`);
  }

  /**
   * Get a listing of all cost centers
   *
   * API Endpoint: '/costcenters'
   * METHOD: GET
   *
   * @returns {Promise}
   * @fulfill {CostCenter[]}
   * @reject {Error}
   *
   * @example
   * contxtSdk.facilities.costCenters
   *   .getAll()
   *   .then((costCenters) => console.log(costCenters))
   *   .catch((err) => console.log(err));
   */
  getAll() {
    return this._request
      .get(`${this._baseUrl}/costcenters`)
      .then((costCenters) => toCamelCase(costCenters));
  }

  /**
   * Get a listing of all cost centers for an organization
   *
   * API Endpoint: '/organizations/:organizationId/costcenters'
   * METHOD: GET
   *
   * @param {string} organizationId The ID of the organization (formatted as a UUID)
   *
   * @returns {Promise}
   * @fulfill {CostCenter[]}
   * @reject {Error}
   *
   * @example
   * contxtSdk.facilities.costCenters
   *   .getAllByOrganizationId('59270c25-4de9-4b22-8e0b-ab287ac344ce')
   *   .then((costCenters) => console.log(costCenters))
   *   .catch((err) => console.log(err));
   */
  getAllByOrganizationId(organizationId) {
    if (!organizationId) {
      return Promise.reject(
        new Error(
          "An organization id is required for getting a list of an organization's cost centers."
        )
      );
    }

    return this._request
      .get(`${this._baseUrl}/organizations/${organizationId}/costcenters`)
      .then((costCenters) => toCamelCase(costCenters));
  }

  /**
   * Removes a facility from a cost center
   *
   * API Endpoint: '/costcenters/:costCenterId/facility/:facilityId'
   * Method: DELETE
   *
   * @param {string} costCenterId UUID corresponding with a cost center
   * @param {number} facilityId ID corresponding with the facility
   *
   * @returns {Promise}
   * @fulfill {undefined}
   * @reject {Error}
   *
   * @example
   * contxtSdk.facilities.costCenters
   *   .removeFacility('b3dbaae3-25dd-475b-80dc-66296630a8d0', 4)
   *   .catch((err) => console.log(err));
   */
  removeFacility(costCenterId, facilityId) {
    let errorMsg;

    if (!costCenterId) {
      errorMsg =
        'A costCenterId is required to remove a relationship between a cost center and a facility.';
    } else if (!facilityId) {
      errorMsg =
        'A facilityId is required to remove a relationship between a cost center and a facility.';
    }

    if (errorMsg) {
      return Promise.reject(new Error(errorMsg));
    }

    return this._request.delete(
      `${this._baseUrl}/costcenters/${costCenterId}/facility/${facilityId}`
    );
  }

  /**
   * Updates an existing cost center
   *
   * API Endpoint: '/costcenters/:costCenterId'
   * Method: PUT
   *
   * @param {String} costCenterId
   * @param {Object} update
   * @param {string} [update.description]
   * @param {string} [update.name]
   *
   * @returns {Promise}
   * @fulfill {FacilityGrouping} Information about the updated cost center
   * @reject {Error}
   *
   * @example
   * contxtSdk.facilities.costCenters
   *   .update({
   *     description: 'Refrigeration compressors throughout the facility',
   *     name: 'Compressors',
   *   })
   *   .then((costCenter) => console.log(costCenter))
   *   .catch((err) => console.log(err));
   */
  update(costCenterId, update) {
    if (!costCenterId) {
      return Promise.reject(
        new Error('A cost center id is required to update a cost center.')
      );
    }

    if (!update) {
      return Promise.reject(
        new Error('An update is required to update a cost center.')
      );
    }

    if (!isPlainObject(update)) {
      return Promise.reject(
        new Error(
          'The cost center update must be a well-formed object with the data you wish to update.'
        )
      );
    }

    return this._request
      .put(`${this._baseUrl}/costcenters/${costCenterId}`, toSnakeCase(update))
      .then((costCenter) => toCamelCase(costCenter));
  }
}

export default CostCenters;

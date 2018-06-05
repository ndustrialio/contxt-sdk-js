import {
  formatCostCenterFromServer,
  formatCostCenterToServer,
  formatCostCenterFacilityFromServer
} from '../utils/facilities';

/**
 * Module that provides access to cost centers, and helps manage
 * the relationship between those cost centers and facilities
 *
 * @typicalname contxtSdk.facilities.costCenters
 */
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
   * API Endpoint: '/costcenters/:costCenterId/facilities/:facilityId'
   * Method: POST
   *
   * @param {string} costCenterId UUID corresponding with a facility grouping
   * @param {number} facilityId The ID of a facility
   *
   * @returns {Promise}
   * @fulfill {CostCenterFacility} Information about the new cost center facility relationship
   * @reject {Error}
   *
   * @example
   * contxtSdk.facilities.costCenters
   *   .addFacility('b3dbaae3-25dd-475b-80dc-66296630a8d0', 4)
   *   .then((grouping) => console.log(grouping))
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
      .then((costCenterFacility) =>
        formatCostCenterFacilityFromServer(costCenterFacility)
      );
  }

  /**
   * Creates a new cost center
   *
   * API Endpoint: '/costcenters'
   * Method: POST
   *
   * @param {Object} costCenter
   * @param {string} costCenter.description
   * @param {string} costCenter.name
   * @param {string} costCenter.organizationId UUID
   *
   * @returns {Promise}
   * @fulfill {CostCenter} Information about the new cost center
   * @reject {Error}
   *
   * @example
   * contxtSdk.costCenters
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

    const data = formatCostCenterToServer(costCenter);

    return this._request
      .post(`${this._baseUrl}/costcenters`, data)
      .then((costCenter) => formatCostCenterFromServer(costCenter));
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
   * contxtSdk.costCenters
   *   .getAll()
   *   .then((costCenters) => console.log(costCenters))
   *   .catch((err) => console.log(err));
   */
  getAll() {
    return this._request
      .get(`${this._baseUrl}/costcenters`)
      .then((costCenters) => costCenters.map(formatCostCenterFromServer));
  }
}

export default CostCenters;

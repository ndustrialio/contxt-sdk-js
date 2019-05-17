import { toCamelCase } from '../utils/objects';

/**
 * @typedef {Object} ContxtRole
 * @property {ContxtApplication[]} applications
 * @property {string} createdAt ISO 8601 Extended Format date/time string
 * @property {string} description
 * @property {string} id
 * @property {string} name
 * @property {string} organizationId
 * @property {ContxtStack[]} stacks
 * @property {string} updatedAt ISO 8601 Extended Format date/time string
 */

/**
 * @typedef {Object} ContxtStack
 * @property {string} clientId
 * @property {string} clusterId
 * @property {string} createdAt ISO 8601 Extended Format date/time string
 * @property {string} currentVersionId
 * @property {string} description
 * @property {string} documentationUrl
 * @property {string} icon
 * @property {number} id
 * @property {string} name
 * @property {string} organizationId
 * @property {string} ownerId
 * @property {string} type
 * @property {string} updatedAt ISO 8601 Extended Format date/time string
 */

/**
 * Module that provides access to contxt roles
 *
 * @typicalname contxtSdk.coordinator.roles
 */
class Roles {
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
   * Gets an organization's list of roles
   *
   * API Endpoint: '/organizations/:organizationId/roles'
   * Method: GET
   *
   * @param {string} organizationId The ID of the organization
   *
   * @returns {Promise}
   * @fulfill {ContxtRole[]} A list of roles
   * @reject {Error}
   *
   * @example
   * contxtSdk.coordinator.roles
   *   .getByOrganizationId('36b8421a-cc4a-4204-b839-1397374fb16b')
   *   .then((roles) => console.log(roles))
   *   .catch((err) => console.log(err));
   */
  getByOrganizationId(organizationId) {
    if (!organizationId) {
      return Promise.reject(
        new Error(
          'An organization ID is required for getting roles for an organization'
        )
      );
    }

    return this._request
      .get(`${this._baseUrl}/organizations/${organizationId}/roles`)
      .then((roles) => toCamelCase(roles));
  }
}

export default Roles;

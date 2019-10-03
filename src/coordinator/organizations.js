import { toCamelCase } from '../utils/objects';

/**
 * @typedef {Object} ContxtOrganization
 * @property {string} createdAt ISO 8601 Extended Format date/time string
 * @property {string} id UUID formatted ID
 * @property {number} legacyOrganizationId
 * @property {string} name
 * @property {string} updatedAt ISO 8601 Extended Format date/time string
 */

/**
 * Module that provides access to contxt organizations
 *
 * @typicalname contxtSdk.coordinator.organizations
 */
class Organizations {
  /**
   * @param {Object} sdk An instance of the SDK so the module can communicate with other modules
   * @param {Object} request An instance of the request module tied to this module's audience.
   * @param {string} baseUrl The base URL provided by the parent module
   * @param {string} [organizationId] The organization ID to be used in tenant url requests
   */
  constructor(sdk, request, baseUrl, organizationId = null) {
    this._baseUrl = baseUrl;
    this._request = request;
    this._sdk = sdk;
    this._organizationId = organizationId;
  }

  /**
   * Gets information about a contxt organization
   *
   * Legacy API Endpoint: '/organizations/:organizationId'
   * API Endpoint: '/'
   * Method: GET
   *
   * @param {string} organizationId The ID of the organization, optional when using the tenant API and an organization ID has been set
   *
   * @returns {Promise}
   * @fulfill {ContxtOrganization} Information about a contxt organization
   * @reject {Error}
   *
   * @example
   * contxtSdk.coordinator.organizations
   *   .get('36b8421a-cc4a-4204-b839-1397374fb16b')
   *   .then((org) => console.log(org))
   *   .catch((err) => console.log(err));
   */
  get(organizationId) {
    if (this._organizationId) {
      return this._request
        .get(`${this._baseUrl}`)
        .then((org) => toCamelCase(org));
    }

    if (!organizationId) {
      return Promise.reject(
        new Error(
          'An organization ID is required for getting information about an organization'
        )
      );
    }

    return this._request
      .get(`${this._baseUrl}/organizations/${organizationId}`)
      .then((org) => toCamelCase(org));
  }

  /**
   * Gets information about all contxt organizations
   *
   * API Endpoint: '/organizations'
   * Method: GET
   *
   * @returns {Promise}
   * @fulfill {ContxtOrganization[]} Information about all contxt organizations
   * @reject {Error}
   *
   * @example
   * contxtSdk.coordinator.organizations
   *   .getAll()
   *   .then((orgs) => console.log(orgs))
   *   .catch((err) => console.log(err));
   */
  getAll() {
    return this._request
      .get(`${this._baseUrl}/organizations`)
      .then((orgs) => orgs.map((org) => toCamelCase(org)));
  }
}

export default Organizations;

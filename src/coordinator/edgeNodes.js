import { toCamelCase } from '../utils/objects';

/**
 * @typedef {Object} EdgeNode
 * @param {string} clientId
 * @param {string} createdAt ISO 8601 Extended Format date/time string
 * @param {string} [description]
 * @param {string} id UUID
 * @param {string} name
 * @param {string} organizationId UUID
 * @param {string} updatedAt ISO 8601 Extended Format date/time string
 */

/**
 * Module that provides access to contxt edge nodes
 *
 * @typicalname contxtSdk.coordinator.edgeNodes
 */
class EdgeNodes {
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
   * Get an edge node
   *
   * Legacy API Endpoint: '/organizations/:organizationId/edgenodes/:edgeNodeClientId'
   * API Endpoint: 'edgenodes/:edgeNodeClientId'
   * METHOD: GET
   *
   * @param {string} organizationId The ID of the organization, optional when using the tenant API and an organization ID has been set
   * @param {string} edgeNodeClientId
   *
   * @returns {Promise}
   * @fulfill {EdgeNode}
   * @reject {Error}
   *
   * @example
   * contxtSdk.coordinator.edgeNodes
   *   .get('59270c25-4de9-4b22-8e0b-ab287ac344ce', 'abc123')
   *   .then((edgeNode) => console.log(edgeNode))
   *   .catch((err) => console.log(err));
   */
  get(organizationId, edgeNodeClientId) {
    if (this._organizationId) {
      if (!edgeNodeClientId) {
        return Promise.reject(
          new Error('An edgeNodeClientId is required for getting an edge node.')
        );
      }

      return this._request
        .get(`${this._baseUrl}/edgenodes/${edgeNodeClientId}`)
        .then((edgeNode) => toCamelCase(edgeNode));
    }

    if (!organizationId) {
      return Promise.reject(
        new Error('An organizationId is required for getting an edge node.')
      );
    }

    if (!edgeNodeClientId) {
      return Promise.reject(
        new Error('An edgeNodeClientId is required for getting an edge node.')
      );
    }

    return this._request
      .get(
        `${
          this._baseUrl
        }/organizations/${organizationId}/edgenodes/${edgeNodeClientId}`
      )
      .then((edgeNode) => toCamelCase(edgeNode));
  }
}

export default EdgeNodes;

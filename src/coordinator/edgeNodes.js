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
   */
  constructor(sdk, request, baseUrl) {
    this._baseUrl = baseUrl;
    this._request = request;
    this._sdk = sdk;
  }

  /**
   * Get an edge node
   *
   * API Endpoint: '/organizations/:organizationId/edgenodes/:edgeNodeId'
   * METHOD: GET
   *
   * @param {string} organizationId UUID
   * @param {string} edgeNodeId
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
  get(organizationId, edgeNodeId) {
    if (!organizationId) {
      return Promise.reject(
        new Error('An organizationId is required for getting an edge node.')
      );
    }

    if (!edgeNodeId) {
      return Promise.reject(
        new Error('An edgeNodeId is required for getting an edge node.')
      );
    }

    return this._request
      .get(
        `${
          this._baseUrl
        }/organizations/${organizationId}/edgenodes/${edgeNodeId}`
      )
      .then((edgeNode) => toCamelCase(edgeNode));
  }
}

export default EdgeNodes;

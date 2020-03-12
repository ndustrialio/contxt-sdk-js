/**
 * @typedef {Object} FeedType
 * @property {String} createdAt
 * @property {String} downAfter
 * @property {String} id UUID
 * @property {String} troubleshootingUrl
 * @property {String} type
 * @property {String} updatedAt
 */

/**
 * Module that provides access to feed type information
 *
 * @typicalname contxtSdk.iot.feedTypes
 */
class FeedTypes {
  /**
   * @param {Object} sdk An instance of the SDK so the module can communicate
   *   with other modules
   * @param {Object} request An instance of the request module tied to this
   *   module's audience
   * @param {string} baseUrl The base URL provided by the parent module
   */
  constructor(sdk, request, baseUrl) {
    this._baseUrl = baseUrl;
    this._request = request;
    this._sdk = sdk;
  }

  /**
   * Get a listing of all feed types
   *
   * API Endpoint: '/feeds/types'
   * Method: GET
   *
   * @param {PaginationOptions} [paginationOptions]
   *
   * @returns {Promise}
   * @fulfill {FeedTypesFromServer} Information about the feed types
   * @reject {Error}
   *
   * @example
   * contxtSdk.iot.feedTypes
   *   .getAll()
   *   .then((feedTypes) => console.log(feedTypes))
   *   .catch((err) => console.log(err));
   */
  getAll() {
    return this._request.get(`${this._baseUrl}/feeds/types`);
  }
}

export default FeedTypes;

import { formatPaginatedDataFromServer } from '../utils/pagination';

/**
 * @typedef {Object} HealthStatus
 * @property {string} status A health status of value 'healthy' or 'unhealthy'
 * @property {string} timestamp  ISO 8601 Extended Format date/time string
 */

/**
 * @typedef {Object} HealthAsset
 * @augments Asset
 * @property {HealthStatus} health
 */

/**
 * @interface PaginatedResponse
 * @template RecordType
 * @typedef {Object} PaginatedResponse
 * @property {Object} _metadata Metadata about the pagination settings
 * @property {number} _metadata.offset Offset of records in subsequent queries
 * @property {number} _metadata.totalRecords Total number of asset types found
 * @property {Array.<RecordType>} records
 */

/**
 * @typedef {PaginatedResponse.<HealthAsset>} HealthAssetPaginatedResponse
 */

/**
 * @typedef {PaginatedResponse.<HealthStatus>} HealthStatusPaginatedResponse
 */

/**
 * Module that provides access to the Contxt Health Service
 *
 * @typicalname contxtSdk.health
 */
class Health {
  /**
   * @param {Object} sdk An instance of the SDK so the module can communicate with other modules
   * @param {Object} request An instance of the request module tied to this module's audience.
   * @param {string} [organizationId] The organization ID to be used in tenant url requests
   */
  constructor(sdk, request, organizationId = null) {
    const baseUrl = `${sdk.config.audiences.health.host}/v1`;

    this._baseUrl = baseUrl;
    this._request = request;
    this._sdk = sdk;

    this._organizationId = organizationId;
  }

  /**
   * The health status option constants
   * @enum {string}
   * @static
   * @example
   * console.log(Health.GOOD) //healthy
   * console.log(Health.BAD) //unhealthy
   */
  static status = {
    GOOD: 'healthy',
    BAD: 'unhealthy'
  };

  /**
   * Gets all of an organization's assets and their most recent health status
   *
   * API Endpoint: '/:organizationId/assets'
   * Method: GET
   *
   * @param {Object} options
   * @param {string} [options.organizationId] The organization id that owns the assets. Required if an organization id isn't set on the module instance.
   * @param {number} [options.limit] The maximum number of records to return
   * @param {number} [options.offset] The number of records you wish to skip before returning records
   * @param {string} [options.orderBy] The direction to sort by: "asc" or "desc"
   * @param {string} [options.sortBy] The field to sort by
   * @returns {Promise}
   * @fulfill {HealthAssetPaginatedResponse} Information about all contxt applications
   * @reject {Error}
   *
   * @example
   * contxtSdk.health
   *   .getAll({
   *      organizationId: 'bd900b6e-a319-492f-aa95-9715891b9a83',
   *      limit: 50,
   *      offset: 100
   *   })
   *   .then((healthAssetRecords) => console.log(healthAssetRecords))
   *   .catch((err) => console.log(err));
   */
  getAll({
    organizationId = this._organizationId,
    limit,
    offset,
    orderBy,
    sortBy
  }) {
    if (!organizationId) {
      return Promise.reject(new Error('An organization ID is required'));
    }

    return this._request
      .get(`${this._baseUrl}/${organizationId}/assets`, {
        params: {
          limit,
          offset,
          orderBy,
          sortBy
        }
      })
      .then((response) => formatPaginatedDataFromServer(response));
  }

  /**
   * Gets a list of health statuses for a single asset
   *
   * API Endpoint: '/:organizationId/assets/:assetId'
   * Method: GET
   *
   * @param {Object} options
   * @param {string} options.assetId The asset id to get the health for
   * @param {string} [options.organizationId] The organization id that owns the assets. Required if an organization id isn't set on the module instance.
   * @param {number} [options.limit] The maximum number of records to return
   * @param {number} [options.offset] The number of records you wish to skip before returning records
   * @param {string} [options.orderBy] The direction to sort by: "asc" or "desc"
   * @param {string} [options.sortBy] The field to sort by
   * @returns {Promise}
   * @fulfill {HealthStatusPaginatedResponse} Information about all contxt applications
   * @reject {Error}
   *
   * @example
   * contxtSdk.health
   *   .getByAssetId({
   *      assetId: '9859f22d-cc45-4015-8674-1671f54d1888',
   *      organizationId: 'bd900b6e-a319-492f-aa95-9715891b9a83',
   *      limit: 50,
   *      offset: 100
   *   })
   *   .then((healthStatusRecords) => console.log(healthStatusRecords))
   *   .catch((err) => console.log(err));
   */
  getByAssetId({
    assetId,
    organizationId = this._organizationId,
    limit,
    offset,
    orderBy,
    sortBy
  }) {
    if (!assetId) {
      return Promise.reject(new Error('An asset ID is required'));
    }

    if (!organizationId) {
      return Promise.reject(new Error('An organization ID is required'));
    }

    return this._request
      .get(`${this._baseUrl}/${organizationId}/assets/${assetId}`, {
        params: {
          limit,
          offset,
          orderBy,
          sortBy
        }
      })
      .then((response) => formatPaginatedDataFromServer(response));
  }

  /**
   * Creates a new health status entry for an asset
   *
   * API Endpoint: '/:organizationId/assets/:assetId'
   * Method: POST
   *
   * @param {Object} options
   * @param {string} options.assetId The asset id to get the health for
   * @param {string} [options.organizationId] The organization id that owns the assets. Required if an organization id isn't set on the module instance.
   * @param {string} options.status The health of the asset. One of type Health.status.GOOD or Health.status.BAD
   * @param {string} [options.timestamp] Defaults to now. ISO 8601 Extended Format date/time string
   * @returns {Promise}
   * @fulfill {HealthStatusPaginatedResponse} Information about all contxt applications
   * @reject {Error}
   *
   * @example
   * contxtSdk.health
   *   .post({
   *      assetId: '9859f22d-cc45-4015-8674-1671f54d1888',
   *      organizationId: 'bd900b6e-a319-492f-aa95-9715891b9a83',
   *      status: contxtSdk.health.status.GOOD
   *   })
   *   .then((healthStatus) => console.log(healthStatus))
   *   .catch((err) => console.log(err));
   */
  post({ assetId, organizationId = this._organizationId, status, timestamp }) {
    if (!assetId) {
      return Promise.reject(new Error('An asset ID is required'));
    }

    if (!organizationId) {
      return Promise.reject(new Error('An organization ID is required'));
    }

    if (!Object.values(Health.status).includes(status)) {
      return Promise.reject(
        new Error(
          `Status must equal one of: ${Object.values(Health.status).join(', ')}`
        )
      );
    }

    return this._request.post(
      `${this._baseUrl}/${organizationId}/assets/${assetId}`,
      {
        status,
        timestamp
      }
    );
  }
}

export default Health;

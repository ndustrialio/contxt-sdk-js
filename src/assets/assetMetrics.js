import has from 'lodash.has';
import isPlainObject from 'lodash.isplainobject';
import { toCamelCase, toSnakeCase } from '../utils/objects';
import { formatPaginatedDataFromServer } from '../utils/pagination';

/**
 * @typedef {Object} AssetMetric
 * @property {string} assetTypeId UUID corresponding with the asset type
 * @property {string} createdAt ISO 8601 Extended Format date/time string
 * @property {string} description
 * @property {string} id UUID
 * @property {string} label
 * @property {string} organizationId UUID corresponding with the organization
 * @property {string} timeInterval Options are "hourly", "daily", "weekly", "monthly", "yearly"
 * @property {string} [units]
 * @property {string} updatedAt ISO 8601 Extended Format date/time string
 */

/**
 * @typedef {Object} AssetMetricsFromServer
 * @property {Object} _metadata Metadata about the pagination settings
 * @property {number} _metadata.offset Offset of records in subsequent queries
 * @property {number} _metadata.totalRecords Total number of asset types found
 * @property {AssetMetric[]} records
 */

/**
 * Module that provides access to, and the manipulation of, information about different asset metrics
 *
 * @typicalname contxtSdk.assets.metrics
 */
class AssetMetrics {
  /**
   * @param {Object} sdk An instance of the SDK so the module can communicate with other modules.
   * @param {Object} request An instance of the request module tied to this module's audience.
   * @param {string} baseUrl The base URL provided by the parent module
   */
  constructor(sdk, request, baseUrl) {
    this._baseUrl = baseUrl;
    this._request = request;
    this._sdk = sdk;
  }

  /**
   * Creates a new asset metric
   *
   * API Endpoint: '/assets/types/:assetTypeId/metrics'
   * Method: POST
   *
   * @param {string} assetTypeId The UUID formatted ID of the asset type
   * @param {Object} assetMetric
   * @param {string} assetMetric.description
   * @param {string} assetMetric.label
   * @param {string} assetMetric.organizationId Organization ID (UUID) to which the metric belongs
   * @param {string} assetMetric.timeInterval Options are "hourly", "daily", "weekly", "monthly", "yearly"
   * @param {string} [assetMetric.units] Units of the metric
   *
   * @returns {Promise}
   * @fulfill {AssetMetric} Information about the new asset metric
   * @reject {Error}
   *
   * @example
   * contxtSdk.assets.metrics
   *   .create('4f0e51c6-728b-4892-9863-6d002e61204d', {
   *     description: 'Number of injuries which occur in the facility each month',
   *     label: 'Facility Injuries',
   *     organizationId: 'b47e45af-3e18-408a-8070-008f9e6d7b42',
   *     timeInterval: 'monthly',
   *     units: 'injuries'
   *   })
   *   .then((assetMetric) => console.log(assetMetric))
   *   .catch((err) => console.log(err));
   */
  create(assetTypeId, assetMetric = {}) {
    if (!assetTypeId) {
      return Promise.reject(
        new Error('An asset type ID is required for creating an asset metric.')
      );
    }

    const hasFieldFns = {
      default: (object, key) => !!object[key],
      organizationId: (object, key) => has(object, key)
    };
    const requiredFields = [
      'description',
      'label',
      'organizationId',
      'timeInterval'
    ];

    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      const hasField = hasFieldFns[field] || hasFieldFns.default;

      if (!hasField(assetMetric, field)) {
        return Promise.reject(
          new Error(`A ${field} is required to create a new asset metric.`)
        );
      }
    }

    return this._request
      .post(
        `${this._baseUrl}/assets/types/${assetTypeId}/metrics`,
        toSnakeCase(assetMetric)
      )
      .then((assetMetric) => toCamelCase(assetMetric));
  }

  /**
   * Deletes an asset metric
   *
   * API Endpoint: '/assets/metrics/:assetMetricId'
   * Method: DELETE
   *
   * @param {string} assetMetricId The UUID formatted ID of the asset metric
   *
   * @returns {Promise}
   * @fulfill {undefined}
   * @reject {Error}
   *
   * @example
   * contxtSdk.assets.metrics.delete('4f0e51c6-728b-4892-9863-6d002e61204d')
   */
  delete(assetMetricId) {
    if (!assetMetricId) {
      return Promise.reject(
        new Error(
          'An asset metric ID is required for deleting an asset metric.'
        )
      );
    }

    return this._request.delete(
      `${this._baseUrl}/assets/metrics/${assetMetricId}`
    );
  }

  /**
   * Gets information about an asset metric
   *
   * API Endpoint: '/assets/metrics/:assetMetricId'
   * Method: GET
   *
   * @param {string} assetMetricId The UUID formatted ID of the asset metric
   *
   * @returns {Promise}
   * @fulfill {AssetMetric} Information about the asset metric
   * @reject {Error}
   *
   * @example
   * contxtSdk.assets.metrics
   *   .get('4f0e51c6-728b-4892-9863-6d002e61204d')
   *   .then((assetMetric) => console.log(assetMetric))
   *   .catch((err) => console.log(err));
   */
  get(assetMetricId) {
    if (!assetMetricId) {
      return Promise.reject(
        new Error(
          'An asset metric ID is required for getting information about an asset metric.'
        )
      );
    }

    return this._request
      .get(`${this._baseUrl}/assets/metrics/${assetMetricId}`)
      .then((assetMetric) => toCamelCase(assetMetric));
  }

  /**
   * Gets a list of all asset metrics that belong to a given type
   *
   * API Endpoint: '/assets/types/:assetTypeId/metrics
   * Method: GET
   *
   * @param {string} assetTypeId The UUID formatted ID of the asset type
   * @param {PaginationOptions} [paginationOptions]
   *
   * @returns {Promise}
   * @fulfill {AssetMetricsFromServer}
   * @reject {Error}
   *
   * @example
   * contxtSdk.assets.metrics
   *   .getAll('4f0e51c6-728b-4892-9863-6d002e61204d')
   *   .then((assetMetrics) => console.log(assetMetrics))
   *   .catch((err) => console.log(err));
   */
  getAll(assetTypeId, paginationOptions) {
    if (!assetTypeId) {
      return Promise.reject(
        new Error(
          'An asset type ID is required to get a list of all asset metrics.'
        )
      );
    }

    return this._request
      .get(`${this._baseUrl}/assets/types/${assetTypeId}/metrics`, {
        params: toSnakeCase(paginationOptions)
      })
      .then((assetTypesData) => formatPaginatedDataFromServer(assetTypesData));
  }

  /**
   * Updates an asset metric's data
   *
   * API Endpoint: '/assets/metrics/:assetMetricId'
   * Method: PUT
   *
   * @param {string} assetMetricId The ID of the asset metric to update (formatted as a UUID)
   * @param {Object} update An object containing the updated data for the asset metric
   * @param {string} [update.description]
   * @param {string} [update.label]
   * @param {string} [update.timeInterval]
   * @param {string} [update.units]
   *
   * @returns {Promise}
   * @fulfill {undefined}
   * @reject {Error}
   *
   * @example
   * contxtSdk.assets.metrics
   *   .update('5f310899-d8f9-4dac-ae82-cedb2048a8ef', {
   *     description: 'An updated description of this metric'
   *   });
   */
  update(assetMetricId, update) {
    if (!assetMetricId) {
      return Promise.reject(
        new Error('An asset metric ID is required to update an asset metric.')
      );
    }

    if (!update) {
      return Promise.reject(
        new Error('An update is required to update an asset metric.')
      );
    }

    if (!isPlainObject(update)) {
      return Promise.reject(
        new Error(
          'The asset metric update must be a well-formed object with the data you wish to update.'
        )
      );
    }

    const formattedUpdate = toSnakeCase(update, {
      excludeKeys: ['createdAt', 'id', 'label', 'organizationId', 'updatedAt']
    });

    return this._request.put(
      `${this._baseUrl}/assets/metrics/${assetMetricId}`,
      formattedUpdate
    );
  }
}

export default AssetMetrics;

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
 * @typedef {Object} AssetMetricValue
 * @property {string} assetId UUID corresponding to the asset
 * @property {string} assetMetricId UUID corresponding to the asset metric
 * @property {string} createdAt ISO 8601 Extended Format date/time string
 * @property {string} effectiveEndDate ISO 8601 Extended Format date/time string
 * @property {string} effectiveStartDate ISO 8601 Extended Format date/time string
 * @property {string} id UUID
 * @property {string} notes
 * @property {string} updatedAt ISO 8601 Extended Format date/time string
 * @property {string} value
 */

/**
 * @typedef {Object} AssetMetricValuesFromServer
 * @property {Object} _metadata Metadata about the pagination settings
 * @property {number} _metadata.offset Offset of records in subsequent queries
 * @property {number} _metadata.totalRecords Total number of asset types found
 * @property {AssetMetricValue[]} records
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
        new Error('An asset type ID is required to create an asset metric.')
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
   * contxtSdk.assets.metrics.delete('4f0e51c6-728b-4892-9863-6d002e61204d');
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
   * Gets a list of all asset metrics that belong to a given asset
   *
   * API Endpoint: '/assets/:assetId/metrics
   * Method: GET
   *
   * @param {string} assetId The UUID formatted ID of the asset type
   * @param {Object} [assetMetricsFilters] Specific information that is used to
   *   filter the list of asset metrics
   * @param {String} [assetMetricsFilters.assetMetricLabel] The label of the
   *   associated asset metrics
   * @param {Number} [assetMetricsFilters.limit] Maximum number of records to
   *   return per query
   * @param {Number} [assetMetricsFilters.offset] How many records from the first
   *   record to start the query
   *
   * @returns {Promise}
   * @fulfill {AssetMetricsFromServer}
   * @reject {Error}
   *
   * @example
   * contxtSdk.assets.metrics
   *   .getByAssetId(
   *     'f3be81fd-4494-443b-87a3-320b1c9aa495',
   *      {
   *        assetMetricLabel: 'Square Footage',
   *        limit: 50,
   *        offset: 150
   *      }
   *    )
   *   .then((assetMetricData) => console.log(assetMetricData))
   *   .catch((err) => console.log(err));
   */
  getByAssetId(assetId, assetMetricsFilters) {
    if (!assetId) {
      return Promise.reject(
        new Error('An asset ID is required to get a list of all asset metrics.')
      );
    }

    return this._request
      .get(`${this._baseUrl}/assets/${assetId}/metrics`, {
        params: toSnakeCase(assetMetricsFilters)
      })
      .then((assetMetricsData) =>
        formatPaginatedDataFromServer(assetMetricsData)
      );
  }

  /**
   * Gets a list of all asset metrics that belong to a given type
   *
   * API Endpoint: '/assets/types/:assetTypeId/metrics
   * Method: GET
   *
   * @param {string} assetTypeId The UUID formatted ID of the asset type
   * @param {Object} [assetMetricsFilters] Specific information that is used to
   *   filter the list of asset metrics
   * @param {Number} [assetMetricsFilters.limit] Maximum number of records to
   *   return per query
   * @param {Number} [assetMetricsFilters.offset] How many records from the first
   *   record to start the query
   * @param {String} [assetMetricsFilters.organizationId] The UUID formatted ID
   *   of the organization to filter asset metrics by
   *
   * @returns {Promise}
   * @fulfill {AssetMetricsFromServer}
   * @reject {Error}
   *
   * @example
   * contxtSdk.assets.metrics
   *   .getByAssetTypeId(
   *     '4f0e51c6-728b-4892-9863-6d002e61204d'
   *      {
   *        limit: 50,
   *        offset: 150
   *      }
   *    )
   *   .then((assetMetrics) => console.log(assetMetrics))
   *   .catch((err) => console.log(err));
   */
  getByAssetTypeId(assetTypeId, assetMetricsFilters) {
    if (!assetTypeId) {
      return Promise.reject(
        new Error(
          'An asset type ID is required to get a list of all asset metrics.'
        )
      );
    }

    return this._request
      .get(`${this._baseUrl}/assets/types/${assetTypeId}/metrics`, {
        params: toSnakeCase(assetMetricsFilters)
      })
      .then((assetMetricsData) =>
        formatPaginatedDataFromServer(assetMetricsData)
      );
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

  /**
   * Creates a new asset metric value
   *
   * API Endpoint: '/assets/:assetId/metrics/:assetMetricId/values'
   * Method: POST
   *
   * @param {string} assetId The ID of the asset (formatted as a UUID)
   * @param {Object} assetMetricValue
   * @param {string} assetMetricValue.assetMetricId UUID corresponding to the asset metric
   * @param {string} assetMetricValue.effectiveEndDate ISO 8601 Extended Format date/time string
   * @param {string} assetMetricValue.effectiveStartDate ISO 8601 Extended Format date/time string
   * @param {string} [assetMetricValue.notes]
   * @param {string} assetMetricValue.value
   *
   * @returns {Promise}
   * @fulfill {AssetMetricValue}
   * @reject {Error}
   *
   * @example
   * contxtSdk.assets.metrics
   *   .createValue('1140cc2e-6d13-42ee-9941-487fe98f8e2d', {
   *      assetMetricId: 'cca11baa-cf7d-44c0-9d0a-6ad73d5f30cb',
   *      effectiveEndDate: '2018-08-28T18:18:18.264Z',
   *      effectiveStartDate: '2018-08-27T18:18:03.175Z',
   *      notes: 'Iure delectus non sunt a voluptates pariatur fuga.',
   *      value: '2000'
   *    })
   *    .then((newAssetMetricValue) => {
   *      console.log(newAssetMetricValue);
   *    })
   *    .catch((error) => {
   *      console.error(error);
   *    });
   */
  createValue(assetId, assetMetricValue = {}) {
    const requiredFields = [
      'assetMetricId',
      'effectiveEndDate',
      'effectiveStartDate',
      'value'
    ];

    if (!assetId) {
      return Promise.reject(
        new Error('An asset ID is required to create a new asset metric value.')
      );
    }

    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];

      if (!assetMetricValue[field]) {
        return Promise.reject(
          new Error(
            `A ${field} is required to create a new asset metric value.`
          )
        );
      }
    }

    return this._request
      .post(
        `${this._baseUrl}/assets/${assetId}/metrics/${
          assetMetricValue.assetMetricId
        }/values`,
        toSnakeCase(assetMetricValue)
      )
      .then((assetMetricValue) => toCamelCase(assetMetricValue));
  }

  /**
   * Deletes an asset metric value
   *
   * API Endpoint: '/assets/metrics/values/:assetMetricValueId'
   * Method: DELETE
   *
   * @param {string} assetMetricValueId The ID of the asset metric value (formatted as a UUID)
   *
   * @returns {Promise}
   * @fulfill {undefined}
   * @reject {Error}
   *
   * @example
   * contxtSdk.assets.metrics.deleteValue(
   *   'f4cd0d84-6c61-4d19-9322-7c1ab226dc83'
   * );
   */
  deleteValue(assetMetricValueId) {
    if (!assetMetricValueId) {
      return Promise.reject(
        new Error(
          'An asset metric value ID is required for deleting an asset metric value.'
        )
      );
    }

    return this._request.delete(
      `${this._baseUrl}/assets/metrics/values/${assetMetricValueId}`
    );
  }

  /**
   * Gets asset metric values for a particular asset
   *
   * API Endpoint: '/assets/:assetId/metrics/values'
   * Method: GET
   *
   * @param {String} assetId The ID of the asset (formatted as a UUID)
   * @param {Object} [assetMetricValuesFilters] Specific information that is
   *   used to filter the list of asset metric values
   * @param {String} [assetMetricValuesFilters.assetMetricLabel] The label of
   *   the associated asset metrics
   * @param {String} [assetMetricValuesFilters.effectiveEndDate] Effective end
   *   date (ISO 8601 Extended formatted) of the asset metric values
   * @param {String} [assetMetricValuesFilters.effectiveStartDate] Effective
   *   start date (ISO 8601 Extended formatted) of the asset metric values
   * @param {Number} [assetMetricValuesFilters.limit] Maximum number of records
   *   to return per query
   * @param {Number} [assetMetricValuesFilters.offset] How many records from the
   *   first record to start the query
   *
   * @returns {Promise}
   * @fulfill {AssetMetricValuesFromServer}
   * @rejects {Error}
   *
   * @example
   * contxtSdk.assets.metrics
   *   .getValuesByAssetId(
   *      'f9c606f3-d270-4623-bf3b-b085424d9a8b',
   *      {
   *        assetMetricLabel: 'Square Footage',
   *        effectiveEndDate: '2018-04-13T15:44:51.943Z'
   *        effectiveStartDate: '2017-12-13T15:42:01.376Z'
   *        limit: 10,
   *        offset: 200
   *      }
   *    )
   *   .then((assetMetricValuesData) => console.log(assetMetricValuesData))
   *   .catch((err) => console.log(err));
   */
  getValuesByAssetId(assetId, assetMetricValuesFilters) {
    if (!assetId) {
      return Promise.reject(
        new Error(
          'An asset ID is required to get a list of asset metric values.'
        )
      );
    }

    return this._request
      .get(`${this._baseUrl}/assets/${assetId}/metrics/values`, {
        params: toSnakeCase(assetMetricValuesFilters)
      })
      .then((assetMetricValueData) =>
        formatPaginatedDataFromServer(assetMetricValueData)
      );
  }

  /**
   * Gets asset metric values for a particular asset and metric
   *
   * API Endpoint: '/assets/:assetId/metrics/:assetMetricId/values'
   * Method: GET
   *
   * @param {String} assetId The ID of the asset (formatted as a UUID)
   * @param {String} assetMetricId The ID of the asset metric (formatted as a
   *   UUID)
   * @param {Object} [assetMetricValuesFilters] Specific information that is
   *   used to filter the list of asset metric values
   * @param {String} [assetMetricValuesFilters.effectiveEndDate] Effective end
   *   date (ISO 8601 Extended formatted) of the asset metric values
   * @param {String} [assetMetricValuesFilters.effectiveStartDate] Effective
   *   start date (ISO 8601 Extended formatted) of the asset metric values
   * @param {Number} [assetMetricValuesFilters.limit] Maximum number of records
   *   to return per query
   * @param {Number} [assetMetricValuesFilters.offset] How many records from the
   *   first record to start the query
   *
   * @returns {Promise}
   * @fulfill {AssetMetricValuesFromServer}
   * @rejects {Error}
   *
   * @example
   * contxtSdk.assets.metrics
   *   .getValuesByMetricId(
   *      'd7329ef3-ca63-4ad5-bb3e-632b702584f8',
   *      'a1329ef3-ca63-4ad5-bb3e-632b702584f8',
   *      {
   *        limit: 10,
   *        effectiveStartDate: '2018-07-11T19:14:49.715Z'
   *      }
   *    )
   *   .then((assetMetricValuesData) => {
   *     console.log(assetMetricValuesData);
   *   })
   *   .catch((err) => console.log(err));
   */
  getValuesByMetricId(assetId, assetMetricId, assetMetricValuesFilters) {
    if (!assetId) {
      return Promise.reject(
        new Error(
          'An asset ID is required to get a list of asset metric values.'
        )
      );
    }

    if (!assetMetricId) {
      return Promise.reject(
        new Error(
          'An asset metric ID is required to get a list of asset metric values.'
        )
      );
    }

    return this._request
      .get(
        `${this._baseUrl}/assets/${assetId}/metrics/${assetMetricId}/values`,
        {
          params: toSnakeCase(assetMetricValuesFilters)
        }
      )
      .then((assetMetricValueData) =>
        formatPaginatedDataFromServer(assetMetricValueData)
      );
  }

  /**
   * Updates an asset metric value
   *
   * API Endpoint: '/assets/metrics/values/:assetMetricValueId'
   * Method: PUT
   *
   * @param {string} assetMetricValueId The ID of the asset metric value to update (formatted as a UUID)
   * @param {Object} update An object containing the updated data for the asset metric value
   * @param {string} [update.effectiveEndDate] ISO 8601 Extended Format date/time string
   * @param {string} [update.effectiveStartDate] ISO 8601 Extended Format date/time string
   * @param {string} [update.notes]
   * @param {string} [update.value]
   *
   * @returns {Promise}
   * @fulfill {undefined}
   * @reject {Error}
   *
   * @example
   * contxtSdk.assets.metrics
   *   .updateValue('2140cc2e-6d13-42ee-9941-487fe98f8e2d', {
   *     effectiveEndDate: '2018-07-10T11:04:24.631Z',
   *     notes: 'Dolores et sapiente sunt doloribus aut in.',
   *     value: '61456'
   *   })
   *   .catch((err) => console.log(err));
   */
  updateValue(assetMetricValueId, update) {
    if (!assetMetricValueId) {
      return Promise.reject(
        new Error(
          'An asset metric value ID is required to update an asset metric value.'
        )
      );
    }

    if (!update) {
      return Promise.reject(
        new Error('An update is required to update an asset metric value.')
      );
    }

    if (!isPlainObject(update)) {
      return Promise.reject(
        new Error(
          'The asset metric value update must be a well-formed object with the data you wish to update.'
        )
      );
    }

    const formattedUpdate = toSnakeCase(update, {
      excludeKeys: ['assetId', 'assetMetricId', 'id']
    });

    return this._request.put(
      `${this._baseUrl}/assets/metrics/values/${assetMetricValueId}`,
      formattedUpdate
    );
  }
}

export default AssetMetrics;

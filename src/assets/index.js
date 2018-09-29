import isPlainObject from 'lodash.isplainobject';
import AssetAttributes from './assetAttributes';
import AssetMetrics from './assetMetrics';
import AssetTypes from './assetTypes';

import { toCamelCase, toSnakeCase } from '../utils/objects';
import { formatPaginatedDataFromServer } from '../utils/pagination';

/**
 * @typedef {Object} Asset
 * @property {string} assetTypeId UUID corresponding with the asset type
 * @property {string} createdAt ISO 8601 Extended Format date/time string
 * @property {string} [description]
 * @property {string} id UUID
 * @property {string} label
 * @property {string} organizationId UUID corresponding with the organization
 * @property {string} updatedAt ISO 8601 Extended Format date/time string
 */

/**
 * @typedef {Object} AssetsFromServer
 * @property {Object} _metadata Metadata about the pagination settings
 * @property {number} _metadata.offset Offset of records in subsequent queries
 * @property {number} _metadata.totalRecords Total number of asset types found
 * @property {Asset[]} records
 */

/**
 * Module that provides access to, and the manipulation of, information about different assets
 *
 * @typicalname contxtSdk.assets
 */
class Assets {
  /**
   * @param {Object} sdk An instance of the SDK so the module can communicate with other modules.
   * @param {Object} request An instance of the request module tied to this module's audience.
   */
  constructor(sdk, request) {
    const baseUrl = `${sdk.config.audiences.facilities.host}/v1`;

    this._baseUrl = baseUrl;
    this._request = request;
    this._sdk = sdk;

    this.attributes = new AssetAttributes(sdk, request, baseUrl);
    this.types = new AssetTypes(sdk, request, baseUrl);
    this.metrics = new AssetMetrics(sdk, request, baseUrl);
  }

  /**
   * Creates a new asset
   *
   * API Endpoint: '/assets'
   * Method: POST
   *
   * @param {Object} asset
   * @param {string} asset.assetTypeId UUID
   * @param {string} [asset.description]
   * @param {string} asset.label
   * @param {string} asset.organizationId UUID
   *
   * @returns {Promise}
   * @fulfill {Asset} information about the new asset
   * @reject {Error}
   *
   * @example
   * contxtSdk.assets
   *   .create({
   *     assetTypeId: '4f0e51c6-728b-4892-9863-6d002e61204d',
   *     description: '221B Baker Street, London',
   *     label: 'Sherlock Homes Museum',
   *     organizationId: 'b47e45af-3e18-408a-8070-008f9e6d7b42'
   *   })
   *   .then((asset) => console.log(asset))
   *   .catch((err) => console.log(err));
   */
  create(asset = {}) {
    const requiredFields = ['assetTypeId', 'label', 'organizationId'];

    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];

      if (!asset[field]) {
        return Promise.reject(
          new Error(`A ${field} is required to create a new asset.`)
        );
      }
    }

    return this._request
      .post(`${this._baseUrl}/assets`, toSnakeCase(asset))
      .then((asset) => toCamelCase(asset));
  }

  /**
   * Deletes an asset
   *
   * API Endpoint: '/assets/:assetId'
   * Method: DELETE
   *
   * @param {string} assetId The ID of the asset (formatted as a UUID)
   *
   * @returns {Promise}
   * @fulfill {undefined}
   * @reject {Error}
   *
   * @example
   * contxtSdk.assets.delete('0b51429f-91a0-48ba-b144-fd2db697000e');
   */
  delete(assetId) {
    if (!assetId) {
      return Promise.reject(
        new Error('An asset ID is required for deleting an asset.')
      );
    }

    return this._request.delete(`${this._baseUrl}/assets/${assetId}`);
  }

  /**
   * Gets information about an asset
   *
   * API Endpoint: '/assets/:assetId'
   * Method: GET
   *
   * @param {string} assetId The ID of the asset (formatted as a UUID)
   *
   * @returns {Promise}
   * @fulfill {Asset} Information about the asset
   * @reject {Error}
   *
   * @example
   * contxtSdk.assets
   *   .get('0b51429f-91a0-48ba-b144-fd2db697000e')
   *   .then((asset) => console.log(asset))
   *   .catch((err) => console.log(err));
   */
  get(assetId) {
    if (!assetId) {
      return Promise.reject(
        new Error(
          'An asset ID is required for getting information about an asset.'
        )
      );
    }

    return this._request
      .get(`${this._baseUrl}/assets/${assetId}`)
      .then((asset) => toCamelCase(asset));
  }

  /**
   * Get a list of all assets
   *
   * API Endpoint: '/assets'
   * Method: GET
   *
   * @param {PaginationOptions} [paginationOptions]
   *
   * @returns {Promise}
   * @fulfill {AssetsFromServer}
   * @reject {Error}
   *
   * @example
   * contxtSdk.assets
   *   .getAll()
   *   .then((assets) => console.log(assets))
   *   .catch((err) => console.log(err));
   */
  getAll(paginationOptions) {
    return this._request
      .get(`${this._baseUrl}/assets`, {
        params: toSnakeCase(paginationOptions)
      })
      .then((assetsData) => formatPaginatedDataFromServer(assetsData));
  }

  /**
   * Get a list of all assets that belong to a particular organization
   *
   * API Endpoint: '/organizations/:organizationId/assets'
   * Method: GET
   *
   * @param {string} organizationId UUID corresponding with an organization
   * @param {Object} [options] Object containing parameters to be called with the request
   * @param {string} [options.assetTypeId] UUID of the asset type to use for filtering
   * @param {Number} [options.limit] Maximum number of records to return per query
   * @param {Number} [options.offset] How many records from the first record to start
   *
   * @returns {Promise}
   * @fulfill {AssetsFromServer}
   * @reject {Error}
   *
   * @example
   * contxtSdk.assets
   *   .getAllByOrganizationId('53fba880-70b7-47a2-b4e3-ad9ecfb67d5c', {
   *     assetTypeId: '4f0e51c6-728b-4892-9863-6d002e61204d'
   *   })
   *   .then((assets) => console.log(assets))
   *   .catch((err) => console.log(err));
   */
  getAllByOrganizationId(organizationId, options) {
    if (!organizationId) {
      return Promise.reject(
        new Error(
          "An organization ID is required for getting a list of an organization's assets."
        )
      );
    }

    const params = toSnakeCase(options);

    return this._request
      .get(`${this._baseUrl}/organizations/${organizationId}/assets`, {
        params
      })
      .then((assetsData) => formatPaginatedDataFromServer(assetsData));
  }

  /**
   * Updates an asset's data
   *
   * API Endpoint: '/assets/:assetId'
   * Method: PUT
   *
   * @param {string} assetId The ID of the asset to update (formatted as a UUID)
   * @param {Object} update An object containing the updated data for the asset
   * @param {string} update.description
   *
   * @example
   * contxtSdk.assets
   *   .update({
   *     description: 'A new description'
   *   })
   *   .then((asset) => console.log(asset))
   *   .catch((err) => console.log(err));
   */
  update(assetId, update) {
    if (!assetId) {
      return Promise.reject(
        new Error('An asset ID is required to update an asset.')
      );
    }

    if (!update) {
      return Promise.reject(
        new Error('An update is required to update an asset.')
      );
    }

    if (!isPlainObject(update)) {
      return Promise.reject(
        new Error(
          'The asset update must be a well-formed object with the data you wish to update.'
        )
      );
    }

    const formattedUpdate = toSnakeCase(update, {
      excludeKeys: ['assetTypeId', 'id', 'label', 'organizationId']
    });

    return this._request
      .put(`${this._baseUrl}/assets/${assetId}`, formattedUpdate)
      .then((asset) => toCamelCase(asset));
  }
}

export default Assets;

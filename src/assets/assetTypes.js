import has from 'lodash.has';
import isPlainObject from 'lodash.isplainobject';
import { toCamelCase, toSnakeCase } from '../utils/objects';
import { formatPaginatedDataFromServer } from '../utils/pagination';

/**
 * @typedef {Object} AssetType
 * @property {string} createdAt ISO 8601 Extended Format date/time string
 * @property {string} description
 * @property {string} id UUID
 * @property {string} label
 * @property {string} organizationId UUID corresponding with the organization
 * @property {string} updatedAt ISO 8601 Extended Format date/time string
 */

/**
 * @typedef {Object} AssetTypesFromServer
 * @property {Object} _metadata Metadata about the pagination settings
 * @property {number} _metadata.offset Offset of records in subsequent queries
 * @property {number} _metadata.totalRecords Total number of asset types found
 * @property {AssetType[]} records
 */

/**
 * Module that provides access to, and the manipulation of, information about different asset types
 *
 * @typicalname contxtSdk.assets.types
 */
class AssetTypes {
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
   * Creates a new asset type
   *
   * API Endpoint: '/assets/types'
   * Method: POST
   *
   * @param {Object} assetType
   * @param {string} assetType.description
   * @param {string} assetType.label
   * @param {string} assetType.organizationId The ID of the asset type's parent organization. Can be
   *   explicitly set to `null` to create a global asset type
   *
   * @returns {Promise}
   * @fulfill {AssetType} Information about the new asset type
   * @reject {Error}
   *
   * @example
   * contxtSdk.assets.types
   *   .create({
   *     description: 'A physicial facility building',
   *     label: 'Facility',
   *     organizationId: 'b47e45af-3e18-408a-8070-008f9e6d7b42'
   *   })
   *   .then((assetType) => console.log(assetType))
   *   .catch((err) => console.log(err));
   */
  create(assetType = {}) {
    const hasFieldFns = {
      default: (object, key) => !!object[key],
      organizationId: (object, key) => has(object, key)
    };
    const requiredFields = ['description', 'label', 'organizationId'];

    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      const hasField = hasFieldFns[field] || hasFieldFns.default;

      if (!hasField(assetType, field)) {
        return Promise.reject(
          new Error(`A ${field} is required to create a new asset type.`)
        );
      }
    }

    return this._request
      .post(`${this._baseUrl}/assets/types`, toSnakeCase(assetType))
      .then((assetType) => toCamelCase(assetType));
  }

  /**
   * Deletes an asset type
   *
   * API Endpoint: '/assets/types/:assetTypeId'
   * Method: DELETE
   *
   * @param {string} assetTypeId The ID of the asset type (formatted as a UUID)
   *
   * @returns {Promise}
   * @fulfill {undefined}
   * @reject {Error}
   *
   * @example
   * contxtSdk.assets.types.delete('4f0e51c6-728b-4892-9863-6d002e61204d')
   */
  delete(assetTypeId) {
    if (!assetTypeId) {
      return Promise.reject(
        new Error('An asset type ID is required for deleting an asset type.')
      );
    }

    return this._request.delete(`${this._baseUrl}/assets/types/${assetTypeId}`);
  }

  /**
   * Gets information about an asset type
   *
   * API Endpoint: '/assets/types/:assetTypeId'
   * Method: GET
   *
   * @param {string} assetTypeId The ID of the asset type (formatted as a UUID)
   *
   * @returns {Promise}
   * @fulfill {AssetType} Information about the asset type
   * @reject {Error}
   *
   * @example
   * contxtSdk.assets.types
   *   .get('4f0e51c6-728b-4892-9863-6d002e61204d')
   *   .then((assetType) => console.log(assetType))
   *   .catch((err) => console.log(err));
   */
  get(assetTypeId) {
    if (!assetTypeId) {
      return Promise.reject(
        new Error(
          'An asset type ID is required for getting information about an asset type.'
        )
      );
    }

    return this._request
      .get(`${this._baseUrl}/assets/types/${assetTypeId}`)
      .then((assetType) => toCamelCase(assetType));
  }

  /**
   * Gets a list of all asset types
   *
   * API Endpoint: '/assets/types/
   * Method: GET
   *
   * @param {PaginationOptions} [paginationOptions]
   *
   * @returns {Promise}
   * @fulfill {AssetTypesFromServer}
   * @reject {Error}
   *
   * @example
   * contxtSdk.assets.types
   *   .getAll()
   *   .then((assetTypes) => console.log(assetTypes))
   *   .catch((err) => console.log(err));
   */
  getAll(paginationOptions) {
    return this._request
      .get(`${this._baseUrl}/assets/types`, {
        params: toSnakeCase(paginationOptions)
      })
      .then((assetTypesData) => formatPaginatedDataFromServer(assetTypesData));
  }

  /**
   * Gets a list of all asset types that belong to a particular organization
   *
   * API Endpoint: '/organizations/:organizationId/assets/types'
   * Method: GET
   *
   * @param {string} organizationId UUID corresponding with an organization
   * @param {PaginationOptions} [paginationOptions]
   *
   * @returns {Promise}
   * @fulfill {AssetTypesFromServer}
   * @reject {Error}
   *
   * @example
   * contxtSdk.assets.types
   *   .getAllByOrganizationId('53fba880-70b7-47a2-b4e3-ad9ecfb67d5c')
   *   .then((assetTypes) => console.log(assetTypes))
   *   .catch((err) => console.log(assetTypes));
   */
  getAllByOrganizationId(organizationId, paginationOptions) {
    if (!organizationId) {
      return Promise.reject(
        new Error(
          "An organization ID is required for getting a list of an organization's asset types."
        )
      );
    }

    return this._request
      .get(`${this._baseUrl}/organizations/${organizationId}/assets/types`, {
        params: toSnakeCase(paginationOptions)
      })
      .then((assetTypesData) => formatPaginatedDataFromServer(assetTypesData));
  }

  /**
   * Updates an asset type's data
   *
   * API Endpoint: '/assets/types/:assetTypeId'
   * Method: PUT
   *
   * @param {string} assetTypeId The ID of the asset type to update (formatted as a UUID)
   * @param {Object} update An object containing the updated data for the asset type
   * @param {string} update.description
   *
   * @returns {Promise}
   * @fulfill {undefined}
   * @reject {Error}
   *
   * @example
   * contxtSdk.assets.types
   *   .update('5f310899-d8f9-4dac-ae82-cedb2048a8ef', {
   *     description: 'A physical facility building'
   *   });
   */
  update(assetTypeId, update) {
    if (!assetTypeId) {
      return Promise.reject(
        new Error('An asset type ID is required to update an asset type.')
      );
    }

    if (!update) {
      return Promise.reject(
        new Error('An update is required to update an asset type.')
      );
    }

    if (!isPlainObject(update)) {
      return Promise.reject(
        new Error(
          'The asset type update must be a well-formed object with the data you wish to update.'
        )
      );
    }

    const formattedUpdate = toSnakeCase(update, {
      excludeKeys: ['id', 'label', 'organizationId']
    });

    return this._request.put(
      `${this._baseUrl}/assets/types/${assetTypeId}`,
      formattedUpdate
    );
  }
}

export default AssetTypes;

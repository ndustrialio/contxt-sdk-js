import isPlainObject from 'lodash.isplainobject';
import {
  formatAssetAttributeDataFromServer,
  formatAssetAttributeFromServer,
  formatAssetAttributeToServer,
  formatAssetAttributeValueFromServer,
  formatAssetAttributeValueToServer
} from '../utils/assets';

/**
 * @typedef {Object} AssetAttribute
 * @property {string} assetTypeId UUID corresponding with the asset type
 * @property {string} createdAt ISO 8601 Extended Format date/time string
 * @property {string} description
 * @property {string} id UUID
 * @property {boolean} isRequired
 * @property {string} label
 * @property {string} organizationId UUID corresponding with the organization
 * @property {string} [units]
 * @property {string} updatedAt ISO 8601 Extended Format date/time string
 */

/**
 * @typedef {Object} AssetAttributeData
 * @property {Object} _metadata Metadata about the pagination settings
 * @property {number} _metadata.offset Offset of records in subsequent queries
 * @property {number} _metadata.totalRecords Total number of asset attributes found
 * @property {AssetAttribute[]} records
 */

/**
 * @typedef {Object} AssetAttributeValue
 * @property {string} assetId UUID corresponding to the asset
 * @property {string} assetAttributeId UUID corresponding to the asset attribute
 * @property {string} createdAt ISO 8601 Extended Format date/time string
 * @property {string} effectiveDate ISO 8601 Extended Format date/time string
 * @property {string} id UUID
 * @property {string} [notes]
 * @property {string} updatedAt ISO 8601 Extended Format date/time string
 * @property {string} value
 */

/**
 * Module that provides access to, and the manipulation of, information about
 * different asset attributes and their values
 *
 * @typicalname contxtSdk.assets.attributes
 */
class AssetAttributes {
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
   * Creates a new asset attribute
   *
   * API Endpoint: '/assets/types/:assetTypeId/attributes'
   * Method: POST
   *
   * @param {string} assetTypeId The ID of the asset type (formatted as a UUID)
   * @param {Object} assetAttribute
   * @param {string} assetAttribute.description
   * @param {boolean} [assetAttribute.isRequired]
   * @param {string} assetAttribute.label
   * @param {string} assetAttribute.organizationId
   * @param {string} [assetAttribute.units]
   *
   * @returns {Promise}
   * @fulfill {AssetAttribute}
   * @reject {Error}
   *
   * @example
   * contxtSdk.assets.attributes
   *   .create('4f0e51c6-728b-4892-9863-6d002e61204d', {
   *     description: 'Square footage of a facility',
   *     isRequired: true,
   *     label: 'Square Footage',
   *     organizationId: 'b47e45af-3e18-408a-8070-008f9e6d7b42',
   *     units: 'sqft'
   *   })
   *   .then((assetAttribute) => console.log(assetAttribute))
   *   .catch((err) => console.log(err));
   */
  create(assetTypeId, assetAttribute = {}) {
    const requiredFields = ['description', 'label', 'organizationId'];

    if (!assetTypeId) {
      return Promise.reject(
        new Error(
          'An asset type ID is required to create a new asset attribute.'
        )
      );
    }

    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];

      if (!assetAttribute[field]) {
        return Promise.reject(
          new Error(`A ${field} is required to create a new asset attribute.`)
        );
      }
    }

    const data = formatAssetAttributeToServer(assetAttribute);

    return this._request
      .post(`${this._baseUrl}/assets/types/${assetTypeId}/attributes`, data)
      .then((assetAttribute) => formatAssetAttributeFromServer(assetAttribute));
  }

  /**
   * Deletes an asset attribute
   *
   * API Endpoint: '/assets/attributes/:assetAttributeId'
   * Method: DELETE
   *
   * @param {string} assetAttributeId The ID of the asset attribute (formatted as a UUID)
   *
   * @returns {Promise}
   * @fulfill {undefined}
   * @reject {Error}
   *
   * @example
   * contxtSdk.assets.attributes.delete('c7f927c3-11a7-4024-9269-e1231baeb765');
   */
  delete(assetAttributeId) {
    if (!assetAttributeId) {
      return Promise.reject(
        new Error(
          'An asset attribute ID is required for deleting an asset attribute.'
        )
      );
    }

    return this._request.delete(
      `${this._baseUrl}/assets/attributes/${assetAttributeId}`
    );
  }

  /**
   * Gets information about an asset attribute
   *
   * API Endpoint: '/assets/attributes/:assetAttributeId'
   * Method: GET
   *
   * @param {string} assetAttributeId The ID of the asset attribute (formatted as a UUID)
   *
   * @returns {Promise}
   * @fulfill {AssetAttribute}
   * @reject {Error}
   *
   * @example
   * contxtSdk.assets.attributes
   *   .get('c7f927c3-11a7-4024-9269-e1231baeb765')
   *   .then((assetAttribute) => console.log(assetAttribute))
   *   .catch((err) => console.log(err));
   */
  get(assetAttributeId) {
    if (!assetAttributeId) {
      return Promise.reject(
        new Error(
          'An asset attribute ID is required for getting information about an asset attribute.'
        )
      );
    }

    return this._request
      .get(`${this._baseUrl}/assets/attributes/${assetAttributeId}`)
      .then((assetAttribute) => formatAssetAttributeFromServer(assetAttribute));
  }

  /**
   * Gets a list of asset attributes for a specific asset type
   *
   * API Endpoint: '/assets/types/:assetTypeId/attributes'
   * Method: GET
   *
   * @param {string} assetTypeId The ID of the asset type (formatted as a UUID)
   *
   * @returns {Promise}
   * @fulfill {AssetAttributeData}
   * @reject {Error}
   *
   * @example
   * contxtSdk.assets.attributes
   *   .getAll('4f0e51c6-728b-4892-9863-6d002e61204d')
   *   .then((assetAttributesData) => console.log(assetAttributesData))
   *   .catch((err) => console.log(err));
   */
  getAll(assetTypeId) {
    if (!assetTypeId) {
      return Promise.reject(
        new Error(
          'An asset type ID is required to get a list of all asset attributes.'
        )
      );
    }

    return this._request
      .get(`${this._baseUrl}/assets/types/${assetTypeId}/attributes`)
      .then((assetAttributeData) =>
        formatAssetAttributeDataFromServer(assetAttributeData)
      );
  }

  /**
   * Updates an asset attribute
   *
   * API Endpoint: '/assets/attributes/:assetAttributeId'
   * Method: PUT
   *
   * @param {string} assetAttributeId The ID of the asset attribute to update (formatted as a UUID)
   * @param {Object} update An object containing the updated data for the asset attribute
   * @param {string} [update.description]
   * @param {boolean} [update.isRequired]
   * @param {string} [update.label]
   * @param {string} [update.units]
   *
   * @returns {Promise}
   * @fulfill {undefined}
   * @reject {Error}
   *
   * @example
   * contxtSdk.assets.attributes
   *   .update('c7f927c3-11a7-4024-9269-e1231baeb765', {
   *     description: 'Temperature of a facility',
   *     isRequired: false,
   *     label: 'Temperature',
   *     units: 'Celsius'
   *   });
   */
  update(assetAttributeId, update) {
    if (!assetAttributeId) {
      return Promise.reject(
        new Error(
          'An asset attribute ID is required to update an asset attribute.'
        )
      );
    }

    if (!update) {
      return Promise.reject(
        new Error('An update is required to update an asset attribute.')
      );
    }

    if (!isPlainObject(update)) {
      return Promise.reject(
        new Error(
          'The asset attribute update must be a well-formed object with the data you wish to update.'
        )
      );
    }

    const formattedUpdate = formatAssetAttributeToServer(update);

    return this._request.put(
      `${this._baseUrl}/assets/attributes/${assetAttributeId}`,
      formattedUpdate
    );
  }

  /**
   * Creates a new asset attribute value
   *
   * API Endpoint: '/assets/:assetId/values'
   * Method: POST
   *
   * @param {string} assetId The ID of the asset type (formatted as a UUID)
   * @param {Object} assetAttributeValue
   * @param {string} assetAttributeValue.assetAttributeId UUID corresponding to the asset attribute
   * @param {string} assetAttributeValue.effectiveDate ISO 8601 Extended Format date/time string
   * @param {string} assetAttributeValue.notes
   * @param {string} assetAttributeValue.value
   *
   * @returns {Promise}
   * @fulfill {AssetAttributeValue}
   * @reject {Error}
   *
   * @example
   * contxtSdk.assets.attributes
   *   .createValue('2140cc2e-6d13-42ee-9941-487fe98f8e2d', {
   *     assetAttributeId: 'cca11baa-cf7d-44c0-9d0a-6ad73d5f30cb',
   *     effectiveDate: '2018-07-09T14:36:36.004Z',
   *     notes: 'Iure delectus non sunt a voluptates pariatur fuga.',
   *     value: '2206'
   *   })
   *   .then((assetAttributeValue) => console.log(assetAttributeValue))
   *   .catch((err) => console.log(err));
   */
  createValue(assetId, assetAttributeValue = {}) {
    const requiredFields = ['assetAttributeId', 'effectiveDate', 'value'];

    if (!assetId) {
      return Promise.reject(
        new Error(
          'An asset ID is required to create a new asset attribute value.'
        )
      );
    }

    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];

      if (!assetAttributeValue[field]) {
        return Promise.reject(
          new Error(
            `A ${field} is required to create a new asset attribute value.`
          )
        );
      }
    }

    const data = formatAssetAttributeValueToServer(assetAttributeValue);

    return this._request
      .post(`${this._baseUrl}/assets/${assetId}/values`, data)
      .then((assetAttributeValue) =>
        formatAssetAttributeValueFromServer(assetAttributeValue)
      );
  }

  /**
   * Deletes an asset attribute value
   *
   * API Endpoint: '/assets/attributes/values/:assetAttributeValueId'
   * Method: DELETE
   *
   * @param {string} assetAttributeValueId The ID of the asset attribute value (formatted as a UUID)
   *
   * @returns {Promise}
   * @fulfill {undefined}
   * @reject {Error}
   *
   * @example
   * contxtSdk.assets.attributes.deleteValue(
   *   'f4cd0d84-6c61-4d19-9322-7c1ab226dc83'
   * );
   */
  deleteValue(assetAttributeValueId) {
    if (!assetAttributeValueId) {
      return Promise.reject(
        new Error(
          'An asset attribute value ID is required for deleting an asset attribute value.'
        )
      );
    }

    return this._request.delete(
      `${this._baseUrl}/assets/attributes/values/${assetAttributeValueId}`
    );
  }

  /**
   * Gets a list of all asset attribute values
   */
  getAllValues() {}

  /**
   * Updates an asset attribute value
   *
   * API Endpoint: '/assets/attributes/values/:assetAttributeValueId'
   * Method: PUT
   *
   * @param {string} assetAttributeId The ID of the asset attribute to update (formatted as a UUID)
   * @param {Object} update An object containing the updated data for the asset attribute value
   * @param {string} [update.effectiveDate] ISO 8601 Extended Format date/time string
   * @param {string} [update.notes]
   * @param {string} [update.value]
   *
   * @returns {Promise}
   * @fulfill {undefined}
   * @reject {Error}
   *
   * @example
   * contxtSdk.assets.attributes
   *   .updateValue('2140cc2e-6d13-42ee-9941-487fe98f8e2d', {
   *     effectiveDate: '2018-07-10T11:04:24.631Z',
   *     notes: 'Dolores et sapiente sunt doloribus aut in.',
   *     value: '61456'
   *   })
   *   .catch((err) => console.log(err));
   */
  updateValue(assetAttributeValueId, update) {
    if (!assetAttributeValueId) {
      return Promise.reject(
        new Error(
          'An asset attribute value ID is required to update an asset attribute value.'
        )
      );
    }

    if (!update) {
      return Promise.reject(
        new Error('An update is required to update an asset attribute value.')
      );
    }

    if (!isPlainObject(update)) {
      return Promise.reject(
        new Error(
          'The asset attribute value update must be a well-formed object with the data you wish to update.'
        )
      );
    }

    const formattedUpdate = formatAssetAttributeValueToServer(update);

    return this._request.put(
      `${this._baseUrl}/assets/attributes/values/${assetAttributeValueId}`,
      formattedUpdate
    );
  }
}

export default AssetAttributes;

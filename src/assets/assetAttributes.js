import has from 'lodash.has';
import isPlainObject from 'lodash.isplainobject';
import { toCamelCase, toSnakeCase } from '../utils/objects';
import { formatPaginatedDataFromServer } from '../utils/pagination';

/**
 * @typedef {Object} PaginationMetadata
 * @property {number} offset Offset of records in subsequent queries
 * @property {number} totalRecords Total number of asset attributes found
 */

/**
 * @typedef {Object} PaginationOptions
 * @property {Number} limit Maximum number of records to return per query
 * @property {Number} offset How many records from the first record to start
 *   the query
 */

/**
 * @typedef {Object} AssetAttribute
 * @property {string} assetTypeId UUID corresponding with the asset type
 * @property {string} createdAt ISO 8601 Extended Format date/time string
 * @property {string} dataType Data Type of attribute with options "boolean", "date", "number", "string"
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
 * @property {PaginationMetadata} _metadata Metadata about the pagination settings
 * @property {AssetAttribute[]} records
 */

/**
 * @typedef {Object} AssetAttributeValue
 * @property {Object} [asset] The associated parent asset. Will always be
 *   present if retrieving more than one AssetAttributeValue.
 * @property {string} [asset.label] Label of the parent asset. Will always be
 *   present if retrieving more than one AssetAttributeValue.
 * @property {Object} [assetAttribute] The associated parent assetAttribute.
 *   Will always be present if retrieving more than one AssetAttributeValue.
 * @property {boolean} [assetAttribute.isRequired] Indication of required status
 *   for the parent asset attribute. Will always be present if retrieving more
 *   than one AssetAttributeValue.
 * @property {string} [assetAttribute.label] Label of the parent assetAttribute.
 *   Will always be present if retrieving more than one AssetAttributeValue.
 * @property {string} [assetAttribute.units] Units of the parent assetAttribute.
 *   Will always be present if retrieving more than one AssetAttributeValue.
 * @property {string} assetAttributeId UUID corresponding to the assetAttribute
 * @property {string} assetId UUID corresponding to the asset
 * @property {string} createdAt ISO 8601 Extended Format date/time string
 * @property {string} effectiveDate ISO 8601 Extended Format date/time string
 * @property {string} id UUID
 * @property {string} [notes]
 * @property {string} updatedAt ISO 8601 Extended Format date/time string
 * @property {string} value
 */

/**
 * @typedef {Object} AssetAttributeValueData
 * @property {PaginationMetadata} _metadata Metadata about the pagination settings
 * @property {AssetAttributeValue[]} records
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
   * @param {string} assetAttribute.dataType
   * @param {string} assetAttribute.description
   * @param {boolean} [assetAttribute.isRequired]
   * @param {string} assetAttribute.label
   * @param {string} assetAttribute.organizationId Can be explicitly set to `null` to create a global attribute
   * @param {string} [assetAttribute.units]
   *
   * @returns {Promise}
   * @fulfill {AssetAttribute}
   * @reject {Error}
   *
   * @example
   * contxtSdk.assets.attributes
   *   .create('4f0e51c6-728b-4892-9863-6d002e61204d', {
   *     dataType: 'boolean',
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
    const hasFieldFns = {
      default: (object, key) => !!object[key],
      organizationId: (object, key) => has(object, key)
    };

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
      const hasField = hasFieldFns[field] || hasFieldFns.default;

      if (!hasField(assetAttribute, field)) {
        return Promise.reject(
          new Error(`A ${field} is required to create a new asset attribute.`)
        );
      }
    }

    return this._request
      .post(
        `${this._baseUrl}/assets/types/${assetTypeId}/attributes`,
        toSnakeCase(assetAttribute)
      )
      .then((assetAttribute) => toCamelCase(assetAttribute));
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
      .then((assetAttribute) => toCamelCase(assetAttribute));
  }

  /**
   * Gets a list of asset attributes for a specific asset type
   *
   * API Endpoint: '/assets/types/:assetTypeId/attributes'
   * Method: GET
   *
   * @param {string} assetTypeId The ID of the asset type (formatted as a UUID)
   * @param {PaginationOptions} [paginationOptions]
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
  getAll(assetTypeId, paginationOptions) {
    if (!assetTypeId) {
      return Promise.reject(
        new Error(
          'An asset type ID is required to get a list of all asset attributes.'
        )
      );
    }

    return this._request
      .get(`${this._baseUrl}/assets/types/${assetTypeId}/attributes`, {
        params: toSnakeCase(paginationOptions)
      })
      .then((assetAttributeData) =>
        formatPaginatedDataFromServer(assetAttributeData)
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
   * @param {string} [update.dataType]
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
   *     dataType: 'boolean',
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

    const formattedUpdate = toSnakeCase(update, {
      excludeKeys: ['assetTypeId', 'id', 'organizationId']
    });

    return this._request.put(
      `${this._baseUrl}/assets/attributes/${assetAttributeId}`,
      formattedUpdate
    );
  }

  /**
   * Creates a new asset attribute value
   *
   * API Endpoint: '/assets/:assetId/attributes/:assetAttributeId/values'
   * Method: POST
   *
   * @param {string} assetId The ID of the asset type (formatted as a UUID)
   * @param {Object} assetAttributeValue
   * @param {string} assetAttributeValue.assetAttributeId UUID corresponding to the asset attribute
   * @param {string} assetAttributeValue.effectiveDate ISO 8601 Extended Format date/time string
   * @param {string} [assetAttributeValue.notes]
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

    return this._request
      .post(
        `${this._baseUrl}/assets/${assetId}/attributes/${
          assetAttributeValue.assetAttributeId
        }/values`,
        toSnakeCase(assetAttributeValue)
      )
      .then((assetAttributeValue) => toCamelCase(assetAttributeValue));
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
   * Gets the effective attribute values for a particular asset
   *
   * API Endpoint: '/assets/:assetId/attributes/values'
   * Method: GET
   *
   * @param {String} assetId The ID of the asset for which you are looking up
   *   attribute values  (formatted as a UUID)
   * @param {Object} [assetAttributeFilters] Specific information that is used to
   *   filter the list of asset attribute values
   * @param {String} [assetAttributeFilters.attributeLabel] Label of the parent
   *   asset attribute
   * @param {String} [assetAttributeFilters.effectiveDate = (new Date()).toISOString()] Effective
   *   date of the asset attribute values
   *
   * @returns {Promise}
   * @fulfill {AssetAttributeValue[]}
   * @rejects {Error}
   *
   * @example
   * contxtSdk.assets.attributes
   *   .getEffectiveValuesByAssetId('d7329ef3-ca63-4ad5-bb3e-632b702584f8', {
   *     attributeLabel: 'Square Footage',
   *     effectiveDate: '2018-07-11T19:14:49.715Z'
   *   })
   *   .then((assetAttributeValues) => {
   *     console.log(assetAttributeValues);
   *   })
   *   .catch((err) => console.log(err));
   */
  getEffectiveValuesByAssetId(assetId, assetAttributeFilters) {
    if (!assetId) {
      return Promise.reject(
        new Error(
          'An asset ID is required to get a list of asset attribute values.'
        )
      );
    }

    return this._request
      .get(`${this._baseUrl}/assets/${assetId}/attributes/values`, {
        params: toSnakeCase(assetAttributeFilters)
      })
      .then((assetAttributeValues) => toCamelCase(assetAttributeValues));
  }

  /**
   * Gets a paginated list of effective asset attribute values for an
   * organization.
   *
   * API Endpoint: '/organizations/:organizationId/attributes/values'
   * Method: GET
   *
   * @param {String} organizationId UUID corresponding with an organization
   * @param {PaginationOptions} [paginationOptions]
   *
   * @returns {Promise}
   * @fulfill {AssetAttributeValueData}
   * @rejects {Error}
   *
   * @example
   * contxtSdk.assets.attributes
   *   .getValuesByAttributeId(
   *     '53fba880-70b7-47a2-b4e3-ad9ecfb67d5c',
   *     {
   *       limit: 100,
   *       offset: 0
   *     }
   *   )
   *   .then((assetAttributeValuesData) => {
   *     console.log(assetAttributeValuesData);
   *   })
   *   .catch((err) => console.log(err));
   */
  getEffectiveValuesByOrganizationId(organizationId, paginationOptions) {
    if (!organizationId) {
      return Promise.reject(
        new Error(
          'An organization ID is required to get a list of asset attribute values.'
        )
      );
    }

    return this._request
      .get(
        `${this._baseUrl}/organizations/${organizationId}/attributes/values`,
        { params: toSnakeCase(paginationOptions) }
      )
      .then((assetAttributeValueData) =>
        formatPaginatedDataFromServer(assetAttributeValueData)
      );
  }

  /**
   * Gets a paginated list of asset attribute values for a particular attribute
   * of a particular asset
   *
   * API Endpoint: '/assets/:assetId/attributes/:attributeId/values'
   * Method: GET
   *
   * @param {String} assetId The ID of the asset for which you are looking up
   *   attribute values  (formatted as a UUID)
   * @param {String} assetAttributeId The ID of the asset attribute for which you are
   *   looking up attribute values (formatted as a UUID)
   * @param {PaginationOptions} [paginationOptions]
   *
   * @returns {Promise}
   * @fulfill {AssetAttributeValueData}
   * @rejects {Error}
   *
   * @example
   * contxtSdk.assets.attributes
   *   .getValuesByAttributeId(
   *     'a4d80a97-cbf6-453b-bab5-0477e1ede04f',
   *     'c2779610-44d7-4313-aea2-96cce58d6efd',
   *     {
   *       limit: 100,
   *       offset: 0
   *     }
   *   )
   *   .then((assetAttributeValuesData) => {
   *     console.log(assetAttributeValuesData);
   *   })
   *   .catch((err) => console.log(err));
   */
  getValuesByAttributeId(assetId, assetAttributeId, paginationOptions) {
    if (!assetId) {
      return Promise.reject(
        new Error(
          'An asset ID is required to get a list of asset attribute values.'
        )
      );
    }

    if (!assetAttributeId) {
      return Promise.reject(
        new Error(
          'An asset attribute ID is required to get a list of asset attribute values.'
        )
      );
    }

    return this._request
      .get(
        `${
          this._baseUrl
        }/assets/${assetId}/attributes/${assetAttributeId}/values`,
        { params: toSnakeCase(paginationOptions) }
      )
      .then((assetAttributeValueData) =>
        formatPaginatedDataFromServer(assetAttributeValueData)
      );
  }

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

    const formattedUpdate = toSnakeCase(update, {
      excludeKeys: ['assetAttributeId', 'assetId', 'id']
    });

    return this._request.put(
      `${this._baseUrl}/assets/attributes/values/${assetAttributeValueId}`,
      formattedUpdate
    );
  }
}

export default AssetAttributes;

import isPlainObject from 'lodash.isplainobject';
import { toCamelCase, toSnakeCase } from '../utils/objects';
import { formatPaginatedDataFromServer } from '../utils/pagination';

/**
 * @typedef {Object} FieldCategory
 * @property {String} description
 * @property {String} id UUID
 * @property {String} name
 * @property {String} organizationId
 * @property {String} [parentCategoryId] UUID
 */

/**
 * @typedef {Object} FieldCategoriesFromServer
 * @property {Object} _metadata Metadata about the pagination settings
 * @property {number} _metadata.offset Offset of records in subsequent queries
 * @property {number} _metadata.totalRecords Total number of asset types found
 * @property {FieldCategory[]} records
 */

/**
 * Module that provides access to field category information
 *
 * @typicalname contxtSdk.iot.fieldCategories
 */
class FieldCategories {
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
   * Create a field category
   *
   * API Endpoint: '/categories'
   * Method: POST
   *
   * @param {Object} fieldCategory
   * @param {string} fieldCategory.description
   * @param {string} fieldCategory.name
   * @param {string} fieldCategory.organizationId
   * @param {string} [fieldCategory.parentCategoryId]
   *
   * @returns {Promise}
   * @fulfill {FieldCategory} Information about the field category
   * @reject {Error}
   *
   * @example
   * contxtSdk.iot.fieldCategories
   *   .create({
   *      description: 'Compressors in Room 2',
   *      name: 'Room 2',
   *      organizationId: '8a3cb818-0889-4674-b871-7ceadaecd26a',
   *      parentCategoryId: 'e9f8f89c-609c-4c83-8ebc-cea928af661e'
   *   })
   *   .then((fieldCategory) => console.log(fieldCategory))
   *   .catch((err) => console.log(err));
   */
  create(fieldCategory) {
    const requiredFields = ['name', 'description', 'organizationId'];

    for (let i = 0; requiredFields.length > i; i++) {
      const field = requiredFields[i];
      if (!fieldCategory[field]) {
        return Promise.reject(
          new Error(`A ${field} is required to create a new field category.`)
        );
      }
    }

    const formattedCategory = toSnakeCase(fieldCategory);

    return this._request
      .post(`${this._baseUrl}/categories`, formattedCategory)
      .then((fieldCategory) => toCamelCase(fieldCategory));
  }

  /**
   * Deletes a field category
   *
   * API Endpoint: '/categories/:categoryId'
   * Method: DELETE
   *
   * @param {String} categoryId The UUID of a field category
   *
   * @returns {Promise}
   * @fulfill {undefined}
   * @reject {Error}
   *
   * @example
   * contxtSdk.iot.fieldCategories
   *   .delete('b3dbaae3-25dd-475b-80dc-66296630a8d0');
   */
  delete(categoryId) {
    if (!categoryId) {
      return Promise.reject(
        new Error('A categoryId is required for deleting a field category.')
      );
    }

    return this._request.delete(`${this._baseUrl}/categories/${categoryId}`);
  }

  /**
   * Gets information about a field category
   *
   * API Endpoint: '/categories/:categoryId'
   * Method: GET
   *
   * @param {String} categoryId The UUID of a field category
   *
   * @returns {Promise}
   * @fulfill {FieldCategory} Information about the field category
   * @reject {Error}
   *
   * @example
   * contxtSdk.iot.fieldCategories
   *   .get('b3dbaae3-25dd-475b-80dc-66296630a8d0')
   *   .then((fieldCategory) => console.log(fieldCategory))
   *   .catch((err) => console.log(err));
   */
  get(categoryId) {
    if (!categoryId) {
      return Promise.reject(
        new Error(
          'A categoryId is required for getting information about a field category.'
        )
      );
    }

    return this._request
      .get(`${this._baseUrl}/categories/${categoryId}`)
      .then((fieldCategory) => toCamelCase(fieldCategory));
  }

  /**
   * Get a listing of all field categories available to the user.
   *
   * API Endpoint: '/categories'
   * Method: GET
   *
   * @param {PaginationOptions} [paginationOptions]
   *
   * @returns {Promise}
   * @fulfill {FieldCategoriesFromServer} Information about the field categories
   * @reject {Error}
   *
   * @example
   * contxtSdk.iot.fieldCategories
   *   .getAll()
   *   .then((fieldCategories) => console.log(fieldCategories))
   *   .catch((err) => console.log(err));
   */
  getAll(paginationOptions) {
    return this._request
      .get(`${this._baseUrl}/categories`, {
        params: toSnakeCase(paginationOptions)
      })
      .then((fieldCategories) =>
        formatPaginatedDataFromServer(fieldCategories)
      );
  }

  /**
   * Get a listing of all field categories for a given facility ID.
   *
   * API Endpoint: '/facilities/:facilityId/categories'
   * Method: GET
   *
   * @param {String} facilityId
   *
   * @returns {Promise}
   * @fulfill {FieldCategory[]} Information about the field categories
   * @reject {Error}
   *
   * @example
   * contxtSdk.iot.fieldCategories
   *   .getAllByFacility(187)
   *   .then((fieldCategories) => console.log(fieldCategories))
   *   .catch((err) => console.log(err));
   */
  getAllByFacility(facilityId) {
    if (!facilityId) {
      return Promise.reject(
        new Error(
          'A facilityId is required for getting field categories by facility.'
        )
      );
    }

    return this._request
      .get(`${this._baseUrl}/facilities/${facilityId}/categories`)
      .then((fieldCategories) => toCamelCase(fieldCategories));
  }

  /**
   * Updates information about a field category
   *
   * API Endpoint: '/categories/:categoryId'
   * Method: PUT
   *
   * @param {String} categoryId The UUID of a field category
   * @param {Object} update
   * @param {string} [update.description]
   * @param {string} [update.name]
   * @param {string} [update.parentCategoryId]
   *
   * @returns {Promise}
   * @fulfill {FieldCategory} Information about the field category
   * @reject {Error}
   *
   * @example
   * contxtSdk.iot.fieldCategories
   *   .update('b3dbaae3-25dd-475b-80dc-66296630a8d0', {
   *      description: 'Power usage from all compressors in Room 2',
   *      parentCategoryId: 'e9f8f89c-609c-4c83-8ebc-cea928af661e',
   *      name: 'Room 2 Compressors'
   *   })
   *   .then((fieldCategory) => console.log(fieldCategory))
   *   .catch((err) => console.log(err));
   */
  update(categoryId, update) {
    if (!categoryId) {
      return Promise.reject(
        new Error(
          'A categoryId is required for updating information about a field category.'
        )
      );
    }

    if (!update) {
      return Promise.reject(
        new Error('An update is required to update a field category')
      );
    }

    if (!isPlainObject(update)) {
      return Promise.reject(
        new Error(
          'The field category update must be a well-formed object with the data you wish to update.'
        )
      );
    }

    const formattedUpdate = toSnakeCase(update, {
      excludeKeys: ['id', 'organizationId']
    });

    return this._request
      .put(`${this._baseUrl}/categories/${categoryId}`, formattedUpdate)
      .then((fieldCategory) => toCamelCase(fieldCategory));
  }
}

export default FieldCategories;

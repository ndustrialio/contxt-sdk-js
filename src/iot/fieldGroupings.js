import isPlainObject from 'lodash.isplainobject';
import { toCamelCase, toSnakeCase } from '../utils/objects';
import { formatPaginatedDataFromServer } from '../utils/pagination';

/**
 * @typedef {Object} FieldGrouping
 * @property {String} description
 * @property {String} [fieldCategoryId] UUID
 * @property {Number} facilityId
 * @property {String} id UUID
 * @property {Boolean} isPublic
 * @property {String} label
 * @property {String} ownerId
 * @property {String} slug
 */

/**
 * @typedef {Object} FieldGroupingsFromServer
 * @property {Object} _metadata Metadata about the pagination settings
 * @property {number} _metadata.offset Offset of records in subsequent queries
 * @property {number} _metadata.totalRecords Total number of asset types found
 * @property {FieldGrouping[]} records
 */

/**
 * @typedef {Object} FieldGroupingField
 * @param {string} createdAt ISO 8601 Extended Format date/time string
 * @param {string} fieldGroupingId UUID
 * @param {string} id UUID
 * @param {number} outputFieldId
 * @param {string} updatedAt ISO 8601 Extended Format date/time string
 */

/**
 * Module that provides access to field information
 *
 * @typicalname contxtSdk.iot.fieldGroupings
 */
class FieldGroupings {
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
   * Adds a field to a field grouping
   *
   * API Endpoint: '/groupings/:fieldGroupingId/fields/:outputFieldId'
   * Method: POST
   *
   * @param {string} fieldGroupingId UUID corresponding with a field grouping
   * @param {number} outputFieldId ID corresponding to the field being added
   *
   * @returns {Promise}
   * @fulfill {FieldGroupingField} Information about the new field/grouping relationship
   * @reject {Error}
   *
   * @example
   * contxtSdk.iot.fieldGroupings
   *   .addField('b3dbaae3-25dd-475b-80dc-66296630a8d0', 4)
   *   .then((grouping) => console.log(grouping))
   *   .catch((err) => console.log(err));
   */
  addField(fieldGroupingId, outputFieldId) {
    let errorMsg;

    if (!fieldGroupingId) {
      errorMsg =
        'A fieldGroupingId is required to create a relationship between a field grouping and a field.';
    } else if (!outputFieldId) {
      errorMsg =
        'A outputFieldId is required to create a relationship between a field grouping and a field.';
    }

    if (errorMsg) {
      return Promise.reject(new Error(errorMsg));
    }

    return this._request
      .post(
        `${this._baseUrl}/groupings/${fieldGroupingId}/fields/${outputFieldId}`
      )
      .then((grouping) => toCamelCase(grouping));
  }

  /**
   * Create a field grouping associated with a facility
   *
   * API Endpoint: '/facilities/:facilityId/groupings'
   * Method: POST
   *
   * @param {String} facilityId TheID of a facility
   * @param {Object} fieldGrouping
   * @param {string} fieldGrouping.description
   * @param {string} [fieldGrouping.fieldCategoryId]
   * @param {boolean} [fieldGrouping.isPublic]
   * @param {string} fieldGrouping.label
   *
   * @returns {Promise}
   * @fulfill {FieldGrouping} Information about the field grouping
   * @reject {Error}
   *
   * @example
   * contxtSdk.iot.fieldGroupings
   *   .create(135, {
   *      description: 'Power usage from all compressors in Room 2',
   *      fieldCategoryId: 'e9f8f89c-609c-4c83-8ebc-cea928af661e',
   *      isPublic: true,
   *      label: 'Room 2 Compressors'
   *   })
   *   .then((fieldGrouping) => console.log(fieldGrouping))
   *   .catch((err) => console.log(err));
   */
  create(facilityId, fieldGrouping) {
    if (!facilityId) {
      return Promise.reject(
        new Error('A facilityId is required for creating a field grouping.')
      );
    }

    const requiredFields = ['label', 'description'];

    for (let i = 0; requiredFields.length > i; i++) {
      const field = requiredFields[i];
      if (!fieldGrouping[field]) {
        return Promise.reject(
          new Error(`A ${field} is required to create a new field grouping.`)
        );
      }
    }

    const formattedGrouping = toSnakeCase(fieldGrouping);

    return this._request
      .post(
        `${this._baseUrl}/facilities/${facilityId}/groupings`,
        formattedGrouping
      )
      .then((fieldGrouping) => toCamelCase(fieldGrouping));
  }

  /**
   * Deletes a field grouping
   *
   * API Endpoint: '/groupings/:groupingId'
   * Method: DELETE
   *
   * @param {String} groupingId The UUID of a field grouping
   *
   * @returns {Promise}
   * @fulfill {undefined}
   * @reject {Error}
   *
   * @example
   * contxtSdk.iot.fieldGroupings
   *   .delete('b3dbaae3-25dd-475b-80dc-66296630a8d0');
   */
  delete(groupingId) {
    if (!groupingId) {
      return Promise.reject(
        new Error('A groupingId is required for deleting a field grouping.')
      );
    }

    return this._request.delete(`${this._baseUrl}/groupings/${groupingId}`);
  }

  /**
   * Gets information about a field grouping
   *
   * API Endpoint: '/groupings/:groupingId'
   * Method: GET
   *
   * @param {String} groupingId The UUID of a field grouping
   *
   * @returns {Promise}
   * @fulfill {FieldGrouping} Information about the field grouping
   * @reject {Error}
   *
   * @example
   * contxtSdk.iot.fieldGroupings
   *   .get('b3dbaae3-25dd-475b-80dc-66296630a8d0')
   *   .then((fieldGrouping) => console.log(fieldGrouping))
   *   .catch((err) => console.log(err));
   */
  get(groupingId) {
    if (!groupingId) {
      return Promise.reject(
        new Error(
          'A groupingId is required for getting information about a field grouping.'
        )
      );
    }

    return this._request
      .get(`${this._baseUrl}/groupings/${groupingId}`)
      .then((fieldGrouping) => toCamelCase(fieldGrouping));
  }

  /**
   * Get a paginated listing of field groupings for a facility available to the user. Includes public groupings across
   * any organization the user has access to and the user's private groupings.
   *
   * API Endpoint: '/facilities/:facilityId/groupings'
   * Method: GET
   *
   * @param {number} facilityId The ID of a facility with groupings
   * @param {PaginationOptions} [paginationOptions]
   *
   * @returns {Promise}
   * @fulfill {FieldGroupingsFromServer} Information about the field grouping
   * @reject {Error}
   *
   * @example
   * contxtSdk.iot.fieldGroupings
   *   .getGroupingsByFacilityId(135)
   *   .then((fieldGroupings) => console.log(fieldGroupings))
   *   .catch((err) => console.log(err));
   */
  getGroupingsByFacilityId(facilityId, paginationOptions) {
    if (!facilityId) {
      return Promise.reject(
        new Error('A facilityId is required for getting all field groupings.')
      );
    }

    return this._request
      .get(`${this._baseUrl}/facilities/${facilityId}/groupings`, {
        params: toSnakeCase(paginationOptions)
      })
      .then((fieldGrouping) => formatPaginatedDataFromServer(fieldGrouping));
  }

  /**
   * Removes a field from a field grouping
   *
   * API Endpoint: '/groupings/:fieldGroupingId/fields/:outputFieldId'
   * Method: DELETE
   *
   * @param {string} fieldGroupingId UUID corresponding with a field grouping
   * @param {number} outputFieldId ID corresponding with the field
   *
   * @returns {Promise}
   * @reject {Error}
   *
   * @example
   * contxtSdk.iot.fieldGroupings
   *   .removeField('b3dbaae3-25dd-475b-80dc-66296630a8d0', 4)
   *   .catch((err) => console.log(err));
   */
  removeField(fieldGroupingId, outputFieldId) {
    let errorMsg;

    if (!fieldGroupingId) {
      errorMsg =
        'A fieldGroupingId is required to remove a relationship between a field grouping and a field.';
    } else if (!outputFieldId) {
      errorMsg =
        'A outputFieldId is required to remove a relationship between a field grouping and a field.';
    }

    if (errorMsg) {
      return Promise.reject(new Error(errorMsg));
    }

    return this._request.delete(
      `${this._baseUrl}/groupings/${fieldGroupingId}/fields/${outputFieldId}`
    );
  }

  /**
   * Updates information about a field grouping
   *
   * API Endpoint: '/groupings/:groupingId'
   * Method: PUT
   *
   * @param {String} groupingId The UUID of a field grouping
   * @param {Object} update
   * @param {string} [update.description]
   * @param {string} [update.fieldCategoryId]
   * @param {boolean} [update.isPublic]
   * @param {string} [update.label]
   *
   * @returns {Promise}
   * @fulfill {FieldGrouping} Information about the field grouping
   * @reject {Error}
   *
   * @example
   * contxtSdk.iot.fieldGroupings
   *   .update('b3dbaae3-25dd-475b-80dc-66296630a8d0', {
   *      description: 'Power usage from all compressors in Room 2',
   *      fieldCategoryId: 'e9f8f89c-609c-4c83-8ebc-cea928af661e',
   *      isPublic: true,
   *      label: 'Room 2 Compressors'
   *   })
   *   .then((fieldGrouping) => console.log(fieldGrouping))
   *   .catch((err) => console.log(err));
   */
  update(groupingId, update) {
    if (!groupingId) {
      return Promise.reject(
        new Error(
          'A groupingId is required for getting information about a field grouping.'
        )
      );
    }

    if (!update) {
      return Promise.reject(
        new Error('An update is required to update a field grouping')
      );
    }

    if (!isPlainObject(update)) {
      return Promise.reject(
        new Error(
          'The field grouping update must be a well-formed object with the data you wish to update.'
        )
      );
    }

    const formattedUpdate = toSnakeCase(update, {
      excludeKeys: ['facilityId', 'id', 'ownerId', 'slug']
    });

    return this._request
      .put(`${this._baseUrl}/groupings/${groupingId}`, formattedUpdate)
      .then((fieldGrouping) => toCamelCase(fieldGrouping));
  }
}

export default FieldGroupings;

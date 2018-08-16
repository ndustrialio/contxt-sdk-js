import { toCamelCase } from '../utils/objects';

/**
 * @typedef {Object} OutputField
 * @property {Boolean} [canAggregate]
 * @property {Number} [divisor]
 * @property {String} feedKey
 * @property {String} fieldDescriptor
 * @property {String} fieldHumanName
 * @property {String} [fieldName]
 * @property {Number} id
 * @property {Boolean} [isDefault]
 * @property {Boolean} [isHidden]
 * @property {Boolean} [isTotalizer]
 * @property {Boolean} [isWindowed]
 * @property {String} [label]
 * @property {Number} outputId
 * @property {Number} [scalar]
 * @property {String} [status]
 * @property {String} [units]
 * @property {String} valueType What type of value can be coming from the feed.
 *   One of `boolean`, `numeric`, and `string`
 */

/**
 * Module that provides access to field information
 *
 * @typicalname contxtSdk.iot.fields
 */
class Fields {
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
   * Gets information about a field
   *
   * API Endpoint: '/fields/:fieldId'
   * Method: GET
   *
   * @param {Number} outputFieldId The ID of an output field
   *
   * @returns {Promise}
   * @fulfill {OutputField} Information about the output field
   * @reject {Error}
   *
   * @example
   * contxtSdk.iot.fields
   *   .get(563)
   *   .then((outputField) => console.log(outputField))
   *   .catch((err) => console.log(err));
   */
  get(outputFieldId) {
    if (!outputFieldId) {
      return Promise.reject(
        new Error(
          'An outputFieldId is required for getting information about an output field'
        )
      );
    }

    return this._request
      .get(`${this._baseUrl}/fields/${outputFieldId}`)
      .then((outputField) => toCamelCase(outputField));
  }
}

export default Fields;

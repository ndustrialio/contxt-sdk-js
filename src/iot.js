import { formatOutputFieldFromServer } from './utils/iot';

/**
 * @typedef {Object} OutputField
 * @property {Boolean} canAggregate
 * @property {Number} divisor
 * @property {String} feedKey
 * @property {String} fieldDescriptor
 * @property {String} fieldHumanName
 * @property {String} fieldName
 * @property {Number} id
 * @property {Boolean} isDefault
 * @property {Boolean} isHidden
 * @property {Boolean} isTotalizer
 * @property {Boolean} isWindowed
 * @property {String} label
 * @property {Number} outputId
 * @property {Number} scalar
 * @property {String} status
 * @property {String} units
 * @property {String} valueType What type of value can be coming from the feed.
 *   One of `boolean`, `numeric`, and `string`
 */

/**
 * Module that provides access to real time IOT feeds and fields.
 *
 * @typicalname contxtSdk.iot
 */
class Iot {
  /**
   * @param {Object} sdk An instance of the SDK so the module can communicate
       with other modules
   * @param {Object} request An instance of the request module tied to this
       module's audience.
   */
  constructor(sdk, request) {
    this._baseUrl = `${sdk.config.audiences.iot.host}/v1`;
    this._request = request;
    this._sdk = sdk;
  }

  /**
   * Gets information about a field
   *
   * API Endpoint: '/fields/:fieldId'
   * Method: GET
   *
   * @param {number} outputFieldId The ID of an output field
   *
   * @returns {Promise}
   * @fulfill {OutputField} Information about the output field
   * @reject {Error}
   *
   * @example
   * contxtSdk.iot.getOutputField(25)
   *   .then((outputField) => console.log(outputField));
   *   .catch((err) => console.log(err));
   */
  getOutputField(outputFieldId) {
    if (!outputFieldId) {
      return Promise.reject(
        new Error(
          'An output field ID is required for getting information about an output field'
        )
      );
    }

    return this._request
      .get(`${this._baseUrl}/fields/${outputFieldId}`)
      .then((outputField) => formatOutputFieldFromServer(outputField));
  }
}

export default Iot;

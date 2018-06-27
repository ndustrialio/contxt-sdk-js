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
   * @param {Number} outputFieldId The ID of an output field
   *
   * @returns {Promise}
   * @fulfill {OutputField} Information about the output field
   * @reject {Error}
   *
   * @example
   * contxtSdk.iot.getOutputField(563)
   *   .then((outputField) => console.log(outputField));
   *   .catch((err) => console.log(err));
   */
  getOutputField(outputFieldId) {
    if (!outputFieldId) {
      return Promise.reject(
        new Error(
          'An outputFieldId is required for getting information about an output field'
        )
      );
    }

    return this._request
      .get(`${this._baseUrl}/fields/${outputFieldId}`)
      .then((outputField) => formatOutputFieldFromServer(outputField));
  }

  /**
   * Gets an output's data from a specific field
   *
   * API Endpoint: '/outputs/:outputId/fields/:fieldHumanName/data'
   * Method: GET
   *
   * @param {Number} outputId The ID of an output
   * @param {String} fieldHumanName The human readable name of a field
   *
   * @returns {Promise}
   * @fulfill {Object}
   * @reject {Error}
   *
   * @example
   * contxtSdk.iot.getOutputFieldData(491, 'temperature')
   *   .then((outputData) => console.log(outputData));
   *   .catch((err) => console.log(err));
   */
  getOutputFieldData(outputId, fieldHumanName) {
    if (!outputId) {
      return Promise.reject(
        new Error(
          'An outputId is required for getting data about a specific output'
        )
      );
    }

    if (!fieldHumanName) {
      return Promise.reject(
        new Error(
          "A fieldHumanName is required for getting a specific field's output data"
        )
      );
    }

    return this._request.get(
      `${this._baseUrl}/outputs/${outputId}/fields/${fieldHumanName}/data`
    );
  }
}

export default Iot;

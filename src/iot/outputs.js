import { formatOutputFieldDataFromServer } from '../utils/iot';

/**
 * Module that provides access to output information
 *
 * @typicalname contxtSdk.iot.outputs
 */
class Outputs {
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
   * contxtSdk.iot.outputs.getFieldData(491, 'temperature')
   *   .then((outputData) => console.log(outputData));
   *   .catch((err) => console.log(err));
   */
  getFieldData(outputId, fieldHumanName) {
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

    return this._request
      .get(`${this._baseUrl}/outputs/${outputId}/fields/${fieldHumanName}/data`)
      .then((fieldData) => formatOutputFieldDataFromServer(fieldData));
  }
}

export default Outputs;

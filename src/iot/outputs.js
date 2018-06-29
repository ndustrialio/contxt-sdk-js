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
   * @param {Object} [options]
   * @param {Number} [options.limit = 5000] Number of records to return
   * @param {Number} [options.timeEnd] UNIX timestamp indicating the end of the
   *   query window
   * @param {Number} [options.timeStart] UNIX timestamp indicating the start of
   *   the query window
   * @param {Number} [options.window] The sampling window for records.
   *   Required if including a timeEnd or timeStart.
   *   Valid options include: `0`, `60`, `900`, and `3600`
   *
   * @returns {Promise}
   * @fulfill {Object}
   * @reject {Error}
   *
   * @example
   * contxtSdk.iot.outputs
   *   .getFieldData(491, 'temperature', {
   *     limit: 100,
   *     timeStart: 1530290218365,
   *     window: 3600
   *   })
   *   .then(outputData => console.log(outputData))
   *   .catch(err => console.log(err));

   */
  getFieldData(outputId, fieldHumanName, options) {
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
      .get(
        `${this._baseUrl}/outputs/${outputId}/fields/${fieldHumanName}/data`,
        { params: options }
      )
      .then((fieldData) => formatOutputFieldDataFromServer(fieldData));
  }
}

export default Outputs;

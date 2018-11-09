import FieldCategories from './fieldCategories';
import FieldGroupings from './fieldGroupings';
import Fields from './fields';
import Outputs from './outputs';

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
    const baseUrl = `${sdk.config.audiences.iot.host}/v1`;

    this._baseUrl = baseUrl;
    this._request = request;
    this._sdk = sdk;

    this.fields = new Fields(sdk, request, baseUrl);
    this.outputs = new Outputs(sdk, request, baseUrl);
    this.fieldCategories = new FieldCategories(sdk, request, baseUrl);
    this.fieldGroupings = new FieldGroupings(sdk, request, baseUrl);
  }
}

export default Iot;

import Channels from './channels';

/**
 * Module that provides access to the message bus
 *
 * @typicalname contxtSdk.bus
 */
class Bus {
  /**
   * @param {Object} sdk An instance of the SDK so the module can communicate with other modules
   * @param {Object} request An instance of the request module tied to this module's audience.
   */
  constructor(sdk, request) {
    const baseUrl = `${sdk.config.audiences.bus.host}`;

    this._baseUrl = baseUrl;
    this._request = request;
    this._sdk = sdk;

    this.channels = new Channels(sdk, request, baseUrl);
  }
}

export default Bus;

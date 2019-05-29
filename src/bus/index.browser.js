import Channels from './channels';

/**
 * Module that provides access to the message bus. This is for browser
 * environments. Documentation for Node environments is found under `Bus`.
 *
 * @alias BrowserBus
 * @typicalname contxtSdk.bus
 */
class Bus {
  /**
   * @alias BrowserBus
   *
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

  /**
   * Connects to the message bus via WebSocket. Does not currently work in
   * browser environments.
   */
  connect() {
    throw new Error(
      'The Message Bus is not currently supported in browser environments'
    );
  }

  /**
   * Gets an open WebSocketConnection for an organization ID. Does not currently
   * work in browser environments.
   */
  getWebSocketConnection() {
    throw new Error(
      'The Message Bus is not currently supported in browser environments'
    );
  }
}

export default Bus;

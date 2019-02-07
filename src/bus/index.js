import WebSocket from 'ws';

import Channels from './channels';
import Socket from './socket';

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
    const baseWebSocketUrl = `${sdk.config.audiences.bus.webSocket}`;

    this._baseWebSocketUrl = baseWebSocketUrl;
    this._baseUrl = baseUrl;
    this._request = request;
    this._sdk = sdk;
    this._webSockets = {};

    this.channels = new Channels(sdk, request, baseUrl);
  }

  /**
   * Connects to the message bus via websocket.
   * If a connection already exists for that organization id, the connection is returned, otherwise a new connection is created and returned.
   *
   * @param {string} organizationId UUID corresponding with an organization
   *
   * @returns {Promise}
   * @fulfill {Socket}
   * @reject {object} The error event
   *
   * @example
   * contxtSdk.bus.connect('4f0e51c6-728b-4892-9863-6d002e61204d')
   *   .then((webSocket) => {
   *     console.log(webSocket);
   *   })
   *   .catch((errorEvent) => {
   *     console.log(errorEvent);
   *   });
   */
  connect(organizationId) {
    return new Promise((resolve, reject) => {
      if (this._webSockets[organizationId]) {
        resolve(this._webSockets[organizationId]);
      } else {
        return this._sdk.auth
          .getCurrentApiToken('contxtAuth')
          .then((apiToken) => {
            const ws = new WebSocket(
              `${
                this._baseWebSocketUrl
              }/organizations/${organizationId}/stream`,
              [],
              {
                headers: {
                  Authorization: `Bearer ${apiToken}`
                }
              }
            );

            ws.onopen = (event) => {
              this._webSockets[organizationId] = new Socket(ws, organizationId);

              resolve(this._webSockets[organizationId]);
            };

            ws.onclose = (event) => {
              this._webSockets[organizationId] = null;
            };

            ws.onerror = (errorEvent) => {
              reject(errorEvent);
            };
          })
          .catch((err) => {
            reject(err);
          });
      }
    });
  }
}

export default Bus;

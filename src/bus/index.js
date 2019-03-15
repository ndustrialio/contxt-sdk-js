import WebSocket from 'ws';

import Channels from './channels';
import WebSocketConnection from './webSocketConnection';

/**
 * The raw WebSocket created by ws
 *
 * @typedef {Object} WebSocket
 * @property {function} addEventListener Register an event listener emulating the EventTarget interface
 * @property {string} binaryType A string indicating the type of binary data being transmitted by the connection. This should be one of "nodebuffer", "arraybuffer" or "fragments". Defaults to "nodebuffer".
 * @property {number} bufferedAmount The number of bytes of data that have been queued using calls to send() but not yet transmitted to the network.
 * @property {function} close Initiate a closing handshake
 * @property {Object} extensions An object containing the negotiated extensions
 * @property {function} onclose An event listener to be called when connection is closed
 * @property {function} onerror An event listener to be called when an error occurs
 * @property {function} onmessage An event listener to be called when a message is received from the server
 * @property {function} onopen An event listener to be called when the connection is established
 * @property {function} ping Send a ping to the WebSocket server
 * @property {function} pong Send a pong to the WebSocket server
 * @property {string} protocol The subprotocol selected by the server
 * @property {number} readyState The current state of the connection
 * @property {function} removeEventListener Removes an event listener emulating the EventTarget interface
 * @property {function} send Send data through the open WebSocket connection
 * @property {function} terminate Forcibly close the connection
 * @property {string} url The URL of the WebSocket server
 */

/**
 * A wrapper around the raw WebSocket to provide a finite set of operations
 *
 * @typedef {Object} WebSocketConnection
 * @property {function} close Closes the WebSocket connection to the message bus server
 * @property {string} _organizationId The organization id for the open WebSocket connection
 * @property {WebSocket} _webSocket The raw WebSocket connection to the message bus
 */

/**
 * Module that provides access to the message bus. This is for Node
 * environments. Documentation for browser environments is found under
 * `BrowserBus`.
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
   * @fulfill {WebSocketConnection}
   * @reject {errorEvent} The error event
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
        return resolve(this._webSockets[organizationId]);
      }

      return this._sdk.auth
        .getCurrentApiToken('contxtAuth')
        .then((apiToken) => {
          const ws = new WebSocket(
            `${this._baseWebSocketUrl}/organizations/${organizationId}/stream`,
            [],
            {
              headers: {
                Authorization: `Bearer ${apiToken}`
              }
            }
          );

          ws.onopen = (event) => {
            this._webSockets[organizationId] = new WebSocketConnection(
              ws,
              organizationId
            );

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
    });
  }

  /**
   * Gets the WebSocketConnection for an organization id
   * If a connection already exists for that organization id, the connection is returned, otherwise returns undefined.
   *
   * @param {string} organizationId UUID corresponding with an organization
   *
   * @returns {WebSocketConnection}
   *
   * @example
   * const messageBusWebSocket = contxtSdk.bus.getWebSocketConnection('4f0e51c6-728b-4892-9863-6d002e61204d');
   */
  getWebSocketConnection(organizationId) {
    return this._webSockets[organizationId];
  }
}

export default Bus;

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
    const baseSocketUrl = `${sdk.config.audiences.bus.socket}`;
    this._baseSocketUrl = baseSocketUrl;
    this._baseUrl = baseUrl;
    this._request = request;
    this._sdk = sdk;
    this._sockets = {};

    this.channels = new Channels(sdk, request, baseUrl);
  }

  /**
   * Connects to the message bus via websocket.
   * If a connection already exists for that organization id, the connection is returned, otherwise a new connection is created.
   *
   * @param {string} organizationId UUID corresponding with an organization
   *
   * @returns {Promise}
   * @fulfill {Socket}
   * @reject {object} The error event
   *
   * @example
   * contxtSdk.bus.connect('4f0e51c6-728b-4892-9863-6d002e61204d')
   * .then((socket) => {
   *    console.log(socket);
   * })
   * .catch((event) => {
   *    console.log(event);
   * })
   */
  connect(organizationId) {
    return new Promise((resolve, reject) => {
      if (!this._sockets[organizationId]) {
        return this._sdk.auth
          .getCurrentApiToken('contxtAuth')
          .then((apiToken) => {
            const socket = new WebSocket(
              `${this._baseSocketUrl}/organizations/${organizationId}/stream`,
              [],
              {
                headers: {
                  Authorization: `Bearer ${apiToken}`
                }
              }
            );

            socket.onopen = (event) => {
              this._sockets[organizationId] = new Socket(
                socket,
                organizationId
              );

              resolve(this._sockets[organizationId]);
            };

            socket.onclose = (event) => {
              this._sockets[organizationId] = null;
            };

            socket.onerror = (event) => {
              reject(event);
            };
          });
      } else {
        resolve(this._sockets[organizationId]);
      }
    });
  }
}

export default Bus;

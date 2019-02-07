/**
 * Module that wraps the websocket connection to the message bus
 * to provide the developer with a specific set of functionality
 *
 */
class Socket {
  /**
   * @param {WebSocket} webSocket A WebSocket connection to the message bus
   * @param {string} organizationId UUID corresponding with an organization
   */
  constructor(webSocket, organizationId) {
    this._organizationId = organizationId;
    this._webSocket = webSocket;
  }

  /**
   * Closes the websocket connection
   *
   * @example
   * contxtSdk.bus.connect('4f0e51c6-728b-4892-9863-6d002e61204d')
   *   .then((webSocket) => {
   *     webSocket.close()
   *   })
   *   .catch((errorEvent) => {
   *     console.log(errorEvent);
   *   });
   */
  close() {
    this._webSocket.close();
  }
}

export default Socket;

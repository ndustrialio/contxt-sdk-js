/**
 * Module that wraps the websocket connection to the message bus
 * to provide the developer with a specific set of functionality
 *
 */
class Socket {
  /**
   * @param {Websocket} socket A websocket connection to the message bus
   * @param {string} organizationId UUID corresponding with an organization
   */
  constructor(socket, organizationId) {
    this._organizationId = organizationId;
    this._socket = socket;
  }

  /**
   * Closes the websocket connection
   *
   * @example
   * contxtSdk.bus.connect('4f0e51c6-728b-4892-9863-6d002e61204d')
   * .then((socket) => {
   *    socket.close()
   * })
   * .catch((event) => {
   *    console.log(event);
   * })
   */
  close() {
    this._socket.close();
  }
}

export default Socket;

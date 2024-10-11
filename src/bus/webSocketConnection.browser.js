/**
 * Module that wraps the websocket connection to the message bus to provide the
 * developer with a specific set of functionality. This is for browser
 * environments. Documentation for Node environments is found under
 * `WebSocketConnection`.
 *
 * @alias BrowserWebSocketConnection
 */
class WebSocketConnection {
  /**
   * @alias BrowserWebSocketConnection
   */
  constructor(webSocket, organizationId) { // eslint-disable-line no-unused-vars
    throw new Error(
      'The Message Bus is not currently supported in browser environments'
    );
  }
}

export default WebSocketConnection;

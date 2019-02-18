/**
 * Module that wraps the websocket connection to the message bus
 * to provide the developer with a specific set of functionality
 *
 */
class WebSocketConnection {
  /**
   * @param {WebSocket} webSocket A WebSocket connection to the message bus
   * @param {string} organizationId UUID corresponding with an organization
   */
  constructor(webSocket, organizationId) {
    this._jsonRpcId = 0;
    this._organizationId = organizationId;
    this._webSocket = webSocket;
  }

  /**
   * Sends a message to the message bus to authorize a channel
   *
   * @param {string} token JSON Web Signature containing the channel and actions needed for authorization
   *
   * @returns {Promise}
   * @fulfill
   * @reject {error} The error event from the WebSocket or the error message from the message bus
   *
   * @example
   *   contxtSdk.bus.connect('4f0e51c6-728b-4892-9863-6d002e61204d')
   *     .then((webSocket) => {
   *       webSocket.authorize(token).then(() => {
   *         console.log("authorization successful")
   *       })
   *       .catch((authError) => {
   *         console.log(authError)
   *       });
   *     })
   * });
   */
  authorize(token) {
    return new Promise((resolve, reject) => {
      if (!token) {
        return reject(new Error('A token is required for authorization'));
      }

      const messageId = this._jsonRpcId;

      if (
        !this._webSocket ||
        this._webSocket.readyState !== this._webSocket.OPEN
      ) {
        return reject(new Error('WebSocket connection not open'));
      }

      this._webSocket.onmessage = (message) => {
        const messageData = JSON.parse(message.data);
        const error = messageData.error;

        if (error) {
          this._webSocket.onmessage = null;
          this._webSocket.onerror = null;

          return reject(error);
        }

        if (messageData.id === messageId) {
          this._webSocket.onmessage = null;
          this._webSocket.onerror = null;

          return resolve();
        }
      };

      this._webSocket.onerror = (errorEvent) => {
        this._webSocket.onmessage = null;
        this._webSocket.onerror = null;

        return reject(errorEvent);
      };

      this._webSocket.send(
        JSON.stringify({
          jsonrpc: '2.0',
          method: 'MessageBus.Authorize',
          params: {
            token
          },
          id: this._jsonRpcId
        })
      );

      this._jsonRpcId++;
    });
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

export default WebSocketConnection;

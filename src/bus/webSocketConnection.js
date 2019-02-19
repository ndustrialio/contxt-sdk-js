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

        if (parseInt(messageData.id) === messageId) {
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

  /**
   * Publishes a message to a specific channel on the message bus
   *
   * @param {string} serviceClientId Client ID of the message bus service
   * @param {string} channel Message bus channel the message is being sent to
   * @param {Any} message Message being sent to the message bus. Must be valid JSON.
   *
   * @returns {Promise}
   * @fulfill
   * @reject {error} The error event from the WebSocket or the error message from the message bus
   *
   * @example
   *   contxtSdk.bus.connect('4f0e51c6-728b-4892-9863-6d002e61204d')
   *     .then((webSocket) => {
   *       webSocket.publish('GCXd2bwE9fgvqxygrx2J7TkDJ3ef', 'feed:1', {"example": 1}).then(() => {
   *         console.log("publish successful")
   *       })
   *       .catch((error) => {
   *         console.log(error)
   *       });
   *     })
   * });
   */
  publish(serviceClientId, channel, message) {
    return new Promise((resolve, reject) => {
      if (!serviceClientId) {
        return reject(
          new Error('A service client id is required for publishing')
        );
      }

      if (!channel) {
        return reject(new Error('A channel is required for publishing'));
      }

      if (!message) {
        return reject(new Error('A message is required for publishing'));
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

        if (parseInt(messageData.id) === messageId) {
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
          method: 'MessageBus.Publish',
          params: {
            service_id: serviceClientId,
            channel,
            message
          },
          id: this._jsonRpcId
        })
      );

      this._jsonRpcId++;
    });
  }
}

export default WebSocketConnection;

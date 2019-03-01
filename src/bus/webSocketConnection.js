import uuid from 'uuid/v4';

/**
 * The WebSocket Error Event
 *
 * @typedef {Object} WebSocketError
 * @property {string} type The event type
 */

/**
 * The WebSocket Message Event
 *
 * @typedef {Object} WebSocketMessage
 * @property {Object} data The data sent by the message emitter
 * @property {string} origin A USVString representing the origin of the message emitter
 * @property {string} lastEventId A DOMString representing a unique ID for the event
 * @property {Object} source A MessageEventSource (which can be a WindowProxy, MessagePort, or ServiceWorker object) representing the message emitter
 * @property {Array} ports  MessagePort objects representing the ports associated with the channel the message is being sent through (where appropriate, e.g. in channel messaging or when sending a message to a shared worker)
 */

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
    this._messageHandlers = {};
    this._organizationId = organizationId;
    this._webSocket = webSocket;

    if (this._webSocket) {
      this._webSocket.onerror = this._onError;
      this._webSocket.onmessage = this._onMessage;
    }
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

      if (
        !this._webSocket ||
        this._webSocket.readyState !== this._webSocket.OPEN
      ) {
        return reject(new Error('WebSocket connection not open'));
      }

      const messageId = uuid();

      this._messageHandlers[messageId] = (message) => {
        const error = message.error;

        delete this._messageHandlers[messageId];

        if (error) {
          return reject(error);
        }

        return resolve();
      };

      this._webSocket.send(
        JSON.stringify({
          jsonrpc: '2.0',
          method: 'MessageBus.Authorize',
          params: {
            token
          },
          id: messageId
        })
      );
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
   * Handles WebSocket errors.
   * The `ws` library also closes the socket when an error occurs.
   * Since the socket connection closes, the jsonRpcId and message handlers are cleared
   *
   * @param {WebSocketError} error The error event thrown
   *
   * @private
   */
  _onError = (error) => {
    this._messageHandlers = {};

    console.log('Message Bus WebSocket Error: ', error);
  };

  /**
   * Handles messages sent from the Message Bus WebSocket connection.
   *
   * @param {WebSocketMessage} message The message event recieved over the WebSocket connection
   *
   * @private
   */
  _onMessage = (message) => {
    let messageData;

    try {
      messageData = JSON.parse(message.data);
    } catch (err) {
      throw new Error('Invalid JSON in message');
    }

    if (this._messageHandlers[messageData.id]) {
      this._messageHandlers[messageData.id](messageData);
    }
  };

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

      if (
        !this._webSocket ||
        this._webSocket.readyState !== this._webSocket.OPEN
      ) {
        return reject(new Error('WebSocket connection not open'));
      }

      const messageId = uuid();

      this._messageHandlers[messageId] = (message) => {
        const error = message.error;
        delete this._messageHandlers[messageId];

        if (error) {
          return reject(error);
        }

        return resolve();
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
          id: messageId
        })
      );
    });
  }
}

export default WebSocketConnection;

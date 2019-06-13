import uuid from 'uuid/v4';
import once from 'lodash.once';

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
 * Module that wraps the websocket connection to the message bus to provide the
 * developer with a specific set of functionality. This is for Node
 * environments. Documentation for browser environments is found under
 * `BrowserWebSocketConnection`.
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
    if (!token) {
      return Promise.reject(new Error('A token is required for authorization'));
    }

    if (!this._isConnected()) {
      return Promise.reject(new Error('WebSocket connection not open'));
    }

    return this._registerSingleMessageHandler('Authorize', { token });
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
   *     });
   */
  publish(serviceClientId, channel, message) {
    if (!serviceClientId) {
      return Promise.reject(
        new Error('A service client id is required for publishing')
      );
    }

    if (!channel) {
      return Promise.reject(new Error('A channel is required for publishing'));
    }

    if (!message) {
      return Promise.reject(new Error('A message is required for publishing'));
    }

    if (!this._isConnected()) {
      return Promise.reject(new Error('WebSocket connection not open'));
    }

    return this._registerSingleMessageHandler('Publish', {
      service_id: serviceClientId,
      channel,
      message
    });
  }

  /**
   * Subscribes to a specific channel on the message bus and handles messages as they are received. When the handler is
   * called, the message is automatically acknowledged after the message completes except whenever an Error is thrown.
   * The user can also programmatically control when the message is acknowledged by calling `ack` at any time.
   *
   * @param {string} serviceClientId Client ID of the message bus service
   * @param {string} channel Message bus channel the message is being sent to
   * @param {string} [group] A unique identifier for the subscriber that can be shared between connections
   * @param {function} handler A function that gets invoked with every received message
   * @param {function} errorHandler A function that gets invoked with every error
   *
   * @example
   *   contxtSdk.bus.connect('4f0e51c6-728b-4892-9863-6d002e61204d')
   *     .then((webSocket) => {
   *       webSocket.subscribe('GCXd2bwE9fgvqxygrx2J7TkDJ3ef', 'feed:1', 'test-sub', (message) => {
   *         console.log('Message received: ', message);
   *       }, (error) => {
   *         console.log('Error received: ', error);
   *       });
   *     });
   *
   * @example
   *   contxtSdk.bus.connect('4f0e51c6-728b-4892-9863-6d002e61204d')
   *     .then((webSocket) => {
   *       webSocket.subscribe('GCXd2bwE9fgvqxygrx2J7TkDJ3ef', 'feed:1', 'test-sub', (message, ack) => {
   *         console.log('Message received: ', message);
   *
   *         ack();
   *       }, (error) => {
   *         console.log('Error received: ', error);
   *       });
   *     });
   *
   * @example
   *   contxtSdk.bus.connect('4f0e51c6-728b-4892-9863-6d002e61204d')
   *     .then((webSocket) => {
   *       webSocket.subscribe('GCXd2bwE9fgvqxygrx2J7TkDJ3ef', 'feed:1', (message) => {
   *         return db.save(message);
   *       }, (error) => {
   *         console.log('Error received: ', error);
   *       });
   *     });
   *
   * @example
   *   contxtSdk.bus.connect('4f0e51c6-728b-4892-9863-6d002e61204d')
   *     .then((webSocket) => {
   *       webSocket.subscribe('GCXd2bwE9fgvqxygrx2J7TkDJ3ef', 'feed:1', (message, ack) => {
   *         return db.save(message)
   *           .then(ack)
   *           .then(() => {
   *             // additional processing
   *           });
   *       }, (error) => {
   *         console.log('Error received: ', error);
   *       });
   *     });
   */
  subscribe(serviceClientId, channel, group, handler, errorHandler) {
    if (typeof group === 'function') {
      errorHandler = handler;
      handler = group;
      group = null;
    }

    if (!serviceClientId) {
      return Promise.reject(
        new Error('A service client id is required for subscribing')
      );
    }

    if (!channel) {
      return Promise.reject(new Error('A channel is required for subscribing'));
    }

    if (!handler) {
      return Promise.reject(
        new Error('A message handler is required for subscribing')
      );
    }

    if (!errorHandler) {
      return Promise.reject(
        new Error('An error handler is required for subscribing')
      );
    }

    if (!this._isConnected()) {
      return Promise.reject(new Error('WebSocket connection not open'));
    }

    const params = {
      service_id: serviceClientId,
      channel
    };

    if (group) {
      params.group = group;
    }

    return this._registerSingleMessageHandler('Subscribe', params).then(
      (result) => {
        this._messageHandlers[result.subscription] = (subscriptionMessage) => {
          return new Promise((resolve, reject) => {
            const error = subscriptionMessage.error;
            const result = subscriptionMessage.result;

            if (error) {
              return resolve(errorHandler(error));
            } else {
              try {
                const ack = once(() => {
                  return this._acknowledge(result.id);
                });

                return resolve(
                  Promise.resolve(handler(result.body, ack)).then((res) => {
                    return ack().then(() => res);
                  })
                );
              } catch (throwable) {
                return reject(throwable);
              }
            }
          });
        };

        return result;
      }
    );
  }

  /**
   * Acknowledges a Message ID has been received and processed
   *
   * @returns {Promise}
   * @param acknowledgedMessageId {string} The Message ID that has been received
   * @fulfill
   * @reject {error} The error event from the WebSocket or the error message from the message bus
   *
   * @private
   */
  _acknowledge(acknowledgedMessageId) {
    if (!this._isConnected()) {
      return Promise.reject(new Error('WebSocket connection not open'));
    }

    return this._registerSingleMessageHandler('Acknowledge', {
      message_id: acknowledgedMessageId
    });
  }

  /**
   * Registers a JSON RPC message handler that expects only one response.
   *
   * @returns {Promise}
   * @fulfill
   * @reject {error} The error event from the WebSocket or the error message from the message bus
   *
   * @private
   */
  _registerSingleMessageHandler(method, params) {
    return new Promise((resolve, reject) => {
      const messageId = uuid();

      this._messageHandlers[messageId] = (message) => {
        const error = message.error;
        delete this._messageHandlers[messageId];

        if (error) {
          return reject(error);
        }

        return resolve(message.result);
      };

      this._webSocket.send(
        JSON.stringify({
          jsonrpc: '2.0',
          method: `MessageBus.${method}`,
          params,
          id: messageId
        })
      );
    });
  }

  /**
   * Checks whether the current WebSocket is connected to the Message Bus service.
   *
   * @returns {boolean} Whether the WebSocket is connected to the Message Bus service
   *
   * @private
   */
  _isConnected() {
    return (
      this._webSocket && this._webSocket.readyState === this._webSocket.OPEN
    );
  }
}

export default WebSocketConnection;

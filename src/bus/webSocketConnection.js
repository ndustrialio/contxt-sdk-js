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
   * @fulfill {Object} Whether you are authorized or not and any error
   * @reject {errorEvent} The error event from the WebSocket
   *
   * @example
   * axios.post(['https://', SERVICE_ADDRESS, '/authorizations/channels'].join(''), {
   *   resources: [
   *     {
   *       resource: 'CHANNEL_YOU_NEED',
   *       actions: ['publish', 'subscribe']
   *     }
   *   ]
   * }, {
   *   headers: {
   *     Authorization: ['Bearer', ACCESS_TOKEN_FROM_PREVIOUS_STEP].join(' ')
   *   }
   * }).then((response) => {
   *   const token = response.data;
   *
   *   contxtSdk.bus.connect('4f0e51c6-728b-4892-9863-6d002e61204d')
   *     .then((webSocket) => {
   *       webSocket.authorize(token).then((res) => {
   *         if(res.error) {
   *          console.log("Error: ", res.error)
   *         }
   *
   *         console.log(res.authorized)
   *       })
   *       .catch((authErrorEvent) => {
   *         console.log(authErrorEvent)
   *       });
   *     })
   *     .catch((errorEvent) => {
   *       console.log(errorEvent);
   *     });
   * });
   */
  authorize(token) {
    return new Promise((resolve, reject) => {
      this._webSocket.onmessage = (message) => {
        const messageData = JSON.parse(message.data);
        const error = messageData.error || null;
        const authorized = !error;

        resolve({ authorized, error });
      };

      this._webSocket.onerror = (errorEvent) => {
        reject(errorEvent);
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

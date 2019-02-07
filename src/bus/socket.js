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
  constructor(webSocket, organizationId, request) {
    this._jsonRpcId = 0;
    this._organizationId = organizationId;
    this._request = request;
    this._webSocket = webSocket;
  }

  authorize(channel, createSignatureFunction) {
    let getSignature;

    if (createSignatureFunction) {
      getSignature = createSignatureFunction;
    }

    return new Promise((resolve, reject) => {
      getSignature
        .then((token) => {
          this._webSocket.onmessage((message) => {
            let authorized;

            if (message.error) {
              authorized = false;
            } else {
              authorized = true;
            }

            resolve({ authorized });
          });

          this._webSocket.send(
            JSON.stringify({
              jsonrpc: '2.0',
              method: 'MessageBus.Authorize',
              params: {
                token: token
              },
              id: this._jsonRpcId
            })
          );

          this._jsonRpcId++;
        })
        .catch((err) => {
          reject(err);
        });
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

export default Socket;

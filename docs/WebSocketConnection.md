<a name="WebSocketConnection"></a>

## WebSocketConnection
Module that wraps the websocket connection to the message bus to provide the
developer with a specific set of functionality. This is for Node
environments. Documentation for browser environments is found under
`BrowserWebSocketConnection`.

**Kind**: global class  

* [WebSocketConnection](#WebSocketConnection)
    * [new WebSocketConnection(webSocket, organizationId)](#new_WebSocketConnection_new)
    * [.authorize(token)](#WebSocketConnection+authorize) ⇒ <code>Promise</code>
    * [.close()](#WebSocketConnection+close)
    * [.publish(serviceClientId, channel, message)](#WebSocketConnection+publish) ⇒ <code>Promise</code>
    * [.subscribe(serviceClientId, channel, [group], handler, errorHandler)](#WebSocketConnection+subscribe)

<a name="new_WebSocketConnection_new"></a>

### new WebSocketConnection(webSocket, organizationId)

| Param | Type | Description |
| --- | --- | --- |
| webSocket | [<code>WebSocket</code>](./Typedefs.md#WebSocket) | A WebSocket connection to the message bus |
| organizationId | <code>string</code> | UUID corresponding with an organization |

<a name="WebSocketConnection+authorize"></a>

### webSocketConnection.authorize(token) ⇒ <code>Promise</code>
Sends a message to the message bus to authorize a channel

**Kind**: instance method of [<code>WebSocketConnection</code>](#WebSocketConnection)  
**Fulfill**:   
**Reject**: <code>error</code> The error event from the WebSocket or the error message from the message bus  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>string</code> | JSON Web Signature containing the channel and actions needed for authorization |

**Example**  
```js
contxtSdk.bus.connect('4f0e51c6-728b-4892-9863-6d002e61204d')
    .then((webSocket) => {
      webSocket.authorize(token).then(() => {
        console.log("authorization successful")
      })
      .catch((authError) => {
        console.log(authError)
      });
    })
});
```
<a name="WebSocketConnection+close"></a>

### webSocketConnection.close()
Closes the websocket connection

**Kind**: instance method of [<code>WebSocketConnection</code>](#WebSocketConnection)  
**Example**  
```js
contxtSdk.bus.connect('4f0e51c6-728b-4892-9863-6d002e61204d')
  .then((webSocket) => {
    webSocket.close()
  })
  .catch((errorEvent) => {
    console.log(errorEvent);
  });
```
<a name="WebSocketConnection+publish"></a>

### webSocketConnection.publish(serviceClientId, channel, message) ⇒ <code>Promise</code>
Publishes a message to a specific channel on the message bus

**Kind**: instance method of [<code>WebSocketConnection</code>](#WebSocketConnection)  
**Fulfill**:   
**Reject**: <code>error</code> The error event from the WebSocket or the error message from the message bus  

| Param | Type | Description |
| --- | --- | --- |
| serviceClientId | <code>string</code> | Client ID of the message bus service |
| channel | <code>string</code> | Message bus channel the message is being sent to |
| message | <code>Any</code> | Message being sent to the message bus. Must be valid JSON. |

**Example**  
```js
contxtSdk.bus.connect('4f0e51c6-728b-4892-9863-6d002e61204d')
    .then((webSocket) => {
      webSocket.publish('GCXd2bwE9fgvqxygrx2J7TkDJ3ef', 'feed:1', {"example": 1}).then(() => {
        console.log("publish successful")
      })
      .catch((error) => {
        console.log(error)
      });
    });
```
<a name="WebSocketConnection+subscribe"></a>

### webSocketConnection.subscribe(serviceClientId, channel, [group], handler, errorHandler)
Subscribes to a specific channel on the message bus and handles messages as they are received. When the handler is
called, the message is automatically acknowledged after the message completes except whenever an Error is thrown.
The user can also programmatically control when the message is acknowledged by calling `ack` at any time.

**Kind**: instance method of [<code>WebSocketConnection</code>](#WebSocketConnection)  

| Param | Type | Description |
| --- | --- | --- |
| serviceClientId | <code>string</code> | Client ID of the message bus service |
| channel | <code>string</code> | Message bus channel the message is being sent to |
| [group] | <code>string</code> | A unique identifier for the subscriber that can be shared between connections |
| handler | <code>function</code> | A function that gets invoked with every received message |
| errorHandler | <code>function</code> | A function that gets invoked with every error |

**Example**  
```js
contxtSdk.bus.connect('4f0e51c6-728b-4892-9863-6d002e61204d')
    .then((webSocket) => {
      webSocket.subscribe('GCXd2bwE9fgvqxygrx2J7TkDJ3ef', 'feed:1', 'test-sub', (message) => {
        console.log('Message received: ', message);
      }, (error) => {
        console.log('Error received: ', error);
      });
    });
```
**Example**  
```js
contxtSdk.bus.connect('4f0e51c6-728b-4892-9863-6d002e61204d')
    .then((webSocket) => {
      webSocket.subscribe('GCXd2bwE9fgvqxygrx2J7TkDJ3ef', 'feed:1', 'test-sub', (message, ack) => {
        console.log('Message received: ', message);

        ack();
      }, (error) => {
        console.log('Error received: ', error);
      });
    });
```
**Example**  
```js
contxtSdk.bus.connect('4f0e51c6-728b-4892-9863-6d002e61204d')
    .then((webSocket) => {
      webSocket.subscribe('GCXd2bwE9fgvqxygrx2J7TkDJ3ef', 'feed:1', (message) => {
        return db.save(message);
      }, (error) => {
        console.log('Error received: ', error);
      });
    });
```
**Example**  
```js
contxtSdk.bus.connect('4f0e51c6-728b-4892-9863-6d002e61204d')
    .then((webSocket) => {
      webSocket.subscribe('GCXd2bwE9fgvqxygrx2J7TkDJ3ef', 'feed:1', (message, ack) => {
        return db.save(message)
          .then(ack)
          .then(() => {
            // additional processing
          });
      }, (error) => {
        console.log('Error received: ', error);
      });
    });
```

<a name="WebSocketConnection"></a>

## WebSocketConnection
Module that wraps the websocket connection to the message bus
to provide the developer with a specific set of functionality

**Kind**: global class  

* [WebSocketConnection](#WebSocketConnection)
    * [new WebSocketConnection(webSocket, organizationId)](#new_WebSocketConnection_new)
    * [.authorize(token)](#WebSocketConnection+authorize) ⇒ <code>Promise</code>
    * [.close()](#WebSocketConnection+close)
    * [.publish(serviceClientId, channel, message)](#WebSocketConnection+publish) ⇒ <code>Promise</code>

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
    })
});
```

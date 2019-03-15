<a name="Bus"></a>

## Bus
Module that provides access to the message bus. This is for Node
environments. Documentation for browser environments is found under
`BrowserBus`.

**Kind**: global class  

* [Bus](#Bus)
    * [new Bus(sdk, request)](#new_Bus_new)
    * [.connect(organizationId)](#Bus+connect) ⇒ <code>Promise</code>
    * [.getWebSocketConnection(organizationId)](#Bus+getWebSocketConnection) ⇒ [<code>WebSocketConnection</code>](#WebSocketConnection)

<a name="new_Bus_new"></a>

### new Bus(sdk, request)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>Object</code> | An instance of the SDK so the module can communicate with other modules |
| request | <code>Object</code> | An instance of the request module tied to this module's audience. |

<a name="Bus+connect"></a>

### contxtSdk.bus.connect(organizationId) ⇒ <code>Promise</code>
Connects to the message bus via websocket.
If a connection already exists for that organization id, the connection is returned, otherwise a new connection is created and returned.

**Kind**: instance method of [<code>Bus</code>](#Bus)  
**Fulfill**: [<code>WebSocketConnection</code>](#WebSocketConnection)  
**Reject**: <code>errorEvent</code> The error event  

| Param | Type | Description |
| --- | --- | --- |
| organizationId | <code>string</code> | UUID corresponding with an organization |

**Example**  
```js
contxtSdk.bus.connect('4f0e51c6-728b-4892-9863-6d002e61204d')
  .then((webSocket) => {
    console.log(webSocket);
  })
  .catch((errorEvent) => {
    console.log(errorEvent);
  });
```
<a name="Bus+getWebSocketConnection"></a>

### contxtSdk.bus.getWebSocketConnection(organizationId) ⇒ [<code>WebSocketConnection</code>](#WebSocketConnection)
Gets the WebSocketConnection for an organization id
If a connection already exists for that organization id, the connection is returned, otherwise returns undefined.

**Kind**: instance method of [<code>Bus</code>](#Bus)  

| Param | Type | Description |
| --- | --- | --- |
| organizationId | <code>string</code> | UUID corresponding with an organization |

**Example**  
```js
const messageBusWebSocket = contxtSdk.bus.getWebSocketConnection('4f0e51c6-728b-4892-9863-6d002e61204d');
```

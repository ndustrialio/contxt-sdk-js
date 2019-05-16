<a name="BrowserBus"></a>

## BrowserBus
Module that provides access to the message bus. This is for browser
environments. Documentation for Node environments is found under `Bus`.

**Kind**: global class  

* [BrowserBus](#BrowserBus)
    * [new Bus(sdk, request)](#new_BrowserBus_new)
    * [.connect()](#BrowserBus+connect)
    * [.getWebSocketConnection()](#BrowserBus+getWebSocketConnection)

<a name="new_BrowserBus_new"></a>

### new Bus(sdk, request)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>Object</code> | An instance of the SDK so the module can communicate with other modules |
| request | <code>Object</code> | An instance of the request module tied to this module's audience. |

<a name="BrowserBus+connect"></a>

### contxtSdk.bus.connect()
Connects to the message bus via WebSocket. Does not currently work in
browser environments.

**Kind**: instance method of [<code>BrowserBus</code>](#BrowserBus)  
<a name="BrowserBus+getWebSocketConnection"></a>

### contxtSdk.bus.getWebSocketConnection()
Gets an open WebSocketConnection for an organization ID. Does not currently
work in browser environments.

**Kind**: instance method of [<code>BrowserBus</code>](#BrowserBus)  

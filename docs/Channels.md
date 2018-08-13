<a name="Channels"></a>

## Channels
Module that provides access to message bus channels

**Kind**: global class  

* [Channels](#Channels)
    * [new Channels(sdk, request, baseUrl)](#new_Channels_new)
    * [.create(channel)](#Channels+create) ⇒ <code>Promise</code>
    * [.delete(organizationId, serviceId, channelId)](#Channels+delete) ⇒ <code>Promise</code>
    * [.get(organizationId, serviceId, channelId)](#Channels+get) ⇒ <code>Promise</code>
    * [.update(organizationId, serviceId, channelId, update)](#Channels+update) ⇒ <code>Promise</code>

<a name="new_Channels_new"></a>

### new Channels(sdk, request, baseUrl)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>Object</code> | An instance of the SDK so the module can communicate with other modules |
| request | <code>Object</code> | An instance of the request module tied to this module's audience. |
| baseUrl | <code>string</code> | The base URL provided by the parent module |

<a name="Channels+create"></a>

### contxtSdk.bus.channels.create(channel) ⇒ <code>Promise</code>
Creates a new message bus channel

API Endpoint: '/organizations/:organizationId/services/:serviceId/channels'
Method: POST

**Kind**: instance method of [<code>Channels</code>](#Channels)  
**Fulfill**: [<code>MessageBusChannel</code>](./Typedefs.md#MessageBusChannel) Information about the new channel  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| channel | <code>Object</code> |  |
| channel.name | <code>string</code> |  |
| channel.organizationId | <code>string</code> | UUID corresponding with an organization |
| channel.serviceId | <code>string</code> | ID of a service |

**Example**  
```js
contxtSdk.bus.channels
  .create({
    name: 'Channel 46',
    organizationId: '28cc036c-d87f-4f06-bd30-1e78c2701064',
    serviceId: 'abc123service'
  })
  .then((channel) => console.log(channel))
  .catch((err) => console.log(err));
```
<a name="Channels+delete"></a>

### contxtSdk.bus.channels.delete(organizationId, serviceId, channelId) ⇒ <code>Promise</code>
Deletes a message bus channel

API Endpoint: '/organizations/:organizationId/services/:serviceId/channels/:channelId'
Method: DELETE

**Kind**: instance method of [<code>Channels</code>](#Channels)  
**Fulfill**: <code>undefined</code>  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| organizationId | <code>string</code> | UUID of the organization |
| serviceId | <code>string</code> | ID of the service |
| channelId | <code>string</code> | UUID of the channel |

**Example**  
```js
contxtSdk.bus.channels
  .delete(
    '875afddd-091c-4385-bc21-0edf38804d27',
    'ab123service',
    '175afdec-291c-4385-bc21-0edf38804d21'
  );
```
<a name="Channels+get"></a>

### contxtSdk.bus.channels.get(organizationId, serviceId, channelId) ⇒ <code>Promise</code>
Gets information about a message bus channel

API Endpoint: '/organizations/:organizationId/services/:serviceId/channels/:channelId'
Method: GET

**Kind**: instance method of [<code>Channels</code>](#Channels)  
**Fulfill**: [<code>MessageBusChannel</code>](./Typedefs.md#MessageBusChannel) Information about an event  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| organizationId | <code>string</code> | UUID of the organization |
| serviceId | <code>string</code> | ID of the service |
| channelId | <code>string</code> | UUID of the channel |

**Example**  
```js
contxtSdk.bus.channels
  .get(
    '875afddd-091c-4385-bc21-0edf38804d27',
    'ab123service',
    '175afdec-291c-4385-bc21-0edf38804d21'
  )
  .then((channel) => console.log(channel))
  .catch((err) => console.log(err));
```
<a name="Channels+update"></a>

### contxtSdk.bus.channels.update(organizationId, serviceId, channelId, update) ⇒ <code>Promise</code>
Updates a message bus channel

API Endpoint: '/organizations/:organizationId/services/:serviceId/channels/:channelId'
Method: PUT

**Kind**: instance method of [<code>Channels</code>](#Channels)  
**Fulfill**: <code>undefined</code>  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| organizationId | <code>string</code> | UUID of the organization |
| serviceId | <code>string</code> | ID of the service |
| channelId | <code>string</code> | UUID of the channel to update |
| update | <code>Object</code> | An object containing the updated data for the channel |
| [update.name] | <code>string</code> |  |

**Example**  
```js
contxtSdk.bus.channels
  .update(
    '875afddd-091c-4385-bc21-0edf38804d27',
    'ab123service',
    '175afdec-291c-4385-bc21-0edf38804d21'
    { name: 'An Updated Channel Name' }
  );
```

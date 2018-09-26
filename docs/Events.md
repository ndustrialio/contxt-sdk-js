<a name="Events"></a>

## Events
Module that provides access to, and the manipulation
of, information about different events

**Kind**: global class  

* [Events](#Events)
    * [new Events(sdk, request)](#new_Events_new)
    * [.create(event)](#Events+create) ⇒ <code>Promise</code>
    * [.delete(eventId)](#Events+delete) ⇒ <code>Promise</code>
    * [.get(eventId)](#Events+get) ⇒ <code>Promise</code>
    * [.getEventTypesByClientId(clientId)](#Events+getEventTypesByClientId) ⇒ <code>Promise</code>
    * [.getEventsByTypeId(eventTypeId, facilityId, [latest])](#Events+getEventsByTypeId) ⇒ <code>Promise</code>
    * [.update(eventId, update)](#Events+update) ⇒ <code>Promise</code>

<a name="new_Events_new"></a>

### new Events(sdk, request)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>Object</code> | An instance of the SDK so the module can communicate with other modules |
| request | <code>Object</code> | An instance of the request module tied to this module's audience. |

<a name="Events+create"></a>

### contxtSdk.events.create(event) ⇒ <code>Promise</code>
Creates a new event

API Endpoint: '/events'
Method: POST

**Kind**: instance method of [<code>Events</code>](#Events)  
**Fulfill**: [<code>Event</code>](./Typedefs.md#Event) Information about the new event  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> |  |
| [event.allowOthersToTrigger] | <code>boolean</code> |  |
| event.eventTypeId | <code>string</code> | UUID corresponding with an event type |
| [event.facilityId] | <code>number</code> |  |
| [event.isPublic] | <code>boolean</code> |  |
| event.name | <code>string</code> |  |
| event.organizationId | <code>string</code> | UUID corresponding with an organization |

**Example**  
```js
contxtSdk.events
  .create({
    allowOthersToTrigger: false,
    eventTypeId: 'd47e5699-cc17-4631-a2c5-6cefceb7863d',
    isPublic: false,
    name: 'A Major Event',
    organizationId: '28cc036c-d87f-4f06-bd30-1e78c2701064'
  })
  .then((event) => console.log(event))
  .catch((err) => console.log(err));
```
<a name="Events+delete"></a>

### contxtSdk.events.delete(eventId) ⇒ <code>Promise</code>
Deletes an event

API Endpoint: '/events/:eventId'
Method: DELETE

**Kind**: instance method of [<code>Events</code>](#Events)  
**Fulfill**: <code>undefined</code>  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>string</code> | The ID of the Event |

**Example**  
```js
contxtSdk.events.delete('875afddd-091c-4385-bc21-0edf38804d27');
```
<a name="Events+get"></a>

### contxtSdk.events.get(eventId) ⇒ <code>Promise</code>
Gets information about an event

API Endpoint: '/events/:eventId'
Method: GET

**Kind**: instance method of [<code>Events</code>](#Events)  
**Fulfill**: [<code>Event</code>](./Typedefs.md#Event) Information about an event  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>string</code> | The ID of the event |

**Example**  
```js
contxtSdk.events
  .get('875afddd-091c-4385-bc21-0edf38804d27')
  .then((event) => console.log(event))
  .catch((err) => console.log(err));
```
<a name="Events+getEventTypesByClientId"></a>

### contxtSdk.events.getEventTypesByClientId(clientId) ⇒ <code>Promise</code>
Gets all event types for a client

API Endpoint: '/clients/:clientId/types'
Method: GET

**Kind**: instance method of [<code>Events</code>](#Events)  
**Fulfill**: [<code>Events</code>](#Events) Events from the server  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| clientId | <code>string</code> | The ID of the client |

**Example**  
```js
contxtSdk.events
  .getEventTypesByClientId('CW4B1Ih6M1nNwwxk0XOKI21MVH04pGUL')
  .then((events) => console.log(events))
  .catch((err) => console.log(err));
```
<a name="Events+getEventsByTypeId"></a>

### contxtSdk.events.getEventsByTypeId(eventTypeId, facilityId, [latest]) ⇒ <code>Promise</code>
Gets all events by type

API Endpoint: '/types/:typeId/events?facility_id=:facility_id&include[]=latest'
Method: GET

**Kind**: instance method of [<code>Events</code>](#Events)  
**Fulfill**: <code>EventTypes</code> EventTypes from server  
**Reject**: <code>Error</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| eventTypeId | <code>string</code> |  | The ID of the type |
| facilityId | <code>number</code> |  | The ID of the facility |
| [latest] | <code>boolean</code> | <code>false</code> | A boolean to determine if we only want to receive the most recent |

**Example**  
```js
contxtSdk.events
  .getEventsByTypeId('3e9b572b-6b39-4dd5-a9e5-075095eb0867', 150, true)
  .then((events) => console.log(events))
  .catch((err) => console.log(err));
```
<a name="Events+update"></a>

### contxtSdk.events.update(eventId, update) ⇒ <code>Promise</code>
Updates an event

API Endpoint: '/events/:eventId'
Method: PUT

**Kind**: instance method of [<code>Events</code>](#Events)  
**Fulfill**: <code>undefined</code>  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>number</code> | The ID of the event to update |
| update | <code>Object</code> | An object containing the updated data for the event |
| [update.facilityId] | <code>number</code> |  |
| [update.isPublic] | <code>boolean</code> |  |
| [update.name] | <code>string</code> |  |

**Example**  
```js
contxtSdk.events.update('875afddd-091c-4385-bc21-0edf38804d27', {
  name: 'Sgt. Pepper's Lonely Hearts Club Band Event'
});
```

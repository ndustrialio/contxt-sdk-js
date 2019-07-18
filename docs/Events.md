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
    * [.getEventTypesByClientId(clientId, [paginationOptions])](#Events+getEventTypesByClientId) ⇒ <code>Promise</code>
    * [.getEventsByTypeId(eventTypeId, [latest])](#Events+getEventsByTypeId) ⇒ <code>Promise</code>
    * [.subscribeUser(userId, eventId)](#Events+subscribeUser) ⇒ <code>Promise</code>
    * [.unsubscribeUser(userId, userEventSubscriptionId)](#Events+unsubscribeUser) ⇒ <code>Promise</code>
    * [.update(eventId, update)](#Events+update) ⇒ <code>Promise</code>
    * [.createEventType(eventType)](#Events+createEventType) ⇒ <code>Promise</code>

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

### contxtSdk.events.getEventTypesByClientId(clientId, [paginationOptions]) ⇒ <code>Promise</code>
Gets all event types for a client

API Endpoint: '/clients/:clientId/types'
Method: GET

**Kind**: instance method of [<code>Events</code>](#Events)  
**Fulfill**: [<code>EventTypesFromServer</code>](./Typedefs.md#EventTypesFromServer) Event types from the server  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| clientId | <code>string</code> | The ID of the client |
| [paginationOptions] | [<code>PaginationOptions</code>](./Typedefs.md#PaginationOptions) |  |

**Example**  
```js
contxtSdk.events
  .getEventTypesByClientId('CW4B1Ih6M1nNwwxk0XOKI21MVH04pGUL')
  .then((events) => console.log(events))
  .catch((err) => console.log(err));
```
<a name="Events+getEventsByTypeId"></a>

### contxtSdk.events.getEventsByTypeId(eventTypeId, [latest]) ⇒ <code>Promise</code>
Gets all events by type

API Endpoint: '/types/:typeId/events'
Method: GET

**Kind**: instance method of [<code>Events</code>](#Events)  
**Fulfill**: [<code>EventsFromServer</code>](./Typedefs.md#EventsFromServer) Event from server  
**Reject**: <code>Error</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| eventTypeId | <code>string</code> |  | The ID of the type |
| [eventsFilters.facilityId] | <code>number</code> |  | ID of facility to restrict event types to |
| [eventsFilters.include] | <code>Array.&lt;string&gt;</code> |  | List of additional information to be included in the results. Possible options are: 'triggered.latest' |
| [eventsFilters.limit] | <code>number</code> |  | Maximum number of records to return per query |
| [eventsFilters.offset] | <code>number</code> |  | How many records from the first record to start the query |
| [latest] | <code>boolean</code> | <code>false</code> | A boolean to determine if we only want to receive the most recent |

**Example**  
```js
contxtSdk.events
  .getEventsByTypeId(
     '3e9b572b-6b39-4dd5-a9e5-075095eb0867',
     {
       limit: 10,
       offset: 0,
       include: ['triggered.latest']
     }
   )
  .then((events) => console.log(events))
  .catch((err) => console.log(err));
```
<a name="Events+subscribeUser"></a>

### contxtSdk.events.subscribeUser(userId, eventId) ⇒ <code>Promise</code>
Subscribes an user to an event

API Endpoint: '/users/:userId/events/:event_id'
Method: POST

**Kind**: instance method of [<code>Events</code>](#Events)  
**Fulfill**: [<code>UserEventSubscription</code>](./Typedefs.md#UserEventSubscription) The newly created user event  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| userId | <code>string</code> | The ID of the user |
| eventId | <code>string</code> | The ID of the event |

**Example**  
```js
contxtSdk.events
  .subscribeUser('auth0|saklafjheuaiweh', '007ca9ee-ece7-4931-9d11-9b4fd97d4d58')
  .then((userEvent) => console.log(userEvent))
  .catch((err) => console.log(err));
```
<a name="Events+unsubscribeUser"></a>

### contxtSdk.events.unsubscribeUser(userId, userEventSubscriptionId) ⇒ <code>Promise</code>
Removes an event subscription from a user

API Endpoint: '/users/:userId/subscriptions/:user_event_subscription_id'
Method: DELETE

**Kind**: instance method of [<code>Events</code>](#Events)  
**Fulfill**: <code>undefined</code>  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| userId | <code>string</code> | The ID of the user |
| userEventSubscriptionId | <code>string</code> | The ID of the user event subscription |

**Example**  
```js
contxtSdk.events
  .unsubscribeUser('auth0|saklafjheuaiweh', '007ca9ee-ece7-4931-9d11-9b4fd97d4d58')
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
<a name="Events+createEventType"></a>

### contxtSdk.events.createEventType(eventType) ⇒ <code>Promise</code>
Creates a new event type

API Endpoint: '/types'
Method: POST

**Kind**: instance method of [<code>Events</code>](#Events)  
**Fulfill**: [<code>EventType</code>](./Typedefs.md#EventType) Information about the new event type  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| eventType | <code>Object</code> |  |
| eventType.name | <code>string</code> |  |
| eventType.description | <code>string</code> |  |
| [eventType.level] | <code>number</code> | Priority level associated with event type |
| eventType.clientId | <code>string</code> | UUID corresponding with the client |
| eventType.slug | <code>string</code> | Unique per clientId to identify the event type |
| eventType.isRealtimeEnabled | <code>boolean</code> | Flag for if the event is real time |
| eventType.isOngoingEvent | <code>boolean</code> | Flag for if the event is ongoing/updated frequently |

**Example**  
```js
contxtSdk.events
  .createEventType({
    name: 'Example name',
    description: 'Example description',
    level: 2,
    clientId: 'd47e5699-cc17-4631-a2c5-6cefceb7863d',
    slug: 'example_slug',
    isRealtimeEnabled: false,
    isOngoingEvent: false
  })
  .then((eventType) => console.log(eventType))
  .catch((err) => console.log(err));
```

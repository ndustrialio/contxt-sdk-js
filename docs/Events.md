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
| [update.allowOthersToTrigger] | <code>boolean</code> |  |
| [update.eventTypeId] | <code>string</code> | UUID corresponding with an event type |
| [update.facilityId] | <code>number</code> |  |
| [update.isPublic] | <code>boolean</code> |  |
| [update.name] | <code>string</code> |  |
| [update.organizationId] | <code>string</code> | UUID corresponding with an organization |

**Example**  
```js
contxtSdk.events.update('875afddd-091c-4385-bc21-0edf38804d27', {
  name: 'Sgt. Pepper's Lonely Hearts Club Band Event'
});
```

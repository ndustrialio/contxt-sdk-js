<a name="Feeds"></a>

## Feeds
Module that provides access to feed information

**Kind**: global class  

* [Feeds](#Feeds)
    * [new Feeds(sdk, request, baseUrl)](#new_Feeds_new)
    * [.getByFacilityId(facilityId)](#Feeds+getByFacilityId) ⇒ <code>Promise</code>

<a name="new_Feeds_new"></a>

### new Feeds(sdk, request, baseUrl)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>Object</code> | An instance of the SDK so the module can communicate   with other modules |
| request | <code>Object</code> | An instance of the request module tied to this   module's audience |
| baseUrl | <code>string</code> | The base URL provided by the parent module |

<a name="Feeds+getByFacilityId"></a>

### contxtSdk.iot.feeds.getByFacilityId(facilityId) ⇒ <code>Promise</code>
Gets all feeds from a specific facility

API Endpoint: '/feeds'
Method: GET

**Kind**: instance method of [<code>Feeds</code>](#Feeds)  
**Fulfill**: <code>Feeds[]</code> Information about the feeds that are assigned to specific facility  
**Reject**: <code>Error</code>  

| Param | Type |
| --- | --- |
| facilityId | <code>number</code> | 

**Example**  
```js
contxtSdk.iot.feeds
  .getByFacilityId(facilityId)
  .then((feeds) => console.log(feeds))
  .catch((err) => console.log(err));
```

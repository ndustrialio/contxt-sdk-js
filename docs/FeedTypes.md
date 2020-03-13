<a name="FeedTypes"></a>

## FeedTypes
Module that provides access to feed type information

**Kind**: global class  

* [FeedTypes](#FeedTypes)
    * [new FeedTypes(sdk, request, baseUrl)](#new_FeedTypes_new)
    * [.getAll()](#FeedTypes+getAll) ⇒ <code>Promise</code>

<a name="new_FeedTypes_new"></a>

### new FeedTypes(sdk, request, baseUrl)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>Object</code> | An instance of the SDK so the module can communicate   with other modules |
| request | <code>Object</code> | An instance of the request module tied to this   module's audience |
| baseUrl | <code>string</code> | The base URL provided by the parent module |

<a name="FeedTypes+getAll"></a>

### contxtSdk.iot.feedTypes.getAll() ⇒ <code>Promise</code>
Get a listing of all feed types

API Endpoint: '/feeds/types'
Method: GET

**Kind**: instance method of [<code>FeedTypes</code>](#FeedTypes)  
**Fulfill**: <code>FeedType[]</code> A list of feed types  
**Reject**: <code>Error</code>  
**Example**  
```js
contxtSdk.iot.feedTypes
  .getAll()
  .then((feedTypes) => console.log(feedTypes))
  .catch((err) => console.log(err));
```

<a name="FeedTypes"></a>

## FeedTypes
Module that provides access to feed type information

**Kind**: global class  

* [FeedTypes](#FeedTypes)
    * [new FeedTypes(sdk, request, baseUrl)](#new_FeedTypes_new)
    * [.getAll([paginationOptions])](#FeedTypes+getAll) ⇒ <code>Promise</code>

<a name="new_FeedTypes_new"></a>

### new FeedTypes(sdk, request, baseUrl)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>Object</code> | An instance of the SDK so the module can communicate   with other modules |
| request | <code>Object</code> | An instance of the request module tied to this   module's audience |
| baseUrl | <code>string</code> | The base URL provided by the parent module |

<a name="FeedTypes+getAll"></a>

### contxtSdk.iot.feedTypes.getAll([paginationOptions]) ⇒ <code>Promise</code>
Get a listing of all feed types

API Endpoint: '/feeds/types'
Method: GET

**Kind**: instance method of [<code>FeedTypes</code>](#FeedTypes)  
**Fulfill**: <code>FeedTypesFromServer</code> Information about the feed types  
**Reject**: <code>Error</code>  

| Param | Type |
| --- | --- |
| [paginationOptions] | [<code>PaginationOptions</code>](./Typedefs.md#PaginationOptions) | 

**Example**  
```js
contxtSdk.iot.feedTypes
  .getAll()
  .then((feedTypes) => console.log(feedTypes))
  .catch((err) => console.log(err));
```

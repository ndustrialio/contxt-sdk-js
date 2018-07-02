<a name="Fields"></a>

## Fields
Module that provides access to field information

**Kind**: global class  

* [Fields](#Fields)
    * [new Fields(sdk, request, baseUrl)](#new_Fields_new)
    * [.get(outputFieldId)](#Fields+get) ⇒ <code>Promise</code>

<a name="new_Fields_new"></a>

### new Fields(sdk, request, baseUrl)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>Object</code> | An instance of the SDK so the module can communicate   with other modules |
| request | <code>Object</code> | An instance of the request module tied to this   module's audience |
| baseUrl | <code>string</code> | The base URL provided by the parent module |

<a name="Fields+get"></a>

### contxtSdk.iot.fields.get(outputFieldId) ⇒ <code>Promise</code>
Gets information about a field

API Endpoint: '/fields/:fieldId'
Method: GET

**Kind**: instance method of [<code>Fields</code>](#Fields)  
**Fulfill**: [<code>OutputField</code>](./Typedefs.md#OutputField) Information about the output field  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| outputFieldId | <code>Number</code> | The ID of an output field |

**Example**  
```js
contxtSdk.iot.fields
  .get(563)
  .then((outputField) => console.log(outputField))
  .catch((err) => console.log(err));
```

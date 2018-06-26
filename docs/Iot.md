<a name="Iot"></a>

## Iot
Module that provides access to real time IOT feeds and fields.

**Kind**: global class  

* [Iot](#Iot)
    * [new Iot(sdk, request)](#new_Iot_new)
    * [.getOutputField(outputFieldId)](#Iot+getOutputField) ⇒ <code>Promise</code>

<a name="new_Iot_new"></a>

### new Iot(sdk, request)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>Object</code> | An instance of the SDK so the module can communicate        with other modules |
| request | <code>Object</code> | An instance of the request module tied to this        module's audience. |

<a name="Iot+getOutputField"></a>

### contxtSdk.iot.getOutputField(outputFieldId) ⇒ <code>Promise</code>
Gets information about a field

API Endpoint: '/fields/:fieldId'
Method: GET

**Kind**: instance method of [<code>Iot</code>](#Iot)  
**Fulfill**: [<code>OutputField</code>](./Typedefs.md#OutputField) Information about the output field  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| outputFieldId | <code>number</code> | The ID of an output field |

**Example**  
```js
contxtSdk.iot.getOutputField(25)
  .then((outputField) => console.log(outputField));
  .catch((err) => console.log(err));
```

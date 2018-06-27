<a name="Outputs"></a>

## Outputs
Module that provides access to output information

**Kind**: global class  

* [Outputs](#Outputs)
    * [new Outputs(sdk, request, baseUrl)](#new_Outputs_new)
    * [.getFieldData(outputId, fieldHumanName)](#Outputs+getFieldData) ⇒ <code>Promise</code>

<a name="new_Outputs_new"></a>

### new Outputs(sdk, request, baseUrl)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>Object</code> | An instance of the SDK so the module can communicate   with other modules |
| request | <code>Object</code> | An instance of the request module tied to this   module's audience |
| baseUrl | <code>string</code> | The base URL provided by the parent module |

<a name="Outputs+getFieldData"></a>

### contxtSdk.iot.outputs.getFieldData(outputId, fieldHumanName) ⇒ <code>Promise</code>
Gets an output's data from a specific field

API Endpoint: '/outputs/:outputId/fields/:fieldHumanName/data'
Method: GET

**Kind**: instance method of [<code>Outputs</code>](#Outputs)  
**Fulfill**: <code>Object</code>  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| outputId | <code>Number</code> | The ID of an output |
| fieldHumanName | <code>String</code> | The human readable name of a field |

**Example**  
```js
contxtSdk.iot.outputs.getFieldData(491, 'temperature')
  .then((outputData) => console.log(outputData));
  .catch((err) => console.log(err));
```

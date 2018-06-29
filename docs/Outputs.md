<a name="Outputs"></a>

## Outputs
Module that provides access to output information

**Kind**: global class  

* [Outputs](#Outputs)
    * [new Outputs(sdk, request, baseUrl)](#new_Outputs_new)
    * [.getFieldData(outputId, fieldHumanName, [options])](#Outputs+getFieldData) ⇒ <code>Promise</code>

<a name="new_Outputs_new"></a>

### new Outputs(sdk, request, baseUrl)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>Object</code> | An instance of the SDK so the module can communicate   with other modules |
| request | <code>Object</code> | An instance of the request module tied to this   module's audience |
| baseUrl | <code>string</code> | The base URL provided by the parent module |

<a name="Outputs+getFieldData"></a>

### contxtSdk.iot.outputs.getFieldData(outputId, fieldHumanName, [options]) ⇒ <code>Promise</code>
Gets an output's data from a specific field

API Endpoint: '/outputs/:outputId/fields/:fieldHumanName/data'
Method: GET

**Kind**: instance method of [<code>Outputs</code>](#Outputs)  
**Fulfill**: [<code>OutputFieldDataResponse</code>](./Typedefs.md#OutputFieldDataResponse)  
**Reject**: <code>Error</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| outputId | <code>Number</code> |  | The ID of an output |
| fieldHumanName | <code>String</code> |  | The human readable name of a field |
| [options] | <code>Object</code> |  |  |
| [options.limit] | <code>Number</code> | <code>5000</code> | Number of records to return |
| [options.timeEnd] | <code>Number</code> |  | UNIX timestamp indicating the end of the   query window |
| [options.timeStart] | <code>Number</code> |  | UNIX timestamp indicating the start of   the query window |
| [options.window] | <code>Number</code> |  | The sampling window for records.   Required if including a timeEnd or timeStart.   Valid options include: `0`, `60`, `900`, and `3600` |

**Example**  
```js
contxtSdk.iot.outputs
  .getFieldData(491, 'temperature', {
    limit: 100,
    timeStart: 1530290218365,
    window: 3600
  })
  .then(outputData => console.log(outputData))
  .catch(err => console.log(err));
```

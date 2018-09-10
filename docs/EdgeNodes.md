<a name="EdgeNodes"></a>

## EdgeNodes
Module that provides access to contxt edge nodes

**Kind**: global class  

* [EdgeNodes](#EdgeNodes)
    * [new EdgeNodes(sdk, request, baseUrl)](#new_EdgeNodes_new)
    * [.get(organizationId, edgeNodeClientId)](#EdgeNodes+get) ⇒ <code>Promise</code>

<a name="new_EdgeNodes_new"></a>

### new EdgeNodes(sdk, request, baseUrl)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>Object</code> | An instance of the SDK so the module can communicate with other modules |
| request | <code>Object</code> | An instance of the request module tied to this module's audience. |
| baseUrl | <code>string</code> | The base URL provided by the parent module |

<a name="EdgeNodes+get"></a>

### contxtSdk.coordinator.edgeNodes.get(organizationId, edgeNodeClientId) ⇒ <code>Promise</code>
Get an edge node

API Endpoint: '/organizations/:organizationId/edgenodes/:edgeNodeClientId'
METHOD: GET

**Kind**: instance method of [<code>EdgeNodes</code>](#EdgeNodes)  
**Fulfill**: [<code>EdgeNode</code>](./Typedefs.md#EdgeNode)  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| organizationId | <code>string</code> | UUID |
| edgeNodeClientId | <code>string</code> |  |

**Example**  
```js
contxtSdk.coordinator.edgeNodes
  .get('59270c25-4de9-4b22-8e0b-ab287ac344ce', 'abc123')
  .then((edgeNode) => console.log(edgeNode))
  .catch((err) => console.log(err));
```

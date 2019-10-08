<a name="EdgeNodes"></a>

## EdgeNodes
Module that provides access to contxt edge nodes

**Kind**: global class  

* [EdgeNodes](#EdgeNodes)
    * [new EdgeNodes(sdk, request, baseUrl, [organizationId])](#new_EdgeNodes_new)
    * [.get(organizationId, edgeNodeClientId)](#EdgeNodes+get) ⇒ <code>Promise</code>

<a name="new_EdgeNodes_new"></a>

### new EdgeNodes(sdk, request, baseUrl, [organizationId])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| sdk | <code>Object</code> |  | An instance of the SDK so the module can communicate with other modules |
| request | <code>Object</code> |  | An instance of the request module tied to this module's audience. |
| baseUrl | <code>string</code> |  | The base URL provided by the parent module |
| [organizationId] | <code>string</code> | <code>null</code> | The organization ID to be used in tenant url requests |

<a name="EdgeNodes+get"></a>

### contxtSdk.coordinator.edgeNodes.get(organizationId, edgeNodeClientId) ⇒ <code>Promise</code>
Get an edge node

Legacy API Endpoint: '/organizations/:organizationId/edgenodes/:edgeNodeClientId'
API Endpoint: 'edgenodes/:edgeNodeClientId'
METHOD: GET

**Kind**: instance method of [<code>EdgeNodes</code>](#EdgeNodes)  
**Fulfill**: [<code>EdgeNode</code>](./Typedefs.md#EdgeNode)  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| organizationId | <code>string</code> | The ID of the organization, optional when using the tenant API and an organization ID has been set |
| edgeNodeClientId | <code>string</code> |  |

**Example**  
```js
contxtSdk.coordinator.edgeNodes
  .get('59270c25-4de9-4b22-8e0b-ab287ac344ce', 'abc123')
  .then((edgeNode) => console.log(edgeNode))
  .catch((err) => console.log(err));
```

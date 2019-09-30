<a name="Coordinator"></a>

## Coordinator
Module that provides access to information about Contxt

**Kind**: global class  

* [Coordinator](#Coordinator)
    * [new Coordinator(sdk, request)](#new_Coordinator_new)
    * [.setOrganizationId(organizationId)](#Coordinator+setOrganizationId)

<a name="new_Coordinator_new"></a>

### new Coordinator(sdk, request)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>Object</code> | An instance of the SDK so the module can communicate with other modules |
| request | <code>Object</code> | An instance of the request module tied to this module's audience. |

<a name="Coordinator+setOrganizationId"></a>

### contxtSdk.coordinator.setOrganizationId(organizationId)
Sets a selected oranization ID to be used in tenant based requests

**Kind**: instance method of [<code>Coordinator</code>](#Coordinator)  

| Param | Type | Description |
| --- | --- | --- |
| organizationId | <code>string</code> | the ID of the organization |

**Example**  
```js
contxtSdk.coordinator
  .setOrganizationId('36b8421a-cc4a-4204-b839-1397374fb16b');
```

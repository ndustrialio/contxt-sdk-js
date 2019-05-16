<a name="Roles"></a>

## Roles
Module that provides access to contxt roles

**Kind**: global class  

* [Roles](#Roles)
    * [new Roles(sdk, request, baseUrl)](#new_Roles_new)
    * [.getByOrganizationId(organizationId)](#Roles+getByOrganizationId) ⇒ <code>Promise</code>

<a name="new_Roles_new"></a>

### new Roles(sdk, request, baseUrl)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>Object</code> | An instance of the SDK so the module can communicate with other modules |
| request | <code>Object</code> | An instance of the request module tied to this module's audience. |
| baseUrl | <code>string</code> | The base URL provided by the parent module |

<a name="Roles+getByOrganizationId"></a>

### contxtSdk.coordinator.roles.getByOrganizationId(organizationId) ⇒ <code>Promise</code>
Gets an organization's list of roles

API Endpoint: '/organizations/:organizationId/roles'
Method: GET

**Kind**: instance method of [<code>Roles</code>](#Roles)  
**Fulfill**: <code>ContxtRole[]</code> A list of roles  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| organizationId | <code>string</code> | The ID of the organization |

**Example**  
```js
contxtSdk.coordinator.roles
  .getByOrganizationId('36b8421a-cc4a-4204-b839-1397374fb16b')
  .then((roles) => console.log(roles))
  .catch((err) => console.log(err));
```

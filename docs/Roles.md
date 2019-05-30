<a name="Roles"></a>

## Roles
Module that provides access to contxt roles

**Kind**: global class  

* [Roles](#Roles)
    * [new Roles(sdk, request, baseUrl)](#new_Roles_new)
    * [.create(organizationId, role)](#Roles+create) ⇒ <code>Promise</code>
    * [.delete(organizationId, roleId)](#Roles+delete) ⇒ <code>Promise</code>
    * [.getByOrganizationId(organizationId)](#Roles+getByOrganizationId) ⇒ <code>Promise</code>

<a name="new_Roles_new"></a>

### new Roles(sdk, request, baseUrl)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>Object</code> | An instance of the SDK so the module can communicate with other modules |
| request | <code>Object</code> | An instance of the request module tied to this module's audience. |
| baseUrl | <code>string</code> | The base URL provided by the parent module |

<a name="Roles+create"></a>

### contxtSdk.coordinator.roles.create(organizationId, role) ⇒ <code>Promise</code>
Create a new role for an organization

**Kind**: instance method of [<code>Roles</code>](#Roles)  
**Fulfill**: [<code>ContxtRole</code>](./Typedefs.md#ContxtRole) The newly created role  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| organizationId | <code>string</code> | The ID of the organization |
| role | <code>Object</code> |  |
| role.name | <code>string</code> | The name of the new role |
| role.description | <code>string</code> | Some text describing the purpose of the role |

**Example**  
```js
contxtSdk.coordinator.roles
  .create('36b8421a-cc4a-4204-b839-1397374fb16b', {
    name: 'view-myapp',
    description: 'Give this role for viewing myapp'
   })
  .then((role) => console.log(role))
  .catch((err) => console.log(err));
```
<a name="Roles+delete"></a>

### contxtSdk.coordinator.roles.delete(organizationId, roleId) ⇒ <code>Promise</code>
Deletes a role from an organization

API Endpoint: '/organizations/:organizationId/roles/:roleId'
Method: DELETE

**Kind**: instance method of [<code>Roles</code>](#Roles)  
**Fulfill**: <code>undefined</code>  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| organizationId | <code>string</code> | The ID of the organization |
| roleId | <code>string</code> | The UUID formatted ID of the role |

**Example**  
```js
contxtSdk.roles.delete('4f0e51c6-728b-4892-9863-6d002e61204d');
```
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

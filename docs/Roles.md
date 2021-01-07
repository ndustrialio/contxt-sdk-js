<a name="Roles"></a>

## Roles
Module that provides access to contxt roles

**Kind**: global class  

* [Roles](#Roles)
    * [new Roles(sdk, request, baseUrl, [organizationId])](#new_Roles_new)
    * [.addApplication(roleId, applicationId)](#Roles+addApplication) ⇒ <code>Promise</code>
    * [.addProjectEnvironment(roleId, projectSlug, projectEnvironmentSlug, accessType)](#Roles+addProjectEnvironment) ⇒ <code>Promise</code>
    * [.create(organizationId, role)](#Roles+create) ⇒ <code>Promise</code>
    * [.delete(organizationId, roleId)](#Roles+delete) ⇒ <code>Promise</code>
    * [.getByOrganizationId(organizationId)](#Roles+getByOrganizationId) ⇒ <code>Promise</code>
    * [.removeApplication(roleId, applicationId)](#Roles+removeApplication) ⇒ <code>Promise</code>
    * [.removeProjectEnvironment(roleId, projectSlug, projectEnvironmentSlug)](#Roles+removeProjectEnvironment) ⇒ <code>Promise</code>

<a name="new_Roles_new"></a>

### new Roles(sdk, request, baseUrl, [organizationId])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| sdk | <code>Object</code> |  | An instance of the SDK so the module can communicate with other modules |
| request | <code>Object</code> |  | An instance of the request module tied to this module's audience. |
| baseUrl | <code>string</code> |  | The base URL provided by the parent module |
| [organizationId] | <code>string</code> | <code>null</code> | The organization ID to be used in tenant url requests |

<a name="Roles+addApplication"></a>

### contxtSdk.coordinator.roles.addApplication(roleId, applicationId) ⇒ <code>Promise</code>
Add an application to a role

API Endpoint: '/roles/:roleId/applications/:applicationId'
Method: POST

**Kind**: instance method of [<code>Roles</code>](#Roles)  
**Fulfill**: [<code>ContxtRoleApplication</code>](./Typedefs.md#ContxtRoleApplication)  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| roleId | <code>string</code> | The UUID formatted ID of the role |
| applicationId | <code>number</code> | The ID of the application |

**Example**  
```js
contxtSdk.roles
  .addApplication('36b8421a-cc4a-4204-b839-1397374fb16b', 42)
  .then((roleApplication) => console.log(roleApplication))
  .catch((err) => console.log(err));
```
<a name="Roles+addProjectEnvironment"></a>

### contxtSdk.coordinator.roles.addProjectEnvironment(roleId, projectSlug, projectEnvironmentSlug, accessType) ⇒ <code>Promise</code>
Add a project to a role

API Endpoint: '/roles/:roleId/projects/:projectSlug'
Method: POST

**Kind**: instance method of [<code>Roles</code>](#Roles)  
**Fulfill**: [<code>ContxtRoleProjectEnvironment</code>](./Typedefs.md#ContxtRoleProjectEnvironment)  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| roleId | <code>string</code> | The UUID formatted ID of the role |
| projectSlug | <code>string</code> | The slug of the project |
| projectEnvironmentSlug | <code>string</code> | The slug of the project environment |
| accessType | <code>&#x27;reader&#x27;</code> \| <code>&#x27;admin&#x27;</code> | The level of access for the role |

**Example**  
```js
contxtSdk.roles
  .addProjectEnvironment('36b8421a-cc4a-4204-b839-1397374fb16b', 'project-slug', 'project-environment-slug', 'admin')
  .then((roleProject) => console.log(roleProject))
  .catch((err) => console.log(err));
```
<a name="Roles+create"></a>

### contxtSdk.coordinator.roles.create(organizationId, role) ⇒ <code>Promise</code>
Create a new role for an organization

**Kind**: instance method of [<code>Roles</code>](#Roles)  
**Fulfill**: [<code>ContxtRole</code>](./Typedefs.md#ContxtRole) The newly created role  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| organizationId | <code>string</code> | The ID of the organization, optional when using the tenant API and an organization ID has been set |
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

Legacy API Endpoint: '/organizations/:organizationId/roles/:roleId'
API Endpiont: '/roles/:roleId'
Method: DELETE

**Kind**: instance method of [<code>Roles</code>](#Roles)  
**Fulfill**: <code>undefined</code>  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| organizationId | <code>string</code> | The ID of the organization, optional when using the tenant API and an organization ID has been set |
| roleId | <code>string</code> | The UUID formatted ID of the role |

**Example**  
```js
contxtSdk.roles.delete('4f0e51c6-728b-4892-9863-6d002e61204d', '8b64fb12-e649-46be-b330-e672d28eed99s');
```
<a name="Roles+getByOrganizationId"></a>

### contxtSdk.coordinator.roles.getByOrganizationId(organizationId) ⇒ <code>Promise</code>
Gets an organization's list of roles

Legacy API Endpoint: '/organizations/:organizationId/roles'
API Endpoint: '/roles'
Method: GET

**Kind**: instance method of [<code>Roles</code>](#Roles)  
**Fulfill**: <code>ContxtRole[]</code> A list of roles  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| organizationId | <code>string</code> | The ID of the organization, optional when using the tenant API and an organization ID has been set |

**Example**  
```js
contxtSdk.coordinator.roles
  .getByOrganizationId('36b8421a-cc4a-4204-b839-1397374fb16b')
  .then((roles) => console.log(roles))
  .catch((err) => console.log(err));
```
<a name="Roles+removeApplication"></a>

### contxtSdk.coordinator.roles.removeApplication(roleId, applicationId) ⇒ <code>Promise</code>
Remove an application from a role

API Endpoint: '/roles/:roleId/applications/:applicationId'
Method: DELETE

**Kind**: instance method of [<code>Roles</code>](#Roles)  
**Fulfill**: <code>undefined</code>  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| roleId | <code>string</code> | The UUID formatted ID of the role |
| applicationId | <code>number</code> | The ID of the application |

**Example**  
```js
contxtSdk.roles
  .removeApplication('36b8421a-cc4a-4204-b839-1397374fb16b', 42)
  .catch((err) => console.log(err));
```
<a name="Roles+removeProjectEnvironment"></a>

### contxtSdk.coordinator.roles.removeProjectEnvironment(roleId, projectSlug, projectEnvironmentSlug) ⇒ <code>Promise</code>
Remove an project from a role

API Endpoint: '/roles/:roleId/projects/:projectSlug'
Method: DELETE

**Kind**: instance method of [<code>Roles</code>](#Roles)  
**Fulfill**: <code>undefined</code>  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| roleId | <code>string</code> | The UUID formatted ID of the role |
| projectSlug | <code>string</code> | The slug of the project |
| projectEnvironmentSlug | <code>string</code> | The slug of the project environment |

**Example**  
```js
contxtSdk.roles
  .removeProject('36b8421a-cc4a-4204-b839-1397374fb16b', 'project-slug', 'project-environment-slug')
  .catch((err) => console.log(err));
```

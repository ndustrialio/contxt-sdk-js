<a name="Users"></a>

## Users
Module that provides access to contxt users

**Kind**: global class  

* [Users](#Users)
    * [new Users(sdk, request, baseUrl, [organizationId])](#new_Users_new)
    * [.activate(userId, user)](#Users+activate) ⇒ <code>Promise</code>
    * [.addApplication(userId, applicationId)](#Users+addApplication) ⇒ <code>Promise</code>
    * [.addRole(userId, roleId)](#Users+addRole) ⇒ <code>Promise</code>
    * [.addStack(userId, stackId, accessType)](#Users+addStack) ⇒ <code>Promise</code>
    * [.get(userId)](#Users+get) ⇒ <code>Promise</code>
    * [.getByOrganizationId(organizationId)](#Users+getByOrganizationId) ⇒ <code>Promise</code>
    * [.invite(organizationId, user)](#Users+invite) ⇒ <code>Promise</code>
    * [.remove(organizationId, userId)](#Users+remove) ⇒ <code>Promise</code>
    * [.removeApplication(userId, applicationId)](#Users+removeApplication) ⇒ <code>Promise</code>
    * [.removeRole(userId, roleId)](#Users+removeRole) ⇒ <code>Promise</code>
    * [.removeStack(userId, stackId)](#Users+removeStack) ⇒ <code>Promise</code>
    * [.sync(userId)](#Users+sync) ⇒ <code>Promise</code>

<a name="new_Users_new"></a>

### new Users(sdk, request, baseUrl, [organizationId])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| sdk | <code>Object</code> |  | An instance of the SDK so the module can communicate with other modules |
| request | <code>Object</code> |  | An instance of the request module tied to this module's audience. |
| baseUrl | <code>string</code> |  | The base URL provided by the parent module |
| [organizationId] | <code>string</code> | <code>null</code> | The organization ID to be used in tenant url requests |

<a name="Users+activate"></a>

### contxtSdk.coordinator.users.activate(userId, user) ⇒ <code>Promise</code>
Activates a new user

API Endpoint: '/users/:userId/activate'
Method: POST

Note: Only valid for web users using auth0WebAuth session type

**Kind**: instance method of [<code>Users</code>](#Users)  
**Fulfill**: <code>undefined</code>  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| userId | <code>string</code> | The ID of the user to activate |
| user | <code>Object</code> |  |
| user.email | <code>string</code> | The email address of the user |
| user.password | <code>string</code> | The password to set for the user |
| user.userToken | <code>string</code> | The JWT token provided by the invite link |

**Example**  
```js
contxtSdk.coordinator.users
  .activate('7bb79bdf-7492-45c2-8640-2dde63535827', {
    email: 'bob.sagat56@gmail.com',
    password: 'ds32jX32jaMM1Nr',
    userToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  })
  .then(() => console.log("User Activated"))
  .catch((err) => console.log(err));
```
<a name="Users+addApplication"></a>

### contxtSdk.coordinator.users.addApplication(userId, applicationId) ⇒ <code>Promise</code>
Adds a application to a user

API Endpoint: '/users/:userId/applications/:applicationId'
Method: GET

**Kind**: instance method of [<code>Users</code>](#Users)  
**Fulfill**: [<code>ContxtUserApplication</code>](./Typedefs.md#ContxtUserApplication) The newly created user application  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| userId | <code>string</code> | The ID of the user |
| applicationId | <code>string</code> | The ID of the application |

**Example**  
```js
contxtSdk.coordinator.users
  .addApplication('36b8421a-cc4a-4204-b839-1397374fb16b', '007ca9ee-ece7-4931-9d11-9b4fd97d4d58')
  .then((userApplication) => console.log(userApplication))
  .catch((err) => console.log(err));
```
<a name="Users+addRole"></a>

### contxtSdk.coordinator.users.addRole(userId, roleId) ⇒ <code>Promise</code>
Adds a role to a user

API Endpoint: '/users/:userId/roles/:roleId'
Method: POST

**Kind**: instance method of [<code>Users</code>](#Users)  
**Fulfill**: [<code>ContxtUserRole</code>](./Typedefs.md#ContxtUserRole) The newly created user role  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| userId | <code>string</code> | The ID of the user |
| roleId | <code>string</code> | The ID of the role |

**Example**  
```js
contxtSdk.coordinator.users
  .addRole('36b8421a-cc4a-4204-b839-1397374fb16b', '007ca9ee-ece7-4931-9d11-9b4fd97d4d58')
  .then((userRole) => console.log(userRole))
  .catch((err) => console.log(err));
```
<a name="Users+addStack"></a>

### contxtSdk.coordinator.users.addStack(userId, stackId, accessType) ⇒ <code>Promise</code>
Adds a stack to a user

API Endpoint: '/users/:userId/stacks/:stackId'
Method: POST

**Kind**: instance method of [<code>Users</code>](#Users)  
**Fulfill**: [<code>ContxtUserStack</code>](./Typedefs.md#ContxtUserStack) The newly created user stack  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| userId | <code>string</code> | The ID of the user |
| stackId | <code>string</code> | The ID of the stack |
| accessType | <code>&#x27;reader&#x27;</code> \| <code>&#x27;collaborator&#x27;</code> \| <code>&#x27;owner&#x27;</code> | The level of access for the user |

**Example**  
```js
contxtSdk.coordinator.users
  .addStack('36b8421a-cc4a-4204-b839-1397374fb16b', '007ca9ee-ece7-4931-9d11-9b4fd97d4d58', 'collaborator')
  .then((userStack) => console.log(userStack))
  .catch((err) => console.log(err));
```
<a name="Users+get"></a>

### contxtSdk.coordinator.users.get(userId) ⇒ <code>Promise</code>
Gets information about a contxt user

API Endpoint: '/users/:userId'
Method: GET

**Kind**: instance method of [<code>Users</code>](#Users)  
**Fulfill**: [<code>ContxtUser</code>](./Typedefs.md#ContxtUser) Information about a contxt user  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| userId | <code>string</code> | The ID of the user |

**Example**  
```js
contxtSdk.coordinator.users
  .get('auth0|12345')
  .then((user) => console.log(user))
  .catch((err) => console.log(err));
```
<a name="Users+getByOrganizationId"></a>

### contxtSdk.coordinator.users.getByOrganizationId(organizationId) ⇒ <code>Promise</code>
Gets a list of users for a contxt organization

Legacy API Endpoint: '/organizations/:organizationId/users'
API Endpoint: '/users'
Method: GET

**Kind**: instance method of [<code>Users</code>](#Users)  
**Fulfill**: <code>ContxtUser[]</code> List of users for a contxt organization  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| organizationId | <code>string</code> | The ID of the organization, optional when using the tenant API and an organization ID has been set |

**Example**  
```js
contxtSdk.coordinator.users
  .getByOrganizationId('36b8421a-cc4a-4204-b839-1397374fb16b')
  .then((orgUsers) => console.log(orgUsers))
  .catch((err) => console.log(err));
```
<a name="Users+invite"></a>

### contxtSdk.coordinator.users.invite(organizationId, user) ⇒ <code>Promise</code>
Creates a new contxt user, adds them to an organization, and
sends them an email invite link to do final account setup.

Legacy API Endpoint: '/organizations/:organizationId/users'
API Endpoint: '/users'
Method: POST

Note: Only valid for web users using auth0WebAuth session type

**Kind**: instance method of [<code>Users</code>](#Users)  
**Fulfill**: [<code>ContxtUser</code>](./Typedefs.md#ContxtUser) The new user  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| organizationId | <code>string</code> | The ID of the organization, optional when using the tenant API and an organization ID has been set |
| user | <code>Object</code> |  |
| user.email | <code>string</code> | The email address of the new user |
| user.firstName | <code>string</code> | The first name of the new user |
| user.lastName | <code>string</code> | The last name of the new user |
| user.redirectUrl | <code>string</code> | The url that the user will be redirected to after using the invite email link. Typically this is an /activate endpoint that accepts url query params userToken and userId and uses them to do final activation on the user's account. |

**Example**  
```js
contxtSdk.coordinator.users
  .invite('fdf01507-a26a-4dfe-89a2-bc91861169b8', {
    email: 'bob.sagat56@gmail.com',
    firstName: 'Bob',
    lastName: 'Sagat',
    redirectUrl: 'https://contxt.ndustrial.io/activate'
  })
  .then((newUser) => console.log(newUser))
  .catch((err) => console.log(err));
```
<a name="Users+remove"></a>

### contxtSdk.coordinator.users.remove(organizationId, userId) ⇒ <code>Promise</code>
Removes a user from an organization

Legacy API Endpoint: '/organizations/:organizationId/users/:userId'
API Endpoint: '/users/:userId'
Method: DELETE

**Kind**: instance method of [<code>Users</code>](#Users)  
**Fulfill**: <code>undefined</code>  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| organizationId | <code>string</code> | The ID of the organization, optional when using the tenant API and an organization ID has been set |
| userId | <code>string</code> | The ID of the user |

**Example**  
```js
contxtSdk.coordinator.users
  .remove('ed2e8e24-79ef-4404-bf5f-995ef31b2298', '4a577e87-7437-4342-b183-00c18ec26d52')
  .catch((err) => console.log(err));
```
<a name="Users+removeApplication"></a>

### contxtSdk.coordinator.users.removeApplication(userId, applicationId) ⇒ <code>Promise</code>
Removes a application from a user

API Endpoint: '/users/:userId/applications/:applicationId'
Method: DELETE

**Kind**: instance method of [<code>Users</code>](#Users)  
**Fulfill**: <code>undefined</code>  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| userId | <code>string</code> | The ID of the user |
| applicationId | <code>string</code> | The ID of the application |

**Example**  
```js
contxtSdk.coordinator.users
  .removeApplication('36b8421a-cc4a-4204-b839-1397374fb16b', '007ca9ee-ece7-4931-9d11-9b4fd97d4d58')
  .catch((err) => console.log(err));
```
<a name="Users+removeRole"></a>

### contxtSdk.coordinator.users.removeRole(userId, roleId) ⇒ <code>Promise</code>
Removes a role from a user

API Endpoint: '/users/:userId/roles/:roleId'
Method: DELETE

**Kind**: instance method of [<code>Users</code>](#Users)  
**Fulfill**: <code>undefined</code>  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| userId | <code>string</code> | The ID of the user |
| roleId | <code>string</code> | The ID of the role |

**Example**  
```js
contxtSdk.coordinator.users
  .removeRole('36b8421a-cc4a-4204-b839-1397374fb16b', '007ca9ee-ece7-4931-9d11-9b4fd97d4d58')
  .catch((err) => console.log(err));
```
<a name="Users+removeStack"></a>

### contxtSdk.coordinator.users.removeStack(userId, stackId) ⇒ <code>Promise</code>
Removes a stack from a user

API Endpoint: '/users/:userId/stacks/:stackId'
Method: DELETE

**Kind**: instance method of [<code>Users</code>](#Users)  
**Fulfill**: <code>undefined</code>  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| userId | <code>string</code> | The ID of the user |
| stackId | <code>string</code> | The ID of the stack |

**Example**  
```js
contxtSdk.coordinator.users
  .removeStack('36b8421a-cc4a-4204-b839-1397374fb16b', '007ca9ee-ece7-4931-9d11-9b4fd97d4d58')
  .catch((err) => console.log(err));
```
<a name="Users+sync"></a>

### contxtSdk.coordinator.users.sync(userId) ⇒ <code>Promise</code>
Syncs the user's roles and application access with the external auth provider

API Endpoint: '/users/:userId/sync'
Method: GET

**Kind**: instance method of [<code>Users</code>](#Users)  
**Fulfill**: <code>undefined</code>  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| userId | <code>string</code> | The ID of the user |

**Example**  
```js
contxtSdk.coordinator.users
  .sync('36b8421a-cc4a-4204-b839-1397374fb16b')
  .catch((err) => console.log(err));
```

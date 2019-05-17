<a name="Users"></a>

## Users
Module that provides access to contxt users

**Kind**: global class  

* [Users](#Users)
    * [new Users(sdk, request, baseUrl)](#new_Users_new)
    * [.activate(userId, user)](#Users+activate) ⇒ <code>Promise</code>
    * [.get(userId)](#Users+get) ⇒ <code>Promise</code>
    * [.getByOrganizationId(organizationId)](#Users+getByOrganizationId) ⇒ <code>Promise</code>
    * [.invite(organizationId, user)](#Users+invite) ⇒ <code>Promise</code>
    * [.remove(organizationId, userId)](#Users+remove) ⇒ <code>Promise</code>

<a name="new_Users_new"></a>

### new Users(sdk, request, baseUrl)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>Object</code> | An instance of the SDK so the module can communicate with other modules |
| request | <code>Object</code> | An instance of the request module tied to this module's audience. |
| baseUrl | <code>string</code> | The base URL provided by the parent module |

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

API Endpoint: '/organizations/:organizationId/users'
Method: GET

**Kind**: instance method of [<code>Users</code>](#Users)  
**Fulfill**: <code>ContxtUser[]</code> List of users for a contxt organization  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| organizationId | <code>string</code> | The ID of the organization |

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

API Endpoint: '/organizations/:organizationId/users'
Method: POST

Note: Only valid for web users using auth0WebAuth session type

**Kind**: instance method of [<code>Users</code>](#Users)  
**Fulfill**: [<code>ContxtUser</code>](./Typedefs.md#ContxtUser) The new user  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| organizationId | <code>string</code> | The ID of the organization |
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

API Endpoint: '/organizations/:organizationId/users/:userId'
Method: DELETE

**Kind**: instance method of [<code>Users</code>](#Users)  
**Fulfill**: <code>undefined</code>  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| organizationId | <code>string</code> | The ID of the organization |
| userId | <code>string</code> | The ID of the user |

**Example**  
```js
contxtSdk.coordinator.users
  .remove('ed2e8e24-79ef-4404-bf5f-995ef31b2298', '4a577e87-7437-4342-b183-00c18ec26d52')
  .catch((err) => console.log(err));
```
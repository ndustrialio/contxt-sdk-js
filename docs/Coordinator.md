<a name="Coordinator"></a>

## Coordinator
Module that provides access to information about Contxt

**Kind**: global class  

* [Coordinator](#Coordinator)
    * [new Coordinator(sdk, request)](#new_Coordinator_new)
    * [.activateNewUser(userId, user)](#Coordinator+activateNewUser) ⇒ <code>Promise</code>
    * [.createFavoriteApplication(applicationId)](#Coordinator+createFavoriteApplication) ⇒ <code>Promise</code>
    * [.deleteFavoriteApplication(applicationId)](#Coordinator+deleteFavoriteApplication) ⇒ <code>Promise</code>
    * [.getAllApplications()](#Coordinator+getAllApplications) ⇒ <code>Promise</code>
    * [.getAllOrganizations()](#Coordinator+getAllOrganizations) ⇒ <code>Promise</code>
    * [.getFavoriteApplications()](#Coordinator+getFavoriteApplications) ⇒ <code>Promise</code>
    * [.getFeaturedApplications(organizationId)](#Coordinator+getFeaturedApplications) ⇒ <code>Promise</code>
    * [.getOrganizationById(organizationId)](#Coordinator+getOrganizationById) ⇒ <code>Promise</code>
    * [.getUsersByOrganization(organizationId)](#Coordinator+getUsersByOrganization) ⇒ <code>Promise</code>
    * [.getUser(userId)](#Coordinator+getUser) ⇒ <code>Promise</code>
    * [.getUserPermissionsMap(userId)](#Coordinator+getUserPermissionsMap) ⇒ <code>Promise</code>
    * [.getUsersPermissionsByOrganization(organizationId)](#Coordinator+getUsersPermissionsByOrganization) ⇒ <code>Promise</code>
    * [.inviteNewUserToOrganization(organizationId, user)](#Coordinator+inviteNewUserToOrganization) ⇒ <code>Promise</code>
    * [.removeUserFromOrganization(organizationId, userId)](#Coordinator+removeUserFromOrganization) ⇒ <code>Promise</code>

<a name="new_Coordinator_new"></a>

### new Coordinator(sdk, request)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>Object</code> | An instance of the SDK so the module can communicate with other modules |
| request | <code>Object</code> | An instance of the request module tied to this module's audience. |

<a name="Coordinator+activateNewUser"></a>

### contxtSdk.coordinator.activateNewUser(userId, user) ⇒ <code>Promise</code>
Activates a new user

API Endpoint: '/users/:userId/activate'
Method: POST

Note: Only valid for web users using auth0WebAuth session type

**Kind**: instance method of [<code>Coordinator</code>](#Coordinator)  
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
contxtSdk.coordinator.
  .activateNewUser('7bb79bdf-7492-45c2-8640-2dde63535827', {
    email: 'bob.sagat56@gmail.com',
    password: 'ds32jX32jaMM1Nr',
    userToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  })
  .then(() => console.log("User Activated"))
  .catch((err) => console.log(err));
```
<a name="Coordinator+createFavoriteApplication"></a>

### contxtSdk.coordinator.createFavoriteApplication(applicationId) ⇒ <code>Promise</code>
Adds an application to the current user's list of favorited applications

API Endpoint: '/applications/:applicationId/favorites'
Method: POST

Note: Only valid for web users using auth0WebAuth session type

**Kind**: instance method of [<code>Coordinator</code>](#Coordinator)  
**Fulfill**: [<code>ContxtUserFavoriteApplication</code>](./Typedefs.md#ContxtUserFavoriteApplication) Information about the contxt application favorite  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| applicationId | <code>number</code> | The ID of the application |

**Example**  
```js
contxtSdk.coordinator
  .createFavoriteApplication(25)
  .then((favoriteApplication) => console.log(favoriteApplication))
  .catch((err) => console.log(err));
```
<a name="Coordinator+deleteFavoriteApplication"></a>

### contxtSdk.coordinator.deleteFavoriteApplication(applicationId) ⇒ <code>Promise</code>
Removes an application from the current user's list of favorited applications

API Endpoint: '/applications/:applicationId/favorites'
Method: DELETE

Note: Only valid for web users using auth0WebAuth session type

**Kind**: instance method of [<code>Coordinator</code>](#Coordinator)  
**Fulfill**: <code>undefined</code>  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| applicationId | <code>number</code> | The ID of the application |

**Example**  
```js
contxtSdk.coordinator
  .deleteFavoriteApplication(25)
  .catch((err) => console.log(err));
```
<a name="Coordinator+getAllApplications"></a>

### contxtSdk.coordinator.getAllApplications() ⇒ <code>Promise</code>
Gets information about all contxt applications

API Endpoint: '/applications'
Method: GET

**Kind**: instance method of [<code>Coordinator</code>](#Coordinator)  
**Fulfill**: <code>ContxtApplication[]</code> Information about all contxt applications  
**Reject**: <code>Error</code>  
**Example**  
```js
contxtSdk.coordinator
  .getAllApplications()
  .then((apps) => console.log(apps))
  .catch((err) => console.log(err));
```
<a name="Coordinator+getAllOrganizations"></a>

### contxtSdk.coordinator.getAllOrganizations() ⇒ <code>Promise</code>
Gets information about all contxt organizations

API Endpoint: '/organizations'
Method: GET

**Kind**: instance method of [<code>Coordinator</code>](#Coordinator)  
**Fulfill**: <code>ContxtOrganization[]</code> Information about all contxt organizations  
**Reject**: <code>Error</code>  
**Example**  
```js
contxtSdk.coordinator
  .getAllOrganizations()
  .then((orgs) => console.log(orgs))
  .catch((err) => console.log(err));
```
<a name="Coordinator+getFavoriteApplications"></a>

### contxtSdk.coordinator.getFavoriteApplications() ⇒ <code>Promise</code>
Gets the current user's list of favorited applications

API Endpoint: '/applications/favorites'
Method: GET

Note: Only valid for web users using auth0WebAuth session type

**Kind**: instance method of [<code>Coordinator</code>](#Coordinator)  
**Fulfill**: <code>ContxtUserFavoriteApplication[]</code> A list of favorited applications  
**Reject**: <code>Error</code>  
**Example**  
```js
contxtSdk.coordinator
  .getFavoriteApplications()
  .then((favoriteApplications) => console.log(favoriteApplications))
  .catch((err) => console.log(err));
```
<a name="Coordinator+getFeaturedApplications"></a>

### contxtSdk.coordinator.getFeaturedApplications(organizationId) ⇒ <code>Promise</code>
Gets an organization's list of featured applications

API Endpoint: '/organizations/:organizationId/applications/featured'
Method: GET

Note: Only valid for web users using auth0WebAuth session type

**Kind**: instance method of [<code>Coordinator</code>](#Coordinator)  
**Fulfill**: <code>ContxtOrganizationFeaturedApplication[]</code> A list of featured applications  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| organizationId | <code>string</code> | The ID of the organization |

**Example**  
```js
contxtSdk.coordinator
  .getFeaturedApplications('36b8421a-cc4a-4204-b839-1397374fb16b')
  .then((featuredApplications) => console.log(featuredApplications))
  .catch((err) => console.log(err));
```
<a name="Coordinator+getOrganizationById"></a>

### contxtSdk.coordinator.getOrganizationById(organizationId) ⇒ <code>Promise</code>
Gets information about a contxt organization

API Endpoint: '/organizations/:organizationId'
Method: GET

**Kind**: instance method of [<code>Coordinator</code>](#Coordinator)  
**Fulfill**: [<code>ContxtOrganization</code>](./Typedefs.md#ContxtOrganization) Information about a contxt organization  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| organizationId | <code>string</code> | The ID of the organization |

**Example**  
```js
contxtSdk.coordinator
  .getOrganizationById('36b8421a-cc4a-4204-b839-1397374fb16b')
  .then((org) => console.log(org))
  .catch((err) => console.log(err));
```
<a name="Coordinator+getUsersByOrganization"></a>

### contxtSdk.coordinator.getUsersByOrganization(organizationId) ⇒ <code>Promise</code>
Gets a list of users for a contxt organization

API Endpoint: '/organizations/:organizationId/users'
Method: GET

**Kind**: instance method of [<code>Coordinator</code>](#Coordinator)  
**Fulfill**: <code>ContxtUser[]</code> List of users for a contxt organization  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| organizationId | <code>string</code> | The ID of the organization |

**Example**  
```js
contxtSdk.coordinator
  .getUsersByOrganization('36b8421a-cc4a-4204-b839-1397374fb16b')
  .then((orgUsers) => console.log(orgUsers))
  .catch((err) => console.log(err));
```
<a name="Coordinator+getUser"></a>

### contxtSdk.coordinator.getUser(userId) ⇒ <code>Promise</code>
Gets information about a contxt user

API Endpoint: '/users/:userId'
Method: GET

**Kind**: instance method of [<code>Coordinator</code>](#Coordinator)  
**Fulfill**: [<code>ContxtUser</code>](./Typedefs.md#ContxtUser) Information about a contxt user  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| userId | <code>string</code> | The ID of the user |

**Example**  
```js
contxtSdk.coordinator
  .getUser('auth0|12345')
  .then((user) => console.log(user))
  .catch((err) => console.log(err));
```
<a name="Coordinator+getUserPermissionsMap"></a>

### contxtSdk.coordinator.getUserPermissionsMap(userId) ⇒ <code>Promise</code>
Gets a map of permission scopes to which the user has access

API Endpoint: '/users/:userId/permissions'
Method: GET

**Kind**: instance method of [<code>Coordinator</code>](#Coordinator)  
**Fulfill**: <code>Object.&lt;string, string[]&gt;</code> A map of user permissions where the
  key corresponds to a service ID (i.e. the ID generated by Auth0) and the
  value is an array of permission scopes that are managed by Contxt (e.g.
  `read:facilities` and `write:facilities`)  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| userId | <code>string</code> | The ID of the user |

**Example**  
```js
contxtSdk.coordinator
  .getUserPermissionsMap('auth0|12345')
  .then((permissionsMap) => console.log(permissionsMap))
  .catch((err) => console.log(err));
```
<a name="Coordinator+getUsersPermissionsByOrganization"></a>

### contxtSdk.coordinator.getUsersPermissionsByOrganization(organizationId) ⇒ <code>Promise</code>
Gets a list of user permissions for an organization

API Endpoint: '/organizations/:organizationId/users/permissions'
Method: GET

**Kind**: instance method of [<code>Coordinator</code>](#Coordinator)  
**Fulfill**: <code>ContxtUserPermissions[]</code> A collection of user permissions  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| organizationId | <code>string</code> | The ID of the organization |

**Example**  
```js
contxtSdk.coordinator
  .getUsersPermissionsByOrganization('36b8421a-cc4a-4204-b839-1397374fb16b')
  .then((usersPermissions) => console.log(usersPermissions))
  .catch((err) => console.log(err));
```
<a name="Coordinator+inviteNewUserToOrganization"></a>

### contxtSdk.coordinator.inviteNewUserToOrganization(organizationId, user) ⇒ <code>Promise</code>
Creates a new contxt user, adds them to an organization, and
sends them an email invite link to do final account setup.

API Endpoint: '/organizations/:organizationId/users'
Method: POST

Note: Only valid for web users using auth0WebAuth session type

**Kind**: instance method of [<code>Coordinator</code>](#Coordinator)  
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
contxtSdk.coordinator.
  .inviteNewUserToOrganization('fdf01507-a26a-4dfe-89a2-bc91861169b8', {
    email: 'bob.sagat56@gmail.com',
    firstName: 'Bob',
    lastName: 'Sagat',
    redirectUrl: 'https://contxt.ndustrial.io/activate'
  })
  .then((newUser) => console.log(newUser))
  .catch((err) => console.log(err));
```
<a name="Coordinator+removeUserFromOrganization"></a>

### contxtSdk.coordinator.removeUserFromOrganization(organizationId, userId) ⇒ <code>Promise</code>
Removes a user from an organization

API Endpoint: '/organizations/:organizationId/users/:userId'
Method: DELETE

**Kind**: instance method of [<code>Coordinator</code>](#Coordinator)  
**Fulfill**: <code>undefined</code>  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| organizationId | <code>string</code> | The ID of the organization |
| userId | <code>string</code> | The ID of the user |

**Example**  
```js
contxtSdk.coordinator
  .removeUserFromOrganization('ed2e8e24-79ef-4404-bf5f-995ef31b2298', '4a577e87-7437-4342-b183-00c18ec26d52')
  .catch((err) => console.log(err));
```

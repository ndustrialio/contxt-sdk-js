<a name="Coordinator"></a>

## Coordinator
Module that provides access to information about Contxt

**Kind**: global class  

* [Coordinator](#Coordinator)
    * [new Coordinator(sdk, request)](#new_Coordinator_new)
    * [.getAllOrganizations()](#Coordinator+getAllOrganizations) ⇒ <code>Promise</code>
    * [.getOrganizationById(organizationId)](#Coordinator+getOrganizationById) ⇒ <code>Promise</code>
    * [.getUser(userId)](#Coordinator+getUser) ⇒ <code>Promise</code>

<a name="new_Coordinator_new"></a>

### new Coordinator(sdk, request)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>Object</code> | An instance of the SDK so the module can communicate with other modules |
| request | <code>Object</code> | An instance of the request module tied to this module's audience. |

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
<a name="Coordinator"></a>

## Coordinator
Module that provides access to information about Contxt

**Kind**: global class  

* [Coordinator](#Coordinator)
    * [new Coordinator(sdk, request)](#new_Coordinator_new)
    * [.createFavoriteApplication(applicationId)](#Coordinator+createFavoriteApplication) ⇒ <code>Promise</code>
    * [.deleteFavoriteApplication(applicationId)](#Coordinator+deleteFavoriteApplication) ⇒ <code>Promise</code>
    * [.getAllApplications()](#Coordinator+getAllApplications) ⇒ <code>Promise</code>
    * [.getFavoriteApplications()](#Coordinator+getFavoriteApplications) ⇒ <code>Promise</code>
    * [.getFeaturedApplications(organizationId)](#Coordinator+getFeaturedApplications) ⇒ <code>Promise</code>

<a name="new_Coordinator_new"></a>

### new Coordinator(sdk, request)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>Object</code> | An instance of the SDK so the module can communicate with other modules |
| request | <code>Object</code> | An instance of the request module tied to this module's audience. |

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

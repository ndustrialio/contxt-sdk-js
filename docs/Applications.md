<a name="Applications"></a>

## Applications
Module that provides access to contxt applications

**Kind**: global class  

* [Applications](#Applications)
    * [new Applications(sdk, request, baseUrl, [organizationId])](#new_Applications_new)
    * [.addFavorite(applicationId)](#Applications+addFavorite) ⇒ <code>Promise</code>
    * [.getAll()](#Applications+getAll) ⇒ <code>Promise</code>
    * [.getFavorites()](#Applications+getFavorites) ⇒ <code>Promise</code>
    * [.getFeatured(organizationId)](#Applications+getFeatured) ⇒ <code>Promise</code>
    * [.getGroupings(applicationId)](#Applications+getGroupings) ⇒ <code>Promise</code>
    * [.removeFavorite(applicationId)](#Applications+removeFavorite) ⇒ <code>Promise</code>

<a name="new_Applications_new"></a>

### new Applications(sdk, request, baseUrl, [organizationId])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| sdk | <code>Object</code> |  | An instance of the SDK so the module can communicate with other modules |
| request | <code>Object</code> |  | An instance of the request module tied to this module's audience. |
| baseUrl | <code>string</code> |  | The base URL provided by the parent module |
| [organizationId] | <code>string</code> | <code>null</code> | The organization ID to be used in tenant url requests |

<a name="Applications+addFavorite"></a>

### contxtSdk.coordinator.applications.addFavorite(applicationId) ⇒ <code>Promise</code>
Adds an application to the current user's list of favorited applications

API Endpoint: '/applications/:applicationId/favorites'
Method: POST

Note: Only valid for web users using auth0WebAuth session type

**Kind**: instance method of [<code>Applications</code>](#Applications)  
**Fulfill**: [<code>ContxtUserFavoriteApplication</code>](./Typedefs.md#ContxtUserFavoriteApplication) Information about the contxt application favorite  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| applicationId | <code>number</code> | The ID of the application |

**Example**  
```js
contxtSdk.coordinator.applications
  .addFavorite(25)
  .then((favoriteApplication) => console.log(favoriteApplication))
  .catch((err) => console.log(err));
```
<a name="Applications+getAll"></a>

### contxtSdk.coordinator.applications.getAll() ⇒ <code>Promise</code>
Gets information about all contxt applications

API Endpoint: '/applications'
Method: GET

**Kind**: instance method of [<code>Applications</code>](#Applications)  
**Fulfill**: <code>ContxtApplication[]</code> Information about all contxt applications  
**Reject**: <code>Error</code>  
**Example**  
```js
contxtSdk.coordinator.applications
  .getAll()
  .then((apps) => console.log(apps))
  .catch((err) => console.log(err));
```
<a name="Applications+getFavorites"></a>

### contxtSdk.coordinator.applications.getFavorites() ⇒ <code>Promise</code>
Gets the current user's list of favorited applications

API Endpoint: '/applications/favorites'
Method: GET

Note: Only valid for web users using auth0WebAuth session type

**Kind**: instance method of [<code>Applications</code>](#Applications)  
**Fulfill**: <code>ContxtUserFavoriteApplication[]</code> A list of favorited applications  
**Reject**: <code>Error</code>  
**Example**  
```js
contxtSdk.coordinator.applications
  .getFavorites()
  .then((favoriteApplications) => console.log(favoriteApplications))
  .catch((err) => console.log(err));
```
<a name="Applications+getFeatured"></a>

### contxtSdk.coordinator.applications.getFeatured(organizationId) ⇒ <code>Promise</code>
Gets an organization's list of featured applications

Legacy API Endpoint: '/organizations/:organizationId/applications/featured'
API Endpoint: '/applications/featured'
Method: GET

Note: Only valid for web users using auth0WebAuth session type

**Kind**: instance method of [<code>Applications</code>](#Applications)  
**Fulfill**: <code>ContxtOrganizationFeaturedApplication[]</code> A list of featured applications  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| organizationId | <code>string</code> | The ID of the organization, optional when using the tenant API and an organization ID has been set |

**Example**  
```js
contxtSdk.coordinator.applications
  .getFeatured('36b8421a-cc4a-4204-b839-1397374fb16b')
  .then((featuredApplications) => console.log(featuredApplications))
  .catch((err) => console.log(err));
```
<a name="Applications+getGroupings"></a>

### contxtSdk.coordinator.applications.getGroupings(applicationId) ⇒ <code>Promise</code>
Gets the application groupings (and application modules) of an application
that are available to the currently authenticated user.

API Endpoint: '/applications/:applicationId/groupings'
Method: GET

**Kind**: instance method of [<code>Applications</code>](#Applications)  
**Fulfill**: <code>ContxtApplicationGrouping[]</code>  
**Reject**: <code>Error</code>  

| Param | Type |
| --- | --- |
| applicationId | <code>number</code> | 

**Example**  
```js
contxtSdk.coordinator.applications
  .getGroupings(31)
  .then((applicationGroupings) => console.log(applicationGroupings))
  .catch((err) => console.log(err));
```
<a name="Applications+removeFavorite"></a>

### contxtSdk.coordinator.applications.removeFavorite(applicationId) ⇒ <code>Promise</code>
Removes an application from the current user's list of favorited applications

API Endpoint: '/applications/:applicationId/favorites'
Method: DELETE

Note: Only valid for web users using auth0WebAuth session type

**Kind**: instance method of [<code>Applications</code>](#Applications)  
**Fulfill**: <code>undefined</code>  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| applicationId | <code>number</code> | The ID of the application |

**Example**  
```js
contxtSdk.coordinator.applications
  .removeFavorite(25)
  .catch((err) => console.log(err));
```

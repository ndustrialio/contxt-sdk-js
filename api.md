## Classes

<dl>
<dt><a href="#Config">Config</a></dt>
<dd><p>Module that merges user assigned configurations with default configurations.</p>
</dd>
<dt><a href="#Facilities">Facilities</a></dt>
<dd><p>Module that provides access to, and the manipulation
of, information about different facilities</p>
</dd>
<dt><a href="#ContxtSdk">ContxtSdk</a></dt>
<dd><p>ContxtSdk constructor</p>
</dd>
<dt><a href="#Request">Request</a></dt>
<dd></dd>
<dt><a href="#Auth0WebAuth">Auth0WebAuth</a> : <code><a href="#SessionType">SessionType</a></code></dt>
<dd><p>A SessionType that allows the user to initially authenticate with Auth0 and then gain a valid JWT
from the Contxt Auth service.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#UserConfig">UserConfig</a> : <code>object</code></dt>
<dd><p>User provided configuration options</p>
</dd>
<dt><a href="#Audiences">Audiences</a> : <code>object</code></dt>
<dd><p>An object of multiple moduleNames that makes up all audiences that will be used for
authentication and communicating with various APIs</p>
</dd>
<dt><a href="#Facility">Facility</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#SessionType">SessionType</a> : <code>object</code></dt>
<dd><p>An adapter that allows the SDK to authenticate with different services and manage various tokens.
Can authenticate with a service like Auth0 and then with Contxt or can communicate directly
with Contxt. The adapter must implement required methods, but most methods are optional. Some of
the optional methods are documented below.</p>
</dd>
<dt><a href="#UserProfile">UserProfile</a></dt>
<dd></dd>
<dt><a href="#SessionInfo">SessionInfo</a></dt>
<dd></dd>
</dl>

<a name="Config"></a>

## Config
Module that merges user assigned configurations with default configurations.

**Kind**: global class  
<a name="new_Config_new"></a>

### new Config(userConfig, [externalModules])

| Param | Type | Description |
| --- | --- | --- |
| userConfig | [<code>UserConfig</code>](#UserConfig) |  |
| [externalModules] | <code>object</code> | User provided external modules that should be treated as   first class citizens |

<a name="Facilities"></a>

## Facilities
Module that provides access to, and the manipulation
of, information about different facilities

**Kind**: global class  

* [Facilities](#Facilities)
    * [new Facilities(sdk, request)](#new_Facilities_new)
    * [.get(facilityId)](#Facilities+get) ⇒ <code>Promise</code>
    * [.getAll()](#Facilities+getAll) ⇒ <code>Promise</code>

<a name="new_Facilities_new"></a>

### new Facilities(sdk, request)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>object</code> | An instance of the SDK so the module can communicate with other modules |
| request | <code>object</code> | An instance of the request module tied to this module's audience. |

<a name="Facilities+get"></a>

### contxtSdk.facilities.get(facilityId) ⇒ <code>Promise</code>
Gets information about a facility

API Endpoint: '/facilities/:facilityId'
Method: GET

**Kind**: instance method of [<code>Facilities</code>](#Facilities)  
**Fulfill**: [<code>Facility</code>](#Facility) Information about a facility  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| facilityId | <code>object</code> | The id of the facility |

**Example**  
```js
contxtSdk.facilities.get(25)
  .then((facility) => console.log(facility)});
  .catch((err) => console.log(err));
```
<a name="Facilities+getAll"></a>

### contxtSdk.facilities.getAll() ⇒ <code>Promise</code>
Gets a list of all facilities

API Endpoint: '/facilities'
Method: GET

**Kind**: instance method of [<code>Facilities</code>](#Facilities)  
**Fulfill**: <code>Facility[]</code> Information about all facilities  
**Reject**: <code>Error</code>  
**Example**  
```js
contxtSdk.facilities.getAll()
  .then((facilities) => console.log(facilities)});
  .catch((err) => console.log(err));
```
<a name="ContxtSdk"></a>

## ContxtSdk
ContxtSdk constructor

**Kind**: global class  
<a name="new_ContxtSdk_new"></a>

### new ContxtSdk(config, [externalModules], sessionType)

| Param | Type | Description |
| --- | --- | --- |
| config | [<code>UserConfig</code>](#UserConfig) |  |
| [externalModules] | <code>object</code> |  |
| sessionType | <code>string</code> | The type of auth session you wish to use (e.g. auth0WebAuth   or machine) |

<a name="Request"></a>

## Request
**Kind**: global class  

* [Request](#Request)
    * [new Request(sdk, audienceName)](#new_Request_new)
    * [.delete()](#Request+delete) ⇒ <code>Promise</code>
    * [.get()](#Request+get) ⇒ <code>Promise</code>
    * [.head()](#Request+head) ⇒ <code>Promise</code>
    * [.options()](#Request+options) ⇒ <code>Promise</code>
    * [.patch()](#Request+patch) ⇒ <code>Promise</code>
    * [.post()](#Request+post) ⇒ <code>Promise</code>
    * [.put()](#Request+put) ⇒ <code>Promise</code>
    * [.request()](#Request+request) ⇒ <code>Promise</code>

<a name="new_Request_new"></a>

### new Request(sdk, audienceName)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>object</code> | An instance of the SDK so the module can communicate with other modules |
| audienceName | <code>string</code> | The audience name for this instance. Used when grabbing a   Bearer token |

<a name="Request+delete"></a>

### request.delete() ⇒ <code>Promise</code>
Makes a DELETE request
See more at [axios](https://github.com/axios/axios)

**Kind**: instance method of [<code>Request</code>](#Request)  
**Fulfill**: <code>string\|number\|object\|array</code> data  
<a name="Request+get"></a>

### request.get() ⇒ <code>Promise</code>
Makes a GET request
See more at [axios](https://github.com/axios/axios)

**Kind**: instance method of [<code>Request</code>](#Request)  
**Fulfill**: <code>string\|number\|object\|array</code> data  
<a name="Request+head"></a>

### request.head() ⇒ <code>Promise</code>
Makes a HEAD request
See more at [axios](https://github.com/axios/axios)

**Kind**: instance method of [<code>Request</code>](#Request)  
**Fulfill**: <code>string\|number\|object\|array</code> data  
<a name="Request+options"></a>

### request.options() ⇒ <code>Promise</code>
Makes an OPTIONS request
See more at [axios](https://github.com/axios/axios)

**Kind**: instance method of [<code>Request</code>](#Request)  
**Fulfill**: <code>string\|number\|object\|array</code> data  
<a name="Request+patch"></a>

### request.patch() ⇒ <code>Promise</code>
Makes a PATCH request
See more at [axios](https://github.com/axios/axios)

**Kind**: instance method of [<code>Request</code>](#Request)  
**Fulfill**: <code>string\|number\|object\|array</code> data  
<a name="Request+post"></a>

### request.post() ⇒ <code>Promise</code>
Makes a POST request
See more at [axios](https://github.com/axios/axios)

**Kind**: instance method of [<code>Request</code>](#Request)  
**Fulfill**: <code>string\|number\|object\|array</code> data  
<a name="Request+put"></a>

### request.put() ⇒ <code>Promise</code>
Makes a PUT request
See more at [axios](https://github.com/axios/axios)

**Kind**: instance method of [<code>Request</code>](#Request)  
**Fulfill**: <code>string\|number\|object\|array</code> data  
<a name="Request+request"></a>

### request.request() ⇒ <code>Promise</code>
Makes a request
See more at [axios](https://github.com/axios/axios)

**Kind**: instance method of [<code>Request</code>](#Request)  
**Fulfill**: <code>string\|number\|object\|array</code> data  
<a name="Auth0WebAuth"></a>

## Auth0WebAuth : [<code>SessionType</code>](#SessionType)
A SessionType that allows the user to initially authenticate with Auth0 and then gain a valid JWT
from the Contxt Auth service.

**Kind**: global class  

* [Auth0WebAuth](#Auth0WebAuth) : [<code>SessionType</code>](#SessionType)
    * [new Auth0WebAuth(sdk)](#new_Auth0WebAuth_new)
    * [.getCurrentAccessToken()](#Auth0WebAuth+getCurrentAccessToken) ⇒ <code>string</code>
    * [.getCurrentApiToken()](#Auth0WebAuth+getCurrentApiToken) ⇒ <code>string</code>
    * [.getProfile()](#Auth0WebAuth+getProfile) ⇒ <code>Promise</code>
    * [.handleAuthentication()](#Auth0WebAuth+handleAuthentication) ⇒ <code>Promise</code>
    * [.isAuthenticated()](#Auth0WebAuth+isAuthenticated) ⇒ <code>boolean</code>
    * [.logIn()](#Auth0WebAuth+logIn)
    * [.logOut()](#Auth0WebAuth+logOut)

<a name="new_Auth0WebAuth_new"></a>

### new Auth0WebAuth(sdk)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>object</code> | An instance of the SDK so the module can communicate with other modules |
| sdk.config | <code>object</code> |  |
| sdk.audiences | <code>object</code> |  |
| sdk.audiences.contxtAuth | <code>object</code> |  |
| sdk.audiences.contxtAuth.clientId | <code>string</code> | The Auth0 client id of the   Contxt Auth environment |
| sdk.config.auth | <code>object</code> |  |
| sdk.config.auth.authorizationPath | <code>string</code> | Path that is called by Auth0 after   sucessfully authenticating |
| sdk.config.auth.clientId | <code>string</code> | The Auth0 client id of this application |
| [sdk.config.auth.onRedirect] | <code>function</code> | Redirect method used when navingating between   Auth0 callbacks |

<a name="Auth0WebAuth+getCurrentAccessToken"></a>

### contxtSdk.auth.getCurrentAccessToken() ⇒ <code>string</code>
Gets the current access token (used to communicate with Auth0 & Contxt Auth)

**Kind**: instance method of [<code>Auth0WebAuth</code>](#Auth0WebAuth)  
**Returns**: <code>string</code> - accessToken  
<a name="Auth0WebAuth+getCurrentApiToken"></a>

### contxtSdk.auth.getCurrentApiToken() ⇒ <code>string</code>
Gets the current API token (used to communicate with other Contxt APIs)

**Kind**: instance method of [<code>Auth0WebAuth</code>](#Auth0WebAuth)  
**Returns**: <code>string</code> - apiToken  
<a name="Auth0WebAuth+getProfile"></a>

### contxtSdk.auth.getProfile() ⇒ <code>Promise</code>
Gets the current user's profile from Auth0

**Kind**: instance method of [<code>Auth0WebAuth</code>](#Auth0WebAuth)  
**Fulfill**: [<code>UserProfile</code>](#UserProfile)  
<a name="Auth0WebAuth+handleAuthentication"></a>

### contxtSdk.auth.handleAuthentication() ⇒ <code>Promise</code>
Routine that takes unparsed information from Auth0, uses it to get a valid API token, and then
redirects to the correct page in the application.

**Kind**: instance method of [<code>Auth0WebAuth</code>](#Auth0WebAuth)  
**Fulfill**: [<code>SessionInfo</code>](#SessionInfo)  
**Rejects**: <code>Error</code>  
<a name="Auth0WebAuth+isAuthenticated"></a>

### contxtSdk.auth.isAuthenticated() ⇒ <code>boolean</code>
Tells caller if the current user is authenticated.

**Kind**: instance method of [<code>Auth0WebAuth</code>](#Auth0WebAuth)  
<a name="Auth0WebAuth+logIn"></a>

### contxtSdk.auth.logIn()
Starts the Auth0 log in process

**Kind**: instance method of [<code>Auth0WebAuth</code>](#Auth0WebAuth)  
<a name="Auth0WebAuth+logOut"></a>

### contxtSdk.auth.logOut()
Logs the user out by removing any stored session info and redirecting to the root

**Kind**: instance method of [<code>Auth0WebAuth</code>](#Auth0WebAuth)  
<a name="UserConfig"></a>

## UserConfig : <code>object</code>
User provided configuration options

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| auth | <code>object</code> |  | User assigned configurations specific for their authentication methods |
| auth.clientId | <code>string</code> |  | Client Id provided by Auth0 for this application |
| [auth.customModuleConfigs] | <code>object</code> |  | Custom environment setups for individual modules.   Requires clientId/host or env |
| [auth.customModuleConfigs.moduleName] | <code>object</code> |  | The key of this object corresponds with   the module for which you would like to override the host/clientId |
| [auth.customModuleConfigs.moduleName.clientId] | <code>string</code> |  | Client Id provided by Auth0   for the environment you are trying to communicate with |
| [auth.customModuleConfigs.moduleName.env] | <code>string</code> |  | The SDK provided environment name   you are trying to reach |
| [auth.customModuleConfigs.moduleName.host] | <code>string</code> |  | Hostname for the API that   corresponds with the clientId provided |
| [auth.env] | <code>string</code> | <code>&quot;&#x27;production&#x27;&quot;</code> | The environment that every module should use for   their clientId and host |
| [auth.onRedirect] | <code>string</code> | <code>&quot;(pathname) &#x3D;&gt; { window.location &#x3D; pathname; }&quot;</code> | A redirect   method used for navigating through Auth0 callbacks in Web applications |

<a name="Audiences"></a>

## Audiences : <code>object</code>
An object of multiple moduleNames that makes up all audiences that will be used for
authentication and communicating with various APIs

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| moduleName | <code>object</code> | Key of this object is the name of the corresponding module   (e.g. `facilities`) |
| moduleName.clientId | <code>string</code> |  |
| moduleName.host | <code>string</code> |  |

<a name="Facility"></a>

## Facility : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| address1 | <code>string</code> |  |
| address2 | <code>string</code> |  |
| city | <code>string</code> |  |
| created_at | <code>string</code> | ISO 8601 Extended Format date/time string |
| id | <code>number</code> |  |
| Info | <code>object</code> |  |
| name | <code>string</code> |  |
| Organization | <code>object</code> |  |
| Organization.id | <code>string</code> | UUID formatted id |
| Organization.name | <code>string</code> |  |
| Organization.created_at | <code>string</code> | ISO 8601 Extended Format date/time string |
| Organization.updated_at | <code>string</code> | ISO 8601 Extended Format date/time string |
| organization.id | <code>string</code> | UUID formatted id |
| state | <code>string</code> |  |
| tags | <code>Array.&lt;object&gt;</code> |  |
| tags[].id | <code>number</code> |  |
| tags[].facility_id | <code>number</code> |  |
| tags[].name | <code>string</code> |  |
| tags[].created_at | <code>string</code> | ISO 8601 Extended Format date/time string |
| tags[].updated_at | <code>string</code> | ISO 8601 Extended Format date/time string |
| timezone | <code>string</code> | An IANA Time Zone Database string, i.e. America/Los_Angeles |
| weather_location_id | <code>number</code> |  |
| zip | <code>string</code> | US Zip Code |

<a name="SessionType"></a>

## SessionType : <code>object</code>
An adapter that allows the SDK to authenticate with different services and manage various tokens.
Can authenticate with a service like Auth0 and then with Contxt or can communicate directly
with Contxt. The adapter must implement required methods, but most methods are optional. Some of
the optional methods are documented below.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [getCurrentAccessToken] | <code>function</code> | Provides a current access token from Auth0 that is   used for profile information and can be used to get API token for Contxt itself |
| getCurrentApiToken | <code>function</code> | Provides a current API token that is used across   different Contxt services |
| [getProfile] | <code>function</code> | Provides profile information about the current user |
| [handleAuthentication] | <code>function</code> | Is called by front-end code in the Auth0 reference  implementation to handle getting the access token from Auth0 |
| isAuthenticated | <code>isAuthenticated</code> |  |
| [logIn] | <code>logIn</code> | Is used by front-end code in the Auth0 reference implementation to   start the sign in process |
| [logOut] | <code>logOut</code> | Is used by the front-end code in the Auth0 reference implementation   to sign the user out |

<a name="UserProfile"></a>

## UserProfile
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> |  |
| nickname | <code>string</code> |  |
| picture | <code>string</code> | URL to an avatar |
| sub | <code>string</code> |  |
| updated_at | <code>string</code> | ISO 8601 Extended Format date/time string |

<a name="SessionInfo"></a>

## SessionInfo
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| accessToken | <code>string</code> | 
| apiToken | <code>string</code> | 
| expiresAt | <code>number</code> | 


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
<dt><a href="#MachineAuth">MachineAuth</a> : <code><a href="#SessionType">SessionType</a></code></dt>
<dd><p>A SessionType that allows machine to machine communication between Node.js servers.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Audience">Audience</a> : <code>Object</code></dt>
<dd><p>A single audience used for authenticating and communicating with an individual API.</p>
</dd>
<dt><a href="#CustomAudience">CustomAudience</a> : <code>Object</code></dt>
<dd><p>A custom audience that will override the configuration of an individual module. Consists of
either a reference to an environment that already exists or a clientId and host for a
custom environment.</p>
</dd>
<dt><a href="#Environments">Environments</a> : <code>Object.&lt;string, Audience&gt;</code></dt>
<dd><p>An object of audiences that corresponds to all the different environments available for a
single module.</p>
</dd>
<dt><a href="#ExternalModule">ExternalModule</a> : <code>Object</code></dt>
<dd><p>An external module to be integrated into the SDK as a first class citizen. Includes information
for authenticating and communicating with an individual API and the external module itself.</p>
</dd>
<dt><a href="#UserConfig">UserConfig</a> : <code>Object</code></dt>
<dd><p>User provided configuration options</p>
</dd>
<dt><a href="#Facility">Facility</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#SessionType">SessionType</a> : <code>Object</code></dt>
<dd><p>An adapter that allows the SDK to authenticate with different services and manage various tokens.
Can authenticate with a service like Auth0 and then with Contxt or can communicate directly
with Contxt. The adapter must implement required methods, but most methods are optional. Some of
the optional methods are documented below.</p>
</dd>
<dt><a href="#UserProfile">UserProfile</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Auth0WebAuthSessionInfo">Auth0WebAuthSessionInfo</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#MachineAuthSessionInfo">MachineAuthSessionInfo</a> : <code>Object</code></dt>
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
| userConfig | [<code>UserConfig</code>](#UserConfig) | The user provided configuration options |
| [externalModules] | <code>Object</code> | User provided external modules that should be treated as   first class citizens |

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
| sdk | <code>Object</code> | An instance of the SDK so the module can communicate with other modules |
| request | <code>Object</code> | An instance of the request module tied to this module's audience. |

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
| facilityId | <code>number</code> \| <code>string</code> | The id of the facility |

**Example**  
```js
contxtSdk.facilities.get(25)
  .then((facility) => console.log(facility));
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
  .then((facilities) => console.log(facilities));
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
| config | [<code>UserConfig</code>](#UserConfig) | The user provided configuration options |
| [externalModules] | <code>Object.&lt;string, ExternalModule&gt;</code> | User provided external modules that   should be treated as first class citizens |
| sessionType | <code>string</code> | The type of auth session you wish to use (e.g. auth0WebAuth   or machine) |

**Example**  
```js
import contxtSdk from 'contxtSdk';
import ExternalModule1 from './ExternalModule1';
import history from '../services/history';

const contxtSdk = new ContxtSDK({
  config: {
    auth: {
      clientId: 'Auth0 client id of the application being built',
      customModuleConfigs: {
        facilities: {
          env: 'production'
        }
      },
      env: 'staging',
      onRedirect: (pathname) => history.push(pathname)
    }
  },
  externalModules: {
    externalModule1: {
      clientId: 'Auth0 client id of the external module',
      host: 'https://www.example.com/externalModule1',
      module: ExternalModule1
    }
  },
  sessionType: 'auth0WebAuth'
});
```
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
| sdk | <code>Object</code> | An instance of the SDK so the module can communicate with other modules |
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
    * [.getCurrentAccessToken()](#Auth0WebAuth+getCurrentAccessToken) ⇒ <code>Promise</code>
    * [.getCurrentApiToken()](#Auth0WebAuth+getCurrentApiToken) ⇒ <code>Promise</code>
    * [.getProfile()](#Auth0WebAuth+getProfile) ⇒ <code>Promise</code>
    * [.handleAuthentication()](#Auth0WebAuth+handleAuthentication) ⇒ <code>Promise</code>
    * [.isAuthenticated()](#Auth0WebAuth+isAuthenticated) ⇒ <code>boolean</code>
    * [.logIn()](#Auth0WebAuth+logIn)
    * [.logOut()](#Auth0WebAuth+logOut)

<a name="new_Auth0WebAuth_new"></a>

### new Auth0WebAuth(sdk)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>Object</code> | An instance of the SDK so the module can communicate with other modules |
| sdk.audiences | <code>Object</code> |  |
| sdk.audiences.contxtAuth | <code>Object</code> |  |
| sdk.audiences.contxtAuth.clientId | <code>string</code> | The Auth0 client id of the   Contxt Auth environment |
| sdk.config | <code>Object</code> |  |
| sdk.config.auth | <code>Object</code> |  |
| sdk.config.auth.authorizationPath | <code>string</code> | Path that is called by Auth0 after   successfully authenticating |
| sdk.config.auth.clientId | <code>string</code> | The Auth0 client id of this application |
| [sdk.config.auth.onRedirect] | <code>function</code> | Redirect method used when navigating between   Auth0 callbacks |

<a name="Auth0WebAuth+getCurrentAccessToken"></a>

### contxtSdk.auth.getCurrentAccessToken() ⇒ <code>Promise</code>
Gets the current access token (used to communicate with Auth0 & Contxt Auth)

**Kind**: instance method of [<code>Auth0WebAuth</code>](#Auth0WebAuth)  
**Fulfills**: <code>string</code> accessToken  
<a name="Auth0WebAuth+getCurrentApiToken"></a>

### contxtSdk.auth.getCurrentApiToken() ⇒ <code>Promise</code>
Gets the current API token (used to communicate with other Contxt APIs)

**Kind**: instance method of [<code>Auth0WebAuth</code>](#Auth0WebAuth)  
**Fulfills**: <code>string</code> apiToken  
<a name="Auth0WebAuth+getProfile"></a>

### contxtSdk.auth.getProfile() ⇒ <code>Promise</code>
Gets the current user's profile from Auth0

**Kind**: instance method of [<code>Auth0WebAuth</code>](#Auth0WebAuth)  
**Fulfill**: [<code>UserProfile</code>](#UserProfile)  
**Rejects**: <code>Error</code>  
<a name="Auth0WebAuth+handleAuthentication"></a>

### contxtSdk.auth.handleAuthentication() ⇒ <code>Promise</code>
Routine that takes unparsed information from Auth0, uses it to get a valid API token, and then
redirects to the correct page in the application.

**Kind**: instance method of [<code>Auth0WebAuth</code>](#Auth0WebAuth)  
**Fulfill**: [<code>Auth0WebAuthSessionInfo</code>](#Auth0WebAuthSessionInfo)  
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
<a name="MachineAuth"></a>

## MachineAuth : [<code>SessionType</code>](#SessionType)
A SessionType that allows machine to machine communication between Node.js servers.

**Kind**: global class  

* [MachineAuth](#MachineAuth) : [<code>SessionType</code>](#SessionType)
    * [new MachineAuth(sdk)](#new_MachineAuth_new)
    * [.getCurrentApiToken(audienceName)](#MachineAuth+getCurrentApiToken) ⇒ <code>Promise</code>
    * [.isAuthenticated(audienceName)](#MachineAuth+isAuthenticated) ⇒ <code>boolean</code>

<a name="new_MachineAuth_new"></a>

### new MachineAuth(sdk)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>Object</code> | An instance of the SDK so the module can communicate with other modules |

<a name="MachineAuth+getCurrentApiToken"></a>

### contxtSdk.auth.getCurrentApiToken(audienceName) ⇒ <code>Promise</code>
Gets the current API token (used to communicate with other Contxt APIs). Will get and store a
token or use a previously acquired and stored token.

**Kind**: instance method of [<code>MachineAuth</code>](#MachineAuth)  
**Fulfills**: <code>string</code> apiToken  

| Param | Type | Description |
| --- | --- | --- |
| audienceName | <code>string</code> | The audience you wish to get an API for |

<a name="MachineAuth+isAuthenticated"></a>

### contxtSdk.auth.isAuthenticated(audienceName) ⇒ <code>boolean</code>
Tells caller if the app is authenticated with a particular service.

**Kind**: instance method of [<code>MachineAuth</code>](#MachineAuth)  

| Param |
| --- |
| audienceName | 

<a name="Audience"></a>

## Audience : <code>Object</code>
A single audience used for authenticating and communicating with an individual API.

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| config.clientId | <code>string</code> | Client Id provided by Auth0 for the environment you are   trying to communicate with |
| config.host | <code>string</code> | Hostname for the API that corresponds with the clientId provided |

<a name="CustomAudience"></a>

## CustomAudience : <code>Object</code>
A custom audience that will override the configuration of an individual module. Consists of
either a reference to an environment that already exists or a clientId and host for a
custom environment.

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| [config.clientId] | <code>string</code> | Client Id provided by Auth0 for the environment you are   trying to communicate with |
| [config.env] | <code>string</code> | The SDK provided environment name you are trying to reach |
| [config.host] | <code>string</code> | Hostname for the API that corresponds with the clientId provided |

<a name="Environments"></a>

## Environments : <code>Object.&lt;string, Audience&gt;</code>
An object of audiences that corresponds to all the different environments available for a
single module.

**Kind**: global typedef  
<a name="ExternalModule"></a>

## ExternalModule : <code>Object</code>
An external module to be integrated into the SDK as a first class citizen. Includes information
for authenticating and communicating with an individual API and the external module itself.

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| config.clientId | <code>string</code> | Client Id provided by Auth0 for the environment you are   trying to communicate with |
| config.host | <code>string</code> | Hostname for the API that corresponds with the clientId provided |
| config.module | <code>function</code> | The module that will be decorated into the SDK |

<a name="UserConfig"></a>

## UserConfig : <code>Object</code>
User provided configuration options

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| auth | <code>Object</code> |  | User assigned configurations specific for their authentication methods |
| [auth.authorizationPath] | <code>string</code> |  | Path Auth0WebAuth process should redirect to after a   successful sign in attempt |
| auth.clientId | <code>string</code> |  | Client Id provided by Auth0 for this application |
| [auth.clientSecret] | <code>string</code> |  | Client secret provided by Auth0 for this application |
| [auth.customModuleConfigs] | <code>Object.&lt;string, CustomAudience&gt;</code> |  | Custom environment setups   for individual modules. Requires clientId/host or env |
| [auth.env] | <code>string</code> | <code>&quot;&#x27;production&#x27;&quot;</code> | The environment that every module should use for   their clientId and host |
| [auth.onRedirect] | <code>function</code> | <code>(pathname) &#x3D;&gt; { window.location &#x3D; pathname; }</code> | A redirect   method used for navigating through Auth0 callbacks in Web applications |
| [auth.tokenExpiresAtBufferMs] | <code>number</code> | <code>300000</code> | The time (in milliseconds) before a   token truly expires that we consider it expired (i.e. the token's expiresAt - this = calculated   expiresAt). Defaults to 5 minutes. |

<a name="Facility"></a>

## Facility : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| address1 | <code>string</code> |  |
| address2 | <code>string</code> |  |
| city | <code>string</code> |  |
| created_at | <code>string</code> | ISO 8601 Extended Format date/time string |
| id | <code>number</code> |  |
| Info | <code>Object</code> |  |
| name | <code>string</code> |  |
| Organization | <code>Object</code> |  |
| Organization.id | <code>string</code> | UUID formatted id |
| Organization.name | <code>string</code> |  |
| Organization.created_at | <code>string</code> | ISO 8601 Extended Format date/time string |
| Organization.updated_at | <code>string</code> | ISO 8601 Extended Format date/time string |
| state | <code>string</code> |  |
| tags | <code>Array.&lt;Object&gt;</code> |  |
| tags[].id | <code>number</code> |  |
| tags[].facility_id | <code>number</code> |  |
| tags[].name | <code>string</code> |  |
| tags[].created_at | <code>string</code> | ISO 8601 Extended Format date/time string |
| tags[].updated_at | <code>string</code> | ISO 8601 Extended Format date/time string |
| timezone | <code>string</code> | An IANA Time Zone Database string, i.e. America/Los_Angeles |
| weather_location_id | <code>number</code> |  |
| zip | <code>string</code> | US Zip Code |

<a name="SessionType"></a>

## SessionType : <code>Object</code>
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
| isAuthenticated | <code>function</code> | Tells caller if the current user is authenticated. |
| [logIn] | <code>function</code> | Is used by front-end code in the Auth0 reference implementation to   start the sign in process |
| [logOut] | <code>function</code> | Is used by the front-end code in the Auth0 reference implementation   to sign the user out |

<a name="UserProfile"></a>

## UserProfile : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> |  |
| nickname | <code>string</code> |  |
| picture | <code>string</code> | URL to an avatar |
| sub | <code>string</code> | The Subject Claim of the user's JWT |
| updated_at | <code>string</code> | ISO 8601 Extended Format date/time string |

<a name="Auth0WebAuthSessionInfo"></a>

## Auth0WebAuthSessionInfo : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| accessToken | <code>string</code> | 
| apiToken | <code>string</code> | 
| expiresAt | <code>number</code> | 

<a name="MachineAuthSessionInfo"></a>

## MachineAuthSessionInfo : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| apiToken | <code>string</code> | 
| expiresAt | <code>number</code> | 


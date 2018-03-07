<a name="Auth0WebAuth"></a>

## Auth0WebAuth : [<code>SessionType</code>](./Typedefs.md#SessionType)
A SessionType that allows the user to initially authenticate with Auth0 and then gain a valid JWT
from the Contxt Auth service.

**Kind**: global class  

* [Auth0WebAuth](#Auth0WebAuth) : [<code>SessionType</code>](./Typedefs.md#SessionType)
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
**Fulfill**: [<code>UserProfile</code>](./Typedefs.md#UserProfile)  
**Rejects**: <code>Error</code>  
<a name="Auth0WebAuth+handleAuthentication"></a>

### contxtSdk.auth.handleAuthentication() ⇒ <code>Promise</code>
Routine that takes unparsed information from Auth0, uses it to get a valid API token, and then
redirects to the correct page in the application.

**Kind**: instance method of [<code>Auth0WebAuth</code>](#Auth0WebAuth)  
**Fulfill**: [<code>Auth0WebAuthSessionInfo</code>](./Typedefs.md#Auth0WebAuthSessionInfo)  
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

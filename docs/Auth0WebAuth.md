<a name="Auth0WebAuth"></a>

## Auth0WebAuth : [<code>SessionType</code>](./Typedefs.md#SessionType)
A SessionType that allows the user to initially authenticate with Auth0 and then gain a valid JWT
from the Contxt Auth service. This would only be used in web applications. You will need to
integrate this module's `logIn`, `logOut`, and `handleAuthentication` methods with your UI
elements. `logIn` would be tied to a UI element to log the user in. `logOut` would be tied to a
UI element to log the user out. `handleAuthentication` would be tied with your application's
router and would be called when visting the route defined by `config.authorizationPath` (the
default is `/callback`).

This SessionType is set up to refresh auth tokens automatically. To ensure this works, make sure
your single page application has [Cross-Origin Authentication](https://auth0.com/docs/cross-origin-authentication#configure-your-application-for-cross-origin-authentication)
enabled in Auth0.

*NOTE*: The web origin added in auth0 should be something like
"http://localhost:5000", not "http://localhost:5000/callback"

**Kind**: global class  

* [Auth0WebAuth](#Auth0WebAuth) : [<code>SessionType</code>](./Typedefs.md#SessionType)
    * [new Auth0WebAuth(sdk)](#new_Auth0WebAuth_new)
    * [.clearCurrentApiToken(audienceName)](#Auth0WebAuth+clearCurrentApiToken) ⇒ <code>Promise</code>
    * [.getCurrentAccessToken()](#Auth0WebAuth+getCurrentAccessToken) ⇒ <code>Promise</code>
    * [.getCurrentApiToken(audienceName)](#Auth0WebAuth+getCurrentApiToken) ⇒ <code>Promise</code>
    * [.getProfile()](#Auth0WebAuth+getProfile) ⇒ <code>Promise</code>
    * [.handleAuthentication()](#Auth0WebAuth+handleAuthentication) ⇒ <code>Promise</code>
    * [.isAuthenticated()](#Auth0WebAuth+isAuthenticated) ⇒ <code>boolean</code>
    * [.logIn()](#Auth0WebAuth+logIn)
    * [.logOut(options)](#Auth0WebAuth+logOut)

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

**Example**  
```js
import ContxtSdk from '@ndustrial/contxt-sdk';
import history from '../services/history';

const contxtSdk = new ContxtSDK({
  config: {
    auth: {
      clientId: '<client id>',
      onRedirect: (pathname) => history.push(pathname)
    }
  },
  sessionType: 'auth0WebAuth'
});
```
<a name="Auth0WebAuth+clearCurrentApiToken"></a>

### contxtSdk.auth.clearCurrentApiToken(audienceName) ⇒ <code>Promise</code>
Removes an audience's API token from the in-memory token storage

**Kind**: instance method of [<code>Auth0WebAuth</code>](#Auth0WebAuth)  

| Param |
| --- |
| audienceName | 

<a name="Auth0WebAuth+getCurrentAccessToken"></a>

### contxtSdk.auth.getCurrentAccessToken() ⇒ <code>Promise</code>
Gets the current auth0 access token

**Kind**: instance method of [<code>Auth0WebAuth</code>](#Auth0WebAuth)  
**Fulfills**: <code>string</code> accessToken  
<a name="Auth0WebAuth+getCurrentApiToken"></a>

### contxtSdk.auth.getCurrentApiToken(audienceName) ⇒ <code>Promise</code>
Requests an api token from Contxt Auth for the correct audience

**Kind**: instance method of [<code>Auth0WebAuth</code>](#Auth0WebAuth)  
**Fulfills**: <code>string</code> apiToken  

| Param |
| --- |
| audienceName | 

<a name="Auth0WebAuth+getProfile"></a>

### contxtSdk.auth.getProfile() ⇒ <code>Promise</code>
Gets the current user's profile from Auth0

**Kind**: instance method of [<code>Auth0WebAuth</code>](#Auth0WebAuth)  
**Fulfill**: [<code>UserProfile</code>](./Typedefs.md#UserProfile)  
**Rejects**: <code>Error</code>  
<a name="Auth0WebAuth+handleAuthentication"></a>

### contxtSdk.auth.handleAuthentication() ⇒ <code>Promise</code>
Routine that takes unparsed information from Auth0, stores it in a way that
can be used for getting access tokens, schedules its future renewal, and
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

### contxtSdk.auth.logOut(options)
Logs the user out by removing any stored session info, clearing any token
renewal, and redirecting to the root

**Kind**: instance method of [<code>Auth0WebAuth</code>](#Auth0WebAuth)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  |  |
| [options.federated] | <code>Boolean</code> | <code>false</code> | Indicator for if Auth0 should   attempt to log out the user from an external IdP |
| [options.returnTo] | <code>String</code> | <code>window.location.origin</code> | URL that the   user will be redirected to after a successful log out |


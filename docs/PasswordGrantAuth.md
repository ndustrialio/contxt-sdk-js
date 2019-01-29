<a name="PasswordGrantAuth"></a>

## PasswordGrantAuth : [<code>SessionType</code>](./Typedefs.md#SessionType)
A SessionType that allows the user to authenticate with Auth0 and
then gain a valid JWT from the Contxt Auth service. This method
utitlizes the password grant type authorization with Auth0. This
SessionType will expect a username and a password to be passed into
the `logIn` function from the user to authenticate.

**Kind**: global class  

* [PasswordGrantAuth](#PasswordGrantAuth) : [<code>SessionType</code>](./Typedefs.md#SessionType)
    * [new PasswordGrantAuth(sdk)](#new_PasswordGrantAuth_new)
    * [.getCurrentApiToken()](#PasswordGrantAuth+getCurrentApiToken) ⇒ <code>Promise</code>
    * [.isAuthenticated()](#PasswordGrantAuth+isAuthenticated) ⇒ <code>boolean</code>
    * [.logIn(username, password)](#PasswordGrantAuth+logIn) ⇒ <code>Promise</code>
    * [.logOut()](#PasswordGrantAuth+logOut) ⇒ <code>Promise</code>

<a name="new_PasswordGrantAuth_new"></a>

### new PasswordGrantAuth(sdk)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>Object</code> | An instance of the SDK so the module can communicate with other modules |
| sdk.audiences | <code>Object</code> |  |
| sdk.audiences.contxtAuth | <code>Object</code> |  |
| sdk.audiences.contxtAuth.clientId | <code>string</code> | The Auth0 client id of the   Contxt Auth environment |
| sdk.audiences.contxtAuth.host | <code>string</code> |  |
| sdk.config | <code>Object</code> |  |
| sdk.config.auth | <code>Object</code> |  |
| sdk.config.auth.clientId | <code>string</code> | The Auth0 client id of the application |

**Example**  
```js
const ContxtSdk = require('@ndustrial/contxt-sdk');

const contxtService = new ContxtSdk({
  config: {
    auth: {
      clientId: '<client id>'
    }
  },
  sessionType: 'passwordGrantAuth'
});
```
<a name="PasswordGrantAuth+getCurrentApiToken"></a>

### contxtSdk.auth.getCurrentApiToken() ⇒ <code>Promise</code>
Gets the current API token (used to communicate with other Contxt APIs)

**Kind**: instance method of [<code>PasswordGrantAuth</code>](#PasswordGrantAuth)  
**Fulfills**: <code>string</code> apiToken  
**Rejects**: <code>Error</code>  
<a name="PasswordGrantAuth+isAuthenticated"></a>

### contxtSdk.auth.isAuthenticated() ⇒ <code>boolean</code>
Tells caller if the current user is authenticated

**Kind**: instance method of [<code>PasswordGrantAuth</code>](#PasswordGrantAuth)  
<a name="PasswordGrantAuth+logIn"></a>

### contxtSdk.auth.logIn(username, password) ⇒ <code>Promise</code>
Logs the user in using Auth0 using a username a password

**Kind**: instance method of [<code>PasswordGrantAuth</code>](#PasswordGrantAuth)  
**Fulfills**: <code>string</code>  
**Rejects**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| username | <code>string</code> | The username of the user to authenticate |
| password | <code>string</code> | The password of the user to authenticate |

<a name="PasswordGrantAuth+logOut"></a>

### contxtSdk.auth.logOut() ⇒ <code>Promise</code>
Logs the user out by removing any stored session info.

**Kind**: instance method of [<code>PasswordGrantAuth</code>](#PasswordGrantAuth)  
**Fulfills**: <code>string</code>  

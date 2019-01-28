<a name="CliAuth"></a>

## CliAuth : [<code>SessionType</code>](./Typedefs.md#SessionType)
A SessionType that allows the user to authenticate with Auth0 and
then gain a valid JWT from the Contxt Auth service. This would only
be used in command line applications such as `contxt-cli`.

**Kind**: global class  

* [CliAuth](#CliAuth) : [<code>SessionType</code>](./Typedefs.md#SessionType)
    * [new CliAuth(sdk)](#new_CliAuth_new)
    * [.logIn(username, password)](#CliAuth+logIn) ⇒ <code>Promise</code>
    * [.logOut()](#CliAuth+logOut) ⇒ <code>Promise</code>

<a name="new_CliAuth_new"></a>

### new CliAuth(sdk)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>Object</code> | An instance of the SDK so the module can communicate with other modules |
| sdk.audiences | <code>Object</code> |  |
| sdk.audiences.contxtAuth | <code>Object</code> |  |
| sdk.audiences.contxtAuth.clientId | <code>string</code> | The Auth0 client id of the   Contxt Auth environment |
| sdk.config | <code>Object</code> |  |
| sdk.config.auth | <code>Object</code> |  |
| sdk.config.auth.clientId | <code>string</code> | The Auth0 client id of the application |

**Example**  
```js
const ContxtSdk = require('@ndustrial/contxt-sdk');

const contxtService = new ContxtSdk({
  config: {
    auth: {
      clientId: 'bleED0RUwb7CJ9j7D48tqSiSZRZn29AV'
    }
  },
  sessionType: 'cliAuth'
});
```
<a name="CliAuth+logIn"></a>

### contxtSdk.auth.logIn(username, password) ⇒ <code>Promise</code>
Logs the user in using Auth0 using a username a password

**Kind**: instance method of [<code>CliAuth</code>](#CliAuth)  
**Fulfills**: <code>string</code>  
**Rejects**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| username | <code>string</code> | The username of the user to authenticate |
| password | <code>string</code> | The password of the user to authenticate |

<a name="CliAuth+logOut"></a>

### contxtSdk.auth.logOut() ⇒ <code>Promise</code>
Logs the user out by removing any stored session info.

**Kind**: instance method of [<code>CliAuth</code>](#CliAuth)  
**Fulfills**: <code>string</code>  

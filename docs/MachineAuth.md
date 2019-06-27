<a name="MachineAuth"></a>

## MachineAuth : [<code>SessionType</code>](./Typedefs.md#SessionType)
A SessionType that allows machine to machine communication between Node.js servers. This would
only be used in Node.js applications. This SessionType requires a client id and a client secret,
which are obtained from Auth0.

**Kind**: global class  

* [MachineAuth](#MachineAuth) : [<code>SessionType</code>](./Typedefs.md#SessionType)
    * [new MachineAuth(sdk)](#new_MachineAuth_new)
    * [.clearCurrentApiToken(audienceName)](#MachineAuth+clearCurrentApiToken) ⇒ <code>Promise</code>
    * [.getCurrentApiToken(audienceName)](#MachineAuth+getCurrentApiToken) ⇒ <code>Promise</code>
    * [.isAuthenticated(audienceName)](#MachineAuth+isAuthenticated) ⇒ <code>boolean</code>

<a name="new_MachineAuth_new"></a>

### new MachineAuth(sdk)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>Object</code> | An instance of the SDK so the module can communicate with other modules |

**Example**  
```js
const ContxtSdk = require('@ndustrial/contxt-sdk');

const contxtSdk = new ContxtSDK({
  config: {
    auth: {
      clientId: '<client id>',
      clientSecret: '<client secret>'
    }
  },
  sessionType: 'machineAuth'
});
```
<a name="MachineAuth+clearCurrentApiToken"></a>

### contxtSdk.auth.clearCurrentApiToken(audienceName) ⇒ <code>Promise</code>
Removes an audience's API token from the in-memory token storage

**Kind**: instance method of [<code>MachineAuth</code>](#MachineAuth)  

| Param |
| --- |
| audienceName | 

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


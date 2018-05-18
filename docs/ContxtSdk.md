<a name="ContxtSdk"></a>

## ContxtSdk

ContxtSdk constructor

**Kind**: global class  
<a name="new_ContxtSdk_new"></a>

### new ContxtSdk(config, [externalModules], sessionType)

| Param             | Type                                                | Description                                                                   |
| ----------------- | --------------------------------------------------- | ----------------------------------------------------------------------------- |
| config            | [<code>UserConfig</code>](./Typedefs.md#UserConfig) | The user provided configuration options                                       |
| [externalModules] | <code>Object.&lt;string, ExternalModule&gt;</code>  | User provided external modules that should be treated as first class citizens |
| sessionType       | <code>string</code>                                 | The type of auth session you wish to use (e.g. auth0WebAuth or machine)       |

**Example**

```js
import ContxtSdk from '@ndustrial/contxt-sdk';
import ExternalModule1 from './ExternalModule1';
import history from '../services/history';

const contxtSdk = new ContxtSdk({
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

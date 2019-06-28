<a name="ContxtSdk"></a>

## ContxtSdk
ContxtSdk constructor

**Kind**: global class  

* [ContxtSdk](#ContxtSdk)
    * [new ContxtSdk(config, [externalModules], sessionType)](#new_ContxtSdk_new)
    * [.mountDynamicModule(moduleName, externalModule)](#ContxtSdk+mountDynamicModule)
    * [.unmountDynamicModule(moduleName)](#ContxtSdk+unmountDynamicModule)

<a name="new_ContxtSdk_new"></a>

### new ContxtSdk(config, [externalModules], sessionType)

| Param | Type | Description |
| --- | --- | --- |
| config | [<code>UserConfig</code>](./Typedefs.md#UserConfig) | The user provided configuration options |
| [externalModules] | <code>Object.&lt;string, ExternalModule&gt;</code> | User provided external modules that   should be treated as first class citizens |
| sessionType | <code>string</code> | The type of auth session you wish to use (e.g. auth0WebAuth   or machine) |

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
<a name="ContxtSdk+mountDynamicModule"></a>

### contxtSdk.mountDynamicModule(moduleName, externalModule)
Mounts a dynamic module into the SDK. Is used to add a module after initial
instatiation that will use the SDK's authentication and request methods to
access an ndustrial.io API

**Kind**: instance method of [<code>ContxtSdk</code>](#ContxtSdk)  

| Param | Type | Description |
| --- | --- | --- |
| moduleName | <code>string</code> | The name (or key) that will serve as the mount   point for the module in the SDK (i.e. customModule -> sdk.customModule) |
| externalModule | [<code>ExternalModule</code>](./Typedefs.md#ExternalModule) |  |

<a name="ContxtSdk+unmountDynamicModule"></a>

### contxtSdk.unmountDynamicModule(moduleName)
Unmounts a dynamic module from the SDK

**Kind**: instance method of [<code>ContxtSdk</code>](#ContxtSdk)  

| Param | Type | Description |
| --- | --- | --- |
| moduleName | <code>string</code> | The name of the dynamic module to unmount |


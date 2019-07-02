# contxt-sdk [![wercker status](https://app.wercker.com/status/869ef086297da79ddd0cbf3564f7cba6/s/master 'wercker status')](https://app.wercker.com/project/byKey/869ef086297da79ddd0cbf3564f7cba6)

## Installation

The `contxt-sdk` can be installed with NPM:

```bash
npm install --save @ndustrial/contxt-sdk
```

## Getting Started

Once installed, the minimum configuration you need to get going is to include the `clientId` of your application (from Auth0) and a string with the type of authentication you want to use (`auth0WebAuth` or `machineAuth`).

```javascript
import ContxtSdk from '@ndustrial/contxt-sdk';

const contxtSdk = new ContxtSdk({
  config: {
    auth: {
      clientId: 'example clientId from auth0'
    }
  },
  sessionType: 'auth0WebAuth'
});

contxtSdk.facilities.getAll().then((facilities) => {
  console.log(`all of my facilities: ${JSON.stringify(facilities)}`);
});
```

Additional information about configuration options can be found in the [API docs](https://github.com/ndustrialio/contxt-sdk-js/blob/master/docs/ContxtSdk.md).

## SessionTypes {#session-types}

There are several session types available for different types of applications:

1. [`Auth0WebAuth` (documentation)](https://github.com/ndustrialio/contxt-sdk-js/blob/master/docs/Auth0WebAuth.md)
1. [`MachineAuth` (documentation)](https://github.com/ndustrialio/contxt-sdk-js/blob/master/docs/MachineAuth.md)
1. [`PasswordGrantAuth` (documentation)](https://github.com/ndustrialio/contxt-sdk-js/blob/master/docs/PasswordGrantAuth.md)

- This session type is a work in progress and some features are incomplete. One specific caveat is that this session type does not work with dynamic modules or dynamic audiences.

## Extending Functionality

There are times where it is necessary to access Contxt and ndustrial.io APIs that are not currently in the SDK. There are two different mechanisms to extend functionality and allow custom code to act as a first class extension of the SDK's API:

1. [External Modules](#external-modules)
1. [Dynamic Modules](#dynamic-modules)

### External Modules {#external-modules}

The simplest method for extending functionality is to use an External Module. These modules can be added to the SDK when the SDK is initially instantiated in your application.

Include your information about the module when creating your `contxt-sdk` instance:

```javascript
import ContxtSdk from 'contxt-sdk';
import NewExternalModule from './NewExternalModule';

const contxtSdk = new ContxtSdk({
  config: {
    auth: {
      clientId: 'example clientId from auth0'
    }
  },
  externalModules: {
    newExternalModule: {
      clientId: 'The Auth0 Id of the API you are communicated with',
      host: 'http://newExternalModule.example.com',
      module: NewExternalModule
    }
  },
  sessionType: 'auth0WebAuth'
});

contxtSdk.newModule.doWork();
```

When we decorate your external module into your SDK instance, it is treated just like one of the native, internal modules and is provided with the SDK instance (so you can use other parts of the SDK from your new module) and its own request module, which will handle API tokens if you are working with a Contxt API.

```javascript
class NewExternalModule {
  constructor(sdk, request) {
    this._baseUrl = `${sdk.config.audiences.newExternalModule.host}/v1`;
    this._request = request;
    this._sdk = sdk;
  }

  doWork() {
    return this._request.patch(`${this._baseUrl}/data`, { work: 'finished' });
  }
}

export default NewExternalModule;
```

### Dynamic Modules {#dynamic-modules}

A more flexible, but slightly more intensive way of extending functionality is through dynamic modules. Dynamic modules are very much like external modules, but differ in that they can be added or mounted to the SDK after the SDK is initially instatiated. An example of a good time to use this functionality is a web application where Webpack's code splitting functionality is used and parts of the application are added with dynamic imports -- not all the code would necessarily available when initially creating a ContxtSDK instance, so extensions to the SDK need to be added when the split part of the application is loaded.

#### Mounting a dynamic module

To start, there should be a ContxtSDK instance that is created at initial runtime:

```javascript
import ContxtSdk from 'contxt-sdk';

const contxtSdk = new ContxtSdk({
  config: {
    auth: {
      clientId: 'example clientId from auth0'
    }
  },
  sessionType: 'auth0WebAuth'
});

export default contxtSdk;
```

There is also a module that is going to be dynamically decorated or mounted into the Contxt SDK:

```javascript
class NewDynamicModule {
  constructor(sdk, request) {
    this._baseUrl = `${sdk.config.audiences.newDynamicModule.host}/v1`;
    this._request = request;
    this._sdk = sdk;
  }

  doWork() {
    return this._request.patch(`${this._baseUrl}/data`, { work: 'finished' });
  }
}

export default NewDynamicModule;
```

Once both of these things are available, the module can be mounted into the existing SDK instance and the methods of the module can run:

```javascript
import contxtSdk from './contxtSdk';
import NewDynamicModule from './NewDynamicModule';

contxtSdk.mountDynamicModule('newDynamicModule', {
  clientId: 'The Auth0 Id of the API you are communicated with',
  host: 'http://newDynamicModule.example.com',
  module: NewDynamicModule
});

contxtSdk.newDynamicModule.doWork();
```

##### Notes

- If there is already a module (a built-in module or an external module that was added at instantiation time) at this `newDynamicModule` namespace, this functionality will overwrite the existing module, but store the existing built-in or external module and it's audience information for future use if the dynamic module was unmounted in the future.

[More information on `mountDynamicModule`](https://github.com/ndustrialio/contxt-sdk-js/blob/master/docs/ContxtSdk.md#ContxtSdk+mountDynamicModule)

#### Unmounting a dynamic module

There may arise a situation where a dynamic module needs to be unmounted. To do this, the `unmountDynamicModule` method can be used:

```javascript
contxtSdk.unmountDynamicModule('newDynamicModule');
```

##### Notes

- If attempting to unmount a module that is not a dynamic module, an error will be thrown.
- If there was a module that was previously mounted at the same namespace/key, it will be remounted.

[More information on `unmountDynamicModule`](https://github.com/ndustrialio/contxt-sdk-js/blob/master/docs/ContxtSdk.md#ContxtSdk+ynmountDynamicModule)

## Development

### Building the package

[Gulp](https://gulpjs.com/) is used to build the source code in CommonJS and ES Module distributions that can be used across many platforms. These distributions are both built by running one command: `npm run build`. If you'd like to continuously create builds as files are changed (i.e. if you are developing new features and have set things up correctly with `npm link` to serve the newly updated files to your app), you can run `npm run watch`. Currently, the docs are built by a custom script, but may move to Gulp in the future.

If there is a module that needs to be different between browser and Node implementations, this can be achieved by creating a separate file with a file name indicating it is only for a browser (like `module.browser.js`) and adding the source path and replacement path of the files to the `browser` section of the `package.json` (example below). It will need to be added for both the `esm` and `lib` directories to account for whether the end user is using CommonJS or ES modules. When the client application is built, Webpack will pick up the browser version instead of the Node version.

```javascript
{
  ... other stuff
  "main": "lib/index.js",
  "module": "esm/index.js",
  "browser": {
    "./esm/module.js": "./esm/module.browser.js",
    "./lib/module.js": "./lib/module.browser.js",
  }
  ... other stuff
}
```

### Testing & Code Quality

Some important NPM tasks for running the test suite:

- `npm test` - Lints, sets up tracking for Istanbul coverage reports, and runs the test suite
- `npm run test:js` - Runs the test suite
- `npm run test:js:dev` - Runs the test suite in watch mode, where the tests are re-run whenever a file changes
- `npm run test:js:inspect` - Runs the test suite in inspect/inspect-brk mode. Insert a `debugger` somewhere in your code and connect to the debugger with this command. (Node 8: visit `chrome://inspect` to connect. Node 6: Copy and paste the blob provided in the terminal into Chrome to connect. Older versions also have ways to connect.)
- `npm run lint` - Lints the source code
- `npm run coverage` - Sets up tracking for Istanbul coverage reports and runs the test suite
- `npm run report` - Parses the Istanbul coverage reports and writes them to file (in `./coverage`) and displays them in terminal

Some tools used for testing and ensuring code quality include:

- [Chai.js](http://chaijs.com/) (specifically the `expect` syntax)
- [chai-as-promised](https://github.com/domenic/chai-as-promised)
- [ESLint](https://eslint.org/)
- [eslint-config-ndustrial](https://github.com/ndustrialio/eslint-config-ndustrial)
- [faker.js](https://github.com/marak/Faker.js/)
- [Mocha](https://mochajs.org/)
- [Prettier](https://prettier.io/)
- [Sinon.JS](http://sinonjs.org/)
- [sinon-chai](http://chaijs.com/plugins/sinon-chai/)

Additionally, some globals have been added to the testing environment to streamline the process slightly:

- `expect` - Corresponds with `require('chai').expect`. [Info](http://chaijs.com/api/bdd/)
- `faker` - Corresponds with `require('faker')`. [Info](https://github.com/marak/Faker.js/)
- `sinon` - Corresponds with `require('sinon')`. Should be used anytime when wanting to create a `sinon.spy` or `sinon.stub` as it can be easily used to reset/restore multiple spies and stubs. [Info](https://sinonjs.org/releases/v7.3.2/sandbox/)

## Contributing/Publishing

There are certain steps that should be taken when contributing and publishing a new release of the `contxt-sdk`.

### Contributing

We use [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown) for documentation which should be committed to source control. The docs are set up to build and be added to git on a pre-commit hook using [husky](https://github.com/typicode/husky) so you shouldn't need to run an additional command to build the docs before submitting a pull request.

### Publishing

There are certain steps that should be taken when publishing a release to NPM to avoid any issues or problems. After
your pull request is approved and merged into `master`, follow the steps below.

1.  Checkout `master` locally and perform a `git pull origin master` so your local repo is up to date with your merged changes.
1.  Run `npm version x.x.x` in your terminal on `master` where the `x`'s are the new version numbers.
    - This sets the new version in `package.json` and `package-lock.json` and also creates a new `git tag`.
    - Example `npm version 0.30.1`
1.  Perform a `git push --tags origin master` while on your local copy of `master`.
1.  Perform an `npm publish` to publish the updated package to NPM.

You've now successfully updated and published the package.

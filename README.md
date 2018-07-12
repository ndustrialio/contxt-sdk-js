# contxt-sdk [![wercker status](https://app.wercker.com/status/869ef086297da79ddd0cbf3564f7cba6/s/master 'wercker status')](https://app.wercker.com/project/byKey/869ef086297da79ddd0cbf3564f7cba6)

## Installation

The `contxt-sdk` can be installed with NPM:

```bash
npm install --save @ndustrial/contxt-sdk
```

There are two peer dependencies for `contxt-sdk`, `auth0-js` and `axios`. If you don't already have a compatible version installed, run:

```bash
npm install --save auth0-js@^9.0.0 axios@~0.17.0
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

Information about using the auth0WebAuth and machineAuth modules is available in the API docs [here (auth0WebAuth)](https://github.com/ndustrialio/contxt-sdk-js/blob/master/docs/Auth0WebAuth.md) and [here (machineAuth)](https://github.com/ndustrialio/contxt-sdk-js/blob/master/docs/MachineAuth.md). Additional information about configuration options can also be found in the [API docs](https://github.com/ndustrialio/contxt-sdk-js/blob/master/docs/ContxtSdk.md).

## Adding in external modules

At times when building your application, there might be a Contxt API that you need to reach that is not currently included in the `contxt-sdk` package. To help out with this, we've created a way to include an external module into the SDK when creating an SDK instance that allows the external module to act as a first class extension of the SDK's API.

To do this, just include information about the module when creating your `contxt-sdk` instance:

```javascript
import ContxtSdk from 'contxt-sdk';
import NewModule from './NewModule';

const contxtSdk = new ContxtSdk({
  config: {
    auth: {
      clientId: 'example clientId from auth0'
    }
  },
  externalModules: {
    newModule: {
      clientId: 'The Auth0 Id of the API you are communicated with',
      host: 'http://newModule.example.com',
      module: NewModule
    }
  },
  sessionType: 'auth0WebAuth'
});

contxtSdk.newModule.doWork();
```

When we decorate your external module into your SDK instance, it is treated just like one of the native, internal modules and is provided with the SDK instance (so you can use other parts of the SDK from your new module) and its own request module, which will handle API tokens if you are working with a Contxt API.

```javascript
class NewModule {
  constructor(sdk, request) {
    this._baseUrl = `${sdk.config.audiences.newModule.host}/v1`;
    this._request = request;
    this._sdk = sdk;
  }

  doWork() {
    return this._request.patch(`${this._baseUrl}/data`, { work: 'finished' });
  }
}

export default NewModule;
```

## Development

### Building the package

[rollup.js](https://rollupjs.org/guide/en) is used to build the source code into CommonJS and ES6 modules that can be used for distribution. These modules are both built by running one command: `npm run build`. If you'd like to continuously create builds as files are changed (i.e. if you are developing new features and have set things up correctly with `npm link` to serve the newly updated files to your app), you can run `npm run watch`.

### Testing & Code Quality

Some important NPM tasks for running the test suite:

* `npm test` - Lints, sets up tracking for Istanbul coverage reports, and runs the test suite
* `npm run test:js` - Runs the test suite
* `npm run test:js:dev` - Runs the test suite in watch mode, where the tests are re-run whenever a file changes
* `npm run test:js:inspect` - Runs the test suite in inspect/inspect-brk mode. Insert a `debugger` somewhere in your code and connect to the debugger with this command. (Node 8: visit `chrome://inspect` to connect. Node 6: Copy and paste the blob provided in the terminal into Chrome to connect. Older versions also have ways to connect.)
* `npm run lint` - Lints the source code
* `npm run coverage` - Sets up tracking for Istanbul coverage reports and runs the test suite
* `npm run report` - Parses the Istanbul coverage reports and writes them to file (in `./coverage`) and displays them in terminal

Some tools used for testing and ensuring code quality include:

* [Chai.js](http://chaijs.com/) (specifically the `expect` syntax)
* [chai-as-promised](https://github.com/domenic/chai-as-promised)
* [ESLint](https://eslint.org/)
* [eslint-config-ndustrial](https://github.com/ndustrialio/eslint-config-ndustrial)
* [faker.js](https://github.com/marak/Faker.js/)
* [Mocha](https://mochajs.org/)
* [Sinon.JS](http://sinonjs.org/)
* [sinon-chai](http://chaijs.com/plugins/sinon-chai/)

Additionally, some globals have been added to the testing environment to streamline the process slightly:

* `expect` - Corresponds with `require('chai').expect`. [Info](http://chaijs.com/api/bdd/)
* `faker` - Corresponds with `require('faker')`. [Info](https://github.com/marak/Faker.js/)
* `sandbox` - Corresponds with `require('sinon').sandbox`. Should be used anytime when wanting to create a `sinon.spy` or `sinon.stub` as it can be easily used to reset/restore multiple spys and stubs. [Info](http://sinonjs.org/releases/v4.1.6/sandbox/)

## Contributing/Publishing

There are certain steps that should be taken when contributing and publishing a new release of the `contxt-sdk`.

### Contributing

Be sure to run `npm run build` before putting your pull request up for code review. While this is command is run in
preparation of publishing to NPM, it autogenerates the documentation and should be committed into GitHub as well.

### Publishing

There are certain steps that should be taken when publishing a release to NPM to avoid any issues or problems. After
your pull request is approved and merged into `master` follow the steps below.

1.  Checkout `master` locally and perform a `git pull origin master` so your local repo is up to date with your merged changes.
1.  Run `npm version x.x.x` in your terminal on `master` where the `x`'s are the new version numbers.
    * This sets the new version in `package.json` and `package-lock.json` and also creates a new `git tag`.
    * Example `npm version 0.30.1`
1.  Perform a `git push --tags origin master` while on your local copy of `master`.
1.  Perform an `npm publish` to publish the updated package to NPM.

Now you've successfully updated and published the package.

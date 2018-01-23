# contxt-sdk

## Building the package

[rollup.js](https://rollupjs.org/guide/en) is used to build the source code into CommonJS and ES6 modules that can be used for distribution. These modules are both built by running one command: `npm run build`. If you'd like to continuously create builds as files are changed (i.e. if you are developing new features and have set things up correctly with `npm link` to serve the newly updated files to your app), you can run `npm run watch`.

## Testing & Code Quality

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
- [Sinon.JS](http://sinonjs.org/)
- [sinon-chai](http://chaijs.com/plugins/sinon-chai/)

Additionally, some globals have been added to the testing environment to streamline the process slightly:

- `expect` - Corresponds with `require('chai').expect`. [Info](http://chaijs.com/api/bdd/)
- `faker` - Corresponds with `require('faker')`. [Info](https://github.com/marak/Faker.js/)
- `sandbox` - Corresponds with `require('sinon').sandbox`. Should be used anytime when wanting to create a `sinon.spy` or `sinon.stub` as it can be easily used to reset/restore multiple spys and stubs. [Info](http://sinonjs.org/releases/v4.1.6/sandbox/)

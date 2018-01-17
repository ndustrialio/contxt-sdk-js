# ndustrial-js-sdk

## Testing & Code Quality

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

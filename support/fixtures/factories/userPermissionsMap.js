'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');
const times = require('lodash.times');

factory.define('userPermissionsMap').after((userPermissionsMap) => {
  const newPermissionsMap = times(
    faker.random.number({ min: 1, max: 5 })
  ).reduce((memo) => {
    memo[faker.internet.password()] = times(
      faker.random.number({ min: 1, max: 5 })
    ).reduce((existingScopes) => {
      const scopeLabel = `${faker.lorem.word()}_${faker.lorem.word()}`;

      return [...existingScopes, `read:${scopeLabel}`, `write:${scopeLabel}`];
    }, []);

    return memo;
  }, {});

  Object.assign(userPermissionsMap, newPermissionsMap);
});

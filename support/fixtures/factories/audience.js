'use strict';

const factory = require('rosie').Factory;
const { faker } = require('@faker-js/faker');

factory.define('audience').attrs({
  clientId: () => faker.internet.password(),
  host: () => faker.internet.url()
});

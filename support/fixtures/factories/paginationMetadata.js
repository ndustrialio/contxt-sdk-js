'use strict';

const factory = require('rosie').Factory;
const { faker } = require('@faker-js/faker');

factory.define('paginationMetadata').attrs({
  offset: () => faker.number.int({ max: 100 }),
  totalRecords: () => faker.number.int({ min: 1, max: 1000 })
});

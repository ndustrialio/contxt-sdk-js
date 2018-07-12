'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory.define('paginationMetadata').attrs({
  offset: () => faker.random.number({ max: 100 }),
  totalRecords: () => faker.random.number({ min: 1, max: 1000 })
});

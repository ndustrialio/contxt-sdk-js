'use strict';

const factory = require('rosie').Factory;
const { faker } = require('@faker-js/faker');

factory
  .define('fieldGroupingStatus')
  .option('fromServer', false)
  .attrs({
    id: () => faker.string.uuid(),
    label: () => faker.commerce.productName(),
    status: () => faker.helpers.arrayElement(['Active', 'Out-of-Date']),
    updatedAt: () => faker.date.recent().toISOString()
  })
  .after((fieldGroupingStatus, options) => {
    if (options.fromServer) {
      fieldGroupingStatus.updated_at = fieldGroupingStatus.updatedAt;
      delete fieldGroupingStatus.updatedAt;
    }
  });

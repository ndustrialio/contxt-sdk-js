'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('fieldGroupingStatus')
  .option('fromServer', false)
  .attrs({
    id: () => faker.random.uuid(),
    label: () => faker.commerce.productName(),
    status: () => faker.random.arrayElement(['Active', 'Out-of-Date']),
    updatedAt: () => faker.date.recent().toISOString()
  })
  .after((fieldGroupingStatus, options) => {
    if (options.fromServer) {
      fieldGroupingStatus.updated_at = fieldGroupingStatus.updatedAt;
      delete fieldGroupingStatus.updatedAt;
    }
  });

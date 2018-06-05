'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('costCenter')
  .option('fromServer', false)
  .attrs({
    description: () => faker.hacker.phrase(),
    id: () => faker.random.uuid(),
    name: () => faker.commerce.productName(),
    organizationId: () => factory.build('organization').id
  })
  .after((costCenter, options) => {
    // If building a cost center object that comes from the server, transform it to have camel
    // case and capital letters in the right spots
    if (options.fromServer) {
      costCenter.organization_id = costCenter.organizationId;
      delete costCenter.organizationId;
    }
  });

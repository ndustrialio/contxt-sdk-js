'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');
const times = require('lodash.times');

factory
  .define('costCenter')
  .option('fromServer', false)
  .attrs({
    createdAt: () => faker.date.past().toISOString(),
    description: () => faker.hacker.phrase(),
    id: () => faker.random.uuid(),
    name: () => faker.commerce.productName(),
    organizationId: () => factory.build('organization').id,
    updatedAt: () => faker.date.recent().toISOString()
  })
  .attr('facilities', ['id', 'fromServer'], (id, fromServer) => {
    return times(
      faker.random.number({
        min: 0,
        max: 5
      }),
      () => {
        return factory.build(
          'facility',
          {
            facilityId: id
          },
          {
            fromServer
          }
        );
      }
    );
  })
  .after((costCenter, options) => {
    // If building a cost center object that comes from the server, transform it to have camel
    // case and capital letters in the right spots
    if (options.fromServer) {
      costCenter.created_at = costCenter.createdAt;
      delete costCenter.createdAt;

      costCenter.organization_id = costCenter.organizationId;
      delete costCenter.organizationId;

      costCenter.updated_at = costCenter.updatedAt;
      delete costCenter.updatedAt;
    }
  });

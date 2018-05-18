'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('facilityTag')
  .option('fromServer', false)
  .sequence('id')
  .attrs({
    createdAt: () => faker.date.past().toISOString(),
    facilityId: () => faker.random.number(),
    name: () => faker.commerce.productMaterial(),
    updatedAt: () => faker.date.recent().toISOString()
  })
  .after((facilityTag, options) => {
    // If building a facility tag object that comes from the server, transform it to have camel case
    // and capital letters in the right spots
    if (options.fromServer) {
      facilityTag.created_at = facilityTag.createdAt;
      delete facilityTag.createdAt;

      facilityTag.facility_id = facilityTag.facilityId;
      delete facilityTag.facilityId;

      facilityTag.updated_at = facilityTag.updatedAt;
      delete facilityTag.updatedAt;
    }
  });

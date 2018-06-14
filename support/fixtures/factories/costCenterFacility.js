'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('costCenterFacility')
  .option('fromServer', false)
  .attrs({
    costCenterId: () => faker.random.uuid(),
    facilityId: () => faker.random.number(),
    id: () => faker.random.uuid()
  })
  .after((costCenterFacility, options) => {
    // If building a cost center facility object that comes from the server, transform it to
    // have camel case and capital letters in the right spots
    if (options.fromServer) {
      costCenterFacility.cost_center_id = costCenterFacility.costCenterId;
      delete costCenterFacility.costCenterId;

      costCenterFacility.facility_id = costCenterFacility.facilityId;
      delete costCenterFacility.facilityId;
    }
  });

'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('facilityGroupingFacility')
  .option('fromServer', false)
  .attrs({
    createdAt: () => faker.date.past().toISOString(),
    facilityGroupingId: () => faker.random.uuid(),
    facilityId: () => faker.random.number(),
    id: () => faker.random.uuid(),
    updatedAt: () => faker.date.recent().toISOString()
  })
  .after((facilityGroupingFacility, options) => {
    // If building a facility grouping facility object that comes from the server, transform it to
    // have camel case and capital letters in the right spots
    if (options.fromServer) {
      facilityGroupingFacility.created_at = facilityGroupingFacility.createdAt;
      delete facilityGroupingFacility.createdAt;

      facilityGroupingFacility.facility_grouping_id =
        facilityGroupingFacility.facilityGroupingId;
      delete facilityGroupingFacility.facilityGroupingId;

      facilityGroupingFacility.facility_id =
        facilityGroupingFacility.facilityId;
      delete facilityGroupingFacility.facilityId;

      facilityGroupingFacility.updated_at = facilityGroupingFacility.updatedAt;
      delete facilityGroupingFacility.updatedAt;
    }
  });

'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('facilityGrouping')
  .option('fromServer', false)
  .attrs({
    createdAt: () => faker.date.past().toISOString(),
    description: () => faker.hacker.phrase(),
    id: () => faker.random.uuid(),
    isPrivate: () => faker.random.boolean(),
    name: () => faker.commerce.productName(),
    organizationId: () => factory.build('organization').id,
    ownerId: () => faker.internet.userName(),
    parentGroupingId: () => faker.random.uuid(),
    updatedAt: () => faker.date.recent().toISOString()
  })
  .after((facilityGrouping, options) => {
    // If building a facility grouping object that comes from the server, transform it to have camel
    // case and capital letters in the right spots
    if (options.fromServer) {
      facilityGrouping.created_at = facilityGrouping.createdAt;
      delete facilityGrouping.createdAt;

      facilityGrouping.is_private = facilityGrouping.isPrivate;
      delete facilityGrouping.isPrivate;

      facilityGrouping.organization_id = facilityGrouping.organizationId;
      delete facilityGrouping.organizationId;

      facilityGrouping.owner_id = facilityGrouping.ownerId;
      delete facilityGrouping.ownerId;

      facilityGrouping.parent_grouping_id = facilityGrouping.parentGroupingId;
      delete facilityGrouping.parentGroupingId;

      facilityGrouping.updated_at = facilityGrouping.updatedAt;
      delete facilityGrouping.updatedAt;
    }
  });

'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('contxtOrganizationFeaturedApplication')
  .option('fromServer', false)
  .attrs({
    applicationId: () => faker.random.number(),
    createdAt: () => faker.date.past().toISOString(),
    id: () => faker.random.uuid(),
    organizationId: () => faker.random.uuid(),
    updatedAt: () => faker.date.recent().toISOString()
  })
  .after((featuredApp, options) => {
    // If building a featuredApp object that comes from the server, transform it to have camel
    // case and capital letters in the right spots
    if (options.fromServer) {
      featuredApp.application_id = featuredApp.applicationId;
      delete featuredApp.applicationId;

      featuredApp.created_at = featuredApp.createdAt;
      delete featuredApp.createdAt;

      featuredApp.organization_id = featuredApp.organizationId;
      delete featuredApp.organizationId;

      featuredApp.updated_at = featuredApp.updatedAt;
      delete featuredApp.updatedAt;
    }
  });

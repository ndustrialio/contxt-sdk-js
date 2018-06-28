'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('assetType')
  .option('fromServer', false)
  .attrs({
    createdAt: () => faker.date.past().toISOString(),
    description: () => faker.hacker.phrase(),
    id: () => faker.random.uuid(),
    label: () => faker.lorem.sentence(),
    organizationId: () => factory.build('organization').id,
    updatedAt: () => faker.date.recent().toISOString()
  })
  .after((assetType, options) => {
    // If building an asset object that comes from the server,
    // transform it to have camel case and capital letters
    // in the right spots
    if (options.fromServer) {
      assetType.created_at = assetType.createdAt;
      delete assetType.createdAt;

      assetType.organization_id = assetType.organizationId;
      delete assetType.organizationId;

      assetType.updated_at = assetType.updatedAt;
      delete assetType.updatedAt;
    }
  });

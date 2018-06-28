'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('asset')
  .option('fromServer', false)
  .attrs({
    assetTypeId: () => factory.build('assetType').id,
    createdAt: () => faker.date.past().toISOString(),
    description: () => faker.hacker.phrase(),
    id: () => faker.random.uuid(),
    label: () => faker.lorem.sentence(),
    organizationId: () => factory.build('organization').id,
    updatedAt: () => faker.date.recent().toISOString()
  })
  .after((asset, options) => {
    // If building an asset object that comes from the server,
    // transform it to have camel case and capital letters
    // in the right spots
    if (options.fromServer) {
      asset.asset_type_id = asset.assetTypeId;
      delete asset.assetTypeId;

      asset.created_at = asset.createdAt;
      delete asset.createdAt;

      asset.organization_id = asset.organizationId;
      delete asset.organizationId;

      asset.updated_at = asset.updatedAt;
      delete asset.updatedAt;
    }
  });

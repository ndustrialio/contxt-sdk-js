'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('assetAttribute')
  .option('fromServer', false)
  .attrs({
    assetTypeId: () => factory.build('assetType').id,
    createdAt: () => faker.date.past().toISOString(),
    dataType: () =>
      faker.random.arrayElement(['boolean', 'date', 'number', 'string']),
    description: () => faker.lorem.sentence(),
    id: () => faker.random.uuid(),
    isRequired: () => faker.random.boolean(),
    label: () => faker.hacker.phrase(),
    organizationId: () => factory.build('organization').id,
    units: () => faker.lorem.sentence(),
    updatedAt: () => faker.date.recent().toISOString()
  })
  .after((assetAttribute, options) => {
    // If building an asset attribute object that comes from the server,
    // transform it to have camel case
    if (options.fromServer) {
      assetAttribute.asset_type_id = assetAttribute.assetTypeId;
      delete assetAttribute.assetTypeId;

      assetAttribute.created_at = assetAttribute.createdAt;
      delete assetAttribute.createdAt;

      assetAttribute.data_type = assetAttribute.dataType;
      delete assetAttribute.dataType;

      assetAttribute.is_required = assetAttribute.isRequired;
      delete assetAttribute.isRequired;

      assetAttribute.organization_id = assetAttribute.organizationId;
      delete assetAttribute.organizationId;

      assetAttribute.updated_at = assetAttribute.updatedAt;
      delete assetAttribute.updatedAt;
    }
  });

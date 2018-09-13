'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('assetMetric')
  .option('fromServer', false)
  .attrs({
    assetTypeId: () => factory.build('assetType').id,
    createdAt: () => faker.date.past().toISOString(),
    description: () => faker.lorem.sentence(),
    id: () => faker.random.uuid(),
    label: () => faker.hacker.phrase(),
    organizationId: () => factory.build('organization').id,
    timeInterval: () =>
      faker.random.arrayElement([
        'hourly',
        'daily',
        'weekly',
        'monthly',
        'yearly'
      ]),
    units: () => faker.lorem.sentence(),
    updatedAt: () => faker.date.recent().toISOString()
  })
  .after((assetAttribute, options) => {
    // If building an asset metric object that comes from the server,
    // transform it to have camel case
    if (options.fromServer) {
      assetAttribute.asset_type_id = assetAttribute.assetTypeId;
      delete assetAttribute.assetTypeId;

      assetAttribute.created_at = assetAttribute.createdAt;
      delete assetAttribute.createdAt;

      assetAttribute.organization_id = assetAttribute.organizationId;
      delete assetAttribute.organizationId;

      assetAttribute.time_interval = assetAttribute.timeInterval;
      delete assetAttribute.timeInterval;

      assetAttribute.updated_at = assetAttribute.updatedAt;
      delete assetAttribute.updatedAt;
    }
  });

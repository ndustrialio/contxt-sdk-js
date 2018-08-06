'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('assetAttributeValue')
  .option('fromServer', false)
  .attrs({
    assetAttributeId: () => factory.build('assetAttribute').id,
    assetId: () => factory.build('asset').id,
    assetLabel: () => faker.lorem.word(),
    createdAt: () => faker.date.past().toISOString(),
    effectiveDate: () => faker.date.recent().toISOString(),
    id: () => faker.random.uuid(),
    label: () => faker.lorem.word(),
    notes: () => faker.lorem.sentence(),
    updatedAt: () => faker.date.recent().toISOString(),
    value: () => `${faker.random.number()}`
  })
  .after((assetAttributeValue, options) => {
    // If building an asset attribute value object that comes from the server,
    // transform it to have camel case
    if (options.fromServer) {
      assetAttributeValue.asset_attribute_id =
        assetAttributeValue.assetAttributeId;
      delete assetAttributeValue.assetAttributeId;

      assetAttributeValue.asset_id = assetAttributeValue.assetId;
      delete assetAttributeValue.assetId;

      assetAttributeValue.asset_label = assetAttributeValue.assetLabel;
      delete assetAttributeValue.assetLabel;

      assetAttributeValue.created_at = assetAttributeValue.createdAt;
      delete assetAttributeValue.createdAt;

      assetAttributeValue.effective_date = assetAttributeValue.effectiveDate;
      delete assetAttributeValue.effectiveDate;

      assetAttributeValue.updated_at = assetAttributeValue.updatedAt;
      delete assetAttributeValue.updatedAt;
    }
  });

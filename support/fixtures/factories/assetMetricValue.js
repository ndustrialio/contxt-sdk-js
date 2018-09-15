'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('assetMetricValue')
  .option('fromServer', false)
  .attrs({
    assetId: () => factory.build('asset').id,
    assetMetricId: () => factory.build('assetMetric').id,
    createdAt: () => faker.date.past().toISOString(),
    effectiveEndDate: () => faker.date.recent().toISOString(),
    effectiveStartDate: () => faker.date.past().toISOString(),
    id: () => faker.random.uuid(),
    notes: () => faker.lorem.sentence(),
    updatedAt: () => faker.date.recent().toISOString(),
    value: () => `${faker.random.number()}`
  })
  .after((assetMetricValue, options) => {
    // If building an asset metric value object that comes from the server,
    // transform it to have camel case
    if (options.fromServer) {
      assetMetricValue.asset_id = assetMetricValue.assetId;
      delete assetMetricValue.assetId;

      assetMetricValue.asset_metric_id = assetMetricValue.assetMetricId;
      delete assetMetricValue.assetMetricId;

      assetMetricValue.created_at = assetMetricValue.createdAt;
      delete assetMetricValue.createdAt;

      assetMetricValue.effective_end_date = assetMetricValue.effectiveEndDate;
      delete assetMetricValue.effectiveEndDate;

      assetMetricValue.effective_start_date =
        assetMetricValue.effectiveStartDate;
      delete assetMetricValue.effectiveStartDate;

      assetMetricValue.updated_at = assetMetricValue.updatedAt;
      delete assetMetricValue.updatedAt;
    }
  });

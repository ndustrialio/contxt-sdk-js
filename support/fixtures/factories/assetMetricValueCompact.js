const faker = require('faker');
const factory = require('rosie').Factory;

factory
  .define('assetMetricValueCompact')
  .option('fromServer', false)
  .attrs({
    id: faker.random.uuid(),
    value: faker.random.number(),
    isEstimated: false,
    effectiveStartDate: faker.date.past().toISOString(),
    effectiveEndDate: faker.date.recent().toISOString()
  })
  .after((assetMetricValueCompact, options) => {
    // If building an asset metric value object that comes from the server,
    // transform it to have snake case
    if (options.fromServer) {
      assetMetricValueCompact.is_estimated =
        assetMetricValueCompact.isEstimated;
      delete assetMetricValueCompact.isEstimated;

      assetMetricValueCompact.effective_end_date =
        assetMetricValueCompact.effectiveEndDate;
      delete assetMetricValueCompact.effectiveEndDate;

      assetMetricValueCompact.effective_start_date =
        assetMetricValueCompact.effectiveStartDate;
      delete assetMetricValueCompact.effectiveStartDate;
    }
  });

const faker = require('faker');
const factory = require('rosie').Factory;

factory.define('assetMetricValueCompact').attrs({
  id: faker.random.uuid(),
  value: faker.random.number(),
  is_estimated: false,
  effective_start_date: faker.date.past().toISOString(),
  effective_end_date: faker.date.recent().toISOString()
});

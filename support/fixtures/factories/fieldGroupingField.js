'use strict';

const factory = require('rosie').Factory;
const { faker } = require('@faker-js/faker');

factory
  .define('fieldGroupingField')
  .option('fromServer', false)
  .attrs({
    createdAt: () => faker.date.past().toISOString(),
    fieldGroupingId: () => faker.string.uuid(),
    outputFieldId: () => faker.number.int(),
    id: () => faker.string.uuid(),
    updatedAt: () => faker.date.recent().toISOString()
  })
  .after((fieldGroupingField, options) => {
    // If building a field grouping field object that comes from the server, transform it to
    // have camel case and capital letters in the right spots
    if (options.fromServer) {
      fieldGroupingField.created_at = fieldGroupingField.createdAt;
      delete fieldGroupingField.createdAt;

      fieldGroupingField.field_grouping_id = fieldGroupingField.fieldGroupingId;
      delete fieldGroupingField.fieldGroupingId;

      fieldGroupingField.output_field_id = fieldGroupingField.outputFieldId;
      delete fieldGroupingField.outputFieldId;

      fieldGroupingField.updated_at = fieldGroupingField.updatedAt;
      delete fieldGroupingField.updatedAt;
    }
  });

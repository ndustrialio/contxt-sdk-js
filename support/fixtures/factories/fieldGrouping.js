'use strict';

const factory = require('rosie').Factory;
const { faker } = require('@faker-js/faker');

factory
  .define('fieldGrouping')
  .option('fromServer', false)
  .attrs({
    createdAt: () => faker.date.past().toISOString(),
    description: () => faker.hacker.phrase(),
    fieldCategoryId: () => faker.string.uuid(),
    facilityId: () => faker.number.int(),
    id: () => faker.string.uuid(),
    isPublic: () => fakerBoolean(),
    label: () => faker.commerce.productName(),
    ownerId: () => faker.internet.username(),
    slug: () => faker.lorem.slug(),
    updatedAt: () => faker.date.recent().toISOString()
  })
  .after((fieldGrouping, options) => {
    // If building a field grouping object that comes from the server, transform it to have camel
    // case and capital letters in the right spots
    if (options.fromServer) {
      fieldGrouping.created_at = fieldGrouping.createdAt;
      delete fieldGrouping.createdAt;

      fieldGrouping.field_category_id = fieldGrouping.fieldCategoryId;
      delete fieldGrouping.fieldCategoryId;

      fieldGrouping.facility_id = fieldGrouping.facilityId;
      delete fieldGrouping.facilityId;

      fieldGrouping.is_public = fieldGrouping.isPublic;
      delete fieldGrouping.isPublic;

      fieldGrouping.owner_id = fieldGrouping.ownerId;
      delete fieldGrouping.ownerId;

      fieldGrouping.updated_at = fieldGrouping.updatedAt;
      delete fieldGrouping.updatedAt;
    }
  });

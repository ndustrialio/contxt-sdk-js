'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('fieldCategory')
  .option('fromServer', false)
  .attrs({
    createdAt: () => faker.date.past().toISOString(),
    description: () => faker.hacker.phrase(),
    id: () => faker.random.uuid(),
    name: () => faker.commerce.productName(),
    organizationId: () => faker.random.uuid(),
    parentCategoryId: () => faker.random.uuid(),
    updatedAt: () => faker.date.recent().toISOString()
  })
  .after((fieldCategory, options) => {
    // If building a field category object that comes from the server, transform it to have camel
    // case and capital letters in the right spots
    if (options.fromServer) {
      fieldCategory.created_at = fieldCategory.createdAt;
      delete fieldCategory.createdAt;

      fieldCategory.organization_id = fieldCategory.organizationId;
      delete fieldCategory.organizationId;

      fieldCategory.parent_category_id = fieldCategory.parentCategoryId;
      delete fieldCategory.parentCategoryId;

      fieldCategory.updated_at = fieldCategory.updatedAt;
      delete fieldCategory.updatedAt;
    }
  });

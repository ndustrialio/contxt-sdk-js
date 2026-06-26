'use strict';

const factory = require('rosie').Factory;
const { faker } = require('@faker-js/faker');

factory
  .define('organization')
  .attrs({
    createdAt: () => faker.date.past().toISOString(),
    id: () => faker.string.uuid(),
    name: () => faker.company.name(),
    updatedAt: () => faker.date.recent().toISOString()
  })
  .after((organization, options) => {
    // If building an organization object that comes from the server, transform it to have camel
    // case and capital letters in the right spots
    if (options.fromServer) {
      organization.created_at = organization.createdAt;
      delete organization.createdAt;

      organization.updated_at = organization.updatedAt;
      delete organization.updatedAt;
    }
  });

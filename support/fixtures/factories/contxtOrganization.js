'use strict';

const factory = require('rosie').Factory;
const { faker } = require('@faker-js/faker');

factory
  .define('contxtOrganization')
  .option('fromServer', false)
  .attrs({
    createdAt: () => faker.date.past().toISOString(),
    id: () => faker.string.uuid(),
    name: () => faker.person.jobTitle(),
    updatedAt: () => faker.date.recent().toISOString(),
  })
  .after((org, options) => {
    // If building an organization object that comes from the server, transform it to have camel
    // case and capital letters in the right spots
    if (options.fromServer) {
      org.created_at = org.createdAt;
      delete org.createdAt;

      org.updated_at = org.updatedAt;
      delete org.updatedAt;
    }
  });

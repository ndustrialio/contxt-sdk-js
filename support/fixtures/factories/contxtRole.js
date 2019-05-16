'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('contxtRole')
  .option('fromServer', false)
  .attrs({
    applications: () =>
      factory.buildList(
        'contxtApplication',
        faker.random.number({ min: 0, max: 10 })
      ),
    createdAt: () => faker.date.past().toISOString(),
    description: () => faker.hacker.phrase(),
    id: () => faker.random.uuid(),
    name: () => faker.name.title(),
    organizationId: () => factory.build('contxtOrganization').id,
    stacks: () =>
      factory.buildList(
        'contxtStack',
        faker.random.number({ min: 0, max: 10 })
      ),
    updatedAt: () => faker.date.recent().toISOString()
  })
  .after((role, options) => {
    // If building a role object that comes from the server, transform it to have camel
    // case and capital letters in the right spots
    if (options.fromServer) {
      role.created_at = role.createdAt;
      delete role.createdAt;

      role.organization_id = role.organizationId;
      delete role.organizationId;

      role.updated_at = role.updatedAt;
      delete role.updatedAt;
    }
  });

'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('contxtRole')
  .option('fromServer', false)
  .sequence('id')
  .attrs({
    applications: () =>
      factory.buildList(
        'contxtApplication',
        faker.random.number({ min: 0, max: 10 })
      ),
    createdAt: () => faker.date.past().toISOString(),
    description: () => faker.hacker.phrase(),
    name: () => faker.name.title(),
    organizationId: () => faker.random.uuid(),
    stacks: () =>
      factory.buildList(
        'contxtStack',
        faker.random.number({ min: 0, max: 10 })
      ),
    updatedAt: () => faker.date.recent().toISOString()
  })
  .after((user, options) => {
    // If building a user object that comes from the server, transform it to have camel
    // case and capital letters in the right spots
    if (options.fromServer) {
      user.created_at = user.createdAt;
      delete user.createdAt;

      user.organization_id = user.organizationId;
      delete user.organizationId;

      user.updated_at = user.updatedAt;
      delete user.updatedAt;
    }
  });

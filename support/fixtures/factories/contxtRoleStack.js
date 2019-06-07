'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('contxtRoleStack')
  .option('fromServer', false)
  .attrs({
    accessType: () =>
      faker.random.arrayElement(['reader', 'collaborator', 'owner']),
    createdAt: () => faker.date.past().toISOString(),
    id: () => faker.random.uuid(),
    stackId: () => factory.build('contxtStack').id,
    updatedAt: () => faker.date.recent().toISOString(),
    roleId: () => factory.build('contxtRole').id
  })
  .after((roleStack, options) => {
    // If building a roleStack object that comes from the server, transform it to have camel
    // case and capital letters in the right spots
    if (options.fromServer) {
      roleStack.access_type = roleStack.accessType;
      delete roleStack.accessType;

      roleStack.created_at = roleStack.createdAt;
      delete roleStack.createdAt;

      roleStack.stack_id = roleStack.stackId;
      delete roleStack.stackId;

      roleStack.updated_at = roleStack.updatedAt;
      delete roleStack.updatedAt;

      roleStack.role_id = roleStack.roleId;
      delete roleStack.roleId;
    }
  });

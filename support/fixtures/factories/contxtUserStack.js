'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('contxtUserStack')
  .option('fromServer', false)
  .attrs({
    accessType: () =>
      faker.random.arrayElement(['reader', 'collaborator', 'owner']),
    createdAt: () => faker.date.past().toISOString(),
    id: () => faker.random.uuid(),
    stackId: () => factory.build('contxtStack').id,
    updatedAt: () => faker.date.recent().toISOString(),
    userId: () => factory.build('contxtUser').id
  })
  .after((userStack, options) => {
    // If building a userStack object that comes from the server, transform it to have camel
    // case and capital letters in the right spots
    if (options.fromServer) {
      userStack.access_type = userStack.accessType;
      delete userStack.accessType;

      userStack.created_at = userStack.createdAt;
      delete userStack.createdAt;

      userStack.stack_id = userStack.stackId;
      delete userStack.stackId;

      userStack.updated_at = userStack.updatedAt;
      delete userStack.updatedAt;

      userStack.user_id = userStack.userId;
      delete userStack.userId;
    }
  });

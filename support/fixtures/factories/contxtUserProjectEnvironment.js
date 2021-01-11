'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('contxtUserProjectEnvironment')
  .option('fromServer', false)
  .attrs({
    accessType: () => faker.random.arrayElement(['reader', 'admin']),
    createdAt: () => faker.date.past().toISOString(),
    id: () => faker.random.uuid(),
    projectEnvironmentId: () => factory.build('contxtProjectEnvironment').id,
    updatedAt: () => faker.date.recent().toISOString(),
    userId: () => factory.build('contxtUser').id
  })
  .after((userProjectEnvironment, options) => {
    // If building a userProject object that comes from the server, transform it to have camel
    // case and capital letters in the right spots
    if (options.fromServer) {
      userProjectEnvironment.access_type = userProjectEnvironment.accessType;
      delete userProjectEnvironment.accessType;

      userProjectEnvironment.created_at = userProjectEnvironment.createdAt;
      delete userProjectEnvironment.createdAt;

      userProjectEnvironment.project_environment_id =
        userProjectEnvironment.projectEnvironmentId;
      delete userProjectEnvironment.projectEnvironmentId;

      userProjectEnvironment.updated_at = userProjectEnvironment.updatedAt;
      delete userProjectEnvironment.updatedAt;

      userProjectEnvironment.user_id = userProjectEnvironment.userId;
      delete userProjectEnvironment.userId;
    }
  });

'use strict';

const factory = require('rosie').Factory;
const { faker } = require('@faker-js/faker');

factory
  .define('contxtRoleProjectEnvironment')
  .option('fromServer', false)
  .attrs({
    accessType: () => faker.helpers.arrayElement(['reader', 'admin']),
    createdAt: () => faker.date.past().toISOString(),
    id: () => faker.string.uuid(),
    environmentId: () => factory.build('contxtProjectEnvironment').id,
    updatedAt: () => faker.date.recent().toISOString(),
    roleId: () => factory.build('contxtRole').id
  })
  .after((roleProject, options) => {
    // If building a roleProject object that comes from the server, transform it to have camel
    // case and capital letters in the right spots
    if (options.fromServer) {
      roleProject.access_type = roleProject.accessType;
      delete roleProject.accessType;

      roleProject.created_at = roleProject.createdAt;
      delete roleProject.createdAt;

      roleProject.environment_id = roleProject.environmentId;
      delete roleProject.environmentId;

      roleProject.updated_at = roleProject.updatedAt;
      delete roleProject.updatedAt;

      roleProject.role_id = roleProject.roleId;
      delete roleProject.roleId;
    }
  });

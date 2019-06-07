'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('contxtRoleApplication')
  .option('fromServer', false)
  .attrs({
    applicationId: () => factory.build('contxtApplication').id,
    createdAt: () => faker.date.past().toISOString(),
    id: () => faker.random.uuid(),
    updatedAt: () => faker.date.recent().toISOString(),
    roleId: () => factory.build('contxtRole').id
  })
  .after((roleApplication, options) => {
    // If building a roleApplication object that comes from the server, transform it to have camel
    // case and capital letters in the right spots
    if (options.fromServer) {
      roleApplication.application_id = roleApplication.applicationId;
      delete roleApplication.applicationId;

      roleApplication.created_at = roleApplication.createdAt;
      delete roleApplication.createdAt;

      roleApplication.updated_at = roleApplication.updatedAt;
      delete roleApplication.updatedAt;

      roleApplication.role_id = roleApplication.roleId;
      delete roleApplication.roleId;
    }
  });

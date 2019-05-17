'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('contxtUserRole')
  .option('fromServer', false)
  .attrs({
    createdAt: () => faker.date.past().toISOString(),
    id: () => faker.random.uuid(),
    mappedFromExternalGroup: () => faker.random.boolean(),
    roleId: () => factory.build('contxtRole').id,
    updatedAt: () => faker.date.recent().toISOString(),
    userId: () => factory.build('contxtUser').id
  })
  .after((userRole, options) => {
    // If building a userRole object that comes from the server, transform it to have camel
    // case and capital letters in the right spots
    if (options.fromServer) {
      userRole.created_at = userRole.createdAt;
      delete userRole.createdAt;

      userRole.mapped_from_external_group = userRole.mappedFromExternalGroup;
      delete userRole.mappedFromExternalGroup;

      userRole.role_id = userRole.roleId;
      delete userRole.roleId;

      userRole.updated_at = userRole.updatedAt;
      delete userRole.updatedAt;

      userRole.user_id = userRole.userId;
      delete userRole.userId;
    }
  });

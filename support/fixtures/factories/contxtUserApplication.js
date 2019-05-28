'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('contxtUserApplication')
  .option('fromServer', false)
  .attrs({
    applicationId: () => factory.build('contxtApplication').id,
    createdAt: () => faker.date.past().toISOString(),
    id: () => faker.random.uuid(),
    updatedAt: () => faker.date.recent().toISOString(),
    userId: () => factory.build('contxtUser').id
  })
  .after((userApplication, options) => {
    // If building a userApplication object that comes from the server, transform it to have camel
    // case and capital letters in the right spots
    if (options.fromServer) {
      userApplication.application_id = userApplication.applicationId;
      delete userApplication.applicationId;

      userApplication.created_at = userApplication.createdAt;
      delete userApplication.createdAt;

      userApplication.updated_at = userApplication.updatedAt;
      delete userApplication.updatedAt;

      userApplication.user_id = userApplication.userId;
      delete userApplication.userId;
    }
  });

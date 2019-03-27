'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('contxtUserFavoriteApplication')
  .option('fromServer', false)
  .attrs({
    applicationId: () => faker.random.number(),
    createdAt: () => faker.date.past().toISOString(),
    id: () => faker.random.uuid(),
    updatedAt: () => faker.date.recent().toISOString(),
    userId: () => `auth0|${faker.internet.password()}`
  })
  .after((user, options) => {
    // If building a user object that comes from the server, transform it to have camel
    // case and capital letters in the right spots
    if (options.fromServer) {
      user.application_id = user.applicationId;
      delete user.applicationId;

      user.created_at = user.createdAt;
      delete user.createdAt;

      user.updated_at = user.updatedAt;
      delete user.updatedAt;

      user.user_id = user.userId;
      delete user.userId;
    }
  });

'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('contxtUser')
  .option('fromServer', false)
  .attrs({
    createdAt: () => faker.date.past().toISOString(),
    email: () => faker.internet.email(),
    firstName: () => faker.name.firstName(),
    id: () => `auth0|${faker.internet.password()}`,
    isActivated: () => faker.random.boolean(),
    isSuperuser: () => faker.random.boolean(),
    lastName: () => faker.name.lastName(),
    phoneNumber: () => faker.phone.phoneNumber(),
    updatedAt: () => faker.date.recent().toISOString()
  })
  .after((user, options) => {
    // If building a user object that comes from the server, transform it to have camel
    // case and capital letters in the right spots
    if (options.fromServer) {
      user.created_at = user.createdAt;
      delete user.createdAt;

      user.first_name = user.firstName;
      delete user.firstName;

      user.is_activated = user.isActivated;
      delete user.isActivated;

      user.is_superuser = user.isSuperuser;
      delete user.isSuperuser;

      user.last_name = user.lastName;
      delete user.lastName;

      user.phone_number = user.phoneNumber;
      delete user.phoneNumber;

      user.updated_at = user.updatedAt;
      delete user.updatedAt;
    }
  });

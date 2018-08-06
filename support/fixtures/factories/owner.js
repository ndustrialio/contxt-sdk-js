'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('owner')
  .option('fromServer', false)
  .attrs({
    createdAt: () => faker.date.past().toISOString(),
    email: () => faker.internet.email(),
    firstName: () => faker.name.firstName(),
    id: () => `auth0|${faker.random.number()}`,
    isMachineUser: () => faker.random.boolean(),
    lastName: () => faker.name.lastName(),
    updatedAt: () => faker.date.recent().toISOString()
  })
  .after((owner, options) => {
    // If building an owner object that comes from the server, transform it to have camel
    // case and capital letters in the right spots
    if (options.fromServer) {
      owner.created_at = owner.createdAt;
      delete owner.createdAt;

      owner.first_name = owner.firstName;
      delete owner.firstName;

      owner.is_machine_user = owner.isMachineUser;
      delete owner.isMachineUser;

      owner.last_name = owner.lastName;
      delete owner.lastName;

      owner.updated_at = owner.updatedAt;
      delete owner.updatedAt;
    }
  });

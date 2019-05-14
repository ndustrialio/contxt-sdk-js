'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');
const times = require('lodash.times');

factory
  .define('contxtUserPermissions')
  .option('fromServer', false)
  .attrs({
    applicationsExplicit: () =>
      times(
        faker.random.number({ min: 0, max: 15 }),
        () => factory.build('contxtApplication').id
      ),
    applicationsImplicit: () =>
      times(
        faker.random.number({ min: 0, max: 15 }),
        () => factory.build('contxtApplication').id
      ),
    roles: () =>
      times(
        faker.random.number({ min: 0, max: 15 }),
        () => factory.build('contxtRole').id
      ),
    stacksExplicit: () =>
      times(
        faker.random.number({ min: 0, max: 15 }),
        () => factory.build('contxtStack').id
      ),
    stacksImplicit: () =>
      times(
        faker.random.number({ min: 0, max: 15 }),
        () => factory.build('contxtStack').id
      ),
    userId: () => faker.random.uuid()
  })
  .after((permission, options) => {
    // If building a permission object that comes from the server, transform it to have camel
    // case and capital letters in the right spots
    if (options.fromServer) {
      permission.applications_explicit = permission.applicationsExplicit;
      delete permission.applicationsExplicit;

      permission.applications_implicit = permission.applicationsImplicit;
      delete permission.applicationsImplicit;

      permission.stacks_explicit = permission.stacksExplicit;
      delete permission.stacksExplicit;

      permission.stacks_implicit = permission.stacksImplicit;
      delete permission.stacksImplicit;

      permission.user_id = permission.userId;
      delete permission.userId;
    }
  });

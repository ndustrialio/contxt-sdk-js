'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('contxtUserPermissions')
  .option('fromServer', false)
  .attrs({
    applicationsExplicit: () =>
      factory
        .buildList(
          'contxtApplication',
          faker.random.number({ min: 0, max: 15 })
        )
        .map(({ id }) => id),
    applicationsImplicit: () =>
      factory
        .buildList(
          'contxtApplication',
          faker.random.number({ min: 0, max: 15 })
        )
        .map(({ id }) => id),
    roles: () =>
      factory
        .buildList('contxtRole', faker.random.number({ min: 0, max: 15 }))
        .map(({ id }) => id),
    stacksExplicit: () =>
      factory
        .buildList('contxtStack', faker.random.number({ min: 0, max: 15 }))
        .map(({ id }) => id),
    stacksImplicit: () =>
      factory
        .buildList('contxtStack', faker.random.number({ min: 0, max: 15 }))
        .map(({ id }) => id),
    userId: () => factory.build('contxtUser').id
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

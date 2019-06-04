'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');
const times = require('lodash.times');

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
        .map(({ id }) => ({ id })),
    applicationsImplicit: () =>
      factory
        .buildList(
          'contxtApplication',
          faker.random.number({ min: 0, max: 15 })
        )
        .map(({ id }) => ({ id })),
    roles: () =>
      factory
        .buildList('contxtRole', faker.random.number({ min: 0, max: 15 }))
        .map(({ id }) => ({ id })),
    stacksExplicit: () =>
      times(faker.random.number({ min: 0, max: 15 }), () => {
        return {
          id: factory.build('contxtStack').id,
          accessType: factory.build('contxtUserStack').accessType
        };
      }),
    stacksImplicit: () =>
      times(faker.random.number({ min: 0, max: 15 }), () => {
        return {
          id: factory.build('contxtStack').id,
          accessType: factory.build('contxtUserStack').accessType
        };
      }),
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

      permission.stacks_explicit = permission.stacksExplicit.map((s) => ({
        id: s.id,
        access_type: s.accessType
      }));
      delete permission.stacksExplicit;

      permission.stacks_implicit = permission.stacksImplicit.map((s) => ({
        id: s.id,
        access_type: s.accessType
      }));
      delete permission.stacksImplicit;

      permission.user_id = permission.userId;
      delete permission.userId;
    }
  });

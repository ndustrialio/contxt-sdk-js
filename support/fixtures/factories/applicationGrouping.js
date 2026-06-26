'use strict';

const factory = require('rosie').Factory;
const { faker } = require('@faker-js/faker');

factory
  .define('applicationGrouping')
  .attrs({
    applicationId: () => faker.number.int(),
    id: () => faker.string.uuid(),
    index: () => faker.number.int(),
    label: () => faker.lorem.words()
  })
  .attr('applicationModules', ['id'], (id) => {
    return factory.buildList(
      'applicationModule',
      faker.number.int({ min: 1, max: 10 }),
      { applicationGroupingId: id }
    );
  })
  .after((grouping, options) => {
    // If building an application grouping object that comes from the server,
    // transform it to have snake case and underscores in the right spots
    if (options.fromServer) {
      grouping.application_id = grouping.applicationId;
      delete grouping.applicationId;

      grouping.application_modules = grouping.applicationModules;
      delete grouping.applicationModules;
    }
  });

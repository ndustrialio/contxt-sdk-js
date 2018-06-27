'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('outputFieldData')
  .option('fromServer', false)
  .attrs({
    eventTime: () => faker.date.past(),
    value: () => `${faker.random.number()}`
  })
  .after((outputFieldData, options) => {
    // If building an output field data object that comes from the server,
    // transform it to have camel case and capital letters in the right spots
    if (options.fromServer) {
      outputFieldData.event_time = outputFieldData.eventTime;
      delete outputFieldData.eventTime;
    }
  });

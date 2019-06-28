'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('userEventSubscription')
  .option('fromServer', false)
  .attrs({
    eventId: () => factory.build('event').id,
    createdAt: () => faker.date.past().toISOString(),
    id: () => faker.random.uuid(),
    updatedAt: () => faker.date.recent().toISOString(),
    userId: () => factory.build('contxtUser').id
  })
  .after((userEvent, options) => {
    // If building a userApplication object that comes from the server, transform it to have camel
    // case and capital letters in the right spots
    if (options.fromServer) {
      userEvent.event_id = userEvent.eventId;
      delete userEvent.applicationId;

      userEvent.created_at = userEvent.createdAt;
      delete userEvent.createdAt;

      userEvent.updated_at = userEvent.updatedAt;
      delete userEvent.updatedAt;

      userEvent.user_id = userEvent.userId;
      delete userEvent.userId;
    }
  });

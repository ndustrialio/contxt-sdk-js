'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('userEventSubscription')
  .option('fromServer', false)
  .attrs({
    createdAt: () => faker.date.past().toISOString(),
    endpointArn: () => null,
    eventId: () => factory.build('event').id,
    id: () => faker.random.uuid(),
    mediumType: () => faker.random.arrayElement(['email', 'sms']),
    updatedAt: () => faker.date.recent().toISOString(),
    userId: () => factory.build('contxtUser').id
  })
  .after((userEvent, options) => {
    // If building a userApplication object that comes from the server, transform it to have camel
    // case and capital letters in the right spots
    if (options.fromServer) {
      userEvent.created_at = userEvent.createdAt;
      delete userEvent.createdAt;

      userEvent.endpoint_arn = userEvent.endpointArn;
      delete userEvent.endpointArn;

      userEvent.event_id = userEvent.eventId;
      delete userEvent.eventId;

      userEvent.medium_type = userEvent.mediumType;
      delete userEvent.mediumType;

      userEvent.updated_at = userEvent.updatedAt;
      delete userEvent.updatedAt;

      userEvent.user_id = userEvent.userId;
      delete userEvent.userId;
    }
  });

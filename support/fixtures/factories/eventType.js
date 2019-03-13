'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('eventType')
  .option('fromServer', false)
  .attrs({
    clientId: () => faker.internet.password(),
    createdAt: () => faker.date.past().toISOString(),
    description: () => faker.hacker.phrase(),
    id: () => faker.random.uuid(),
    isOngoingEvent: () => faker.random.boolean(),
    isRealtimeEnabled: () => faker.random.boolean(),
    level: () => faker.random.number(),
    name: () => faker.company.companyName(),
    slug: () => faker.lorem.slug(),
    updatedAt: () => faker.date.recent().toISOString()
  })
  .after((eventType, options) => {
    // If building an eventType object that comes from the server, transform it to have camel
    // case and capital letters in the right spots
    if (options.fromServer) {
      eventType.client_id = eventType.clientId;
      delete eventType.clientId;

      eventType.created_at = eventType.createdAt;
      delete eventType.createdAt;

      eventType.is_ongoing_event = eventType.isOngoingEvent;
      delete eventType.isOngoingEvent;

      eventType.is_realtime_enabled = eventType.isRealtimeEnabled;
      delete eventType.isRealtimeEnabled;

      eventType.updated_at = eventType.updatedAt;
      delete eventType.updatedAt;
    }
  });

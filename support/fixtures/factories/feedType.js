'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('feedType')
  .option('fromServer', false)
  .sequence('id')
  .attrs({
    createdAt: () => faker.date.past().toISOString(),
    downAfter: () => faker.random.number({ min: 1000, max: 9999 }),
    troubleshootingUrl: () => faker.internet.url(),
    type: () => faker.hacker.noun(),
    updatedAt: () => faker.date.recent().toISOString()
  })
  .after((feedType, options) => {
    // If building a feed type object that comes from the server, transform it to have camel
    // case and capital letters in the right spots
    if (options.fromServer) {
      feedType.created_at = feedType.createdAt;
      delete feedType.createdAt;

      feedType.down_after = feedType.downAfter;
      delete feedType.downAfter;

      feedType.troubleshooting_url = feedType.troubleshootingUrl;
      delete feedType.troubleshootingUrl;

      feedType.updated_at = feedType.updatedAt;
      delete feedType.updatedAt;
    }
  });

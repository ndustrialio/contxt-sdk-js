'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('feedStatus')
  .option('fromServer', false)
  .sequence('id')
  .attrs({
    feedId: () => faker.datatype.number(),
    feedStatusId: () => null,
    status: () => faker.random.arrayElement(['Active', 'Degraded', 'Critical']),
    updatedAt: () => faker.date.recent().toISOString()
  })
  .after((feedType, options) => {
    // If building a feed type object that comes from the server, transform it to have camel
    // case and capital letters in the right spots
    if (options.fromServer) {
      feedType.feed_id = feedType.feedId;
      delete feedType.feedId;

      feedType.feed_status_id = feedType.feedStatusId;
      delete feedType.feedStatusId;

      feedType.updated_at = feedType.updatedAt;
      delete feedType.updatedAt;
    }
  });

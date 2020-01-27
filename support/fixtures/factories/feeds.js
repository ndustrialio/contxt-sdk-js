'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('feed')
  .option('fromServer', false)
  .sequence('id')
  .attrs({
    createdAt: () => faker.date.past().toISOString(),
    criticalThreshold: () => faker.random.number({ min: 0, max: 5 }),
    degradedThreshold: () => faker.random.number({ min: 0, max: 5 }),
    downAfter: () => faker.random.number({ min: 1000, max: 9999 }),
    facilityId: () => faker.random.number({ min: 0, max: 40 }),
    feedTypeId: () => faker.random.number({ min: 0, max: 40 }),
    isPaused: () => faker.random.boolean(),
    key: () => faker.hacker.noun(),
    ownerId: () => `auth0|${faker.internet.password()}`,
    routingKeys: () => `[${faker.hacker.noun()}]`,
    status: () => faker.random.arrayElement(['Active', 'Degraded', 'Critical']),
    statusEventId: () => faker.random.uuid(),
    timezone: () => {
      return faker.random.arrayElement([
        'America/New_York',
        'America/Chicago',
        'America/Denver',
        'America/Los_Angeles'
      ]);
    },
    token: () => faker.hacker.noun(),
    updatedAt: () => faker.date.recent().toISOString()
  })
  .attr('feedStatus', ['fromServer'], (fromServer) => {
    return factory.build('feedStatus', null, { fromServer });
  })
  .attr('feedType', ['fromServer'], (fromServer) => {
    return factory.build('feedType', null, { fromServer });
  })
  .attr('owner', ['fromServer'], (fromServer) => {
    return factory.build('owner', {}, { fromServer });
  })
  .after((feed, options) => {
    // If building a feed object that comes from the server, transform it to have camel
    // case and capital letters in the right spots
    if (options.fromServer) {
      feed.created_at = feed.createdAt;
      delete feed.createdAt;

      feed.critical_threshold = feed.criticalThreshold;
      delete feed.criticalThreshold;

      feed.degraded_threshold = feed.degradedThreshold;
      delete feed.degradedThreshold;

      feed.down_after = feed.downAfter;
      delete feed.downAfter;

      feed.facility_id = feed.facilityId;
      delete feed.facilityId;

      feed.feed_status = feed.feedStatus;
      delete feed.feedStatus;

      feed.feed_type = feed.feedType;
      delete feed.feedType;

      feed.feed_type_id = feed.feedTypeId;
      delete feed.feedTypeId;

      feed.is_paused = feed.isPaused;
      delete feed.isPaused;

      feed.routing_keys = feed.routingKeys;
      delete feed.routingKeys;

      feed.status_event_id = feed.statusEventId;
      delete feed.statusEventId;

      feed.updated_at = feed.updatedAt;
      delete feed.updatedAt;
    }
  });

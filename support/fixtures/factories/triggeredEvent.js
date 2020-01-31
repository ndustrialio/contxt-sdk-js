'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('triggeredEvent')
  .option('fromServer', false)
  .attrs({
    createdAt: () => faker.date.past().toISOString(),
    data: () => faker.hacker.phrase(),
    deletedAt: () => faker.date.recent().toISOString(),
    eventId: () => faker.random.uuid(),
    id: () => faker.random.uuid(),
    isPublic: () => faker.random.boolean(),
    ownerId: () => faker.random.uuid(),
    triggerEndAt: () => faker.date.recent().toISOString(),
    triggerStartAt: () => faker.date.recent().toISOString(),
    updatedAt: () => faker.date.recent().toISOString()
  })
  .after((triggeredEvent, options) => {
    if (options.fromServer) {
      triggeredEvent.created_at = triggeredEvent.createdAt;
      delete triggeredEvent.createdAt;

      triggeredEvent.deleted_at = triggeredEvent.deletedAt;
      delete triggeredEvent.deletedAt;

      triggeredEvent.is_public = triggeredEvent.isPublic;
      delete triggeredEvent.isPublic;

      triggeredEvent.owner_id = triggeredEvent.ownerId;
      delete triggeredEvent.ownerId;

      triggeredEvent.trigger_end_at = triggeredEvent.triggerEndAt;
      delete triggeredEvent.triggerEndAt;

      triggeredEvent.trigger_start_at = triggeredEvent.triggerStartAt;
      delete triggeredEvent.triggerStartAt;

      triggeredEvent.updated_at = triggeredEvent.updatedAt;
      delete triggeredEvent.updatedAt;
    }
  });

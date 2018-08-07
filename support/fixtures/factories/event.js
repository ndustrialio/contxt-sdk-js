'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('event')
  .option('fromServer', false)
  .attrs({
    allowOthersToTrigger: () => faker.random.boolean(),
    createdAt: () => faker.date.past().toISOString(),
    deletedAt: () => faker.date.recent().toISOString(),
    facilityId: () => faker.random.number(),
    id: () => faker.random.uuid(),
    isPublic: () => faker.random.boolean(),
    name: () => faker.company.companyName(),
    organizationId: () => factory.build('organization').id,
    topicArn: () => faker.random.uuid(),
    updatedAt: () => faker.date.recent().toISOString()
  })
  .attr('eventType', ['fromServer'], (fromServer) => {
    return factory.build('eventType', {}, { fromServer });
  })
  .attr('owner', ['fromServer'], (fromServer) => {
    return factory.build('owner', {}, { fromServer });
  })
  .attr('eventTypeId', ['eventType'], (eventType) => eventType.id)
  .attr('ownerId', ['owner'], (owner) => owner.id)
  .after((event, options) => {
    // If building an event object that comes from the server, transform it to have camel
    // case and capital letters in the right spots
    if (options.fromServer) {
      event.allow_others_to_trigger = event.allowOthersToTrigger;
      delete event.allowOthersToTrigger;

      event.created_at = event.createdAt;
      delete event.createdAt;

      event.deleted_at = event.deletedAt;
      delete event.deletedAt;

      event.EventType = event.eventType;
      delete event.eventType;

      event.event_type_id = event.eventTypeId;
      delete event.eventTypeId;

      event.facility_id = event.facilityId;
      delete event.facilityId;

      event.is_public = event.isPublic;
      delete event.isPublic;

      event.organization_id = event.organizationId;
      delete event.organizationId;

      event.Owner = event.owner;
      delete event.owner;

      event.owner_id = event.ownerId;
      delete event.ownerId;

      event.topic_arn = event.topicArn;
      delete event.topicArn;

      event.updated_at = event.updatedAt;
      delete event.updatedAt;
    }
  });

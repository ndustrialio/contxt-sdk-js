'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('channel')
  .option('fromServer', false)
  .attrs({
    id: () => faker.random.uuid(),
    name: () => faker.hacker.noun(),
    organizationId: () => factory.build('organization').id,
    serviceId: () => faker.internet.password()
  })
  .after((channel, options) => {
    // If building a channel object that comes from the server,
    // transform it to have camel case and capital letters
    // in the right spots
    if (options.fromServer) {
      channel.organization_id = channel.organizationId;
      delete channel.organizationId;

      channel.service_id = channel.serviceId;
      delete channel.serviceId;
    }
  });

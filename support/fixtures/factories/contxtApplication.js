'use strict';

const factory = require('rosie').Factory;
const { faker } = require('@faker-js/faker');

factory
  .define('contxtApplication')
  .option('fromServer', false)
  .attrs({
    clientId: () => faker.string.uuid(),
    clientSecret: () => faker.string.uuid(),
    createdAt: () => faker.date.past().toISOString(),
    currentVersionId: () => faker.string.uuid(),
    description: () => faker.lorem.words(),
    iconUrl: () => faker.image.url(),
    id: () => faker.number.int(),
    name: () => faker.person.jobTitle(),
    serviceId: () => faker.number.int(),
    type: () => faker.lorem.word(),
    updatedAt: () => faker.date.recent().toISOString()
  })
  .after((org, options) => {
    // If building an application object that comes from the server, transform it to have camel
    // case and capital letters in the right spots
    if (options.fromServer) {
      org.client_id = org.clientId;
      delete org.clientId;

      org.client_secret = org.clientSecret;
      delete org.clientSecret;

      org.created_at = org.createdAt;
      delete org.createdAt;

      org.current_version_id = org.currentVersionId;
      delete org.currentVersionId;

      org.icon_url = org.iconUrl;
      delete org.iconUrl;

      org.service_id = org.serviceId;
      delete org.serviceId;

      org.updated_at = org.updatedAt;
      delete org.updatedAt;
    }
  });

'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('contxtApplication')
  .option('fromServer', false)
  .attrs({
    clientId: () => faker.datatype.uuid(),
    clientSecret: () => faker.datatype.uuid(),
    createdAt: () => faker.date.past().toISOString(),
    currentVersionId: () => faker.datatype.uuid(),
    description: () => faker.random.words(),
    iconUrl: () => faker.image.imageUrl(),
    id: () => faker.datatype.number(),
    name: () => faker.name.title(),
    serviceId: () => faker.datatype.number(),
    type: () => faker.random.word(),
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

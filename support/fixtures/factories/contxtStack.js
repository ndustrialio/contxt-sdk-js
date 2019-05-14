'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('contxtStack')
  .option('fromServer', false)
  .attrs({
    clientId: () => faker.random.uuid(),
    clusterId: () => faker.random.uuid(),
    createdAt: () => faker.date.past().toISOString(),
    currentVersionId: () => faker.random.uuid(),
    description: () => faker.random.words(),
    documentationUrl: () => faker.internet.url(),
    icon: () => faker.image.imageUrl(),
    id: () => faker.random.number(),
    name: () => faker.name.title(),
    organizationId: () => faker.random.uuid(),
    ownerId: () => faker.random.uuid(),
    type: () => faker.random.word(),
    updatedAt: () => faker.date.recent().toISOString()
  })
  .after((org, options) => {
    // If building an application object that comes from the server, transform it to have camel
    // case and capital letters in the right spots
    if (options.fromServer) {
      org.client_id = org.clientId;
      delete org.clientId;

      org.cluster_id = org.cluster_id;
      delete org.cluster_id;

      org.created_at = org.createdAt;
      delete org.createdAt;

      org.current_version_id = org.currentVersionId;
      delete org.currentVersionId;

      org.documentation_url = org.documentationUrl;
      delete org.documentationUrl;

      org.organization_id = org.organizationId;
      delete org.organizationId;

      org.owner_id = org.ownerId;
      delete org.ownerId;

      org.updated_at = org.updatedAt;
      delete org.updatedAt;
    }
  });

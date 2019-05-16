'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('contxtStack')
  .option('fromServer', false)
  .attrs({
    clientId: () => faker.internet.password(),
    clusterId: () => faker.random.uuid(),
    createdAt: () => faker.date.past().toISOString(),
    currentVersionId: () => faker.random.uuid(),
    description: () => faker.random.words(),
    documentationUrl: () => faker.internet.url(),
    icon: () => faker.image.imageUrl(),
    id: () => faker.random.number(),
    name: () => faker.name.title(),
    organizationId: () => factory.build('contxtOrganization').id,
    ownerId: () => factory.build('contxtUser').id,
    type: () => faker.random.word(),
    updatedAt: () => faker.date.recent().toISOString()
  })
  .after((stack, options) => {
    // If building an application object that comes from the server, transform it to have camel
    // case and capital letters in the right spots
    if (options.fromServer) {
      stack.client_id = stack.clientId;
      delete stack.clientId;

      stack.cluster_id = stack.clusterId;
      delete stack.clusterId;

      stack.created_at = stack.createdAt;
      delete stack.createdAt;

      stack.current_version_id = stack.currentVersionId;
      delete stack.currentVersionId;

      stack.documentation_url = stack.documentationUrl;
      delete stack.documentationUrl;

      stack.stackanization_id = stack.organizationId;
      delete stack.organizationId;

      stack.owner_id = stack.ownerId;
      delete stack.ownerId;

      stack.updated_at = stack.updatedAt;
      delete stack.updatedAt;
    }
  });

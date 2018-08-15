'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('edgeNode')
  .option('fromServer', false)
  .attrs({
    clientId: () => faker.internet.password(),
    createdAt: () => faker.date.past().toISOString(),
    description: () => faker.lorem.sentence(),
    id: () => faker.random.uuid(),
    name: () => faker.commerce.productMaterial(),
    organizationId: () => factory.build('organization').id,
    updatedAt: () => faker.date.recent().toISOString()
  })
  .after((edgeNode, options) => {
    // If building an edge node that comes from the server, transform it to have camel
    // case and capital letters in the right spots
    if (options.fromServer) {
      edgeNode.client_id = edgeNode.clientId;
      delete edgeNode.clientId;

      edgeNode.created_at = edgeNode.createdAt;
      delete edgeNode.createdAt;

      edgeNode.organization_id = edgeNode.organizationId;
      delete edgeNode.organizationId;

      edgeNode.updated_at = edgeNode.updatedAt;
      delete edgeNode.updatedAt;
    }
  });

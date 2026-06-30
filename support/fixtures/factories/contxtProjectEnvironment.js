'use strict';

const factory = require('rosie').Factory;
const { faker } = require('@faker-js/faker');

factory
  .define('contxtProjectEnvironment')
  .option('fromServer', false)
  .attrs({
    createdAt: () => faker.date.past().toISOString(),
    updatedAt: () => faker.date.recent().toISOString(),
    id: () => faker.string.uuid(),
    organizationId: () => factory.build('contxtOrganization').id,
    projectId: () => factory.build('contxtProject').id,
    clusterId: () => faker.string.uuid(),
    slug: () => `${faker.lorem.word()}-${faker.lorem.word()}`,
    name: () => faker.person.jobTitle(),
    type: () => faker.lorem.word(),
    description: () => faker.lorem.words()
  })
  .after((projectEnvironment, options) => {
    // If building an application object that comes from the server, transform it to have camel
    // case and capital letters in the right spots
    if (options.fromServer) {
      projectEnvironment.created_at = projectEnvironment.createdAt;
      delete projectEnvironment.createdAt;

      projectEnvironment.organization_id = projectEnvironment.organizationId;
      delete projectEnvironment.organizationId;

      projectEnvironment.project_id = projectEnvironment.projectId;
      delete projectEnvironment.projectId;

      projectEnvironment.cluster_id = projectEnvironment.clusterId;
      delete projectEnvironment.clusterId;

      projectEnvironment.updated_at = projectEnvironment.updatedAt;
      delete projectEnvironment.updatedAt;
    }
  });

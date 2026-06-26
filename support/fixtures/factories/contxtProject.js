'use strict';

const factory = require('rosie').Factory;
const { faker } = require('@faker-js/faker');

factory
  .define('contxtProject')
  .option('fromServer', false)
  .attrs({
    createdAt: () => faker.date.past().toISOString(),
    createdBy: () => factory.build('contxtUser').id,
    description: () => faker.lorem.words(),
    id: () => faker.number.int(),
    name: () => faker.person.jobTitle(),
    organizationId: () => factory.build('contxtOrganization').id,
    ownerRoleId: () => faker.string.uuid(),
    slug: () => faker.lorem.word(),
    type: () => faker.lorem.word(),
    updatedAt: () => faker.date.recent().toISOString()
  })
  .after((project, options) => {
    // If building an application object that comes from the server, transform it to have camel
    // case and capital letters in the right spots
    if (options.fromServer) {
      project.created_at = project.createdAt;
      delete project.createdAt;

      project.organization_id = project.organizationId;
      delete project.organizationId;

      project.owner_role_id = project.ownerRoleId;
      delete project.ownerRoleId;

      project.updated_at = project.updatedAt;
      delete project.updatedAt;
    }
  });

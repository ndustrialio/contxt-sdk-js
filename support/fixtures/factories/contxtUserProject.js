'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('contxtUserProject')
  .option('fromServer', false)
  .attrs({
    accessType: () => faker.random.arrayElement(['reader', 'admin']),
    createdAt: () => faker.date.past().toISOString(),
    id: () => faker.random.uuid(),
    projectId: () => factory.build('contxtProject').id,
    updatedAt: () => faker.date.recent().toISOString(),
    userId: () => factory.build('contxtUser').id
  })
  .after((userProject, options) => {
    // If building a userProject object that comes from the server, transform it to have camel
    // case and capital letters in the right spots
    if (options.fromServer) {
      userProject.access_type = userProject.accessType;
      delete userProject.accessType;

      userProject.created_at = userProject.createdAt;
      delete userProject.createdAt;

      userProject.project_id = userProject.projectId;
      delete userProject.projectId;

      userProject.updated_at = userProject.updatedAt;
      delete userProject.updatedAt;

      userProject.user_id = userProject.userId;
      delete userProject.userId;
    }
  });

'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('userProfile')
  .attrs({
    name: () => faker.name.findName(),
    nickname: () => faker.name.firstName(),
    picture: () => faker.image.avatar(),
    sub: () => faker.hacker.adjective(),
    updatedAt: () => faker.date.recent().toISOString()
  })
  .after((userProfile, options) => {
    // If building a user profile object that comes from the server, transform it to have camel case
    // and capital letters in the right spots
    if (options.fromServer) {
      userProfile.updated_at = userProfile.updatedAt;
      delete userProfile.updatedAt;
    }
  });

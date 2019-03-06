'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');
const times = require('lodash.times');

factory
  .define('fileUploadInfo')
  .option('fromServer', false)
  .attrs({
    headers: () =>
      times(faker.random.number({ min: 1, max: 5 })).reduce((memo) => {
        memo[faker.lorem.word()] = faker.hacker.phrase();

        return memo;
      }, {}),
    expiresAt: () => faker.date.future().toISOString(),
    method: 'PUT',
    url: () => faker.internet.avatar()
  })
  .after((uploadInfo, options) => {
    // If building a file object that comes from the server, transform it to have camel
    // case and capital letters in the right spots
    // NOTE: headers are not included here because they are case sensitive.
    if (options.fromServer) {
      uploadInfo.expires_at = uploadInfo.expiresAt;
      delete uploadInfo.expiresAt;
    }
  });

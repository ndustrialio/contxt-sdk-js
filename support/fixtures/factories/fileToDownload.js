'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('fileToDownload')
  .option('fromServer', false)
  .attrs({
    expiresAt: () => faker.date.future().toISOString(),
    temporaryUrl: () => faker.internet.url()
  })
  .after((file, options) => {
    // If building an object that comes from the server, transform it to have camel
    // case and capital letters in the right spots
    if (options.fromServer) {
      file.expires_at = file.expiresAt;
      delete file.expiresAt;

      file.temporary_url = file.temporaryUrl;
      delete file.temporaryUrl;
    }
  });

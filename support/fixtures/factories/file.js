'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('file')
  .option('fromServer', false)
  .attrs({
    createdAt: () => faker.date.past().toISOString(),
    contentType: () => faker.system.mimeType(),
    description: () => faker.hacker.phrase(),
    filename: () => faker.system.commonFileName(),
    id: () => faker.random.uuid(),
    organizationId: () => factory.build('organization').id,
    status: () => faker.random.arrayElement(['ACTIVE', 'UPLOADING']),
    updatedAt: () => faker.date.recent().toISOString()
  })
  .attr('uploadInfo', ['fromServer'], (fromServer, uploadInfo) => {
    return factory.build('fileUploadInfo', null, { fromServer });
  })
  .after((file, options) => {
    // If building a file object that comes from the server, transform it to have camel
    // case and capital letters in the right spots
    if (options.fromServer) {
      file.created_at = file.createdAt;
      delete file.createdAt;

      file.content_type = file.contentType;
      delete file.contentType;

      file.organization_id = file.organizationId;
      delete file.organizationId;

      file.updated_at = file.updatedAt;
      delete file.updatedAt;

      file.upload_info = file.uploadInfo;
      delete file.uploadInfo;
    }
  });

'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('IOSDevice')
  .option('fromServer', false)
  .sequence('id')
  .attrs({
    createdAt: () => faker.date.past().toISOString(),
    deviceToken: () => faker.datatype.uuid(),
    isActive: () => faker.datatype.boolean(),
    snsEndpointArn: () => faker.datatype.uuid(),
    updatedAt: () => faker.date.recent().toISOString(),
    userId: () => factory.build('eventUser').id
  })
  .after((IOSDevice, options) => {
    // If building an IOSDevices object that comes from the server, transform it to have camel
    // case and capital letters in the right spots
    if (options.fromServer) {
      IOSDevice.created_at = IOSDevice.createdAt;
      delete IOSDevice.createdAt;

      IOSDevice.deviceToken = IOSDevice.device_token;
      delete IOSDevice.device_token;

      IOSDevice.isActive = IOSDevice.is_active;
      delete IOSDevice.is_active;

      IOSDevice.snsEndpointArn = IOSDevice.sns_endpoint_arn;
      delete IOSDevice.sns_endpoint_arn;

      IOSDevice.updated_at = IOSDevice.updatedAt;
      delete IOSDevice.updatedAt;

      IOSDevice.userId = IOSDevice.user_id;
      delete IOSDevice.user_id;
    }
  });

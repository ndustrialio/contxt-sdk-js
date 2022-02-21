'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory
  .define('userMobileNumber')
  .option('fromServer', false)
  .sequence('id')
  .attrs({
    createdAt: () => faker.date.past().toISOString(),
    name: () => faker.name.firstName(),
    isActive: () => faker.datatype.boolean(),
    phoneNumber: () => faker.phone.phoneNumber(),
    updatedAt: () => faker.date.recent().toISOString(),
    userId: () => factory.build('eventUser').id
  })
  .after((userMobileNumber, options) => {
    // If building an userMobileNumber object that comes from the server, transform it to have camel
    // case and capital letters in the right spots
    if (options.fromServer) {
      userMobileNumber.created_at = userMobileNumber.createdAt;
      delete userMobileNumber.createdAt;

      userMobileNumber.isActive = userMobileNumber.is_active;
      delete userMobileNumber.is_active;

      userMobileNumber.phoneNumber = userMobileNumber.phone_number;
      delete userMobileNumber.phone_number;

      userMobileNumber.updated_at = userMobileNumber.updatedAt;
      delete userMobileNumber.updatedAt;

      userMobileNumber.userId = userMobileNumber.user_id;
      delete userMobileNumber.user_id;
    }
  });

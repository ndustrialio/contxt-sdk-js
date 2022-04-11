'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');
const times = require('lodash.times');

factory
  .define('eventUser')
  .option('fromServer', false)
  .attrs({
    createdAt: () => faker.date.past().toISOString(),
    email: () => faker.internet.email(),
    firstName: () => faker.name.firstName(),
    id: () => `auth0|${faker.datatype.number()}`,
    isMachineUser: () => faker.datatype.boolean(),
    lastName: () => faker.name.lastName(),
    userMobileNumbers: () => [],
    updatedAt: () => faker.date.recent().toISOString()
  })
  .attr('IOSDevice', ['id', 'fromServer'], (id, fromServer) => {
    return times(
      faker.datatype.number({
        min: 0,
        max: 5
      }),
      () => {
        return factory.build(
          'IOSDevice',
          {
            userId: id
          },
          {
            fromServer
          }
        );
      }
    );
  })
  .attr('userEventSubscription', ['id', 'fromServer'], (id, fromServer) => {
    return times(
      faker.datatype.number({
        min: 0,
        max: 5
      }),
      () => {
        return factory.build(
          'userEventSubscription',
          {
            userId: id
          },
          {
            fromServer
          }
        );
      }
    );
  })
  .attr(
    'userMobileNumber',
    ['id', 'firstName', 'lastName', 'fromServer'],
    (id, firstName, lastName, fromServer) => {
      return times(
        faker.datatype.number({
          min: 0,
          max: 5
        }),
        () => {
          return factory.build(
            'userMobileNumber',
            {
              name: firstName + ' ' + lastName,
              userId: id
            },
            {
              fromServer
            }
          );
        }
      );
    }
  )
  .after((eventUser, options) => {
    // If building an eventUser object that comes from the server, transform it to have camel
    // case and capital letters in the right spots
    if (options.fromServer) {
      eventUser.created_at = eventUser.createdAt;
      delete eventUser.createdAt;

      eventUser.first_name = eventUser.firstName;
      delete eventUser.firstName;

      eventUser.is_machine_user = eventUser.isMachineUser;
      delete eventUser.isMachineUser;

      eventUser.last_name = eventUser.lastName;
      delete eventUser.lastName;

      eventUser.user_mobile_numbers = eventUser.userMobileNumbers;
      delete eventUser.userMobileNumbers;

      eventUser.updated_at = eventUser.updatedAt;
      delete eventUser.updatedAt;
    }
  });

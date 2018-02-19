'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');
const times = require('lodash.times');

factory.define('facility')
  .sequence('id')
  .attrs({
    address1: () => faker.address.streetAddress(),
    address2: () => faker.address.secondaryAddress(),
    city: () => faker.address.city(),
    Info: () => {
      return {
        primary_contact_email: faker.internet.email(),
        primary_contact_first_name: faker.name.firstName(),
        primary_contact_last_name: faker.name.lastName(),
        square_feet: faker.random.number()
      };
    },
    Organization: () => factory.build('organization'),
    state: () => faker.address.state(),
    timezone: () => {
      return faker.helpers.shuffle([
        'America/New_York',
        'America/Chicago',
        'America/Denver',
        'America/Los_Angeles'
      ]);
    },
    weather_location_id: () => null,
    zip: () => faker.address.zipCode()
  })
  .attr('name', ['city'], (city) => `${faker.address.cityPrefix()} ${city}`)
  .attr('organization_id', ['Organization'], (organization) => organization.id)
  .attr('tags', ['id'], (id) => {
    return times(faker.random.number({ min: 0, max: 5 }), () => {
      return factory.build('facilityTag', { facility_id: id });
    });
  });

'use strict';

const factory = require('rosie').Factory;
const { faker } = require('@faker-js/faker');

factory.define('facilityInfo').attrs({
  'General Manager': () => faker.person.fullName(),
  latitude: () => faker.location.latitude(),
  longitude: () => faker.location.longitude(),
  rail_access: () => `${fakerBoolean()}`,
  square_feet: () => `${faker.number.int()}`
});

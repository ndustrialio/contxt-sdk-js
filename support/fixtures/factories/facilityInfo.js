'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory.define('facilityInfo').attrs({
  'General Manager': () => faker.name.findName(),
  latitude: () => faker.address.latitude(),
  longitude: () => faker.address.longitude(),
  rail_access: () => `${faker.datatype.boolean()}`,
  square_feet: () => `${faker.datatype.number()}`
});

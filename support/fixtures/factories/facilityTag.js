'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory.define('facilityTag')
  .sequence('id')
  .attrs({
    facility_id: () => faker.random.number(),
    name: faker.commerce.productMaterial()
  });

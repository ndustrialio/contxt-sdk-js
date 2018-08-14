'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');
const times = require('lodash.times');

factory
  .define('facility')
  .option('fromServer', false)
  .sequence('id')
  .attrs({
    address1: () => faker.address.streetAddress(),
    address2: () => faker.address.secondaryAddress(),
    assetId: () => faker.random.uuid(),
    city: () => faker.address.city(),
    createdAt: () => faker.date.past().toISOString(),
    geometryId: () => faker.random.uuid(),
    info: () => factory.build('facilityInfo'),
    state: () => faker.address.state(),
    timezone: () => {
      return faker.random.arrayElement([
        'America/New_York',
        'America/Chicago',
        'America/Denver',
        'America/Los_Angeles'
      ]);
    },
    weatherLocationId: () => null,
    zip: () => faker.address.zipCode()
  })
  .attr('facilityGroupings', ['id', 'fromServer'], (id, fromServer) => {
    return times(
      faker.random.number({
        min: 0,
        max: 5
      }),
      () => {
        return factory.build(
          'facilityGrouping',
          {
            facilityId: id
          },
          {
            fromServer
          }
        );
      }
    );
  })
  .attr('name', ['city'], (city) => `${faker.address.cityPrefix()} ${city}`)
  .attr('organization', ['fromServer'], (fromServer) => {
    return factory.build('organization', null, {
      fromServer
    });
  })
  .attr('organizationId', ['organization'], (organization) => organization.id)
  .attr('tags', ['id', 'fromServer'], (id, fromServer) => {
    return times(
      faker.random.number({
        min: 0,
        max: 5
      }),
      () => {
        return factory.build(
          'facilityTag',
          {
            facilityId: id
          },
          {
            fromServer
          }
        );
      }
    );
  })
  .after((facility, options) => {
    // If building a facility object that comes from the server, transform it to have camel case and
    // capital letters in the right spots
    if (options.fromServer) {
      facility.created_at = facility.createdAt;
      delete facility.createdAt;

      facility.facility_groupings = facility.facilityGroupings;
      delete facility.facilityGroupings;

      facility.geometry_id = facility.geometryId;
      delete facility.geometryId;

      facility.Info = facility.info;
      delete facility.info;

      facility.Organization = facility.organization;
      delete facility.organization;

      facility.organization_id = facility.organizationId;
      delete facility.organizationId;

      facility.weather_location_id = facility.weatherLocationId;
      delete facility.weatherLocationId;
    }
  });

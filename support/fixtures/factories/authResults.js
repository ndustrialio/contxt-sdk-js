'use strict';

const factory = require('rosie').Factory;
const faker = require('faker');

factory.define('Auth0WebAuthSessionInfo').attrs({
  accessToken: () => faker.datatype.uuid(),
  expiresAt: () => sometimeSoon(2, 24)
});

factory.define('MachineAuthSessionInfo').attrs({
  apiToken: () => faker.datatype.uuid(),
  expiresAt: () => sometimeSoon(2, 24)
});

const sometimeSoon = (minHours, maxHours) => {
  const hoursToMs = (hours) => hours * 60 * 60 * 1000;

  const range = {
    min: hoursToMs(minHours),
    max: hoursToMs(maxHours)
  };

  const date = new Date();

  let future = date.getTime();
  future += faker.datatype.number(range);
  date.setTime(future);

  return date;
};

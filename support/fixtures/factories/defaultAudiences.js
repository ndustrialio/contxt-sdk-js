'use strict';

const factory = require('rosie').Factory;

factory.define('defaultAudiences')
  .attr('contxtAuth', () => factory.build('audience'))
  .attr('facilities', () => factory.build('audience'));

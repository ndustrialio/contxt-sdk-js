'use strict';

const factory = require('rosie').Factory;

require('./audience');
require('./defaultAudiences');
require('./facility');
require('./facilityTag');
require('./organization');
require('./userProfile');

module.exports = factory;

'use strict';

const factory = require('rosie').Factory;

require('./audience');
require('./defaultAudiences');
require('./facility');
require('./facilityGrouping');
require('./facilityGroupingFacility');
require('./facilityInfo');
require('./facilityTag');
require('./organization');
require('./userProfile');

module.exports = factory;

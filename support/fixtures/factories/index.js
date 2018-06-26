'use strict';

const factory = require('rosie').Factory;

require('./audience');
require('./costCenter');
require('./costCenterFacility');
require('./defaultAudiences');
require('./facility');
require('./facilityGrouping');
require('./facilityGroupingFacility');
require('./facilityInfo');
require('./facilityTag');
require('./outputField');
require('./organization');
require('./userProfile');

module.exports = factory;

'use strict';

const factory = require('rosie').Factory;

require('./asset');
require('./assetAttribute');
require('./assetAttributeValue');
require('./assetType');
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
require('./outputFieldData');
require('./organization');
require('./paginationMetadata');
require('./userProfile');

module.exports = factory;

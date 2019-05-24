'use strict';

const factory = require('rosie').Factory;

require('./asset');
require('./assetAttribute');
require('./assetAttributeValue');
require('./assetMetric');
require('./assetMetricValue');
require('./assetType');
require('./audience');
require('./channel');
require('./contxtApplication');
require('./contxtOrganization');
require('./contxtOrganizationFeaturedApplication');
require('./contxtRole');
require('./contxtStack');
require('./contxtUser');
require('./contxtUserApplication');
require('./contxtUserFavoriteApplication');
require('./contxtUserPermissions');
require('./contxtUserRole');
require('./costCenter');
require('./costCenterFacility');
require('./defaultAudiences');
require('./edgeNode');
require('./event');
require('./eventType');
require('./facility');
require('./facilityGrouping');
require('./facilityGroupingFacility');
require('./facilityInfo');
require('./facilityTag');
require('./fieldCategory');
require('./fieldGrouping');
require('./fieldGroupingField');
require('./file');
require('./fileToDownload');
require('./fileUploadInfo');
require('./outputField');
require('./outputFieldData');
require('./organization');
require('./owner');
require('./paginationMetadata');
require('./userPermissionsMap');
require('./userProfile');

module.exports = factory;

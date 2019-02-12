## [v0.0.39](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.39) (2019-02-12)

**Fixed**

- Updated `extend`, `just-extend`, `lodash`, and `nise` libraries to fix newly discovered vulnerabilities

## [v0.0.38](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.38) (2019-01-29)

**Added**

- Added ` passwordGrantAuth`` SessionType for use where the Auth0 `password` grant type can be utilized.

  - `logIn` for logging into Contxt through Auth0
  - `logOut` for clearing the session info retrieved from logging in

## [v0.0.37](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.37) (2019-01-03)

**Added**

-Added `Coordinator#getUserPermissionsMap` to retrieve a map of all permission scopes a user can access

## [v0.0.36](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.36) (2018-11-09)

**Added**

- Methods around Field Groupings

  - `FieldGroupings#addField` for adding a Field to a Field Grouping
  - `FieldGroupings#create` for creating a Field Grouping
  - `FieldGroupings#delete` for deleting a Field Grouping
  - `FieldGroupings#get` for getting information about a Field Grouping
  - `FieldGroupings#getGroupingsByFacilityId` for getting a list of Field Groupings based on the facility ID
  - `FieldGroupings#removeField` for removing a field from a Field Grouping
  - `FieldGroupings#update` for updating information about a Field Grouping

- Methods around Field Categories

  - `FieldCategories#create` for creating a Field Category
  - `FieldCategories#delete` for deleting a Field Category
  - `FieldCategories#get` for getting information about a Field Category
  - `FieldCategories#getAll` for getting a paginated list of all Field Categories
  - `FieldCategories#getAllByFacility` for getting all Field Categories based on a facility ID
  - `FieldCategories#update` for updating information about a Field Category

## [v0.0.35](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.35) (2018-10-11)

**Fixed**

- Updated `AssetAttributes#create` to allow for the creation of global asset attributes.

## [v0.0.34](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.34) (2018-10-08)

**Fixed**

- There were some methods that returned paginated data, but did not pass the `limit` and `offset` to the API. This has been fixed and now allows for passing `limit` and `offset` for:
  - `AssetTypes#getAll`
  - `AssetTypes#getAllByOrganizationId`
  - `Assets#getAll`
  - `Events#getEventTypesByClientId`

## [v0.0.33](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.33) (2018-09-27)

**Added**

- Additional methods for Asset Metrics and Asset Metric Values

  - `AssetMetrics#getByAssetId` for getting all Asset Metrics for a specific Asset ID
    - Allows filtering by `assetMetricLabel`
  - `AssetMetrics#getValuesByAssetId` for getting Asset Metric Values for a specific Asset ID
    - Allows filtering by `assetMetricLabel`, `effectiveEndDate`, and `effectiveStartDate`

- Additional methods for Events

  - `Events#getEventTypesByClientId` for getting all Event Types for a specific Client ID
  - `Events#getEventsByTypeId` for getting Events for a specific Event Type ID
    - Allows passing option to add latest `triggered_event` to Events.

## [v0.0.32](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.32) (2018-09-17)

**Added**

- Methods around Asset Metrics and Asset Metric Values. They are namespaced under `metrics` and include:
  - `AssetMetrics#create` for creating an Asset Metric
  - `AssetMetrics#delete` for removing an Asset Metric
  - `AssetMetrics#get` for getting an Asset Metric by its ID
  - `AssetMetrics#getByAssetTypeId` for getting all Asset Metrics by Asset Type
  - `AssetMetrics#update` for updating an Asset Metric
  - `AssetMetrics#createValue` for creating an Asset Metric Value
  - `AssetMetrics#deleteValue` for deleting an Asset Metric Value
  - `AssetMetrics#getValuesByMetricId` for getting Asset Metric Values by Asset Metric ID
  - `AssetMetrics#updateValue` for updating an Asset Metric Value

## [v0.0.31](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.31) (2018-09-10)

**Added**

- Added `AssetAttributes#getEffectiveValuesByOrganizationId` to retrieve all effective attribute values for a given organization.

## [v0.0.30](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.30) (2018-08-20)

**Changed**

- Started normalizing Silent Authentication errors from Auth0 in the Auth0WebAuth session type to match Axios errors.
  - Additionally, started logging the user out when one of these errors is encountered.

## [v0.0.29](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.29) (2018-08-16)

**Changed**

- Added generic methods to normalize data moving between the API and the SDK consumer.
  - Removed most formatters that were "brute forcing" the same task. Only remaining formatters are for specific edge cases.

## [v0.0.28](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.28) (2018-08-15)

**Added**

- Methods around Edge Nodes. They are namespaced under coordinator (i.e. `coordinator.edgeNodes()`) and include:
  - `EdgeNodes#get` for getting info about a specific Edge Node

## [v0.0.27](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.27) (2018-08-14)

**Added**

- Added Bus, Channel module with the ability to perform create, read, update and delete on Message Bus Channels

## [v0.0.26](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.26) (2018-08-13)

**Changed**

- Set specific engine versions for Node and NPM
- Audited and updated dependencies
- Updated `AssetAttributes#createValue` to use an updated API endpoint

**Fixed**

- Fixed documentation building process to support Node 6

## [v0.0.25](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.25) (2018-08-08)

**Added**

- Added Coordinator module with ability to get info about organizations and users from Contxt Coordinator

## [v0.0.24](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.24) (2018-08-07)

**Added**

- Added Events module with ability to create, read, update, and delete events

**Changed**

- Added `assetLabel` and `label` as fields associated with `AssetAttributeValues`

## [v0.0.23](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.23) (2018-08-01)

**Fixed**

- Fixed how results were returned from `AssetAttributes#getAll`

## [v0.0.22](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.22) (2018-07-30)

**Changed**

- Started to pass a more robust error when there is a problem renewing tokens with the Auth0WebAuth session adapter
- Updated `AssetAttributes#getAll` to pass pagination information along with the request

## [v0.0.21](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.21) (2018-07-23)

**Fixed**

- Updated `AssetTypes#create` to allow for the creation of global asset types

## [v0.0.20](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.20) (2018-07-16)

**Added**

- Methods around the display and manipulation of Asset Attributes Values. They are namespaced under assets (i.e. `assets.attributes.methodName()`) and include:

  - `AssetAttributes#createValue` to add an asset attribute value
  - `AssetAttributes#deleteValue` to delete an asset attribute value
  - `AssetAttributes#getEffectiveValuesByAssetId` to get the effective asset attribute values for a particular asset
  - `AssetAttributes#getValuesByAttributeId` to get a paginated list of asset attribute values for a particular attribute of a particular asset
  - `AssetAttributes#updateValue` to update an asset attribute value

**Changed**

- Now supporting the `data_type` field for `AssetAttributes`

## [v0.0.19](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.19) (2018-07-09)

**Added**

- Methods around the display and manipulation of Asset Attributes. They are namespaced under assets (i.e. `assets.attributes.methodName()`) and include:
  - `AssetAttributes#create` to add an asset attribute
  - `AssetAttributes#delete` to delete an asset attribute
  - `AssetAttributes#get` to get an asset attribute
  - `AssetAttributes#getAll` to get a list of all asset attributes
  - `AssetAttributes#update` to update an asset attribute

## [v0.0.18](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.18) (2018-07-06)

**Changed**

- External Modules can now have a `clientId` or `host` set to `null` if the values are not needed for the module. (_NOTE:_ Some SessionType adapters, like the MachineAuth adapter, require a `clientId` if the built-in `request` module is used since contxt auth tokens for those adapters are generated on a per-clientId basis).

## [v0.0.17](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.17) (2018-07-03)

**Added**

- Methods around the display and manipulation of Assets. They are namespaced under assets (i.e. `assets.methodName()`) and include:
  - `Assets#create` to add an asset
  - `Assets#delete` to delete an asset
  - `Assets#get` to get an asset
  - `Assets#getAll` to get a list of all assets
  - `Assets#getAllByOrganizationId` to get a list of all assets for a specific organization
  - `Assets#update` to update an asset
- Methods around the display and manipulation of Asset Types. They are namespaced under assets (i.e. `assets.types.methodName()`) and include:
  - `AssetTypes#create` to add an asset type
  - `AssetTypes#delete` to delete an asset type
  - `AssetTypes#get` to get an asset type
  - `AssetTypes#getAll` to get a list of all asset types
  - `AssetTypes#getAllByOrganizationId` to get a list of all asset types for a specific organization
  - `AssetTypes#update` to update an asset type

## [v0.0.16](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.16) (2018-07-02)

**Added**

- Added IOT module, with ability to get field data and field information

**Changed**

- `asset_id` added as an optional field when getting facilities

**Fixed**

- Fixed bug where calls would return with a 401 when making simultaneous requests while using the `MachineAuth` session typ.

## [v0.0.15](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.15) (2018-06-21)

**Changed**

- Auth0WebAuth now automatically handles refreshing Access and API tokens instead of forcing the user to log in again every two hours.

## [v0.0.14](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.14) (2018-06-18)

**Changed**

- `Facilities#getAllByOrganizationId` to accept parameters to include cost centers information
- `Facilities#get` to include cost centers information for that specific facility

## [v0.0.13](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.13) (2018-06-16)

**Added**

- The ability to set up custom axios interceptors to be used on each request and response made to an API. (More information available at at {@link https://github.com/axios/axios#interceptors axios Interceptors})

## [v0.0.12](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.12) (2018-06-14)

**Added**

- Methods around the display and manipulation of Cost Centers. They are namespaced under facilities (i.e. `facilities.costCenters.methodName()`) and include:
  - `CostCenters#addFacility` to add a facility to a cost center
  - `CostCenters#create` for creating a new cost center
  - `CostCenters#getAll` for getting a list of all cost centers
  - `CostCenters#getAllByOrganizationId` for getting all cost centers for a specific organization
  - `CostCenters#remove` to remove an existing cost center
  - `CostCenters#removeFacility` to remove a facility from a cost center
  - `CostCenters#update` to update an existing cost center

## [v0.0.11](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.11) (2018-05-16)

**Changed**

- `Facilities#getAllByOrganizationId` to accept parameters to include facility grouping information

## [v0.0.10](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.10) (2018-05-01)

**Added**

- `FacilityGroupings#remove` to remove an existing facility grouping
- `FacilityGroupings#update` to update an existing facility grouping

## [v0.0.9](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.9) (2018-04-19)

**Added**

- `FacilityGroupings#getAllByOrganizationId` for getting all facility groupings for a specific organization

## [v0.0.8](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.8) (2018-04-16)

**Added**

- Added some methods to help out when working with facility groupings. They are namespaced under facilities (i.e. `facilities.groupings.methodName()`) and include:
  - `FacilityGroupings#addFacility` to add a facility to a facility grouping
  - `FacilityGroupings#create` for creating new facility groupings
  - `FacilityGroupings#getAll` for getting a list of all facility groupings
  - `FacilityGroupings#removeFacility` to remove a facility from a facility grouping

## [v0.0.7](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.7) (2018-03-29)

**Renamed**

- `Facilities#updateInfo` to `Facilities#createOrUpdateInfo` so that what the method does is more obvious

## [v0.0.6](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.6) (2018-03-28)

**Added**

- `Facilities#updateInfo` for updating a facility's facilily info

## [v0.0.5](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.5) (2018-03-20)

**Added**

- Facilities#create, Facilities#delete, Facilities#getAllByOrganizationId, and Facilities#update

## [v0.0.4](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.4) (2018-03-08)

**Added**

- MachineAuth SessionType for use on Node.js projects

**Changed**

- Split API documentation into multiple files for easy reading and navigation

**Fixed**

- Updated required version of `auth0-js` to fix [CVS-2018-7307](https://auth0.com/docs/security/bulletins/cve-2018-7307)

## v0.0.3 (2018-02-26)

- Adds documentation!
- Fixes bug where placement of customModuleConfigs and the chosen environment in the user config did not match up with what was in documentation

## v0.0.2 (2018-02-26)

- Fixes publication process so that the built files are in the package grabbed from NPM

## v0.0.1 (2018-02-23)

- Initial release
- Provides Request, Config and an initial SessionType, Auth0WebAuth
- Provides `Facilities#get` and Facilities#getAll

## [v2.4.0](https://github.com/ndustrialio/contxt-sdk-js/pull/131) (2019-10-07)

**Changed**

- Added `Coordinator.setOrganizationId` which, when set, will use the new tenancy/access based API endpoints
  - If no `organizationId` has been set, all `Coordinator` endpoints will use the legacy API endpoints

## [v2.3.0](http://github.com/ndustrialio/contxt-sdk-js/tree/v2.3.0) (2019-09-09)

**Added**

- Added the ability to pass options to the Auth0WebAuth#logOut method. This will be useful for setting up Single Logout between Auth0 and an external IdP

## [v2.2.0](http://github.com/ndustrialio/contxt-sdk-js/tree/v2.2.0) (2019-08-13)

**Added**

- Added the `email` scope when signing in via Auth0WebAuth
  - Provides additional information when getting a user's info from Auth0

## [v2.1.1](http://github.com/ndustrialio/contxt-sdk-js/tree/v2.1.1) (2019-07-25)

**Fixed**

- `Coordinator.users#activate` no longer attempts to attach an authorization header to the request

## [v2.1.0](http://github.com/ndustrialio/contxt-sdk-js/tree/v2.1.0) (2019-07-22)

**Added**

- Added `Coordinator.users#sync` for syncing a user's roles and application access with the external authorization provider

## [v2.0.0](http://github.com/ndustrialio/contxt-sdk-js/tree/v2.0.0) (2019-07-17)

**Breaking Changes**

- Renamed `Events#subscribeEvent` to `Events#subscribeUser`
- Renamed `Events#unsubscribeEvent` to `Events#unsubscribeUser`

## [v1.7.1](http://github.com/ndustrialio/contxt-sdk-js/tree/v1.7.1) (2019-07-12)

**Changed**

- Updated how session types are required/imported into the SDK
  - Solves a problem where `auth0-js` required `window` in Node environments

## [v1.7.0](http://github.com/ndustrialio/contxt-sdk-js/tree/v1.7.0) (2019-07-03)

**Added**

- Added `Coordinator.consent#getForCurrentApplication` for getting the current application version's consent form. The current access_token will be used to derive which application is being consented to.
- Added `Coordinator.consent#accept` for accepting user consent to an applications

## [v1.6.0](http://github.com/ndustrialio/contxt-sdk-js/tree/v1.6.0) (2019-06-25)

**Added**

- Added `Users#subscribeEvent` for subscribing a user to an event
- Added `Users#unsubscribeEvent` for unsubscribing a user from an event

## [v1.5.0](http://github.com/ndustrialio/contxt-sdk-js/tree/v1.5.0) (2019-06-28)

**Added**

- Concept of dynamic modules. Dynamic modules can be used to insert/decorate an external module into the SDK after the SDK is initially instantiated.
  - `Contxt#mountDynamicModule`
  - `Contxt#unmountDynamicModule`
- Concept of dynamic audiences. Dynamic audiences can be used to edit the list of audiences in the SDK's config object after the SDK is initially instantiated.
  - `Config#addDynamicAudience`
  - `Config#removeDynamicAudience`
- `Auth#clearCurrentApiToken` - Added the ability to clear an audience's API token out of memory so a new token is created and retrieved on the next request

## [v1.4.2](http://github.com/ndustrialio/contxt-sdk-js/tree/v1.4.2) (2019-06-14)

**Fixed**

- Update Sinon and Sinon-Chai dependencies to fix potential vulnerabilities

## [v1.4.1](http://github.com/ndustrialio/contxt-sdk-js/tree/v1.4.1) (2019-06-13)

**Fixed**

- Update Axios and Mocha dependencies to fix potential vulnerabilities

## [v1.4.0](http://github.com/ndustrialio/contxt-sdk-js/tree/v1.4.0) (2019-06-13)

**Added**

- Added `WebSocketConnection#subscribe` for subscribing to a Message Bus channel

## [v1.3.0](http://github.com/ndustrialio/contxt-sdk-js/tree/v1.3.0) (2019-06-07)

**Added**

- Added `Coordinator.roles#addApplication` for adding an application to a role
- Added `Coordinator.roles#addStack` for adding a stack to a role
- Added `Coordinator.roles#removeApplication` for removing an application from a role
- Added `Coordinator.roles#removeStack` for removing a stack from a role

## [v1.2.3](http://github.com/ndustrialio/contxt-sdk-js/tree/v1.2.3) (2019-06-05)

**Fixed**

- Updated internal config builder to include `webSocket` key

## [v1.2.2](http://github.com/ndustrialio/contxt-sdk-js/tree/v1.2.2) (2019-06-03)

**Fixed**

- v1.2.1 was published without the changes introduced in 1.1.0. Republishing to re-add this code.

## [v1.2.1](http://github.com/ndustrialio/contxt-sdk-js/tree/v1.2.1) (2019-05-30)

**Added**

- Added `Coordinator.roles#create` for adding a new role within an organization
- Added `Coordinator.roles#delete` for deleting a role within an organization

## [v1.2.0](http://github.com/ndustrialio/contxt-sdk-js/tree/v1.2.0) (2019-05-30)

**Added**

- Added `Coordinator.permissions#getOneByOrganizationId` for getting a single user's permissions within an organization

**Changed**

- Renamed `Coordinator.permissions#getByOrganizationId` to `Coordinator.permissions#getAllByOrganizationId` for getting every user's permissions within an organization.

## [v1.1.0](http://github.com/ndustrialio/contxt-sdk-js/tree/v1.1.0) (2019-05-29)

**Added**

- Added `Coordinator.applications#getGroupings` for getting all application groupings and modules for an application that a user has access to

## [v1.0.0](http://github.com/ndustrialio/contxt-sdk-js/tree/v1.0.0) (2019-05-28)

**Changed**

- Updated build process to only transpile source files instead of also concatenating into a single module

  - This will allow us to substitute out modules when the browser and Node version needs to differ (like the Message Bus module at the moment)
  - Additionally, it will allow end users to import a specific file from the package to use or extend it (i.e. when creating a custom module, a user might want to use our object utilities to transform object key cases or extend off an already built module to add or monkey-patch functionality)
  - Provides separate CommonJS and ES Module file trees (in `/lib` and `/esm`, respectively) to be used directly by Node, Webpack, or the user's preferred bundling application
  - The directory for the ES modules build has changed. If a project was directly importing the ES module instead of the root package, this will need to be updated (i.e. `import ContxtSdk from 'contxt-sdk/es'` to `import ContxtSdk from 'contxt-sdk/esm'`)
  - **NOTE:** The Babel configuration has been moved from the `.babelrc` file to the `package.json` so that the configuration can be shared with the Gulp build process and testing via Mocha. If upgrading to Babel 7, this should be moved to a `babel.config.js` file (this functionality was added in 7).

- Added Browser versions of Message Bus related modules that indicate connecting to the Message Bus is not supported in browser environments at the moment.
- Changed back to using UUIDv4s as IDs for Message Bus subscriptions and publications.
- Refactored Auth0WebAuth to better handle access tokens provided by contxt-auth. Each API/audience now gets its own token instead of getting one big token that contained every possible API/audience combination.

  - If using `Auth#getCurrentApiToken` (especially if not passing in the audience name/API name), pay extra attention to this update. The output has the same format, but the information that should be expected in the token is slightly different (there will be less information).

- Split Coordinator module into multiple submodules

```js
//Applications Module
coordinator.createFavoriteApplication()	-> coordinator.applications.addFavorite()
coordinator.getAllApplications() -> coordinator.applications.getAll()
coordinator.getFavoriteApplications() -> coordinator.applications.getFavorites()
coordinator.getFeaturedApplications() -> coordinator.applications.getFeatured()
coordinator.deleteFavoriteApplication()	-> coordinator.applications.removeFavorite()

//Organizations Module
coordinator.getOrganizationById() -> coordinator.organizations.get()
coordinator.getAllOrganizations() -> coordinator.organizations.getAll()

//Permissions Module
coordinator.getUserPermissionsMap()	-> coordinator.permissions.getByUserId()

//Users Module
coordinator.activateNewUser() -> coordinator.users.activate()
coordinator.getUser() -> coordinator.users.get()
coordinator.getUsersByOrganization() -> coordinator.users.getByOrganizationId()
coordinator.inviteNewUserToOrganization() -> coordinator.users.invite()
coordinator.removeUserFromOrganization() -> coordinator.users.remove()
```

**Added**

- Added `Permissions#getByOrganizationId` for fetching all user permissions for an entire organization.
- Added `Users#addRole` for adding a role to a user
- Added `Users#removeRole` for removing a role from a user
- Added `Users#addApplication` for adding an application to a user
- Added `Users#removeApplication` for removing an application from a user
- Added `Users#addStack` for adding a stack to a user
- Added `Users#removeStack` for removing a stack from a user

## [v0.0.50](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.50) (2019-05-14)

**Added**

- Added Roles Module `coordinator.roles`
- Added `Roles#getByOrganizationId` for getting all roles belonging to an organization

## [v0.0.49](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.49) (2019-04-22)

**Added**

- Added `Coordinator#inviteNewUserToOrganization` for inviting new users to organizations
- Added `Coordinator#activateNewUser` for activating a user account with an initial password
- Added `Coordinator#removeUserFromOrganization` for removing a user from an organization

## [v0.0.48](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.48) (2019-04-02)

**Added**

- Added `Coordinator#getUsersByOrganization` for getting a list of users for an organization

## [v0.0.47](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.45) (2019-04-02)

**Added**

- Added `Coordinator#getFeaturedApplications` for getting an organization's list of featured applications

## [v0.0.46](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.46) (2019-04-01)

**Fixed**

- Fixed the client ID used for seeking authorization with the message bus in staging environments.

## [v0.0.45](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.45) (2019-03-25)

**Added**

- Added `Coordinator#createFavoriteApplication` for adding an application to the current user's favorite application list
- Added `Coordinator#deleteFavoriteApplication` for removing an application from the current user's favorite application list
- Added `Coordinator#getFavoriteApplications` for getting the current user's favorite application list

## [v0.0.44](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.44) (2019-03-19)

**Added**

- Added `Coordinator#getAllApplications` for getting a list of all applications

## [v0.0.43](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.43) (2019-03-13)

**Added**

- Added `Events#createEventType` for creating an event type

## [v0.0.42](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.42) (2019-03-08)

**Added**

- Added Files module to interact with our new Files API. It can help with managing the File records and uploading them to the external service used for actually storing the files.

  - `Files#create` for creating a File record
  - `Files#createAndUpload` for managing the process of creating a File record, uploading the file to an external service, and updating the File's upload status
  - `Files#delete` for deleting a single File
  - `Files#download` for getting a temporary URL to a File
  - `Files#get` for getting metadata about a File
  - `Files#getAll` for getting a paginated list of Files and their metadata
  - `Files#setUploadComplete` for updating a File's upload status to indicate it has been uploaded
  - `Files#setUploadFailed` for updating a File's upload status to indicate the upload failed
  - `Files#upload` for uploading a File to the external service used for storing files

**Fixed**

- There was an issue with requiring v0.0.41 in a browser related to the `uuid` package we were using in the WebSocket module. It's been switched out with `nanoid`.

## [v0.0.41](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.41) (2019-03-01)

**Added**

- Added `WebSocketConnection#onMessage` for handling all messages recieved by the WebSocket
- Added `WebSocketConnection#onError` for handling all WebSocket errors

**Changed**

- Updated `onmessage` handling for the `WebSocketConnection`
  - Multiple messages can be sent to the Message Bus and an `onmessage` handler is created for each message sent
  - When a response comes back for a sent message, the response is sent back to the user and the `onmessage` handler is torn down

## [v0.0.40](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.40) (2019-02-18)

**Added**

- Added `Bus#connect` to connect to the message bus via WebSockets
- Added `WebSocketConnection` class to wrap the open WebSocket connection
  - `authorize` for authorizing publish and/or subscribe for a particular channel
  - `close` for closing the WebSocket connection
  - `publish` for publishing a message to the message bus

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

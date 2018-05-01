## [v0.0.10](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.10) (2018-05-01)

**Added**

* FacilityGroupings#remove to remove an existing facility grouping
* FacilityGroupings#update to update an existing facility grouping

## [v0.0.9](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.9) (2018-04-19)

**Added**

* FacilityGroupings#getAllByOrganizationId for getting all facility groupings for a specific organization

## [v0.0.8](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.8) (2018-04-16)

**Added**

* Added some methods to help out when working with facility groupings. They are namespaced under facilities (i.e. `facilities.groupings.methodName()`) and include:
  * FacilityGroupings#addFacility to add a facility to a facility grouping
  * FacilityGroupings#create for creating new facility groupings
  * FacilityGroupings#getAll for getting a list of all facility groupings
  * FacilityGroupings#removeFacility to remove a facility from a facility grouping

## [v0.0.7](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.7) (2018-03-29)

**Renamed**

* Facilities#updateInfo to Facilities#createOrUpdateInfo so that what the method does is more obvious

## [v0.0.6](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.6) (2018-03-28)

**Added**

* Facilities#updateInfo for updating a facility's facilily info

## [v0.0.5](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.5) (2018-03-20)

**Added**

* Facilities#create, Facilities#delete, Facilities#getAllByOrganizationId, and Facilities#update

## [v0.0.4](http://github.com/ndustrialio/contxt-sdk-js/tree/v0.0.4) (2018-03-08)

**Added**

* MachineAuth SessionType for use on Node.js projects

**Changed**

* Split API documentation into multiple files for easy reading and navigation

**Fixed**

* Updated required version of `auth0-js` to fix [CVS-2018-7307](https://auth0.com/docs/security/bulletins/cve-2018-7307)

## v0.0.3 (2018-02-26)

* Adds documentation!
* Fixes bug where placement of customModuleConfigs and the chosen environment in the user config did not match up with what was in documentation

## v0.0.2 (2018-02-26)

* Fixes publication process so that the built files are in the package grabbed from NPM

## v0.0.1 (2018-02-23)

* Initial release
* Provides Request, Config and an initial SessionType, Auth0WebAuth
* Provides Facilities#get and Facilities#getAll

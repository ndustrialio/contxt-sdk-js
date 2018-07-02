<a name="Facilities"></a>

## Facilities
Module that provides access to, and the manipulation
of, information about different facilities

**Kind**: global class  

* [Facilities](#Facilities)
    * [new Facilities(sdk, request)](#new_Facilities_new)
    * [.create(facility)](#Facilities+create) ⇒ <code>Promise</code>
    * [.createOrUpdateInfo(facilityId, update)](#Facilities+createOrUpdateInfo) ⇒ <code>Promise</code>
    * [.delete(facilityId)](#Facilities+delete) ⇒ <code>Promise</code>
    * [.get(facilityId)](#Facilities+get) ⇒ <code>Promise</code>
    * [.getAll()](#Facilities+getAll) ⇒ <code>Promise</code>
    * [.getAllByOrganizationId(organizationId, [options])](#Facilities+getAllByOrganizationId) ⇒ <code>Promise</code>
    * [.update(facilityId, update)](#Facilities+update) ⇒ <code>Promise</code>

<a name="new_Facilities_new"></a>

### new Facilities(sdk, request)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>Object</code> | An instance of the SDK so the module can communicate with other modules |
| request | <code>Object</code> | An instance of the request module tied to this module's audience. |

<a name="Facilities+create"></a>

### contxtSdk.facilities.create(facility) ⇒ <code>Promise</code>
Creates a new facility

API Endpoint: '/facilities'
Method: POST

**Kind**: instance method of [<code>Facilities</code>](#Facilities)  
**Fulfill**: [<code>Facility</code>](./Typedefs.md#Facility) Information about the new facility  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| facility | <code>Object</code> |  |
| [facility.address1] | <code>string</code> |  |
| [facility.address2] | <code>string</code> |  |
| [facility.assetId] | <code>string</code> | UUID corresponding with an asset |
| [facility.city] | <code>string</code> |  |
| [facility.geometryId] | <code>string</code> | UUID corresponding with a geometry |
| facility.name | <code>string</code> |  |
| facility.organizationId | <code>string</code> | UUID corresponding with an organization |
| [facility.state] | <code>string</code> |  |
| facility.timezone | <code>string</code> |  |
| [facility.weatherLocationId] | <code>number</code> |  |
| [facility.zip] | <code>string</code> |  |

**Example**  
```js
contxtSdk.facilities
  .create({
    address: '221 B Baker St, London, England',
    name: 'Sherlock Holmes Museum',
    organizationId: 25
  })
  .then((facilities) => console.log(facilities))
  .catch((err) => console.log(err));
```
<a name="Facilities+createOrUpdateInfo"></a>

### contxtSdk.facilities.createOrUpdateInfo(facilityId, update) ⇒ <code>Promise</code>
Creates or updates a facility's info (NOTE: This refers to the facility_info model)

API Endpoint: '/facilities/:facilityId/info?should_update=true'
Method: POST

**Kind**: instance method of [<code>Facilities</code>](#Facilities)  
**Fulfill**: <code>undefined</code>  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| facilityId | <code>number</code> | The ID of the facility to update |
| update | <code>Object</code> | An object containing the facility info for the facility |

**Example**  
```js
contxtSdk.facilities.createOrUpdateInfo(25, {
  square_feet: '10000'
});
```
<a name="Facilities+delete"></a>

### contxtSdk.facilities.delete(facilityId) ⇒ <code>Promise</code>
Deletes a facility

API Endpoint: '/facilities/:facilityId'
Method: DELETE

**Kind**: instance method of [<code>Facilities</code>](#Facilities)  
**Fulfill**: <code>undefined</code>  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| facilityId | <code>number</code> | The ID of the facility |

**Example**  
```js
contxtSdk.facilities.delete(25);
```
<a name="Facilities+get"></a>

### contxtSdk.facilities.get(facilityId) ⇒ <code>Promise</code>
Gets information about a facility

API Endpoint: '/facilities/:facilityId'
Method: GET

**Kind**: instance method of [<code>Facilities</code>](#Facilities)  
**Fulfill**: [<code>Facility</code>](./Typedefs.md#Facility) Information about a facility  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| facilityId | <code>number</code> | The ID of the facility |

**Example**  
```js
contxtSdk.facilities
  .get(25)
  .then((facility) => console.log(facility))
  .catch((err) => console.log(err));
```
<a name="Facilities+getAll"></a>

### contxtSdk.facilities.getAll() ⇒ <code>Promise</code>
Gets a list of all facilities

API Endpoint: '/facilities'
Method: GET

**Kind**: instance method of [<code>Facilities</code>](#Facilities)  
**Fulfill**: <code>Facility[]</code> Information about all facilities  
**Reject**: <code>Error</code>  
**Example**  
```js
contxtSdk.facilities
  .getAll()
  .then((facilities) => console.log(facilities))
  .catch((err) => console.log(err));
```
<a name="Facilities+getAllByOrganizationId"></a>

### contxtSdk.facilities.getAllByOrganizationId(organizationId, [options]) ⇒ <code>Promise</code>
Gets a list of all facilities that belong to a particular organization

API Endpoint: '/organizations/:organizationId/facilities'
Method: GET

**Kind**: instance method of [<code>Facilities</code>](#Facilities)  
**Fulfill**: <code>Facility[]</code> Information about all facilities  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| organizationId | <code>string</code> | UUID corresponding with an organization |
| [options] | <code>object</code> | Object containing parameters to be called with the request |
| [options.includeGroupings] | <code>boolean</code> | Boolean flag for including groupings data with each facility |

**Example**  
```js
contxtSdk.facilities
  .getAllByOrganizationId(25, { includeGroupings: true })
  .then((facilities) => console.log(facilities))
  .catch((err) => console.log(err));
```
<a name="Facilities+update"></a>

### contxtSdk.facilities.update(facilityId, update) ⇒ <code>Promise</code>
Updates a facility's specifics

API Endpoint: '/facilities/:facilityId'
Method: PUT

**Kind**: instance method of [<code>Facilities</code>](#Facilities)  
**Fulfill**: <code>undefined</code>  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| facilityId | <code>number</code> | The ID of the facility to update |
| update | <code>Object</code> | An object containing the updated data for the facility |
| [update.address1] | <code>string</code> |  |
| [update.address2] | <code>string</code> |  |
| [update.assetId] | <code>string</code> | UUID corresponding with an asset |
| [update.city] | <code>string</code> |  |
| [update.geometryId] | <code>string</code> | UUID corresponding with a geometry |
| [update.info] | <code>Object</code> | User declared information |
| [update.name] | <code>string</code> |  |
| [update.organizationId] | <code>string</code> | UUID corresponding with an organization |
| [update.state] | <code>string</code> |  |
| [update.timezone] | <code>string</code> |  |
| [update.weatherLocationId] | <code>number</code> |  |
| [update.zip] | <code>string</code> |  |

**Example**  
```js
contxtSdk.facilities.update(25, {
  address: '221 B Baker St, London, England',
  name: 'Sherlock Homes Museum',
  organizationId: 25
});
```

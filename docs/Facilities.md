<a name="Facilities"></a>

## Facilities
Module that provides access to, and the manipulation
of, information about different facilities

**Kind**: global class  

* [Facilities](#Facilities)
    * [new Facilities(sdk, request)](#new_Facilities_new)
    * [.create(options)](#Facilities+create) ⇒ <code>Promise</code>
    * [.get(facilityId)](#Facilities+get) ⇒ <code>Promise</code>
    * [.getAll()](#Facilities+getAll) ⇒ <code>Promise</code>
    * [.getAllByOrganizationId(organizationId)](#Facilities+getAllByOrganizationId) ⇒ <code>Promise</code>

<a name="new_Facilities_new"></a>

### new Facilities(sdk, request)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>Object</code> | An instance of the SDK so the module can communicate with other modules |
| request | <code>Object</code> | An instance of the request module tied to this module's audience. |

<a name="Facilities+create"></a>

### contxtSdk.facilities.create(options) ⇒ <code>Promise</code>
Creates a new facility

API Endpoint: '/facilities'
Method: POST

**Kind**: instance method of [<code>Facilities</code>](#Facilities)  
**Throws**:

- <code>Error</code> 

**Fulfill**: [<code>Facility</code>](./Typedefs.md#Facility) Information about the new facility  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> |  |
| [options.address1] | <code>string</code> |  |
| [options.address2] | <code>string</code> |  |
| [options.city] | <code>string</code> |  |
| [options.geometryId] | <code>string</code> | UUID corresponding with a geometry |
| options.name | <code>string</code> |  |
| options.organizationId | <code>string</code> | UUID corresponding with an organzation |
| [options.state] | <code>string</code> |  |
| options.timezone | <code>string</code> |  |
| [options.weatherLocationId] | <code>number</code> |  |
| [options.zip] | <code>string</code> |  |

**Example**  
```js
contxtSdk.facilities
  .create({
    address: '221 B Baker St, London, England',
    name: 'Sherlock Homes Museum',
    organizationId: 25
  })
  .then((facilities) => console.log(facilities));
  .catch((err) => console.log(err));
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
| facilityId | <code>number</code> | The id of the facility |

**Example**  
```js
contxtSdk.facilities.get(25)
  .then((facility) => console.log(facility));
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
contxtSdk.facilities.getAll()
  .then((facilities) => console.log(facilities));
  .catch((err) => console.log(err));
```
<a name="Facilities+getAllByOrganizationId"></a>

### contxtSdk.facilities.getAllByOrganizationId(organizationId) ⇒ <code>Promise</code>
Gets a list of all facilities that belong to a particular organization

API Endpoint: '/organizations/:organizationId/facilities'
Method: GET

**Kind**: instance method of [<code>Facilities</code>](#Facilities)  
**Fulfill**: <code>Facility[]</code> Information about all facilities  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| organizationId | <code>string</code> | UUID corresponding with an organzation |

**Example**  
```js
contxtSdk.facilities.getAllByOrganizationId(25)
  .then((facilities) => console.log(facilities));
  .catch((err) => console.log(err));
```

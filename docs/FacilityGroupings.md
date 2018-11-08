<a name="FacilityGroupings"></a>

## FacilityGroupings
Module that provides access to facility groupings, and helps manage
the relationship between those groupings and facilities

**Kind**: global class  

* [FacilityGroupings](#FacilityGroupings)
    * [new FacilityGroupings(sdk, request, baseUrl)](#new_FacilityGroupings_new)
    * [.addFacility(facilityGroupingId, facilityId)](#FacilityGroupings+addFacility) ⇒ <code>Promise</code>
    * [.create(facilityGrouping)](#FacilityGroupings+create) ⇒ <code>Promise</code>
    * [.delete(facilityGroupingId)](#FacilityGroupings+delete) ⇒ <code>Promise</code>
    * [.getAll()](#FacilityGroupings+getAll) ⇒ <code>Promise</code>
    * [.getAllByOrganizationId(organizationId)](#FacilityGroupings+getAllByOrganizationId) ⇒ <code>Promise</code>
    * [.removeFacility(facilityGroupingId, facilityId)](#FacilityGroupings+removeFacility) ⇒ <code>Promise</code>
    * [.update(facilityGroupingId, update)](#FacilityGroupings+update) ⇒ <code>Promise</code>

<a name="new_FacilityGroupings_new"></a>

### new FacilityGroupings(sdk, request, baseUrl)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>Object</code> | An instance of the SDK so the module can communicate with other modules |
| request | <code>Object</code> | An instance of the request module tied to this module's audience. |
| baseUrl | <code>string</code> | The base URL provided by the parent module |

<a name="FacilityGroupings+addFacility"></a>

### contxtSdk.facilities.groupings.addFacility(facilityGroupingId, facilityId) ⇒ <code>Promise</code>
Adds a facility to a facility grouping

API Endpoint: '/groupings/:facilityGroupingId/facilities/:facilityId'
Method: POST

**Kind**: instance method of [<code>FacilityGroupings</code>](#FacilityGroupings)  
**Fulfill**: [<code>FacilityGroupingFacility</code>](./Typedefs.md#FacilityGroupingFacility) Information about the new facility/grouping relationship  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| facilityGroupingId | <code>string</code> | UUID corresponding with a facility grouping |
| facilityId | <code>number</code> |  |

**Example**  
```js
contxtSdk.facilities.groupings
  .addFacility('b3dbaae3-25dd-475b-80dc-66296630a8d0', 4)
  .then((grouping) => console.log(grouping))
  .catch((err) => console.log(err));
```
<a name="FacilityGroupings+create"></a>

### contxtSdk.facilities.groupings.create(facilityGrouping) ⇒ <code>Promise</code>
Creates a new facility grouping

API Endpoint: '/groupings'
Method: POST

**Kind**: instance method of [<code>FacilityGroupings</code>](#FacilityGroupings)  
**Fulfill**: [<code>FacilityGrouping</code>](./Typedefs.md#FacilityGrouping) Information about the new facility grouping  
**Reject**: <code>Error</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| facilityGrouping | <code>Object</code> |  |  |
| [facilityGrouping.description] | <code>string</code> |  |  |
| [facilityGrouping.isPrivate] | <code>boolean</code> | <code>false</code> |  |
| facilityGrouping.name | <code>string</code> |  |  |
| facilityGrouping.organizationId | <code>string</code> |  | UUID |
| [facilityGrouping.parentGroupingId] | <code>string</code> |  | UUID |

**Example**  
```js
contxtSdk.facilities.groupings
  .create({
    description: 'US States of CT, MA, ME, NH, RI, VT',
    isPrivate: false,
    name: 'New England, USA',
    organizationId: '61f5fe1d-d202-4ae7-af76-8f37f5bbeec5',
    parentGroupingId: 'e9f8f89c-609c-4c83-8ebc-cea928af661e'
  })
  .then((grouping) => console.log(grouping))
  .catch((err) => console.log(err));
```
<a name="FacilityGroupings+delete"></a>

### contxtSdk.facilities.groupings.delete(facilityGroupingId) ⇒ <code>Promise</code>
Delete a facility groupings

API Endpoint: '/groupings/:facilityGroupingId'
Method: DELETE

**Kind**: instance method of [<code>FacilityGroupings</code>](#FacilityGroupings)  
**Fulfill**: <code>undefined</code>  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| facilityGroupingId | <code>string</code> | The id of the facility grouping (formatted as a UUID) |

**Example**  
```js
contxtSdk.facilities.groupings.delete(
  'e4fec739-56aa-4b50-8dab-e9d6b9c91a5d'
);
```
<a name="FacilityGroupings+getAll"></a>

### contxtSdk.facilities.groupings.getAll() ⇒ <code>Promise</code>
Get a listing of all facility groupings available to a user. Includes public groupings across
any organization the user has access to and the user's private groupings.

API Endpoint: '/groupings'
Method: GET

**Kind**: instance method of [<code>FacilityGroupings</code>](#FacilityGroupings)  
**Fulfill**: <code>FacilityGrouping[]</code>  
**Reject**: <code>Error</code>  
**Example**  
```js
contxtSdk.facilites.groupings
  .getAll()
  .then((groupings) => console.log(groupings))
  .catch((err) => console.log(err));
```
<a name="FacilityGroupings+getAllByOrganizationId"></a>

### contxtSdk.facilities.groupings.getAllByOrganizationId(organizationId) ⇒ <code>Promise</code>
Get a listing of all facility groupings for an organization. Includes public groupings
across that specific organization and the user's private groupings for that organization.

API Endpoint: '/organizations/:organizationId/groupings'
Method: GET

**Kind**: instance method of [<code>FacilityGroupings</code>](#FacilityGroupings)  
**Fulfill**: <code>FacilityGrouping[]</code>  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| organizationId | <code>string</code> | UUID corresponding with an organization |

**Example**  
```js
contxtSdk.facilites.groupings
  .getAllByOrganizationId('349dbd36-5dca-4a10-b54d-d0f71c3c8709')
  .then((groupings) => console.log(groupings))
  .catch((err) => console.log(err));
```
<a name="FacilityGroupings+removeFacility"></a>

### contxtSdk.facilities.groupings.removeFacility(facilityGroupingId, facilityId) ⇒ <code>Promise</code>
Removes a facility from a facility grouping

API Endpoint: '/groupings/:facilityGroupingId/facilities/:facilityId'
Method: DELETE

**Kind**: instance method of [<code>FacilityGroupings</code>](#FacilityGroupings)  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| facilityGroupingId | <code>string</code> | UUID corresponding with a facility grouping |
| facilityId | <code>number</code> |  |

**Example**  
```js
contxtSdk.facilities.groupings
  .removeFacility('b3dbaae3-25dd-475b-80dc-66296630a8d0', 4)
  .catch((err) => console.log(err));
```
<a name="FacilityGroupings+update"></a>

### contxtSdk.facilities.groupings.update(facilityGroupingId, update) ⇒ <code>Promise</code>
Updates an existing facility grouping

API Endpoint: '/groupings/:facilityGroupingId'
Method: PUT

**Kind**: instance method of [<code>FacilityGroupings</code>](#FacilityGroupings)  
**Fulfill**: [<code>FacilityGrouping</code>](./Typedefs.md#FacilityGrouping) Information about the updated facility grouping  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| facilityGroupingId | <code>String</code> |  |
| update | <code>Object</code> |  |
| [update.description] | <code>string</code> |  |
| [update.isPrivate] | <code>boolean</code> |  |
| [update.name] | <code>string</code> |  |
| [update.parentGroupingId] | <code>string</code> | UUID corresponding with another facility grouping |

**Example**  
```js
contxtSdk.facilities.groupings
  .update('b3dbaae3-25dd-475b-80dc-66296630a8d0', {
    description: 'US States of CT, MA, ME, NH, RI, VT',
    isPrivate: false,
    name: 'New England, USA',
    parentGroupingId: 'e9f8f89c-609c-4c83-8ebc-cea928af661e'
  })
  .then((grouping) => console.log(grouping))
  .catch((err) => console.log(err));
```

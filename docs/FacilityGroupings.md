<a name="FacilityGroupings"></a>

## FacilityGroupings
Module that provides access to facility groupings, and helps manage
the relationship between those groupings and facilities

**Kind**: global class  

* [FacilityGroupings](#FacilityGroupings)
    * [new FacilityGroupings(sdk, request, baseUrl)](#new_FacilityGroupings_new)
    * [.addFacility(facilityGroupingId, facilityId)](#FacilityGroupings+addFacility) ⇒ <code>Promise</code>
    * [.create(facilityGrouping)](#FacilityGroupings+create) ⇒ <code>Promise</code>

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
contxtSdk.facilities.groupings.addFacility('b3dbaae3-25dd-475b-80dc-66296630a8d0', 4)
  .then((grouping) => console.log(grouping));
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
    organization_id: '61f5fe1d-d202-4ae7-af76-8f37f5bbeec5'
    parent_grouping_id: 'e9f8f89c-609c-4c83-8ebc-cea928af661e'
  })
  .then((grouping) => console.log(grouping));
  .catch((err) => console.log(err));
```

<a name="Facilities"></a>

## Facilities
Module that provides access to, and the manipulation
of, information about different facilities

**Kind**: global class  

* [Facilities](#Facilities)
    * [new Facilities(sdk, request)](#new_Facilities_new)
    * [.get(facilityId)](#Facilities+get) ⇒ <code>Promise</code>
    * [.getAllByOrganizationId(organizationId, [options])](#Facilities+getAllByOrganizationId) ⇒ <code>Promise</code>

<a name="new_Facilities_new"></a>

### new Facilities(sdk, request)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>Object</code> | An instance of the SDK so the module can communicate with other modules |
| request | <code>Object</code> | An instance of the request module tied to this module's audience. |

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
<a name="Facilities+getAllByOrganizationId"></a>

### contxtSdk.facilities.getAllByOrganizationId(organizationId, [options]) ⇒ <code>Promise</code>
Gets a list of all facilities that belong to a particular organization

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

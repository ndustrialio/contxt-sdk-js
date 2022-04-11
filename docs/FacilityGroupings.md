<a name="FacilityGroupings"></a>

## FacilityGroupings
Module that provides access to facility groupings, and helps manage
the relationship between those groupings and facilities

**Kind**: global class  

* [FacilityGroupings](#FacilityGroupings)
    * [new FacilityGroupings(sdk, request, baseUrl)](#new_FacilityGroupings_new)
    * [.getAllByOrganizationId(organizationId)](#FacilityGroupings+getAllByOrganizationId) ⇒ <code>Promise</code>

<a name="new_FacilityGroupings_new"></a>

### new FacilityGroupings(sdk, request, baseUrl)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>Object</code> | An instance of the SDK so the module can communicate with other modules |
| request | <code>Object</code> | An instance of the request module tied to this module's audience. |
| baseUrl | <code>string</code> | The base URL provided by the parent module |

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

<a name="CostCenters"></a>

## CostCenters

**Kind**: global class

* [CostCenters](#CostCenters)
  * [new CostCenters(sdk, request, baseUrl)](#new_CostCenters_new)
  * [.addFacility(costCenterId, facilityId)](#CostCenters+addFacility) ⇒ <code>Promise</code>
  * [.create(costCenter)](#CostCenters+create) ⇒ <code>Promise</code>
  * [.getAll()](#CostCenters+getAll) ⇒ <code>Promise</code>

<a name="new_CostCenters_new"></a>

### new CostCenters(sdk, request, baseUrl)

| Param   | Type                | Description                                                             |
| ------- | ------------------- | ----------------------------------------------------------------------- |
| sdk     | <code>Object</code> | An instance of the SDK so the module can communicate with other modules |
| request | <code>Object</code> | An instance of the request module tied to this module's audience.       |
| baseUrl | <code>string</code> | The base URL provided by the parent module                              |

<a name="CostCenters+addFacility"></a>

### costCenters.addFacility(costCenterId, facilityId) ⇒ <code>Promise</code>

Adds a facility to a cost center

API Endpoint: '/costcenters/:costCenterId/facilities/:facilityId'
Method: POST

**Kind**: instance method of [<code>CostCenters</code>](#CostCenters)  
**Fulfill**: [<code>CostCenterFacility</code>](./Typedefs.md#CostCenterFacility) Information about the new cost center facility relationship  
**Reject**: <code>Error</code>

| Param        | Type                | Description                                    |
| ------------ | ------------------- | ---------------------------------------------- |
| costCenterId | <code>string</code> | UUID corresponding with a cost center facility |
| facilityId   | <code>number</code> | The ID of a facility                           |

**Example**

```js
contxtSdk.facilities.costCenters
  .addFacility('b3dbaae3-25dd-475b-80dc-66296630a8d0', 4)
  .then((costCenter) => console.log(costCenter))
  .catch((err) => console.log(err));
```

<a name="CostCenters+create"></a>

### costCenters.create(costCenter) ⇒ <code>Promise</code>

Creates a new cost center

API Endpoint: '/costcenters'
Method: POST

**Kind**: instance method of [<code>CostCenters</code>](#CostCenters)  
**Fulfill**: [<code>CostCenter</code>](./Typedefs.md#CostCenter) Information about the new cost center  
**Reject**: <code>Error</code>

| Param                     | Type                | Description |
| ------------------------- | ------------------- | ----------- |
| costCenter                | <code>Object</code> |             |
| costCenter.description    | <code>string</code> |             |
| costCenter.name           | <code>string</code> |             |
| costCenter.organizationId | <code>string</code> | UUID        |

**Example**

```js
contxtSdk.facilities.costCenters
  .create({
    decsription: 'Cost center number 1',
    name: 'North Carolina, USA',
    organizationId: '61f5fe1d-d202-4ae7-af76-8f37f5bbeec5'
  })
  .then((costCenter) => console.log(costCenter))
  .catch((err) => console.log(err));
```

<a name="CostCenters+getAll"></a>

### costCenters.getAll() ⇒ <code>Promise</code>

Get a listing of all cost centers

API Endpoint: '/costcenters'
METHOD: GET

**Kind**: instance method of [<code>CostCenters</code>](#CostCenters)  
**Fulfill**: <code>CostCenter[]</code>  
**Reject**: <code>Error</code>  
**Example**

```js
contxtSdk.facilities.costCenters
  .getAll()
  .then((costCenters) => console.log(costCenters))
  .catch((err) => console.log(err));
```

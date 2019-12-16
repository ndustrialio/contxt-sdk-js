<a name="Health"></a>

## Health
Module that provides access to the Contxt Health Service

**Kind**: global class  

* [Health](#Health)
    * [new Health(sdk, request, [organizationId])](#new_Health_new)
    * [.status](#Health+status) : <code>enum</code>
    * [.getAll(options, [paginationOptions])](#Health+getAll) ⇒ <code>Promise</code>
    * [.getByAssetId(options, [paginationOptions])](#Health+getByAssetId) ⇒ <code>Promise</code>
    * [.post(options)](#Health+post) ⇒ <code>Promise</code>

<a name="new_Health_new"></a>

### new Health(sdk, request, [organizationId])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| sdk | <code>Object</code> |  | An instance of the SDK so the module can communicate with other modules |
| request | <code>Object</code> |  | An instance of the request module tied to this module's audience. |
| [organizationId] | <code>string</code> | <code>null</code> | The organization ID to be used in tenant url requests |

<a name="Health+status"></a>

### contxtSdk.health.status : <code>enum</code>
The health status option constants

**Kind**: instance enum of [<code>Health</code>](#Health)  
**Example**  
```js
console.log(Health.GOOD) //healthy
console.log(Health.BAD) //unhealthy
```
<a name="Health+getAll"></a>

### contxtSdk.health.getAll(options, [paginationOptions]) ⇒ <code>Promise</code>
Gets all of an organization's assets and their most recent health status

API Endpoint: '/:organizationId/assets'
Method: GET

**Kind**: instance method of [<code>Health</code>](#Health)  
**Fulfill**: [<code>HealthAssetPaginatedResponse</code>](./Typedefs.md#HealthAssetPaginatedResponse) Information about all contxt applications  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> |  |
| [options.organizationId] | <code>string</code> | The organization id that owns the assets. Required if an organization id isn't set on the module instance. |
| [paginationOptions] | [<code>PaginationOptions</code>](./Typedefs.md#PaginationOptions) |  |

**Example**  
```js
contxtSdk.health
  .getAll({
     organizationId: 'bd900b6e-a319-492f-aa95-9715891b9a83'
   }, {
     limit: 50,
     offset: 100
  })
  .then((healthAssetRecords) => console.log(healthAssetRecords))
  .catch((err) => console.log(err));
```
<a name="Health+getByAssetId"></a>

### contxtSdk.health.getByAssetId(options, [paginationOptions]) ⇒ <code>Promise</code>
Gets a list of health statuses for a single asset

API Endpoint: '/:organizationId/assets/:assetId'
Method: GET

**Kind**: instance method of [<code>Health</code>](#Health)  
**Fulfill**: [<code>HealthStatusPaginatedResponse</code>](./Typedefs.md#HealthStatusPaginatedResponse) Information about all contxt applications  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> |  |
| options.assetId | <code>string</code> | The asset id to get the health for |
| [options.organizationId] | <code>string</code> | The organization id that owns the assets. Required if an organization id isn't set on the module instance. |
| [paginationOptions] | [<code>PaginationOptions</code>](./Typedefs.md#PaginationOptions) |  |

**Example**  
```js
contxtSdk.health
  .getByAssetId({
     assetId: '9859f22d-cc45-4015-8674-1671f54d1888',
     organizationId: 'bd900b6e-a319-492f-aa95-9715891b9a83'
  }, {
     limit: 50,
     offset: 100
  })
  .then((healthStatusRecords) => console.log(healthStatusRecords))
  .catch((err) => console.log(err));
```
<a name="Health+post"></a>

### contxtSdk.health.post(options) ⇒ <code>Promise</code>
Creates a new health status entry for an asset

API Endpoint: '/:organizationId/assets/:assetId'
Method: POST

**Kind**: instance method of [<code>Health</code>](#Health)  
**Fulfill**: [<code>HealthStatusPaginatedResponse</code>](./Typedefs.md#HealthStatusPaginatedResponse) Information about all contxt applications  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> |  |
| options.assetId | <code>string</code> | The asset id to get the health for |
| [options.organizationId] | <code>string</code> | The organization id that owns the assets. Required if an organization id isn't set on the module instance. |
| options.status | <code>string</code> | The health of the asset. One of type Health.status.GOOD or Health.status.BAD |
| [options.timestamp] | <code>string</code> | Defaults to now. ISO 8601 Extended Format date/time string |

**Example**  
```js
contxtSdk.health
  .post({
     assetId: '9859f22d-cc45-4015-8674-1671f54d1888',
     organizationId: 'bd900b6e-a319-492f-aa95-9715891b9a83',
     status: contxtSdk.health.status.GOOD
  })
  .then((healthStatus) => console.log(healthStatus))
  .catch((err) => console.log(err));
```

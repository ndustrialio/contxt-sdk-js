<a name="AssetMetrics"></a>

## AssetMetrics
Module that provides access to, and the manipulation of, information about different asset metrics

**Kind**: global class  

* [AssetMetrics](#AssetMetrics)
    * [new AssetMetrics(sdk, request, baseUrl)](#new_AssetMetrics_new)
    * [.create(assetTypeId, assetMetric)](#AssetMetrics+create) ⇒ <code>Promise</code>
    * [.delete(assetMetricId)](#AssetMetrics+delete) ⇒ <code>Promise</code>
    * [.get(assetMetricId)](#AssetMetrics+get) ⇒ <code>Promise</code>
    * [.getAll(assetTypeId, [paginationOptions])](#AssetMetrics+getAll) ⇒ <code>Promise</code>
    * [.update(assetMetricId, update)](#AssetMetrics+update) ⇒ <code>Promise</code>

<a name="new_AssetMetrics_new"></a>

### new AssetMetrics(sdk, request, baseUrl)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>Object</code> | An instance of the SDK so the module can communicate with other modules. |
| request | <code>Object</code> | An instance of the request module tied to this module's audience. |
| baseUrl | <code>string</code> | The base URL provided by the parent module |

<a name="AssetMetrics+create"></a>

### contxtSdk.assets.metrics.create(assetTypeId, assetMetric) ⇒ <code>Promise</code>
Creates a new asset metric

API Endpoint: '/assets/types/:assetTypeId/metrics'
Method: POST

**Kind**: instance method of [<code>AssetMetrics</code>](#AssetMetrics)  
**Fulfill**: [<code>AssetMetric</code>](./Typedefs.md#AssetMetric) Information about the new asset metric  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| assetTypeId | <code>string</code> | The UUID formatted ID of the asset type |
| assetMetric | <code>Object</code> |  |
| assetMetric.description | <code>string</code> |  |
| assetMetric.label | <code>string</code> |  |
| assetMetric.organizationId | <code>string</code> | Organization ID (UUID) to which the metric belongs |
| assetMetric.timeInterval | <code>string</code> | Options are "hourly", "daily", "weekly", "monthly", "yearly" |
| [assetMetric.units] | <code>string</code> | Units of the metric |

**Example**  
```js
contxtSdk.assets.metrics
  .create('4f0e51c6-728b-4892-9863-6d002e61204d', {
    description: 'Number of injuries which occur in the facility each month',
    label: 'Facility Injuries',
    organizationId: 'b47e45af-3e18-408a-8070-008f9e6d7b42',
    timeInterval: 'monthly',
    units: 'injuries'
  })
  .then((assetMetric) => console.log(assetMetric))
  .catch((err) => console.log(err));
```
<a name="AssetMetrics+delete"></a>

### contxtSdk.assets.metrics.delete(assetMetricId) ⇒ <code>Promise</code>
Deletes an asset metric

API Endpoint: '/assets/metrics/:assetMetricId'
Method: DELETE

**Kind**: instance method of [<code>AssetMetrics</code>](#AssetMetrics)  
**Fulfill**: <code>undefined</code>  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| assetMetricId | <code>string</code> | The UUID formatted ID of the asset metric |

**Example**  
```js
contxtSdk.assets.metrics.delete('4f0e51c6-728b-4892-9863-6d002e61204d')
```
<a name="AssetMetrics+get"></a>

### contxtSdk.assets.metrics.get(assetMetricId) ⇒ <code>Promise</code>
Gets information about an asset metric

API Endpoint: '/assets/metrics/:assetMetricId'
Method: GET

**Kind**: instance method of [<code>AssetMetrics</code>](#AssetMetrics)  
**Fulfill**: [<code>AssetMetric</code>](./Typedefs.md#AssetMetric) Information about the asset metric  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| assetMetricId | <code>string</code> | The UUID formatted ID of the asset metric |

**Example**  
```js
contxtSdk.assets.metrics
  .get('4f0e51c6-728b-4892-9863-6d002e61204d')
  .then((assetMetric) => console.log(assetMetric))
  .catch((err) => console.log(err));
```
<a name="AssetMetrics+getAll"></a>

### contxtSdk.assets.metrics.getAll(assetTypeId, [paginationOptions]) ⇒ <code>Promise</code>
Gets a list of all asset metrics that belong to a given type

API Endpoint: '/assets/types/:assetTypeId/metrics
Method: GET

**Kind**: instance method of [<code>AssetMetrics</code>](#AssetMetrics)  
**Fulfill**: [<code>AssetMetricsFromServer</code>](./Typedefs.md#AssetMetricsFromServer)  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| assetTypeId | <code>string</code> | The UUID formatted ID of the asset type |
| [paginationOptions] | [<code>PaginationOptions</code>](./Typedefs.md#PaginationOptions) |  |

**Example**  
```js
contxtSdk.assets.metrics
  .getAll('4f0e51c6-728b-4892-9863-6d002e61204d')
  .then((assetMetrics) => console.log(assetMetrics))
  .catch((err) => console.log(err));
```
<a name="AssetMetrics+update"></a>

### contxtSdk.assets.metrics.update(assetMetricId, update) ⇒ <code>Promise</code>
Updates an asset metric's data

API Endpoint: '/assets/metrics/:assetMetricId'
Method: PUT

**Kind**: instance method of [<code>AssetMetrics</code>](#AssetMetrics)  
**Fulfill**: <code>undefined</code>  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| assetMetricId | <code>string</code> | The ID of the asset metric to update (formatted as a UUID) |
| update | <code>Object</code> | An object containing the updated data for the asset metric |
| [update.description] | <code>string</code> |  |
| [update.label] | <code>string</code> |  |
| [update.timeInterval] | <code>string</code> |  |
| [update.units] | <code>string</code> |  |

**Example**  
```js
contxtSdk.assets.metrics
  .update('5f310899-d8f9-4dac-ae82-cedb2048a8ef', {
    description: 'An updated description of this metric'
  });
```

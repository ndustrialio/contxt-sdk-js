<a name="AssetMetrics"></a>

## AssetMetrics
Module that provides access to, and the manipulation of, information about different asset metrics

**Kind**: global class  

* [AssetMetrics](#AssetMetrics)
    * [new AssetMetrics(sdk, request, baseUrl)](#new_AssetMetrics_new)
    * [.create(assetTypeId, assetMetric)](#AssetMetrics+create) ⇒ <code>Promise</code>
    * [.delete(assetMetricId)](#AssetMetrics+delete) ⇒ <code>Promise</code>
    * [.get(assetMetricId)](#AssetMetrics+get) ⇒ <code>Promise</code>
    * [.getByAssetId(assetId, [assetMetricsFilters])](#AssetMetrics+getByAssetId) ⇒ <code>Promise</code>
    * [.getByAssetTypeId(assetTypeId, [assetMetricsFilters])](#AssetMetrics+getByAssetTypeId) ⇒ <code>Promise</code>
    * [.update(assetMetricId, update)](#AssetMetrics+update) ⇒ <code>Promise</code>
    * [.createValue(assetId, assetMetricValue)](#AssetMetrics+createValue) ⇒ <code>Promise</code>
    * [.deleteValue(assetMetricValueId)](#AssetMetrics+deleteValue) ⇒ <code>Promise</code>
    * [.getValuesByAssetId(assetId, [assetMetricValuesFilters])](#AssetMetrics+getValuesByAssetId) ⇒ <code>Promise</code>
    * [.getValuesByMetricId(assetId, assetMetricId, [assetMetricValuesFilters])](#AssetMetrics+getValuesByMetricId) ⇒ <code>Promise</code>
    * [.updateValue(assetMetricValueId, update)](#AssetMetrics+updateValue) ⇒ <code>Promise</code>

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
contxtSdk.assets.metrics.delete('4f0e51c6-728b-4892-9863-6d002e61204d');
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
<a name="AssetMetrics+getByAssetId"></a>

### contxtSdk.assets.metrics.getByAssetId(assetId, [assetMetricsFilters]) ⇒ <code>Promise</code>
Gets a list of all asset metrics that belong to a given asset

API Endpoint: '/assets/:assetId/metrics
Method: GET

**Kind**: instance method of [<code>AssetMetrics</code>](#AssetMetrics)  
**Fulfill**: [<code>AssetMetricsFromServer</code>](./Typedefs.md#AssetMetricsFromServer)  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| assetId | <code>string</code> | The UUID formatted ID of the asset type |
| [assetMetricsFilters] | <code>Object</code> | Specific information that is used to   filter the list of asset metrics |
| [assetMetricsFilters.assetMetricLabel] | <code>String</code> | The label of the   associated asset metrics |
| [assetMetricsFilters.limit] | <code>Number</code> | Maximum number of records to   return per query |
| [assetMetricsFilters.offset] | <code>Number</code> | How many records from the first   record to start the query |

**Example**  
```js
contxtSdk.assets.metrics
  .getByAssetId(
    'f3be81fd-4494-443b-87a3-320b1c9aa495',
     {
       assetMetricLabel: 'Square Footage',
       limit: 50,
       offset: 150
     }
   )
  .then((assetMetricData) => console.log(assetMetricData))
  .catch((err) => console.log(err));
```
<a name="AssetMetrics+getByAssetTypeId"></a>

### contxtSdk.assets.metrics.getByAssetTypeId(assetTypeId, [assetMetricsFilters]) ⇒ <code>Promise</code>
Gets a list of all asset metrics that belong to a given type

API Endpoint: '/assets/types/:assetTypeId/metrics
Method: GET

**Kind**: instance method of [<code>AssetMetrics</code>](#AssetMetrics)  
**Fulfill**: [<code>AssetMetricsFromServer</code>](./Typedefs.md#AssetMetricsFromServer)  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| assetTypeId | <code>string</code> | The UUID formatted ID of the asset type |
| [assetMetricsFilters] | <code>Object</code> | Specific information that is used to   filter the list of asset metrics |
| [assetMetricsFilters.limit] | <code>Number</code> | Maximum number of records to   return per query |
| [assetMetricsFilters.offset] | <code>Number</code> | How many records from the first   record to start the query |
| [assetMetricsFilters.organizationId] | <code>String</code> | The UUID formatted ID   of the organization to filter asset metrics by |

**Example**  
```js
contxtSdk.assets.metrics
  .getByAssetTypeId(
    '4f0e51c6-728b-4892-9863-6d002e61204d'
     {
       limit: 50,
       offset: 150
     }
   )
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
<a name="AssetMetrics+createValue"></a>

### contxtSdk.assets.metrics.createValue(assetId, assetMetricValue) ⇒ <code>Promise</code>
Creates a new asset metric value

API Endpoint: '/assets/:assetId/metrics/:assetMetricId/values'
Method: POST

**Kind**: instance method of [<code>AssetMetrics</code>](#AssetMetrics)  
**Fulfill**: [<code>AssetMetricValue</code>](./Typedefs.md#AssetMetricValue)  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| assetId | <code>string</code> | The ID of the asset (formatted as a UUID) |
| assetMetricValue | <code>Object</code> |  |
| assetMetricValue.assetMetricId | <code>string</code> | UUID corresponding to the asset metric |
| assetMetricValue.effectiveEndDate | <code>string</code> | ISO 8601 Extended Format date/time string |
| assetMetricValue.effectiveStartDate | <code>string</code> | ISO 8601 Extended Format date/time string |
| [assetMetricValue.notes] | <code>string</code> |  |
| assetMetricValue.value | <code>string</code> |  |

**Example**  
```js
contxtSdk.assets.metrics
  .createValue('1140cc2e-6d13-42ee-9941-487fe98f8e2d', {
     assetMetricId: 'cca11baa-cf7d-44c0-9d0a-6ad73d5f30cb',
     effectiveEndDate: '2018-08-28T18:18:18.264Z',
     effectiveStartDate: '2018-08-27T18:18:03.175Z',
     notes: 'Iure delectus non sunt a voluptates pariatur fuga.',
     value: '2000'
   })
   .then((newAssetMetricValue) => {
     console.log(newAssetMetricValue);
   })
   .catch((error) => {
     console.error(error);
   });
```
<a name="AssetMetrics+deleteValue"></a>

### contxtSdk.assets.metrics.deleteValue(assetMetricValueId) ⇒ <code>Promise</code>
Deletes an asset metric value

API Endpoint: '/assets/metrics/values/:assetMetricValueId'
Method: DELETE

**Kind**: instance method of [<code>AssetMetrics</code>](#AssetMetrics)  
**Fulfill**: <code>undefined</code>  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| assetMetricValueId | <code>string</code> | The ID of the asset metric value (formatted as a UUID) |

**Example**  
```js
contxtSdk.assets.metrics.deleteValue(
  'f4cd0d84-6c61-4d19-9322-7c1ab226dc83'
);
```
<a name="AssetMetrics+getValuesByAssetId"></a>

### contxtSdk.assets.metrics.getValuesByAssetId(assetId, [assetMetricValuesFilters]) ⇒ <code>Promise</code>
Gets asset metric values for a particular asset

API Endpoint: '/assets/:assetId/metrics/values'
Method: GET

**Kind**: instance method of [<code>AssetMetrics</code>](#AssetMetrics)  
**Fulfill**: [<code>AssetMetricValuesFromServer</code>](./Typedefs.md#AssetMetricValuesFromServer)  
**Rejects**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| assetId | <code>String</code> | The ID of the asset (formatted as a UUID) |
| [assetMetricValuesFilters] | <code>Object</code> | Specific information that is   used to filter the list of asset metric values |
| [assetMetricValuesFilters.assetMetricLabel] | <code>String</code> | The label of   the associated asset metrics |
| [assetMetricValuesFilters.effectiveEndDate] | <code>String</code> | Effective end   date (ISO 8601 Extended formatted) of the asset metric values |
| [assetMetricValuesFilters.effectiveStartDate] | <code>String</code> | Effective   start date (ISO 8601 Extended formatted) of the asset metric values |
| [assetMetricValuesFilters.limit] | <code>Number</code> | Maximum number of records   to return per query |
| [assetMetricValuesFilters.offset] | <code>Number</code> | How many records from the   first record to start the query |

**Example**  
```js
contxtSdk.assets.metrics
  .getValuesByAssetId(
     'f9c606f3-d270-4623-bf3b-b085424d9a8b',
     {
       assetMetricLabel: 'Square Footage',
       effectiveEndDate: '2018-04-13T15:44:51.943Z'
       effectiveStartDate: '2017-12-13T15:42:01.376Z'
       limit: 10,
       offset: 200
     }
   )
  .then((assetMetricValuesData) => console.log(assetMetricValuesData))
  .catch((err) => console.log(err));
```
<a name="AssetMetrics+getValuesByMetricId"></a>

### contxtSdk.assets.metrics.getValuesByMetricId(assetId, assetMetricId, [assetMetricValuesFilters]) ⇒ <code>Promise</code>
Gets asset metric values for a particular asset and metric

API Endpoint: '/assets/:assetId/metrics/:assetMetricId/values'
Method: GET

**Kind**: instance method of [<code>AssetMetrics</code>](#AssetMetrics)  
**Fulfill**: [<code>AssetMetricValuesFromServer</code>](./Typedefs.md#AssetMetricValuesFromServer)  
**Rejects**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| assetId | <code>String</code> | The ID of the asset (formatted as a UUID) |
| assetMetricId | <code>String</code> | The ID of the asset metric (formatted as a   UUID) |
| [assetMetricValuesFilters] | <code>Object</code> | Specific information that is   used to filter the list of asset metric values |
| [assetMetricValuesFilters.effectiveEndDate] | <code>String</code> | Effective end   date (ISO 8601 Extended formatted) of the asset metric values |
| [assetMetricValuesFilters.effectiveStartDate] | <code>String</code> | Effective   start date (ISO 8601 Extended formatted) of the asset metric values |
| [assetMetricValuesFilters.limit] | <code>Number</code> | Maximum number of records   to return per query |
| [assetMetricValuesFilters.offset] | <code>Number</code> | How many records from the   first record to start the query |

**Example**  
```js
contxtSdk.assets.metrics
  .getValuesByMetricId(
     'd7329ef3-ca63-4ad5-bb3e-632b702584f8',
     'a1329ef3-ca63-4ad5-bb3e-632b702584f8',
     {
       limit: 10,
       effectiveStartDate: '2018-07-11T19:14:49.715Z'
     }
   )
  .then((assetMetricValuesData) => {
    console.log(assetMetricValuesData);
  })
  .catch((err) => console.log(err));
```
<a name="AssetMetrics+updateValue"></a>

### contxtSdk.assets.metrics.updateValue(assetMetricValueId, update) ⇒ <code>Promise</code>
Updates an asset metric value

API Endpoint: '/assets/metrics/values/:assetMetricValueId'
Method: PUT

**Kind**: instance method of [<code>AssetMetrics</code>](#AssetMetrics)  
**Fulfill**: <code>undefined</code>  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| assetMetricValueId | <code>string</code> | The ID of the asset metric value to update (formatted as a UUID) |
| update | <code>Object</code> | An object containing the updated data for the asset metric value |
| [update.effectiveEndDate] | <code>string</code> | ISO 8601 Extended Format date/time string |
| [update.effectiveStartDate] | <code>string</code> | ISO 8601 Extended Format date/time string |
| [update.notes] | <code>string</code> |  |
| [update.value] | <code>string</code> |  |

**Example**  
```js
contxtSdk.assets.metrics
  .updateValue('2140cc2e-6d13-42ee-9941-487fe98f8e2d', {
    effectiveEndDate: '2018-07-10T11:04:24.631Z',
    notes: 'Dolores et sapiente sunt doloribus aut in.',
    value: '61456'
  })
  .catch((err) => console.log(err));
```

<a name="AssetAttributes"></a>

## AssetAttributes
Module that provides access to, and the manipulation of, information about
different asset attributes and their values

**Kind**: global class  

* [AssetAttributes](#AssetAttributes)
    * [new AssetAttributes(sdk, request, baseUrl)](#new_AssetAttributes_new)
    * [.create(assetTypeId, assetAttribute)](#AssetAttributes+create) ⇒ <code>Promise</code>
    * [.delete(assetAttributeId)](#AssetAttributes+delete) ⇒ <code>Promise</code>
    * [.get(assetAttributeId)](#AssetAttributes+get) ⇒ <code>Promise</code>
    * [.getAll(assetTypeId, [paginationOptions])](#AssetAttributes+getAll) ⇒ <code>Promise</code>
    * [.update(assetAttributeId, update)](#AssetAttributes+update) ⇒ <code>Promise</code>
    * [.createValue(assetId, assetAttributeValue)](#AssetAttributes+createValue) ⇒ <code>Promise</code>
    * [.deleteValue(assetAttributeValueId)](#AssetAttributes+deleteValue) ⇒ <code>Promise</code>
    * [.getEffectiveValuesByAssetId(assetId, [assetAttributeFilters])](#AssetAttributes+getEffectiveValuesByAssetId) ⇒ <code>Promise</code>
    * [.getEffectiveValuesByOrganizationId(organizationId, [paginationOptions])](#AssetAttributes+getEffectiveValuesByOrganizationId) ⇒ <code>Promise</code>
    * [.getValuesByAttributeId(assetId, assetAttributeId, [paginationOptions])](#AssetAttributes+getValuesByAttributeId) ⇒ <code>Promise</code>
    * [.updateValue(assetAttributeId, update)](#AssetAttributes+updateValue) ⇒ <code>Promise</code>

<a name="new_AssetAttributes_new"></a>

### new AssetAttributes(sdk, request, baseUrl)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>Object</code> | An instance of the SDK so the module can communicate with other modules. |
| request | <code>Object</code> | An instance of the request module tied to this module's audience. |
| baseUrl | <code>string</code> | The base URL provided by the parent module |

<a name="AssetAttributes+create"></a>

### contxtSdk.assets.attributes.create(assetTypeId, assetAttribute) ⇒ <code>Promise</code>
Creates a new asset attribute

API Endpoint: '/assets/types/:assetTypeId/attributes'
Method: POST

**Kind**: instance method of [<code>AssetAttributes</code>](#AssetAttributes)  
**Fulfill**: [<code>AssetAttribute</code>](./Typedefs.md#AssetAttribute)  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| assetTypeId | <code>string</code> | The ID of the asset type (formatted as a UUID) |
| assetAttribute | <code>Object</code> |  |
| assetAttribute.dataType | <code>string</code> |  |
| assetAttribute.description | <code>string</code> |  |
| [assetAttribute.isRequired] | <code>boolean</code> |  |
| assetAttribute.label | <code>string</code> |  |
| assetAttribute.organizationId | <code>string</code> | Can be explicitly set to `null` to create a global attribute |
| [assetAttribute.units] | <code>string</code> |  |

**Example**  
```js
contxtSdk.assets.attributes
  .create('4f0e51c6-728b-4892-9863-6d002e61204d', {
    dataType: 'boolean',
    description: 'Square footage of a facility',
    isRequired: true,
    label: 'Square Footage',
    organizationId: 'b47e45af-3e18-408a-8070-008f9e6d7b42',
    units: 'sqft'
  })
  .then((assetAttribute) => console.log(assetAttribute))
  .catch((err) => console.log(err));
```
<a name="AssetAttributes+delete"></a>

### contxtSdk.assets.attributes.delete(assetAttributeId) ⇒ <code>Promise</code>
Deletes an asset attribute

API Endpoint: '/assets/attributes/:assetAttributeId'
Method: DELETE

**Kind**: instance method of [<code>AssetAttributes</code>](#AssetAttributes)  
**Fulfill**: <code>undefined</code>  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| assetAttributeId | <code>string</code> | The ID of the asset attribute (formatted as a UUID) |

**Example**  
```js
contxtSdk.assets.attributes.delete('c7f927c3-11a7-4024-9269-e1231baeb765');
```
<a name="AssetAttributes+get"></a>

### contxtSdk.assets.attributes.get(assetAttributeId) ⇒ <code>Promise</code>
Gets information about an asset attribute

API Endpoint: '/assets/attributes/:assetAttributeId'
Method: GET

**Kind**: instance method of [<code>AssetAttributes</code>](#AssetAttributes)  
**Fulfill**: [<code>AssetAttribute</code>](./Typedefs.md#AssetAttribute)  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| assetAttributeId | <code>string</code> | The ID of the asset attribute (formatted as a UUID) |

**Example**  
```js
contxtSdk.assets.attributes
  .get('c7f927c3-11a7-4024-9269-e1231baeb765')
  .then((assetAttribute) => console.log(assetAttribute))
  .catch((err) => console.log(err));
```
<a name="AssetAttributes+getAll"></a>

### contxtSdk.assets.attributes.getAll(assetTypeId, [paginationOptions]) ⇒ <code>Promise</code>
Gets a list of asset attributes for a specific asset type

API Endpoint: '/assets/types/:assetTypeId/attributes'
Method: GET

**Kind**: instance method of [<code>AssetAttributes</code>](#AssetAttributes)  
**Fulfill**: [<code>AssetAttributeData</code>](./Typedefs.md#AssetAttributeData)  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| assetTypeId | <code>string</code> | The ID of the asset type (formatted as a UUID) |
| [paginationOptions] | [<code>PaginationOptions</code>](./Typedefs.md#PaginationOptions) |  |

**Example**  
```js
contxtSdk.assets.attributes
  .getAll('4f0e51c6-728b-4892-9863-6d002e61204d')
  .then((assetAttributesData) => console.log(assetAttributesData))
  .catch((err) => console.log(err));
```
<a name="AssetAttributes+update"></a>

### contxtSdk.assets.attributes.update(assetAttributeId, update) ⇒ <code>Promise</code>
Updates an asset attribute

API Endpoint: '/assets/attributes/:assetAttributeId'
Method: PUT

**Kind**: instance method of [<code>AssetAttributes</code>](#AssetAttributes)  
**Fulfill**: <code>undefined</code>  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| assetAttributeId | <code>string</code> | The ID of the asset attribute to update (formatted as a UUID) |
| update | <code>Object</code> | An object containing the updated data for the asset attribute |
| [update.dataType] | <code>string</code> |  |
| [update.description] | <code>string</code> |  |
| [update.isRequired] | <code>boolean</code> |  |
| [update.label] | <code>string</code> |  |
| [update.units] | <code>string</code> |  |

**Example**  
```js
contxtSdk.assets.attributes
  .update('c7f927c3-11a7-4024-9269-e1231baeb765', {
    dataType: 'boolean',
    description: 'Temperature of a facility',
    isRequired: false,
    label: 'Temperature',
    units: 'Celsius'
  });
```
<a name="AssetAttributes+createValue"></a>

### contxtSdk.assets.attributes.createValue(assetId, assetAttributeValue) ⇒ <code>Promise</code>
Creates a new asset attribute value

API Endpoint: '/assets/:assetId/attributes/:assetAttributeId/values'
Method: POST

**Kind**: instance method of [<code>AssetAttributes</code>](#AssetAttributes)  
**Fulfill**: [<code>AssetAttributeValue</code>](./Typedefs.md#AssetAttributeValue)  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| assetId | <code>string</code> | The ID of the asset type (formatted as a UUID) |
| assetAttributeValue | <code>Object</code> |  |
| assetAttributeValue.assetAttributeId | <code>string</code> | UUID corresponding to the asset attribute |
| assetAttributeValue.effectiveDate | <code>string</code> | ISO 8601 Extended Format date/time string |
| [assetAttributeValue.notes] | <code>string</code> |  |
| assetAttributeValue.value | <code>string</code> |  |

**Example**  
```js
contxtSdk.assets.attributes
  .createValue('2140cc2e-6d13-42ee-9941-487fe98f8e2d', {
    assetAttributeId: 'cca11baa-cf7d-44c0-9d0a-6ad73d5f30cb',
    effectiveDate: '2018-07-09T14:36:36.004Z',
    notes: 'Iure delectus non sunt a voluptates pariatur fuga.',
    value: '2206'
  })
  .then((assetAttributeValue) => console.log(assetAttributeValue))
  .catch((err) => console.log(err));
```
<a name="AssetAttributes+deleteValue"></a>

### contxtSdk.assets.attributes.deleteValue(assetAttributeValueId) ⇒ <code>Promise</code>
Deletes an asset attribute value

API Endpoint: '/assets/attributes/values/:assetAttributeValueId'
Method: DELETE

**Kind**: instance method of [<code>AssetAttributes</code>](#AssetAttributes)  
**Fulfill**: <code>undefined</code>  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| assetAttributeValueId | <code>string</code> | The ID of the asset attribute value (formatted as a UUID) |

**Example**  
```js
contxtSdk.assets.attributes.deleteValue(
  'f4cd0d84-6c61-4d19-9322-7c1ab226dc83'
);
```
<a name="AssetAttributes+getEffectiveValuesByAssetId"></a>

### contxtSdk.assets.attributes.getEffectiveValuesByAssetId(assetId, [assetAttributeFilters]) ⇒ <code>Promise</code>
Gets the effective attribute values for a particular asset

API Endpoint: '/assets/:assetId/attributes/values'
Method: GET

**Kind**: instance method of [<code>AssetAttributes</code>](#AssetAttributes)  
**Fulfill**: <code>AssetAttributeValue[]</code>  
**Rejects**: <code>Error</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| assetId | <code>String</code> |  | The ID of the asset for which you are looking up   attribute values  (formatted as a UUID) |
| [assetAttributeFilters] | <code>Object</code> |  | Specific information that is used to   filter the list of asset attribute values |
| [assetAttributeFilters.attributeLabel] | <code>String</code> |  | Label of the parent   asset attribute |
| [assetAttributeFilters.effectiveDate] | <code>String</code> | <code>(new Date()).toISOString()</code> | Effective   date of the asset attribute values |

**Example**  
```js
contxtSdk.assets.attributes
  .getEffectiveValuesByAssetId('d7329ef3-ca63-4ad5-bb3e-632b702584f8', {
    attributeLabel: 'Square Footage',
    effectiveDate: '2018-07-11T19:14:49.715Z'
  })
  .then((assetAttributeValues) => {
    console.log(assetAttributeValues);
  })
  .catch((err) => console.log(err));
```
<a name="AssetAttributes+getEffectiveValuesByOrganizationId"></a>

### contxtSdk.assets.attributes.getEffectiveValuesByOrganizationId(organizationId, [paginationOptions]) ⇒ <code>Promise</code>
Gets a paginated list of effective asset attribute values for an
organization.

API Endpoint: '/organizations/:organizationId/attributes/values'
Method: GET

**Kind**: instance method of [<code>AssetAttributes</code>](#AssetAttributes)  
**Fulfill**: [<code>AssetAttributeValueData</code>](./Typedefs.md#AssetAttributeValueData)  
**Rejects**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| organizationId | <code>String</code> | UUID corresponding with an organization |
| [paginationOptions] | [<code>PaginationOptions</code>](./Typedefs.md#PaginationOptions) |  |

**Example**  
```js
contxtSdk.assets.attributes
  .getValuesByAttributeId(
    '53fba880-70b7-47a2-b4e3-ad9ecfb67d5c',
    {
      limit: 100,
      offset: 0
    }
  )
  .then((assetAttributeValuesData) => {
    console.log(assetAttributeValuesData);
  })
  .catch((err) => console.log(err));
```
<a name="AssetAttributes+getValuesByAttributeId"></a>

### contxtSdk.assets.attributes.getValuesByAttributeId(assetId, assetAttributeId, [paginationOptions]) ⇒ <code>Promise</code>
Gets a paginated list of asset attribute values for a particular attribute
of a particular asset

API Endpoint: '/assets/:assetId/attributes/:attributeId/values'
Method: GET

**Kind**: instance method of [<code>AssetAttributes</code>](#AssetAttributes)  
**Fulfill**: [<code>AssetAttributeValueData</code>](./Typedefs.md#AssetAttributeValueData)  
**Rejects**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| assetId | <code>String</code> | The ID of the asset for which you are looking up   attribute values  (formatted as a UUID) |
| assetAttributeId | <code>String</code> | The ID of the asset attribute for which you are   looking up attribute values (formatted as a UUID) |
| [paginationOptions] | [<code>PaginationOptions</code>](./Typedefs.md#PaginationOptions) |  |

**Example**  
```js
contxtSdk.assets.attributes
  .getValuesByAttributeId(
    'a4d80a97-cbf6-453b-bab5-0477e1ede04f',
    'c2779610-44d7-4313-aea2-96cce58d6efd',
    {
      limit: 100,
      offset: 0
    }
  )
  .then((assetAttributeValuesData) => {
    console.log(assetAttributeValuesData);
  })
  .catch((err) => console.log(err));
```
<a name="AssetAttributes+updateValue"></a>

### contxtSdk.assets.attributes.updateValue(assetAttributeId, update) ⇒ <code>Promise</code>
Updates an asset attribute value

API Endpoint: '/assets/attributes/values/:assetAttributeValueId'
Method: PUT

**Kind**: instance method of [<code>AssetAttributes</code>](#AssetAttributes)  
**Fulfill**: <code>undefined</code>  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| assetAttributeId | <code>string</code> | The ID of the asset attribute to update (formatted as a UUID) |
| update | <code>Object</code> | An object containing the updated data for the asset attribute value |
| [update.effectiveDate] | <code>string</code> | ISO 8601 Extended Format date/time string |
| [update.notes] | <code>string</code> |  |
| [update.value] | <code>string</code> |  |

**Example**  
```js
contxtSdk.assets.attributes
  .updateValue('2140cc2e-6d13-42ee-9941-487fe98f8e2d', {
    effectiveDate: '2018-07-10T11:04:24.631Z',
    notes: 'Dolores et sapiente sunt doloribus aut in.',
    value: '61456'
  })
  .catch((err) => console.log(err));
```

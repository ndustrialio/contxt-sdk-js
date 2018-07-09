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
    * [.getAll(assetTypeId)](#AssetAttributes+getAll) ⇒ <code>Promise</code>
    * [.update(assetAttributeId, update)](#AssetAttributes+update) ⇒ <code>Promise</code>
    * [.createValue()](#AssetAttributes+createValue)
    * [.deleteValue()](#AssetAttributes+deleteValue)
    * [.getValue()](#AssetAttributes+getValue)
    * [.getAllValues()](#AssetAttributes+getAllValues)
    * [.updateValue()](#AssetAttributes+updateValue)

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
| assetAttribute.description | <code>string</code> |  |
| [assetAttribute.isRequired] | <code>boolean</code> |  |
| assetAttribute.label | <code>string</code> |  |
| assetAttribute.organizationId | <code>string</code> |  |
| [assetAttribute.units] | <code>string</code> |  |

**Example**  
```js
contxtSdk.assets.attributes
  .create('4f0e51c6-728b-4892-9863-6d002e61204d', {
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

### contxtSdk.assets.attributes.getAll(assetTypeId) ⇒ <code>Promise</code>
Gets a list of asset attributes for a specific asset type

API Endpoint: '/assets/types/:assetTypeId/attributes'
Method: GET

**Kind**: instance method of [<code>AssetAttributes</code>](#AssetAttributes)  
**Fulfill**: [<code>AssetAttributeData</code>](./Typedefs.md#AssetAttributeData)  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| assetTypeId | <code>string</code> | The ID of the asset type (formatted as a UUID) |

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
| [update.description] | <code>string</code> |  |
| [update.isRequired] | <code>boolean</code> |  |
| [update.label] | <code>string</code> |  |
| [update.units] | <code>string</code> |  |

**Example**  
```js
contxtSdk.assets.attributes
  .update('c7f927c3-11a7-4024-9269-e1231baeb765', {
    description: 'Temperature of a facility',
    isRequired: false,
    label: 'Temperature',
    units: 'Celsius'
  });
```
<a name="AssetAttributes+createValue"></a>

### contxtSdk.assets.attributes.createValue()
Creates a new asset attribute value

**Kind**: instance method of [<code>AssetAttributes</code>](#AssetAttributes)  
<a name="AssetAttributes+deleteValue"></a>

### contxtSdk.assets.attributes.deleteValue()
Deletes an asset attribute value

**Kind**: instance method of [<code>AssetAttributes</code>](#AssetAttributes)  
<a name="AssetAttributes+getValue"></a>

### contxtSdk.assets.attributes.getValue()
Gets an asset attribute value

**Kind**: instance method of [<code>AssetAttributes</code>](#AssetAttributes)  
<a name="AssetAttributes+getAllValues"></a>

### contxtSdk.assets.attributes.getAllValues()
Gets a list of all asset attribute values

**Kind**: instance method of [<code>AssetAttributes</code>](#AssetAttributes)  
<a name="AssetAttributes+updateValue"></a>

### contxtSdk.assets.attributes.updateValue()
Updates an asset attribute value

**Kind**: instance method of [<code>AssetAttributes</code>](#AssetAttributes)  

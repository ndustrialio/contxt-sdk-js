<a name="AssetTypes"></a>

## AssetTypes
Module that provides access to, and the manipulation of, information about different asset types

**Kind**: global class  

* [AssetTypes](#AssetTypes)
    * [new AssetTypes(sdk, request, baseUrl)](#new_AssetTypes_new)
    * [.create(assetType)](#AssetTypes+create) ⇒ <code>Promise</code>
    * [.delete(assetTypeId)](#AssetTypes+delete) ⇒ <code>Promise</code>
    * [.get(assetTypeId)](#AssetTypes+get) ⇒ <code>Promise</code>
    * [.getAll([paginationOptions])](#AssetTypes+getAll) ⇒ <code>Promise</code>
    * [.getAllByOrganizationId(organizationId, [paginationOptions])](#AssetTypes+getAllByOrganizationId) ⇒ <code>Promise</code>
    * [.update(assetTypeId, update)](#AssetTypes+update) ⇒ <code>Promise</code>

<a name="new_AssetTypes_new"></a>

### new AssetTypes(sdk, request, baseUrl)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>Object</code> | An instance of the SDK so the module can communicate with other modules. |
| request | <code>Object</code> | An instance of the request module tied to this module's audience. |
| baseUrl | <code>string</code> | The base URL provided by the parent module |

<a name="AssetTypes+create"></a>

### contxtSdk.assets.types.create(assetType) ⇒ <code>Promise</code>
Creates a new asset type

API Endpoint: '/assets/types'
Method: POST

**Kind**: instance method of [<code>AssetTypes</code>](#AssetTypes)  
**Fulfill**: [<code>AssetType</code>](./Typedefs.md#AssetType) Information about the new asset type  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| assetType | <code>Object</code> |  |
| assetType.description | <code>string</code> |  |
| assetType.label | <code>string</code> |  |
| assetType.organizationId | <code>string</code> | The ID of the asset type's parent organization. Can be   explicitly set to `null` to create a global asset type |

**Example**  
```js
contxtSdk.assets.types
  .create({
    description: 'A physicial facility building',
    label: 'Facility',
    organizationId: 'b47e45af-3e18-408a-8070-008f9e6d7b42'
  })
  .then((assetType) => console.log(assetType))
  .catch((err) => console.log(err));
```
<a name="AssetTypes+delete"></a>

### contxtSdk.assets.types.delete(assetTypeId) ⇒ <code>Promise</code>
Deletes an asset type

API Endpoint: '/assets/types/:assetTypeId'
Method: DELETE

**Kind**: instance method of [<code>AssetTypes</code>](#AssetTypes)  
**Fulfill**: <code>undefined</code>  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| assetTypeId | <code>string</code> | The ID of the asset type (formatted as a UUID) |

**Example**  
```js
contxtSdk.assets.types.delete('4f0e51c6-728b-4892-9863-6d002e61204d')
```
<a name="AssetTypes+get"></a>

### contxtSdk.assets.types.get(assetTypeId) ⇒ <code>Promise</code>
Gets information about an asset type

API Endpoint: '/assets/types/:assetTypeId'
Method: GET

**Kind**: instance method of [<code>AssetTypes</code>](#AssetTypes)  
**Fulfill**: [<code>AssetType</code>](./Typedefs.md#AssetType) Information about the asset type  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| assetTypeId | <code>string</code> | The ID of the asset type (formatted as a UUID) |

**Example**  
```js
contxtSdk.assets.types
  .get('4f0e51c6-728b-4892-9863-6d002e61204d')
  .then((assetType) => console.log(assetType))
  .catch((err) => console.log(err));
```
<a name="AssetTypes+getAll"></a>

### contxtSdk.assets.types.getAll([paginationOptions]) ⇒ <code>Promise</code>
Gets a list of all asset types

API Endpoint: '/assets/types/
Method: GET

**Kind**: instance method of [<code>AssetTypes</code>](#AssetTypes)  
**Fulfill**: [<code>AssetTypesFromServer</code>](./Typedefs.md#AssetTypesFromServer)  
**Reject**: <code>Error</code>  

| Param | Type |
| --- | --- |
| [paginationOptions] | [<code>PaginationOptions</code>](./Typedefs.md#PaginationOptions) | 

**Example**  
```js
contxtSdk.assets.types
  .getAll()
  .then((assetTypes) => console.log(assetTypes))
  .catch((err) => console.log(err));
```
<a name="AssetTypes+getAllByOrganizationId"></a>

### contxtSdk.assets.types.getAllByOrganizationId(organizationId, [paginationOptions]) ⇒ <code>Promise</code>
Gets a list of all asset types that belong to a particular organization

API Endpoint: '/organizations/:organizationId/assets/types'
Method: GET

**Kind**: instance method of [<code>AssetTypes</code>](#AssetTypes)  
**Fulfill**: [<code>AssetTypesFromServer</code>](./Typedefs.md#AssetTypesFromServer)  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| organizationId | <code>string</code> | UUID corresponding with an organization |
| [paginationOptions] | [<code>PaginationOptions</code>](./Typedefs.md#PaginationOptions) |  |

**Example**  
```js
contxtSdk.assets.types
  .getAllByOrganizationId('53fba880-70b7-47a2-b4e3-ad9ecfb67d5c')
  .then((assetTypes) => console.log(assetTypes))
  .catch((err) => console.log(assetTypes));
```
<a name="AssetTypes+update"></a>

### contxtSdk.assets.types.update(assetTypeId, update) ⇒ <code>Promise</code>
Updates an asset type's data

API Endpoint: '/assets/types/:assetTypeId'
Method: PUT

**Kind**: instance method of [<code>AssetTypes</code>](#AssetTypes)  
**Fulfill**: <code>undefined</code>  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| assetTypeId | <code>string</code> | The ID of the asset type to update (formatted as a UUID) |
| update | <code>Object</code> | An object containing the updated data for the asset type |
| update.description | <code>string</code> |  |

**Example**  
```js
contxtSdk.assets.types
  .update('5f310899-d8f9-4dac-ae82-cedb2048a8ef', {
    description: 'A physical facility building'
  });
```

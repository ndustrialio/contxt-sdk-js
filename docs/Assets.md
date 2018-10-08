<a name="Assets"></a>

## Assets
Module that provides access to, and the manipulation of, information about different assets

**Kind**: global class  

* [Assets](#Assets)
    * [new Assets(sdk, request)](#new_Assets_new)
    * [.create(asset)](#Assets+create) ⇒ <code>Promise</code>
    * [.delete(assetId)](#Assets+delete) ⇒ <code>Promise</code>
    * [.get(assetId)](#Assets+get) ⇒ <code>Promise</code>
    * [.getAll([paginationOptions])](#Assets+getAll) ⇒ <code>Promise</code>
    * [.getAllByOrganizationId(organizationId, [options])](#Assets+getAllByOrganizationId) ⇒ <code>Promise</code>
    * [.update(assetId, update)](#Assets+update)

<a name="new_Assets_new"></a>

### new Assets(sdk, request)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>Object</code> | An instance of the SDK so the module can communicate with other modules. |
| request | <code>Object</code> | An instance of the request module tied to this module's audience. |

<a name="Assets+create"></a>

### contxtSdk.assets.create(asset) ⇒ <code>Promise</code>
Creates a new asset

API Endpoint: '/assets'
Method: POST

**Kind**: instance method of [<code>Assets</code>](#Assets)  
**Fulfill**: [<code>Asset</code>](./Typedefs.md#Asset) information about the new asset  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| asset | <code>Object</code> |  |
| asset.assetTypeId | <code>string</code> | UUID |
| [asset.description] | <code>string</code> |  |
| asset.label | <code>string</code> |  |
| asset.organizationId | <code>string</code> | UUID |

**Example**  
```js
contxtSdk.assets
  .create({
    assetTypeId: '4f0e51c6-728b-4892-9863-6d002e61204d',
    description: '221B Baker Street, London',
    label: 'Sherlock Homes Museum',
    organizationId: 'b47e45af-3e18-408a-8070-008f9e6d7b42'
  })
  .then((asset) => console.log(asset))
  .catch((err) => console.log(err));
```
<a name="Assets+delete"></a>

### contxtSdk.assets.delete(assetId) ⇒ <code>Promise</code>
Deletes an asset

API Endpoint: '/assets/:assetId'
Method: DELETE

**Kind**: instance method of [<code>Assets</code>](#Assets)  
**Fulfill**: <code>undefined</code>  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| assetId | <code>string</code> | The ID of the asset (formatted as a UUID) |

**Example**  
```js
contxtSdk.assets.delete('0b51429f-91a0-48ba-b144-fd2db697000e');
```
<a name="Assets+get"></a>

### contxtSdk.assets.get(assetId) ⇒ <code>Promise</code>
Gets information about an asset

API Endpoint: '/assets/:assetId'
Method: GET

**Kind**: instance method of [<code>Assets</code>](#Assets)  
**Fulfill**: [<code>Asset</code>](./Typedefs.md#Asset) Information about the asset  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| assetId | <code>string</code> | The ID of the asset (formatted as a UUID) |

**Example**  
```js
contxtSdk.assets
  .get('0b51429f-91a0-48ba-b144-fd2db697000e')
  .then((asset) => console.log(asset))
  .catch((err) => console.log(err));
```
<a name="Assets+getAll"></a>

### contxtSdk.assets.getAll([paginationOptions]) ⇒ <code>Promise</code>
Get a list of all assets

API Endpoint: '/assets'
Method: GET

**Kind**: instance method of [<code>Assets</code>](#Assets)  
**Fulfill**: [<code>AssetsFromServer</code>](./Typedefs.md#AssetsFromServer)  
**Reject**: <code>Error</code>  

| Param | Type |
| --- | --- |
| [paginationOptions] | [<code>PaginationOptions</code>](./Typedefs.md#PaginationOptions) | 

**Example**  
```js
contxtSdk.assets
  .getAll()
  .then((assets) => console.log(assets))
  .catch((err) => console.log(err));
```
<a name="Assets+getAllByOrganizationId"></a>

### contxtSdk.assets.getAllByOrganizationId(organizationId, [options]) ⇒ <code>Promise</code>
Get a list of all assets that belong to a particular organization

API Endpoint: '/organizations/:organizationId/assets'
Method: GET

**Kind**: instance method of [<code>Assets</code>](#Assets)  
**Fulfill**: [<code>AssetsFromServer</code>](./Typedefs.md#AssetsFromServer)  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| organizationId | <code>string</code> | UUID corresponding with an organization |
| [options] | <code>Object</code> | Object containing parameters to be called with the request |
| [options.assetTypeId] | <code>string</code> | UUID of the asset type to use for filtering |
| [options.limit] | <code>Number</code> | Maximum number of records to return per query |
| [options.offset] | <code>Number</code> | How many records from the first record to start |

**Example**  
```js
contxtSdk.assets
  .getAllByOrganizationId('53fba880-70b7-47a2-b4e3-ad9ecfb67d5c', {
    assetTypeId: '4f0e51c6-728b-4892-9863-6d002e61204d'
  })
  .then((assets) => console.log(assets))
  .catch((err) => console.log(err));
```
<a name="Assets+update"></a>

### contxtSdk.assets.update(assetId, update)
Updates an asset's data

API Endpoint: '/assets/:assetId'
Method: PUT

**Kind**: instance method of [<code>Assets</code>](#Assets)  

| Param | Type | Description |
| --- | --- | --- |
| assetId | <code>string</code> | The ID of the asset to update (formatted as a UUID) |
| update | <code>Object</code> | An object containing the updated data for the asset |
| update.description | <code>string</code> |  |

**Example**  
```js
contxtSdk.assets
  .update({
    description: 'A new description'
  })
  .then((asset) => console.log(asset))
  .catch((err) => console.log(err));
```

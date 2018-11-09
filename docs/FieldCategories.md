<a name="FieldCategories"></a>

## FieldCategories
Module that provides access to field category information

**Kind**: global class  

* [FieldCategories](#FieldCategories)
    * [new FieldCategories(sdk, request, baseUrl)](#new_FieldCategories_new)
    * [.create(fieldCategory)](#FieldCategories+create) ⇒ <code>Promise</code>
    * [.delete(categoryId)](#FieldCategories+delete) ⇒ <code>Promise</code>
    * [.get(categoryId)](#FieldCategories+get) ⇒ <code>Promise</code>
    * [.getAll([paginationOptions])](#FieldCategories+getAll) ⇒ <code>Promise</code>
    * [.getAllByFacility(facilityId)](#FieldCategories+getAllByFacility) ⇒ <code>Promise</code>
    * [.update(categoryId, update)](#FieldCategories+update) ⇒ <code>Promise</code>

<a name="new_FieldCategories_new"></a>

### new FieldCategories(sdk, request, baseUrl)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>Object</code> | An instance of the SDK so the module can communicate   with other modules |
| request | <code>Object</code> | An instance of the request module tied to this   module's audience |
| baseUrl | <code>string</code> | The base URL provided by the parent module |

<a name="FieldCategories+create"></a>

### contxtSdk.iot.fieldCategories.create(fieldCategory) ⇒ <code>Promise</code>
Create a field category

API Endpoint: '/categories'
Method: POST

**Kind**: instance method of [<code>FieldCategories</code>](#FieldCategories)  
**Fulfill**: [<code>FieldCategory</code>](./Typedefs.md#FieldCategory) Information about the field category  
**Reject**: <code>Error</code>  

| Param | Type |
| --- | --- |
| fieldCategory | <code>Object</code> | 
| fieldCategory.description | <code>string</code> | 
| fieldCategory.name | <code>string</code> | 
| fieldCategory.organizationId | <code>string</code> | 
| [fieldCategory.parentCategoryId] | <code>string</code> | 

**Example**  
```js
contxtSdk.iot.fieldCategories
  .create({
     description: 'Compressors in Room 2',
     name: 'Room 2',
     organizationId: '8a3cb818-0889-4674-b871-7ceadaecd26a',
     parentCategoryId: 'e9f8f89c-609c-4c83-8ebc-cea928af661e'
  })
  .then((fieldCategory) => console.log(fieldCategory))
  .catch((err) => console.log(err));
```
<a name="FieldCategories+delete"></a>

### contxtSdk.iot.fieldCategories.delete(categoryId) ⇒ <code>Promise</code>
Deletes a field category

API Endpoint: '/categories/:categoryId'
Method: DELETE

**Kind**: instance method of [<code>FieldCategories</code>](#FieldCategories)  
**Fulfill**: <code>undefined</code>  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| categoryId | <code>String</code> | The UUID of a field category |

**Example**  
```js
contxtSdk.iot.fieldCategories
  .delete('b3dbaae3-25dd-475b-80dc-66296630a8d0');
```
<a name="FieldCategories+get"></a>

### contxtSdk.iot.fieldCategories.get(categoryId) ⇒ <code>Promise</code>
Gets information about a field category

API Endpoint: '/categories/:categoryId'
Method: GET

**Kind**: instance method of [<code>FieldCategories</code>](#FieldCategories)  
**Fulfill**: [<code>FieldCategory</code>](./Typedefs.md#FieldCategory) Information about the field category  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| categoryId | <code>String</code> | The UUID of a field category |

**Example**  
```js
contxtSdk.iot.fieldCategories
  .get('b3dbaae3-25dd-475b-80dc-66296630a8d0')
  .then((fieldCategory) => console.log(fieldCategory))
  .catch((err) => console.log(err));
```
<a name="FieldCategories+getAll"></a>

### contxtSdk.iot.fieldCategories.getAll([paginationOptions]) ⇒ <code>Promise</code>
Get a listing of all field categories available to the user.

API Endpoint: '/categories'
Method: GET

**Kind**: instance method of [<code>FieldCategories</code>](#FieldCategories)  
**Fulfill**: [<code>FieldCategoriesFromServer</code>](./Typedefs.md#FieldCategoriesFromServer) Information about the field categories  
**Reject**: <code>Error</code>  

| Param | Type |
| --- | --- |
| [paginationOptions] | [<code>PaginationOptions</code>](./Typedefs.md#PaginationOptions) | 

**Example**  
```js
contxtSdk.iot.fieldCategories
  .getAll()
  .then((fieldCategories) => console.log(fieldCategories))
  .catch((err) => console.log(err));
```
<a name="FieldCategories+getAllByFacility"></a>

### contxtSdk.iot.fieldCategories.getAllByFacility(facilityId) ⇒ <code>Promise</code>
Get a listing of all field categories for a given facility ID.

API Endpoint: '/facilities/:facilityId/categories'
Method: GET

**Kind**: instance method of [<code>FieldCategories</code>](#FieldCategories)  
**Fulfill**: <code>FieldCategory[]</code> Information about the field categories  
**Reject**: <code>Error</code>  

| Param | Type |
| --- | --- |
| facilityId | <code>String</code> | 

**Example**  
```js
contxtSdk.iot.fieldCategories
  .getAllByFacility(187)
  .then((fieldCategories) => console.log(fieldCategories))
  .catch((err) => console.log(err));
```
<a name="FieldCategories+update"></a>

### contxtSdk.iot.fieldCategories.update(categoryId, update) ⇒ <code>Promise</code>
Updates information about a field category

API Endpoint: '/categories/:categoryId'
Method: PUT

**Kind**: instance method of [<code>FieldCategories</code>](#FieldCategories)  
**Fulfill**: [<code>FieldCategory</code>](./Typedefs.md#FieldCategory) Information about the field category  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| categoryId | <code>String</code> | The UUID of a field category |
| update | <code>Object</code> |  |
| [update.description] | <code>string</code> |  |
| [update.name] | <code>string</code> |  |
| [update.parentCategoryId] | <code>string</code> |  |

**Example**  
```js
contxtSdk.iot.fieldCategories
  .update('b3dbaae3-25dd-475b-80dc-66296630a8d0', {
     description: 'Power usage from all compressors in Room 2',
     parentCategoryId: 'e9f8f89c-609c-4c83-8ebc-cea928af661e',
     name: 'Room 2 Compressors'
  })
  .then((fieldCategory) => console.log(fieldCategory))
  .catch((err) => console.log(err));
```

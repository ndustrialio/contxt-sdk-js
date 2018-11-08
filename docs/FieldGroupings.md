<a name="FieldGroupings"></a>

## FieldGroupings
Module that provides access to field information

**Kind**: global class  

* [FieldGroupings](#FieldGroupings)
    * [new FieldGroupings(sdk, request, baseUrl)](#new_FieldGroupings_new)
    * [.addField(fieldGroupingId, outputFieldId)](#FieldGroupings+addField) ⇒ <code>Promise</code>
    * [.create(facilityId, fieldGrouping)](#FieldGroupings+create) ⇒ <code>Promise</code>
    * [.delete(groupingId)](#FieldGroupings+delete) ⇒ <code>Promise</code>
    * [.get(groupingId)](#FieldGroupings+get) ⇒ <code>Promise</code>
    * [.getGroupingsByFacilityId(facilityId, [paginationOptions])](#FieldGroupings+getGroupingsByFacilityId) ⇒ <code>Promise</code>
    * [.removeField(fieldGroupingId, outputFieldId)](#FieldGroupings+removeField) ⇒ <code>Promise</code>
    * [.update(groupingId, update)](#FieldGroupings+update) ⇒ <code>Promise</code>

<a name="new_FieldGroupings_new"></a>

### new FieldGroupings(sdk, request, baseUrl)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>Object</code> | An instance of the SDK so the module can communicate   with other modules |
| request | <code>Object</code> | An instance of the request module tied to this   module's audience |
| baseUrl | <code>string</code> | The base URL provided by the parent module |

<a name="FieldGroupings+addField"></a>

### contxtSdk.iot.fieldGroupings.addField(fieldGroupingId, outputFieldId) ⇒ <code>Promise</code>
Adds a field to a field grouping

API Endpoint: '/groupings/:fieldGroupingId/fields/:outputFieldId'
Method: POST

**Kind**: instance method of [<code>FieldGroupings</code>](#FieldGroupings)  
**Fulfill**: [<code>FieldGroupingField</code>](./Typedefs.md#FieldGroupingField) Information about the new field/grouping relationship  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| fieldGroupingId | <code>string</code> | UUID corresponding with a field grouping |
| outputFieldId | <code>number</code> | ID corresponding to the field being added |

**Example**  
```js
contxtSdk.iot.fieldGroupings
  .addField('b3dbaae3-25dd-475b-80dc-66296630a8d0', 4)
  .then((grouping) => console.log(grouping))
  .catch((err) => console.log(err));
```
<a name="FieldGroupings+create"></a>

### contxtSdk.iot.fieldGroupings.create(facilityId, fieldGrouping) ⇒ <code>Promise</code>
Create a field grouping associated with a facility

API Endpoint: '/facilities/:facilityId/groupings'
Method: POST

**Kind**: instance method of [<code>FieldGroupings</code>](#FieldGroupings)  
**Fulfill**: [<code>FieldGrouping</code>](./Typedefs.md#FieldGrouping) Information about the field grouping  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| facilityId | <code>String</code> | TheID of a facility |
| fieldGrouping | <code>Object</code> |  |
| fieldGrouping.description | <code>string</code> |  |
| [fieldGrouping.fieldCategoryId] | <code>string</code> |  |
| [fieldGrouping.isPublic] | <code>boolean</code> |  |
| fieldGrouping.label | <code>string</code> |  |

**Example**  
```js
contxtSdk.iot.fieldGroupings
  .create(135, {
     description: 'Power usage from all compressors in Room 2',
     fieldCategoryId: 'e9f8f89c-609c-4c83-8ebc-cea928af661e',
     isPublic: true,
     label: 'Room 2 Compressors'
  })
  .then((fieldGrouping) => console.log(fieldGrouping))
  .catch((err) => console.log(err));
```
<a name="FieldGroupings+delete"></a>

### contxtSdk.iot.fieldGroupings.delete(groupingId) ⇒ <code>Promise</code>
Deletes a field grouping

API Endpoint: '/groupings/:groupingId'
Method: DELETE

**Kind**: instance method of [<code>FieldGroupings</code>](#FieldGroupings)  
**Fulfill**: <code>undefined</code>  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| groupingId | <code>String</code> | The UUID of a field grouping |

**Example**  
```js
contxtSdk.iot.fieldGroupings
  .delete('b3dbaae3-25dd-475b-80dc-66296630a8d0');
```
<a name="FieldGroupings+get"></a>

### contxtSdk.iot.fieldGroupings.get(groupingId) ⇒ <code>Promise</code>
Gets information about a field grouping

API Endpoint: '/groupings/:groupingId'
Method: GET

**Kind**: instance method of [<code>FieldGroupings</code>](#FieldGroupings)  
**Fulfill**: [<code>FieldGrouping</code>](./Typedefs.md#FieldGrouping) Information about the field grouping  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| groupingId | <code>String</code> | The UUID of a field grouping |

**Example**  
```js
contxtSdk.iot.fieldGroupings
  .get('b3dbaae3-25dd-475b-80dc-66296630a8d0')
  .then((fieldGrouping) => console.log(fieldGrouping))
  .catch((err) => console.log(err));
```
<a name="FieldGroupings+getGroupingsByFacilityId"></a>

### contxtSdk.iot.fieldGroupings.getGroupingsByFacilityId(facilityId, [paginationOptions]) ⇒ <code>Promise</code>
Get a paginated listing of field groupings for a facility available to the user. Includes public groupings across
any organization the user has access to and the user's private groupings.

API Endpoint: '/facilities/:facilityId/groupings'
Method: GET

**Kind**: instance method of [<code>FieldGroupings</code>](#FieldGroupings)  
**Fulfill**: [<code>FieldGroupingsFromServer</code>](./Typedefs.md#FieldGroupingsFromServer) Information about the field grouping  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| facilityId | <code>number</code> | The ID of a facility with groupings |
| [paginationOptions] | [<code>PaginationOptions</code>](./Typedefs.md#PaginationOptions) |  |

**Example**  
```js
contxtSdk.iot.fieldGroupings
  .getGroupingsByFacilityId(135)
  .then((fieldGroupings) => console.log(fieldGroupings))
  .catch((err) => console.log(err));
```
<a name="FieldGroupings+removeField"></a>

### contxtSdk.iot.fieldGroupings.removeField(fieldGroupingId, outputFieldId) ⇒ <code>Promise</code>
Removes a field from a field grouping

API Endpoint: '/groupings/:fieldGroupingId/fields/:outputFieldId'
Method: DELETE

**Kind**: instance method of [<code>FieldGroupings</code>](#FieldGroupings)  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| fieldGroupingId | <code>string</code> | UUID corresponding with a field grouping |
| outputFieldId | <code>number</code> | ID corresponding with the field |

**Example**  
```js
contxtSdk.iot.fieldGroupings
  .removeField('b3dbaae3-25dd-475b-80dc-66296630a8d0', 4)
  .catch((err) => console.log(err));
```
<a name="FieldGroupings+update"></a>

### contxtSdk.iot.fieldGroupings.update(groupingId, update) ⇒ <code>Promise</code>
Updates information about a field grouping

API Endpoint: '/groupings/:groupingId'
Method: PUT

**Kind**: instance method of [<code>FieldGroupings</code>](#FieldGroupings)  
**Fulfill**: [<code>FieldGrouping</code>](./Typedefs.md#FieldGrouping) Information about the field grouping  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| groupingId | <code>String</code> | The UUID of a field grouping |
| update | <code>Object</code> |  |
| [update.description] | <code>string</code> |  |
| [update.fieldCategoryId] | <code>string</code> |  |
| [update.isPublic] | <code>boolean</code> |  |
| [update.label] | <code>string</code> |  |

**Example**  
```js
contxtSdk.iot.fieldGroupings
  .update('b3dbaae3-25dd-475b-80dc-66296630a8d0', {
     description: 'Power usage from all compressors in Room 2',
     fieldCategoryId: 'e9f8f89c-609c-4c83-8ebc-cea928af661e',
     isPublic: true,
     label: 'Room 2 Compressors'
  })
  .then((fieldGrouping) => console.log(fieldGrouping))
  .catch((err) => console.log(err));
```

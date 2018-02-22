## Classes

<dl>
<dt><a href="#Facilities">Facilities</a></dt>
<dd><p>Module that provides access to, and the manipulation
of, information about different facilities</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Facility">Facility</a> : <code>object</code></dt>
<dd></dd>
</dl>

<a name="Facilities"></a>

## Facilities
Module that provides access to, and the manipulation
of, information about different facilities

**Kind**: global class  

* [Facilities](#Facilities)
    * [.get(facilityId)](#Facilities+get) ⇒ <code>Promise</code>
    * [.getAll()](#Facilities+getAll) ⇒ <code>Promise</code>

<a name="Facilities+get"></a>

### contxtSdk.facilities.get(facilityId) ⇒ <code>Promise</code>
Gets information about a facility

API Endpoint: '/facilities/:facilityId'
Method: GET

**Kind**: instance method of [<code>Facilities</code>](#Facilities)  
**Fulfill**: [<code>Facility</code>](#Facility) Information about a facility  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| facilityId | <code>object</code> | The id of the facility |

**Example**  
```js
contxtSdk.facilities.get(25)
  .then((facility) => console.log(facility)});
  .catch((err) => console.log(err));
```
<a name="Facilities+getAll"></a>

### contxtSdk.facilities.getAll() ⇒ <code>Promise</code>
Gets a list of all facilities

API Endpoint: '/facilities'
Method: GET

**Kind**: instance method of [<code>Facilities</code>](#Facilities)  
**Fulfill**: <code>Facility[]</code> Information about a facility  
**Reject**: <code>Error</code>  
**Example**  
```js
contxtSdk.facilities.getAll()
  .then((facilities) => console.log(facilities)});
  .catch((err) => console.log(err));
```
<a name="Facility"></a>

## Facility : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| address1 | <code>string</code> |  |
| address2 | <code>string</code> |  |
| city | <code>string</code> |  |
| created_at | <code>string</code> | ISO8901 formatted |
| id | <code>number</code> |  |
| Info | <code>object</code> |  |
| name | <code>string</code> |  |
| Organization | <code>object</code> |  |
| Organization.id | <code>string</code> | UUID formatted id |
| Organization.name | <code>string</code> |  |
| Organization.created_at | <code>string</code> | ISO8901 formatted |
| Organization.updated_at | <code>string</code> | ISO8901 formatted |
| organization.id | <code>string</code> | UUID formatted id |
| state | <code>string</code> |  |
| tags | <code>Array.&lt;object&gt;</code> |  |
| tags[].id | <code>number</code> |  |
| tags[].facility_id | <code>number</code> |  |
| tags[].name | <code>string</code> |  |
| tags[].created_at | <code>string</code> | ISO8901 formatted |
| tags[].updated_at | <code>string</code> | ISO8901 formatted |
| timezone | <code>string</code> |  |
| weather_location_id | <code>number</code> |  |
| zip | <code>string</code> | US Zip Code |


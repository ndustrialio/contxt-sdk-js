<a name="Nionic"></a>

## Nionic
Module that provides access to, and the manipulation of, information about different assets

**Kind**: global class  

* [Nionic](#Nionic)
    * [new Nionic(sdk, request)](#new_Nionic_new)
    * [.getFacilities(organizationId, [options])](#Nionic+getFacilities) ⇒ <code>Promise</code>
    * [.getFacility(organizationId, facilityId)](#Nionic+getFacility) ⇒ <code>Promise</code>

<a name="new_Nionic_new"></a>

### new Nionic(sdk, request)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>Object</code> | An instance of the SDK so the module can communicate with other modules. |
| request | <code>Object</code> | An instance of the request module tied to this module's audience. |

<a name="Nionic+getFacilities"></a>

### contxtSdk.nionic.getFacilities(organizationId, [options]) ⇒ <code>Promise</code>
Get a list of all assets that belong to a particular organization

**Kind**: instance method of [<code>Nionic</code>](#Nionic)  
**Fulfill**: [<code>AssetsFromServer</code>](./Typedefs.md#AssetsFromServer)  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| organizationId | <code>string</code> | UUID corresponding with an organization |
| [options] | <code>Object</code> | Object containing parameters to be called with the request |

**Example**  
```js
contxtSdk.nionic
  .getAllFacilities('53fba880-70b7-47a2-b4e3-ad9ecfb67d5c')
  .then((facilities) => console.log(facilities))
  .catch((err) => console.log(err));
```
<a name="Nionic+getFacility"></a>

### contxtSdk.nionic.getFacility(organizationId, facilityId) ⇒ <code>Promise</code>
Gets information about a facility

**Kind**: instance method of [<code>Nionic</code>](#Nionic)  
**Fulfill**: [<code>Facility</code>](./Typedefs.md#Facility) Information about a facility  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| organizationId | <code>string</code> | UUID corresponding with an organization |
| facilityId | <code>number</code> | The ID of the facility |

**Example**  
```js
contxtSdk.facilities
  .get('53fba880-70b7-47a2-b4e3-ad9ecfb67d5c', 25)
  .then((facility) => console.log(facility))
  .catch((err) => console.log(err));
```

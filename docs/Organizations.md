<a name="Organizations"></a>

## Organizations
Module that provides access to contxt organizations

**Kind**: global class  

* [Organizations](#Organizations)
    * [new Organizations(sdk, request, baseUrl, [organizationId])](#new_Organizations_new)
    * [.get(organizationId)](#Organizations+get) ⇒ <code>Promise</code>
    * [.getAll()](#Organizations+getAll) ⇒ <code>Promise</code>

<a name="new_Organizations_new"></a>

### new Organizations(sdk, request, baseUrl, [organizationId])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| sdk | <code>Object</code> |  | An instance of the SDK so the module can communicate with other modules |
| request | <code>Object</code> |  | An instance of the request module tied to this module's audience. |
| baseUrl | <code>string</code> |  | The base URL provided by the parent module |
| [organizationId] | <code>string</code> | <code>null</code> | The organization ID to be used in tenant url requests |

<a name="Organizations+get"></a>

### contxtSdk.coordinator.organizations.get(organizationId) ⇒ <code>Promise</code>
Gets information about a contxt organization

Legacy API Endpoint: '/organizations/:organizationId'
API Endpoint: '/'
Method: GET

**Kind**: instance method of [<code>Organizations</code>](#Organizations)  
**Fulfill**: [<code>ContxtOrganization</code>](./Typedefs.md#ContxtOrganization) Information about a contxt organization  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| organizationId | <code>string</code> | The ID of the organization, optional when using the tenant API and an organization ID has been set |

**Example**  
```js
contxtSdk.coordinator.organizations
  .get('36b8421a-cc4a-4204-b839-1397374fb16b')
  .then((org) => console.log(org))
  .catch((err) => console.log(err));
```
<a name="Organizations+getAll"></a>

### contxtSdk.coordinator.organizations.getAll() ⇒ <code>Promise</code>
Gets information about all contxt organizations

API Endpoint: '/organizations'
Method: GET

**Kind**: instance method of [<code>Organizations</code>](#Organizations)  
**Fulfill**: <code>ContxtOrganization[]</code> Information about all contxt organizations  
**Reject**: <code>Error</code>  
**Example**  
```js
contxtSdk.coordinator.organizations
  .getAll()
  .then((orgs) => console.log(orgs))
  .catch((err) => console.log(err));
```

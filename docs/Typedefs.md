<a name="Asset"></a>

## Asset : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| assetTypeId | <code>string</code> | UUID corresponding with the asset type |
| createdAt | <code>string</code> | ISO 8601 Extended Format date/time string |
| [description] | <code>string</code> |  |
| id | <code>string</code> | UUID |
| label | <code>string</code> |  |
| organizationId | <code>string</code> | UUID corresponding with the organization |
| updatedAt | <code>string</code> | ISO 8601 Extended Format date/time string |

<a name="AssetAttribute"></a>

## AssetAttribute : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| assetTypeId | <code>string</code> | UUID corresponding with the asset type |
| createdAt | <code>string</code> | ISO 8601 Extended Format date/time string |
| dataType | <code>string</code> | Data Type of attribute with options "boolean", "date", "number", "string" |
| description | <code>string</code> |  |
| id | <code>string</code> | UUID |
| isRequired | <code>boolean</code> |  |
| label | <code>string</code> |  |
| organizationId | <code>string</code> | UUID corresponding with the organization |
| [units] | <code>string</code> |  |
| updatedAt | <code>string</code> | ISO 8601 Extended Format date/time string |

<a name="AssetAttributeData"></a>

## AssetAttributeData : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| _metadata | [<code>PaginationMetadata</code>](./Typedefs.md#PaginationMetadata) | Metadata about the pagination settings |
| records | [<code>Array.&lt;AssetAttribute&gt;</code>](#AssetAttribute) |  |

<a name="AssetAttributeValue"></a>

## AssetAttributeValue : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| assetId | <code>string</code> | UUID corresponding to the asset |
| assetAttributeId | <code>string</code> | UUID corresponding to the asset attribute |
| [assetLabel] | <code>string</code> | Label from the associated asset |
| createdAt | <code>string</code> | ISO 8601 Extended Format date/time string |
| effectiveDate | <code>string</code> | ISO 8601 Extended Format date/time string |
| id | <code>string</code> | UUID |
| [label] | <code>string</code> | Label from the associated asset attribute |
| [notes] | <code>string</code> |  |
| updatedAt | <code>string</code> | ISO 8601 Extended Format date/time string |
| value | <code>string</code> |  |

<a name="AssetAttributeValueData"></a>

## AssetAttributeValueData : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| _metadata | [<code>PaginationMetadata</code>](./Typedefs.md#PaginationMetadata) | Metadata about the pagination settings |
| records | [<code>Array.&lt;AssetAttributeValue&gt;</code>](#AssetAttributeValue) |  |

<a name="AssetType"></a>

## AssetType : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| createdAt | <code>string</code> | ISO 8601 Extended Format date/time string |
| description | <code>string</code> |  |
| id | <code>string</code> | UUID |
| label | <code>string</code> |  |
| organizationId | <code>string</code> | UUID corresponding with the organization |
| updatedAt | <code>string</code> | ISO 8601 Extended Format date/time string |

<a name="AssetTypesFromServer"></a>

## AssetTypesFromServer : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| _metadata | <code>Object</code> | Metadata about the pagination settings |
| _metadata.offset | <code>number</code> | Offset of records in subsequent queries |
| _metadata.totalRecords | <code>number</code> | Total number of asset types found |
| records | [<code>Array.&lt;AssetType&gt;</code>](#AssetType) |  |

<a name="AssetsFromServer"></a>

## AssetsFromServer : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| _metadata | <code>Object</code> | Metadata about the pagination settings |
| _metadata.offset | <code>number</code> | Offset of records in subsequent queries |
| _metadata.totalRecords | <code>number</code> | Total number of asset types found |
| records | [<code>Array.&lt;Asset&gt;</code>](#Asset) |  |

<a name="Audience"></a>

## Audience : <code>Object</code>
A single audience used for authenticating and communicating with an individual API.

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| config.clientId | <code>string</code> | Client Id provided by Auth0 for the environment you are   trying to communicate with |
| config.host | <code>string</code> | Hostname for the API that corresponds with the clientId provided |

<a name="Auth0WebAuthSessionInfo"></a>

## Auth0WebAuthSessionInfo : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| accessToken | <code>string</code> | 
| apiToken | <code>string</code> | 
| expiresAt | <code>number</code> | 

<a name="AxiosInterceptor"></a>

## AxiosInterceptor : <code>Object</code>
An object of interceptors that get called on every request or response.
More information at [axios Interceptors](https://github.com/axios/axios#interceptors)

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| interceptor.fulfilled | <code>function</code> | A function that is run on every successful request or   response |
| interceptor.rejected | <code>function</code> | A function that is run on every failed request or response |

<a name="CostCenter"></a>

## CostCenter : <code>Object</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| createdAt | <code>string</code> | ISO 8601 Extended Format date/time string |
| [description] | <code>string</code> |  |
| id | <code>string</code> | UUID |
| name | <code>string</code> |  |
| organizationId | <code>string</code> | UUID |
| updatedAt | <code>string</code> | ISO 8601 Extended Format date/time string |

<a name="CostCenterFacility"></a>

## CostCenterFacility : <code>Object</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| costCenterId | <code>string</code> | UUID |
| createdAt | <code>string</code> | ISO 8601 Extended Format date/time string |
| facilityId | <code>number</code> |  |
| id | <code>string</code> | UUID |
| updatedAt | <code>string</code> | ISO 8601 Extended Format date/time string |

<a name="CustomAudience"></a>

## CustomAudience : <code>Object</code>
A custom audience that will override the configuration of an individual module. Consists of
either a reference to an environment that already exists or a clientId and host for a
custom environment.

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| [config.clientId] | <code>string</code> | Client Id provided by Auth0 for the environment you are   trying to communicate with |
| [config.env] | <code>string</code> | The SDK provided environment name you are trying to reach |
| [config.host] | <code>string</code> | Hostname for the API that corresponds with the clientId provided |

<a name="Environments"></a>

## Environments : <code>Object.&lt;string, Audience&gt;</code>
An object of audiences that corresponds to all the different environments available for a
single module.

**Kind**: global typedef  
<a name="Event"></a>

## Event : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| allowOthersToTrigger | <code>boolean</code> | Whether or not to allow non-owners to trigger the Event |
| createdAt | <code>string</code> | ISO 8601 Extended Format date/time string |
| [deletedAt] | <code>string</code> | ISO 8601 Extended Format date/time string |
| [eventType] | <code>Object</code> |  |
| [eventType.clientId] | <code>string</code> | The ID of the client to which the event type belongs |
| [eventType.createdAt] | <code>string</code> | ISO 8601 Extended Format date/time string |
| [eventType.description] | <code>string</code> |  |
| [eventType.id] | <code>string</code> | UUID formatted ID |
| [eventType.isRealtimeEnabled] | <code>boolean</code> |  |
| [eventType.level] | <code>number</code> |  |
| [eventType.name] | <code>string</code> |  |
| [eventType.slug] | <code>string</code> |  |
| [eventType.updatedAt] | <code>string</code> | ISO 8601 Extended Format date/time string |
| [eventTypeId] | <code>string</code> | UUID corresponding with an event type |
| [facilityId] | <code>number</code> | The facility associated with the event |
| id | <code>string</code> | UUID formatted ID |
| [isPublic] | <code>boolean</code> |  |
| name | <code>string</code> |  |
| [organizationId] | <code>string</code> | UUID of the organization to which the event belongs |
| [owner] | <code>Object</code> |  |
| [owner.createdAt] | <code>string</code> | ISO 8601 Extended Format date/time string |
| [owner.email] | <code>string</code> |  |
| [owner.firstName] | <code>string</code> |  |
| [owner.id] | <code>string</code> |  |
| [owner.isMachineUser] | <code>boolean</code> |  |
| [owner.lastName] | <code>string</code> |  |
| [owner.updatedAt] | <code>string</code> | ISO 8601 Extended Format date/time string |
| [ownerId] | <code>string</code> | The ID of the user who owns the event |
| [topicArn] | <code>number</code> | The Amazon Resource Name (ARN) associated with the event |
| updatedAt | <code>string</code> | ISO 8601 Extended Format date/time string |

<a name="ExternalModule"></a>

## ExternalModule : <code>Object</code>
An external module to be integrated into the SDK as a first class citizen. Includes information
for authenticating and communicating with an individual API and the external module itself.

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| config.clientId | <code>string</code> | Client Id provided by Auth0 for the environment you are   trying to communicate with. Can be a `null` value if the value is not needed. Some SessionType   adapters (currently, just the MachineAuth adapter) require a value other than `null` if the   built-in `request` module is used since they acquire contxt tokens based on a single clientId. |
| config.host | <code>string</code> | Hostname for the API that corresponds with the clientId provided.   Can be a `null` value if the value is not needed. |
| config.module | <code>function</code> | The module that will be decorated into the SDK |

<a name="Facility"></a>

## Facility : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [address1] | <code>string</code> |  |
| [address2] | <code>string</code> |  |
| [assetId] | <code>string</code> | UUID corresponding with an asset |
| [city] | <code>string</code> |  |
| createdAt | <code>string</code> | ISO 8601 Extended Format date/time string |
| [geometryId] | <code>string</code> | UUID corresponding with a geometry |
| id | <code>number</code> |  |
| [Info] | <code>Object</code> | User declared information |
| name | <code>string</code> |  |
| [Organization] | <code>Object</code> |  |
| [Organization.createdAt] | <code>string</code> | ISO 8601 Extended Format date/time string |
| [Organization.id] | <code>string</code> | UUID formatted ID |
| [Organization.name] | <code>string</code> |  |
| [Organization.updatedAt] | <code>string</code> | ISO 8601 Extended Format date/time string |
| [state] | <code>string</code> |  |
| [tags] | <code>Array.&lt;Object&gt;</code> |  |
| [tags[].createdAt] | <code>string</code> | ISO 8601 Extended Format date/time string |
| [tags[].id] | <code>number</code> |  |
| [tags[].facilityId] | <code>number</code> |  |
| [tags[].name] | <code>string</code> |  |
| [tags[].updatedAt] | <code>string</code> | ISO 8601 Extended Format date/time string |
| timezone | <code>string</code> | An IANA Time Zone Database string, i.e. America/Los_Angeles |
| [weatherLocationId] | <code>number</code> |  |
| [zip] | <code>string</code> | US Zip Code |

<a name="FacilityGrouping"></a>

## FacilityGrouping : <code>Object</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| createdAt | <code>string</code> | ISO 8601 Extended Format date/time string |
| [description] | <code>string</code> |  |
| [facilities] | [<code>Array.&lt;Facility&gt;</code>](#Facility) |  |
| id | <code>string</code> | UUID |
| isPrivate | <code>boolean</code> |  |
| name | <code>string</code> |  |
| organizationId | <code>string</code> | UUID |
| ownerId | <code>string</code> | Auth0 identifer of the user |
| [parentGroupingId] | <code>string</code> | UUID |
| updatedAt | <code>string</code> | ISO 8601 Extended Format date/time string |

<a name="FacilityGroupingFacility"></a>

## FacilityGroupingFacility : <code>Object</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| createdAt | <code>string</code> | ISO 8601 Extended Format date/time string |
| facilityGroupingId | <code>string</code> | UUID |
| facilityId | <code>number</code> |  |
| id | <code>string</code> | UUID |
| updatedAt | <code>string</code> | ISO 8601 Extended Format date/time string |

<a name="MachineAuthSessionInfo"></a>

## MachineAuthSessionInfo : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| apiToken | <code>string</code> | 
| expiresAt | <code>number</code> | 

<a name="OutputField"></a>

## OutputField : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [canAggregate] | <code>Boolean</code> |  |
| [divisor] | <code>Number</code> |  |
| feedKey | <code>String</code> |  |
| fieldDescriptor | <code>String</code> |  |
| fieldHumanName | <code>String</code> |  |
| [fieldName] | <code>String</code> |  |
| id | <code>Number</code> |  |
| [isDefault] | <code>Boolean</code> |  |
| [isHidden] | <code>Boolean</code> |  |
| [isTotalizer] | <code>Boolean</code> |  |
| [isWindowed] | <code>Boolean</code> |  |
| [label] | <code>String</code> |  |
| outputId | <code>Number</code> |  |
| [scalar] | <code>Number</code> |  |
| [status] | <code>String</code> |  |
| [units] | <code>String</code> |  |
| valueType | <code>String</code> | What type of value can be coming from the feed.   One of `boolean`, `numeric`, and `string` |

<a name="OutputFieldData"></a>

## OutputFieldData : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| eventTime | <code>String</code> | ISO 8601 Extended Format date/time string |
| value | <code>String</code> |  |

<a name="OutputFieldDataResponse"></a>

## OutputFieldDataResponse : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| meta | <code>Object</code> |  |
| meta.count | <code>Number</code> | Total number of field data records |
| meta.hasMore | <code>Boolean</code> | Indicates if there are more records   to retrieve |
| [meta.limit] | <code>Number</code> | Number of records to return |
| [nextRecordTime] | <code>Number</code> | UNIX timestamp indicating a   `timeStart` that would return new values |
| [meta.timeEnd] | <code>Number</code> | UNIX timestamp indicating the end of   the query window |
| [meta.timeStart] | <code>Number</code> | UNIX timestamp indicating the   start of the query window |
| [meta.window] | <code>Number</code> | The sampling window for records.   Required if including a timeEnd or timeStart.   Valid options include: `0`, `60`, `900`, and `3600` |
| records | [<code>Array.&lt;OutputFieldData&gt;</code>](#OutputFieldData) |  |

<a name="PaginationMetadata"></a>

## PaginationMetadata : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| offset | <code>number</code> | Offset of records in subsequent queries |
| totalRecords | <code>number</code> | Total number of asset attributes found |

<a name="PaginationOptions"></a>

## PaginationOptions : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| limit | <code>Number</code> | Maximum number of records to return per query |
| offset | <code>Number</code> | How many records from the first record to start   the query |

<a name="SessionType"></a>

## SessionType : <code>Object</code>
An adapter that allows the SDK to authenticate with different services and manage various tokens.
Can authenticate with a service like Auth0 and then with Contxt or can communicate directly
with Contxt. The adapter must implement required methods, but most methods are optional. Some of
the optional methods are documented below.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [getCurrentAccessToken] | <code>function</code> | Provides a current access token from Auth0 that is   used for profile information and can be used to get API token for Contxt itself |
| getCurrentApiToken | <code>function</code> | Provides a current API token that is used across   different Contxt services |
| [getProfile] | <code>function</code> | Provides profile information about the current user |
| [handleAuthentication] | <code>function</code> | Is called by front-end code in the Auth0 reference  implementation to handle getting the access token from Auth0 |
| isAuthenticated | <code>function</code> | Tells caller if the current user is authenticated. |
| [logIn] | <code>function</code> | Is used by front-end code in the Auth0 reference implementation to   start the sign in process |
| [logOut] | <code>function</code> | Is used by the front-end code in the Auth0 reference implementation   to sign the user out |

<a name="UserConfig"></a>

## UserConfig : <code>Object</code>
User provided configuration options

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| auth | <code>Object</code> |  | User assigned configurations specific for their authentication methods |
| [auth.authorizationPath] | <code>string</code> |  | Path Auth0WebAuth process should redirect to after a   successful sign in attempt |
| auth.clientId | <code>string</code> |  | Client Id provided by Auth0 for this application |
| [auth.clientSecret] | <code>string</code> |  | Client secret provided by Auth0 for this application. This   is optional for the auth0WebAuth SessionType, but required for the machineAuth SessionType |
| [auth.customModuleConfigs] | <code>Object.&lt;string, CustomAudience&gt;</code> |  | Custom environment setups   for individual modules. Requires clientId/host or env |
| [auth.env] | <code>string</code> | <code>&quot;&#x27;production&#x27;&quot;</code> | The environment that every module should use for   their clientId and host |
| [auth.onRedirect] | <code>function</code> | <code>(pathname) &#x3D;&gt; { window.location &#x3D; pathname; }</code> | A redirect   method used for navigating through Auth0 callbacks in Web applications |
| [auth.tokenExpiresAtBufferMs] | <code>number</code> | <code>300000</code> | The time (in milliseconds) before a   token truly expires that we consider it expired (i.e. the token's expiresAt - this = calculated   expiresAt). Defaults to 5 minutes. |
| [interceptors] | <code>Object</code> |  | Axios interceptors that can transform requests and responses.   More information at [axios Interceptors](https://github.com/axios/axios#interceptors) |
| [interceptors.request] | [<code>Array.&lt;AxiosInterceptor&gt;</code>](#AxiosInterceptor) |  | Interceptors that act on every request |
| [intercepotrs.response] | [<code>Array.&lt;AxiosInterceptor&gt;</code>](#AxiosInterceptor) |  | Intereptors that act on every response |

<a name="UserProfile"></a>

## UserProfile : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> |  |
| nickname | <code>string</code> |  |
| picture | <code>string</code> | URL to an avatar |
| sub | <code>string</code> | The Subject Claim of the user's JWT |
| updatedAt | <code>string</code> | ISO 8601 Extended Format date/time string |


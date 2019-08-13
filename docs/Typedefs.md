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
| [asset] | <code>Object</code> | The associated parent asset. Will always be   present if retrieving more than one AssetAttributeValue. |
| [asset.label] | <code>string</code> | Label of the parent asset. Will always be   present if retrieving more than one AssetAttributeValue. |
| [assetAttribute] | <code>Object</code> | The associated parent assetAttribute.   Will always be present if retrieving more than one AssetAttributeValue. |
| [assetAttribute.isRequired] | <code>boolean</code> | Indication of required status   for the parent asset attribute. Will always be present if retrieving more   than one AssetAttributeValue. |
| [assetAttribute.label] | <code>string</code> | Label of the parent assetAttribute.   Will always be present if retrieving more than one AssetAttributeValue. |
| [assetAttribute.units] | <code>string</code> | Units of the parent assetAttribute.   Will always be present if retrieving more than one AssetAttributeValue. |
| assetAttributeId | <code>string</code> | UUID corresponding to the assetAttribute |
| assetId | <code>string</code> | UUID corresponding to the asset |
| createdAt | <code>string</code> | ISO 8601 Extended Format date/time string |
| effectiveDate | <code>string</code> | ISO 8601 Extended Format date/time string |
| id | <code>string</code> | UUID |
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

<a name="AssetMetric"></a>

## AssetMetric : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| assetTypeId | <code>string</code> | UUID corresponding with the asset type |
| createdAt | <code>string</code> | ISO 8601 Extended Format date/time string |
| description | <code>string</code> |  |
| id | <code>string</code> | UUID |
| label | <code>string</code> |  |
| organizationId | <code>string</code> | UUID corresponding with the organization |
| timeInterval | <code>string</code> | Options are "hourly", "daily", "weekly", "monthly", "yearly" |
| [units] | <code>string</code> |  |
| updatedAt | <code>string</code> | ISO 8601 Extended Format date/time string |

<a name="AssetMetricValue"></a>

## AssetMetricValue : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| assetId | <code>string</code> | UUID corresponding to the asset |
| assetMetricId | <code>string</code> | UUID corresponding to the asset metric |
| createdAt | <code>string</code> | ISO 8601 Extended Format date/time string |
| effectiveEndDate | <code>string</code> | ISO 8601 Extended Format date/time string |
| effectiveStartDate | <code>string</code> | ISO 8601 Extended Format date/time string |
| id | <code>string</code> | UUID |
| notes | <code>string</code> |  |
| updatedAt | <code>string</code> | ISO 8601 Extended Format date/time string |
| value | <code>string</code> |  |

<a name="AssetMetricValuesFromServer"></a>

## AssetMetricValuesFromServer : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| _metadata | <code>Object</code> | Metadata about the pagination settings |
| _metadata.offset | <code>number</code> | Offset of records in subsequent queries |
| _metadata.totalRecords | <code>number</code> | Total number of asset types found |
| records | [<code>Array.&lt;AssetMetricValue&gt;</code>](#AssetMetricValue) |  |

<a name="AssetMetricsFromServer"></a>

## AssetMetricsFromServer : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| _metadata | <code>Object</code> | Metadata about the pagination settings |
| _metadata.offset | <code>number</code> | Offset of records in subsequent queries |
| _metadata.totalRecords | <code>number</code> | Total number of asset types found |
| records | [<code>Array.&lt;AssetMetric&gt;</code>](#AssetMetric) |  |

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
| [config.webSocket] | <code>string</code> | WebSocket URL for the API that corresponds with the clientId provided |

<a name="Auth0WebAuthSessionInfo"></a>

## Auth0WebAuthSessionInfo : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| accessToken | <code>string</code> | 
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

<a name="ContxtApplication"></a>

## ContxtApplication : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| clientId | <code>string</code> |  |
| clientSecret | <code>string</code> |  |
| createdAt | <code>string</code> | ISO 8601 Extended Format date/time string |
| currentVersionId | <code>string</code> |  |
| description | <code>string</code> |  |
| iconUrl | <code>string</code> |  |
| id | <code>number</code> |  |
| name | <code>string</code> |  |
| serviceId | <code>number</code> |  |
| type | <code>string</code> |  |
| updatedAt | <code>string</code> | ISO 8601 Extended Format date/time string |

<a name="ContxtApplicationConsent"></a>

## ContxtApplicationConsent : <code>Object</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| clientId | <code>string</code> |  |
| clientSecret | <code>string</code> |  |
| createdAt | <code>string</code> | ISO 8601 Extended Format date/time string |
| currentVersion | [<code>ContxtApplicationVersion</code>](./Typedefs.md#ContxtApplicationVersion) | The current application version |
| description | <code>string</code> | Application's description |
| iconUrl | <code>string</code> | Application's icon url |
| id | <code>number</code> | Application's ID |
| name | <code>string</code> | Application's name |
| serviceId | <code>number</code> | Application's service ID |
| updatedAt | <code>string</code> | ISO 8601 Extended Format date/time string |

<a name="ContxtApplicationGrouping"></a>

## ContxtApplicationGrouping : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| applicationId | <code>number</code> |  |
| applicationModules | [<code>Array.&lt;ContxtApplicationModule&gt;</code>](#ContxtApplicationModule) |  |
| id | <code>string</code> |  |
| index | <code>number</code> | The position of the grouping within the list of all   groupings of a the parent application |
| label | <code>string</code> |  |

<a name="ContxtApplicationModule"></a>

## ContxtApplicationModule : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| applicationGroupingId | <code>string</code> |  |
| [externalLink] | <code>string</code> | A URI pointing to an external application |
| [iconUrl] | <code>string</code> | A URI pointing to an icon/image representing the   application module |
| id | <code>string</code> |  |
| index | <code>number</code> | The position of the module within the list of all   modules of a the parent application grouping |
| label | <code>string</code> |  |
| slug | <code>string</code> | String that corresponds with a front-end package   name (e.g. the `@ndustrial/nsight-example` example application) |

<a name="ContxtApplicationVersion"></a>

## ContxtApplicationVersion : <code>Object</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| applicationId | <code>number</code> |  |
| [consent] | [<code>ContxtConsent</code>](./Typedefs.md#ContxtConsent) | The consent model associated with this application version |
| consentId | <code>string</code> |  |
| createdAt | <code>string</code> | ISO 8601 Extended Format date/time string |
| description | <code>string</code> |  |
| id | <code>string</code> | UUID |
| label | <code>string</code> |  |
| updatedAt | <code>string</code> | ISO 8601 Extended Format date/time string |

<a name="ContxtConsent"></a>

## ContxtConsent : <code>Object</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| createdAt | <code>string</code> | ISO 8601 Extended Format date/time string |
| [effectiveEndDate] | <code>string</code> | ISO 8601 Extended Format date/time string |
| effectiveStartDate | <code>string</code> | ISO 8601 Extended Format date/time string |
| id | <code>string</code> | UUID |
| text | <code>string</code> | The body of the consent form in HTML |
| updatedAt | <code>string</code> | ISO 8601 Extended Format date/time string |
| userApproval | [<code>Array.&lt;ContxtUser&gt;</code>](#ContxtUser) | An array of users. If empty, the user has not consented |

<a name="ContxtOrganization"></a>

## ContxtOrganization : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| createdAt | <code>string</code> | ISO 8601 Extended Format date/time string |
| id | <code>string</code> | UUID formatted ID |
| legacyOrganizationId | <code>number</code> |  |
| name | <code>string</code> |  |
| updatedAt | <code>string</code> | ISO 8601 Extended Format date/time string |

<a name="ContxtOrganizationFeaturedApplication"></a>

## ContxtOrganizationFeaturedApplication : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| applicationId | <code>number</code> |  |
| createdAt | <code>string</code> | ISO 8601 Extended Format date/time string |
| id | <code>string</code> |  |
| organizationId | <code>string</code> |  |
| updatedAt | <code>string</code> | ISO 8601 Extended Format date/time string |

<a name="ContxtRole"></a>

## ContxtRole : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| applications | [<code>Array.&lt;ContxtApplication&gt;</code>](#ContxtApplication) |  |
| createdAt | <code>string</code> | ISO 8601 Extended Format date/time string |
| description | <code>string</code> |  |
| id | <code>string</code> |  |
| name | <code>string</code> |  |
| organizationId | <code>string</code> |  |
| stacks | [<code>Array.&lt;ContxtStack&gt;</code>](#ContxtStack) |  |
| updatedAt | <code>string</code> | ISO 8601 Extended Format date/time string |

<a name="ContxtRoleApplication"></a>

## ContxtRoleApplication : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| applicationId | <code>number</code> |  |
| createdAt | <code>string</code> | ISO 8601 Extended Format date/time string |
| id | <code>number</code> |  |
| roleId | <code>string</code> |  |
| updatedAt | <code>string</code> | ISO 8601 Extended Format date/time string |

<a name="ContxtRoleStack"></a>

## ContxtRoleStack : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| accessType | <code>string</code> | Access Type of the user for this stack with options "reader", "collaborator", "owner" |
| createdAt | <code>string</code> | ISO 8601 Extended Format date/time string |
| id | <code>number</code> |  |
| userId | <code>string</code> |  |
| stackId | <code>number</code> |  |
| updatedAt | <code>string</code> | ISO 8601 Extended Format date/time string |

<a name="ContxtStack"></a>

## ContxtStack : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| clientId | <code>string</code> |  |
| clusterId | <code>string</code> |  |
| createdAt | <code>string</code> | ISO 8601 Extended Format date/time string |
| currentVersionId | <code>string</code> |  |
| description | <code>string</code> |  |
| documentationUrl | <code>string</code> |  |
| icon | <code>string</code> |  |
| id | <code>number</code> |  |
| name | <code>string</code> |  |
| organizationId | <code>string</code> |  |
| ownerId | <code>string</code> |  |
| type | <code>string</code> |  |
| updatedAt | <code>string</code> | ISO 8601 Extended Format date/time string |

<a name="ContxtUser"></a>

## ContxtUser : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| createdAt | <code>string</code> | ISO 8601 Extended Format date/time string |
| email | <code>string</code> |  |
| firstName | <code>string</code> |  |
| id | <code>string</code> |  |
| isActivated | <code>boolean</code> |  |
| isSuperuser | <code>boolean</code> |  |
| lastName | <code>string</code> |  |
| [phoneNumber] | <code>string</code> |  |
| updatedAt | <code>string</code> | ISO 8601 Extended Format date/time string |

<a name="ContxtUserApplication"></a>

## ContxtUserApplication : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| applicationId | <code>string</code> |  |
| createdAt | <code>string</code> | ISO 8601 Extended Format date/time string |
| id | <code>string</code> |  |
| userId | <code>string</code> |  |
| updatedAt | <code>string</code> | ISO 8601 Extended Format date/time string |

<a name="ContxtUserConsentApproval"></a>

## ContxtUserConsentApproval : <code>Object</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| consentId | <code>string</code> |  |
| createdAt | <code>string</code> | ISO 8601 Extended Format date/time string |
| id | <code>string</code> | UUID |
| updatedAt | <code>string</code> | ISO 8601 Extended Format date/time string |
| userId | <code>string</code> | UUID |

<a name="ContxtUserFavoriteApplication"></a>

## ContxtUserFavoriteApplication : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| applicationId | <code>number</code> |  |
| createdAt | <code>string</code> | ISO 8601 Extended Format date/time string |
| id | <code>string</code> |  |
| updatedAt | <code>string</code> | ISO 8601 Extended Format date/time string |
| userId | <code>string</code> |  |

<a name="ContxtUserPermissions"></a>

## ContxtUserPermissions : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| applicationsExplicit | <code>Array.&lt;number&gt;</code> | Application ids the user has directly been given access to |
| applicationsImplicit | <code>Array.&lt;number&gt;</code> | Application ids the user has access to from a role or being the owner |
| roles | <code>Array.&lt;string&gt;</code> | Role ids that the user belongs to |
| stacksExplicit | <code>Array.&lt;number&gt;</code> | Stack ids the user has directly been given access to |
| stacksImplicit | <code>Array.&lt;number&gt;</code> | Stack ids the user has access to from a role or being the owner |
| userId | <code>string</code> |  |

<a name="ContxtUserRole"></a>

## ContxtUserRole : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| createdAt | <code>string</code> | ISO 8601 Extended Format date/time string |
| id | <code>string</code> |  |
| mappedFromExternalGroup | <code>boolean</code> |  |
| userId | <code>string</code> |  |
| roleId | <code>string</code> |  |
| updatedAt | <code>string</code> | ISO 8601 Extended Format date/time string |

<a name="ContxtUserStack"></a>

## ContxtUserStack : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| accessType | <code>string</code> | Access Type of the user for this stack with options "reader", "collaborator", "owner" |
| createdAt | <code>string</code> | ISO 8601 Extended Format date/time string |
| id | <code>string</code> |  |
| userId | <code>string</code> |  |
| stackId | <code>string</code> |  |
| updatedAt | <code>string</code> | ISO 8601 Extended Format date/time string |

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
| [config.webSocket] | <code>string</code> | WebSocket URL for the API that corresponds with the clientId provided |

<a name="EdgeNode"></a>

## EdgeNode : <code>Object</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| clientId | <code>string</code> |  |
| createdAt | <code>string</code> | ISO 8601 Extended Format date/time string |
| [description] | <code>string</code> |  |
| id | <code>string</code> | UUID |
| name | <code>string</code> |  |
| organizationId | <code>string</code> | UUID |
| updatedAt | <code>string</code> | ISO 8601 Extended Format date/time string |

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

<a name="EventType"></a>

## EventType : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| clientId | <code>string</code> | UUID corresponding with the client |
| createdAt | <code>string</code> | ISO 8601 Extended Format date/time string |
| description | <code>string</code> |  |
| id | <code>string</code> | UUID |
| isOngoingEvent | <code>boolean</code> | Flag for if the event is ongoing/updated frequently |
| isRealtimeEnabled | <code>boolean</code> | Flag for if the event is real time |
| level | <code>number</code> | Priority level associated with event type |
| name | <code>string</code> |  |
| slug | <code>string</code> | Unique per clientId to identify the event type |
| updatedAt | <code>string</code> | ISO 8601 Extended Format date/time string |

<a name="EventTypesFromServer"></a>

## EventTypesFromServer : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| _metadata | <code>Object</code> | Metadata about the pagination settings |
| _metadata.offset | <code>number</code> | Offset of records in subsequent queries |
| _metadata.totalRecords | <code>number</code> | Total number of asset types found |
| records | [<code>Array.&lt;EventType&gt;</code>](#EventType) |  |

<a name="EventsFromServer"></a>

## EventsFromServer : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| _metadata | <code>Object</code> | Metadata about the pagination settings |
| _metadata.offset | <code>number</code> | Offset of records in subsequent queries |
| _metadata.totalRecords | <code>number</code> | Total number of asset types found |
| records | [<code>Array.&lt;Event&gt;</code>](#Event) |  |

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

<a name="FieldCategoriesFromServer"></a>

## FieldCategoriesFromServer : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| _metadata | <code>Object</code> | Metadata about the pagination settings |
| _metadata.offset | <code>number</code> | Offset of records in subsequent queries |
| _metadata.totalRecords | <code>number</code> | Total number of asset types found |
| records | [<code>Array.&lt;FieldCategory&gt;</code>](#FieldCategory) |  |

<a name="FieldCategory"></a>

## FieldCategory : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| description | <code>String</code> |  |
| id | <code>String</code> | UUID |
| name | <code>String</code> |  |
| organizationId | <code>String</code> |  |
| [parentCategoryId] | <code>String</code> | UUID |

<a name="FieldGrouping"></a>

## FieldGrouping : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| description | <code>String</code> |  |
| [fieldCategoryId] | <code>String</code> | UUID |
| facilityId | <code>Number</code> |  |
| id | <code>String</code> | UUID |
| isPublic | <code>Boolean</code> |  |
| label | <code>String</code> |  |
| ownerId | <code>String</code> |  |
| slug | <code>String</code> |  |

<a name="FieldGroupingField"></a>

## FieldGroupingField : <code>Object</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| createdAt | <code>string</code> | ISO 8601 Extended Format date/time string |
| fieldGroupingId | <code>string</code> | UUID |
| id | <code>string</code> | UUID |
| outputFieldId | <code>number</code> |  |
| updatedAt | <code>string</code> | ISO 8601 Extended Format date/time string |

<a name="FieldGroupingsFromServer"></a>

## FieldGroupingsFromServer : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| _metadata | <code>Object</code> | Metadata about the pagination settings |
| _metadata.offset | <code>number</code> | Offset of records in subsequent queries |
| _metadata.totalRecords | <code>number</code> | Total number of asset types found |
| records | [<code>Array.&lt;FieldGrouping&gt;</code>](#FieldGrouping) |  |

<a name="File"></a>

## File : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| createdAt | <code>string</code> | ISO 8601 Extended Format date/time string |
| contentType | <code>string</code> | The MIME type of the file |
| description | <code>string</code> |  |
| filename | <code>string</code> |  |
| id | <code>string</code> | UUID of the file |
| organizationId | <code>string</code> | UUID of the organization to which the file belongs |
| ownerId | <code>string</code> | The ID of the user who owns the file |
| status | <code>string</code> | The status of the File, e.g. "ACTIVE" |
| updatedAt | <code>string</code> | ISO 8601 Extended Format date/time string |

<a name="FileError"></a>

## FileError : <code>Error</code>
An error returned while creating and uploading an
  individual file

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| artifacts | <code>Object</code> | Records that may have been created while   creating and uploading a file. Can be used to pick up the process manually   or clean up before trying again. |
| [artifacts.file] | <code>Object</code> | A created File artifact |
| originalError | <code>Error</code> | The original error object that can be used   for additional debugging purposes |
| stage | <code>string</code> | A string describing in what stage of the create and   upload process the failure occurred. Possible choices are:     - create (failed while creating the initial file record)     - upload (failed while uploading the actual file for storage)     - statusUpdate (failed while updating the upload status for the file record)     - get (failed at the end while getting an updated file record) |

<a name="FileToDownload"></a>

## FileToDownload : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| createdAt | <code>string</code> | ISO 8601 Extended Format date/time string |
| contentType | <code>string</code> | The MIME type of the file |
| description | <code>string</code> |  |
| downloadInfo | <code>Object</code> |  |
| downloadInfo.attachmentUrl | <code>string</code> | A URL that can be used to download the file from the external storage |
| downloadInfo.expiresAt | <code>string</code> | ISO 8601 Extended Format date/time indicating when the attachement and inline URLs expire |
| downloadInfo.inlineUrl | <code>string</code> | A URL that can be used for embedding the file into a page |
| filename | <code>string</code> |  |
| id | <code>string</code> | UUID of the file |
| organizationId | <code>string</code> | UUID of the organization to which the file belongs |
| ownerId | <code>string</code> | The ID of the user who owns the file |
| status | <code>string</code> | The status of the File, e.g. "ACTIVE" |
| updatedAt | <code>string</code> | ISO 8601 Extended Format date/time string |

<a name="FileWithUploadInformation"></a>

## FileWithUploadInformation : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| createdAt | <code>string</code> | ISO 8601 Extended Format date/time string |
| contentType | <code>string</code> | The MIME type of the file |
| description | <code>string</code> |  |
| filename | <code>string</code> |  |
| id | <code>string</code> | UUID of the file |
| organizationId | <code>string</code> | UUID of the organization to which the file   belongs |
| ownerId | <code>string</code> | The ID of the user who owns the file |
| status | <code>string</code> | The status of the File, e.g. "ACTIVE" |
| updatedAt | <code>string</code> | ISO 8601 Extended Format date/time string |
| uploadInfo | <code>Object</code> | Information related to the uploading the   underlying file |
| uploadInfo.expiresAt | <code>string</code> | A ISO 8601 Extended format date/time   string indicating when the validity of the included URL expires |
| uploadInfo.headers | <code>Object.&lt;string, string&gt;</code> | to be appended to the   request when uploading the file. The key is the header name and the value   is the included value. |
| uploadInfo.method | <code>string</code> | The HTTP method to be used when   uploading the file. |
| uploadInfo.url | <code>string</code> | The URL to be used when uploading the file. |

<a name="FilesFromServer"></a>

## FilesFromServer : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| _metadata | <code>Object</code> | Metadata about the pagination settings |
| _metadata.offset | <code>number</code> | Offset of records in subsequent queries |
| _metadata.totalRecords | <code>number</code> | Total number of files found |
| records | [<code>Array.&lt;File&gt;</code>](#File) |  |

<a name="MachineAuthSessionInfo"></a>

## MachineAuthSessionInfo : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| apiToken | <code>string</code> | 
| expiresAt | <code>number</code> | 

<a name="MessageBusChannel"></a>

## MessageBusChannel : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | UUID formatted ID |
| name | <code>string</code> |  |
| organizationId | <code>string</code> | UUID of the organization to which the channel belongs |
| serviceId | <code>string</code> |  |

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
| [isAuthenticated] | <code>function</code> | Tells caller if the current user is authenticated.  Different session types may determine if a user is authenticated in different ways. |
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

<a name="UserEventSubscription"></a>

## UserEventSubscription : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| eventId | <code>string</code> |  |
| createdAt | <code>string</code> | ISO 8601 Extended Format date/time string |
| id | <code>string</code> |  |
| userId | <code>string</code> |  |
| updatedAt | <code>string</code> | ISO 8601 Extended Format date/time string |

<a name="UserProfile"></a>

## UserProfile : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| email | <code>string</code> |  |
| email_verified | <code>boolean</code> |  |
| name | <code>string</code> |  |
| nickname | <code>string</code> |  |
| picture | <code>string</code> | URL to an avatar |
| sub | <code>string</code> | The Subject Claim of the user's JWT |
| updatedAt | <code>string</code> | ISO 8601 Extended Format date/time string |

<a name="WebSocket"></a>

## WebSocket : <code>Object</code>
The raw WebSocket created by ws

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| addEventListener | <code>function</code> | Register an event listener emulating the EventTarget interface |
| binaryType | <code>string</code> | A string indicating the type of binary data being transmitted by the connection. This should be one of "nodebuffer", "arraybuffer" or "fragments". Defaults to "nodebuffer". |
| bufferedAmount | <code>number</code> | The number of bytes of data that have been queued using calls to send() but not yet transmitted to the network. |
| close | <code>function</code> | Initiate a closing handshake |
| extensions | <code>Object</code> | An object containing the negotiated extensions |
| onclose | <code>function</code> | An event listener to be called when connection is closed |
| onerror | <code>function</code> | An event listener to be called when an error occurs |
| onmessage | <code>function</code> | An event listener to be called when a message is received from the server |
| onopen | <code>function</code> | An event listener to be called when the connection is established |
| ping | <code>function</code> | Send a ping to the WebSocket server |
| pong | <code>function</code> | Send a pong to the WebSocket server |
| protocol | <code>string</code> | The subprotocol selected by the server |
| readyState | <code>number</code> | The current state of the connection |
| removeEventListener | <code>function</code> | Removes an event listener emulating the EventTarget interface |
| send | <code>function</code> | Send data through the open WebSocket connection |
| terminate | <code>function</code> | Forcibly close the connection |
| url | <code>string</code> | The URL of the WebSocket server |

<a name="WebSocketConnection"></a>

## WebSocketConnection : <code>Object</code>
A wrapper around the raw WebSocket to provide a finite set of operations

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| close | <code>function</code> | Closes the WebSocket connection to the message bus server |
| _organizationId | <code>string</code> | The organization id for the open WebSocket connection |
| _webSocket | [<code>WebSocket</code>](./Typedefs.md#WebSocket) | The raw WebSocket connection to the message bus |


* [WebSocketConnection](#WebSocketConnection) : <code>Object</code>
    * [new WebSocketConnection(webSocket, organizationId)](#new_WebSocketConnection_new)
    * [.authorize(token)](#WebSocketConnection+authorize) ⇒ <code>Promise</code>
    * [.close()](#WebSocketConnection+close)
    * [.publish(serviceClientId, channel, message)](#WebSocketConnection+publish) ⇒ <code>Promise</code>
    * [.subscribe(serviceClientId, channel, [group], handler, errorHandler)](#WebSocketConnection+subscribe)

<a name="new_WebSocketConnection_new"></a>

### new WebSocketConnection(webSocket, organizationId)

| Param | Type | Description |
| --- | --- | --- |
| webSocket | [<code>WebSocket</code>](./Typedefs.md#WebSocket) | A WebSocket connection to the message bus |
| organizationId | <code>string</code> | UUID corresponding with an organization |

<a name="WebSocketConnection+authorize"></a>

### webSocketConnection.authorize(token) ⇒ <code>Promise</code>
Sends a message to the message bus to authorize a channel

**Kind**: instance method of [<code>WebSocketConnection</code>](#WebSocketConnection)  
**Fulfill**:   
**Reject**: <code>error</code> The error event from the WebSocket or the error message from the message bus  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>string</code> | JSON Web Signature containing the channel and actions needed for authorization |

**Example**  
```js
contxtSdk.bus.connect('4f0e51c6-728b-4892-9863-6d002e61204d')
    .then((webSocket) => {
      webSocket.authorize(token).then(() => {
        console.log("authorization successful")
      })
      .catch((authError) => {
        console.log(authError)
      });
    })
});
```
<a name="WebSocketConnection+close"></a>

### webSocketConnection.close()
Closes the websocket connection

**Kind**: instance method of [<code>WebSocketConnection</code>](#WebSocketConnection)  
**Example**  
```js
contxtSdk.bus.connect('4f0e51c6-728b-4892-9863-6d002e61204d')
  .then((webSocket) => {
    webSocket.close()
  })
  .catch((errorEvent) => {
    console.log(errorEvent);
  });
```
<a name="WebSocketConnection+publish"></a>

### webSocketConnection.publish(serviceClientId, channel, message) ⇒ <code>Promise</code>
Publishes a message to a specific channel on the message bus

**Kind**: instance method of [<code>WebSocketConnection</code>](#WebSocketConnection)  
**Fulfill**:   
**Reject**: <code>error</code> The error event from the WebSocket or the error message from the message bus  

| Param | Type | Description |
| --- | --- | --- |
| serviceClientId | <code>string</code> | Client ID of the message bus service |
| channel | <code>string</code> | Message bus channel the message is being sent to |
| message | <code>Any</code> | Message being sent to the message bus. Must be valid JSON. |

**Example**  
```js
contxtSdk.bus.connect('4f0e51c6-728b-4892-9863-6d002e61204d')
    .then((webSocket) => {
      webSocket.publish('GCXd2bwE9fgvqxygrx2J7TkDJ3ef', 'feed:1', {"example": 1}).then(() => {
        console.log("publish successful")
      })
      .catch((error) => {
        console.log(error)
      });
    });
```
<a name="WebSocketConnection+subscribe"></a>

### webSocketConnection.subscribe(serviceClientId, channel, [group], handler, errorHandler)
Subscribes to a specific channel on the message bus and handles messages as they are received. When the handler is
called, the message is automatically acknowledged after the message completes except whenever an Error is thrown.
The user can also programmatically control when the message is acknowledged by calling `ack` at any time.

**Kind**: instance method of [<code>WebSocketConnection</code>](#WebSocketConnection)  

| Param | Type | Description |
| --- | --- | --- |
| serviceClientId | <code>string</code> | Client ID of the message bus service |
| channel | <code>string</code> | Message bus channel the message is being sent to |
| [group] | <code>string</code> | A unique identifier for the subscriber that can be shared between connections |
| handler | <code>function</code> | A function that gets invoked with every received message |
| errorHandler | <code>function</code> | A function that gets invoked with every error |

**Example**  
```js
contxtSdk.bus.connect('4f0e51c6-728b-4892-9863-6d002e61204d')
    .then((webSocket) => {
      webSocket.subscribe('GCXd2bwE9fgvqxygrx2J7TkDJ3ef', 'feed:1', 'test-sub', (message) => {
        console.log('Message received: ', message);
      }, (error) => {
        console.log('Error received: ', error);
      });
    });
```
**Example**  
```js
contxtSdk.bus.connect('4f0e51c6-728b-4892-9863-6d002e61204d')
    .then((webSocket) => {
      webSocket.subscribe('GCXd2bwE9fgvqxygrx2J7TkDJ3ef', 'feed:1', 'test-sub', (message, ack) => {
        console.log('Message received: ', message);

        ack();
      }, (error) => {
        console.log('Error received: ', error);
      });
    });
```
**Example**  
```js
contxtSdk.bus.connect('4f0e51c6-728b-4892-9863-6d002e61204d')
    .then((webSocket) => {
      webSocket.subscribe('GCXd2bwE9fgvqxygrx2J7TkDJ3ef', 'feed:1', (message) => {
        return db.save(message);
      }, (error) => {
        console.log('Error received: ', error);
      });
    });
```
**Example**  
```js
contxtSdk.bus.connect('4f0e51c6-728b-4892-9863-6d002e61204d')
    .then((webSocket) => {
      webSocket.subscribe('GCXd2bwE9fgvqxygrx2J7TkDJ3ef', 'feed:1', (message, ack) => {
        return db.save(message)
          .then(ack)
          .then(() => {
            // additional processing
          });
      }, (error) => {
        console.log('Error received: ', error);
      });
    });
```
<a name="WebSocketError"></a>

## WebSocketError : <code>Object</code>
The WebSocket Error Event

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | The event type |

<a name="WebSocketMessage"></a>

## WebSocketMessage : <code>Object</code>
The WebSocket Message Event

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The data sent by the message emitter |
| origin | <code>string</code> | A USVString representing the origin of the message emitter |
| lastEventId | <code>string</code> | A DOMString representing a unique ID for the event |
| source | <code>Object</code> | A MessageEventSource (which can be a WindowProxy, MessagePort, or ServiceWorker object) representing the message emitter |
| ports | <code>Array</code> | MessagePort objects representing the ports associated with the channel the message is being sent through (where appropriate, e.g. in channel messaging or when sending a message to a shared worker) |


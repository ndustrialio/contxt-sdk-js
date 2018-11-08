## Classes

<dl>
<dt><a href="./AssetAttributes.md">AssetAttributes</a></dt>
<dd><p>Module that provides access to, and the manipulation of, information about
different asset attributes and their values</p>
</dd>
<dt><a href="./AssetMetrics.md">AssetMetrics</a></dt>
<dd><p>Module that provides access to, and the manipulation of, information about different asset metrics</p>
</dd>
<dt><a href="./AssetTypes.md">AssetTypes</a></dt>
<dd><p>Module that provides access to, and the manipulation of, information about different asset types</p>
</dd>
<dt><a href="./Assets.md">Assets</a></dt>
<dd><p>Module that provides access to, and the manipulation of, information about different assets</p>
</dd>
<dt><a href="./Auth0WebAuth.md">Auth0WebAuth</a> : <code><a href="./Typedefs.md#SessionType">SessionType</a></code></dt>
<dd><p>A SessionType that allows the user to initially authenticate with Auth0 and then gain a valid JWT
from the Contxt Auth service. This would only be used in web applications. You will need to
integrate this module&#39;s <code>logIn</code>, <code>logOut</code>, and <code>handleAuthentication</code> methods with your UI
elements. <code>logIn</code> would be tied to a UI element to log the user in. <code>logOut</code> would be tied to a
UI element to log the user out. <code>handleAuthentication</code> would be tied with your application&#39;s
router and would be called when visting the route defined by <code>config.authorizationPath</code> (the
default is <code>/callback</code>).</p>
<p>This SessionType is set up to refresh auth tokens automatically. To ensure this works, make sure
your single page application has <a href="https://auth0.com/docs/cross-origin-authentication#configure-your-application-for-cross-origin-authentication">Cross-Origin Authentication</a>
enabled in Auth0.</p>
<p><em>NOTE</em>: The web origin added in auth0 should be something like
&quot;<a href="http://localhost:5000&quot;">http://localhost:5000&quot;</a>, not &quot;<a href="http://localhost:5000/callback&quot;">http://localhost:5000/callback&quot;</a></p>
</dd>
<dt><a href="./Bus.md">Bus</a></dt>
<dd><p>Module that provides access to the message bus</p>
</dd>
<dt><a href="./Channels.md">Channels</a></dt>
<dd><p>Module that provides access to message bus channels</p>
</dd>
<dt><a href="./Config.md">Config</a></dt>
<dd><p>Module that merges user assigned configurations with default configurations.</p>
</dd>
<dt><a href="./ContxtSdk.md">ContxtSdk</a></dt>
<dd><p>ContxtSdk constructor</p>
</dd>
<dt><a href="./Coordinator.md">Coordinator</a></dt>
<dd><p>Module that provides access to information about Contxt</p>
</dd>
<dt><a href="./CostCenters.md">CostCenters</a></dt>
<dd><p>Module that provides access to cost centers, and helps manage
the relationship between those cost centers and facilities</p>
</dd>
<dt><a href="./EdgeNodes.md">EdgeNodes</a></dt>
<dd><p>Module that provides access to contxt edge nodes</p>
</dd>
<dt><a href="./Events.md">Events</a></dt>
<dd><p>Module that provides access to, and the manipulation
of, information about different events</p>
</dd>
<dt><a href="./Facilities.md">Facilities</a></dt>
<dd><p>Module that provides access to, and the manipulation
of, information about different facilities</p>
</dd>
<dt><a href="./FacilityGroupings.md">FacilityGroupings</a></dt>
<dd><p>Module that provides access to facility groupings, and helps manage
the relationship between those groupings and facilities</p>
</dd>
<dt><a href="./FieldCategories.md">FieldCategories</a></dt>
<dd><p>Module that provides access to field category information</p>
</dd>
<dt><a href="./FieldGroupings.md">FieldGroupings</a></dt>
<dd><p>Module that provides access to field information</p>
</dd>
<dt><a href="./Fields.md">Fields</a></dt>
<dd><p>Module that provides access to field information</p>
</dd>
<dt><a href="./Iot.md">Iot</a></dt>
<dd><p>Module that provides access to real time IOT feeds and fields.</p>
</dd>
<dt><a href="./MachineAuth.md">MachineAuth</a> : <code><a href="./Typedefs.md#SessionType">SessionType</a></code></dt>
<dd><p>A SessionType that allows machine to machine communication between Node.js servers. This would
only be used in Node.js applications. This SessionType requires a client id and a client secret,
which are obtained from Auth0.</p>
</dd>
<dt><a href="./Outputs.md">Outputs</a></dt>
<dd><p>Module that provides access to output information</p>
</dd>
<dt><a href="./Request.md">Request</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="./Typedefs.md#Asset">Asset</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="./Typedefs.md#AssetAttribute">AssetAttribute</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="./Typedefs.md#AssetAttributeData">AssetAttributeData</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="./Typedefs.md#AssetAttributeValue">AssetAttributeValue</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="./Typedefs.md#AssetAttributeValueData">AssetAttributeValueData</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="./Typedefs.md#AssetMetric">AssetMetric</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="./Typedefs.md#AssetMetricValue">AssetMetricValue</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="./Typedefs.md#AssetMetricValuesFromServer">AssetMetricValuesFromServer</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="./Typedefs.md#AssetMetricsFromServer">AssetMetricsFromServer</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="./Typedefs.md#AssetType">AssetType</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="./Typedefs.md#AssetTypesFromServer">AssetTypesFromServer</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="./Typedefs.md#AssetsFromServer">AssetsFromServer</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="./Typedefs.md#Audience">Audience</a> : <code>Object</code></dt>
<dd><p>A single audience used for authenticating and communicating with an individual API.</p>
</dd>
<dt><a href="./Typedefs.md#Auth0WebAuthSessionInfo">Auth0WebAuthSessionInfo</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="./Typedefs.md#AxiosInterceptor">AxiosInterceptor</a> : <code>Object</code></dt>
<dd><p>An object of interceptors that get called on every request or response.
More information at <a href="https://github.com/axios/axios#interceptors">axios Interceptors</a></p>
</dd>
<dt><a href="./Typedefs.md#ContxtOrganization">ContxtOrganization</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="./Typedefs.md#ContxtUser">ContxtUser</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="./Typedefs.md#CostCenter">CostCenter</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="./Typedefs.md#CostCenterFacility">CostCenterFacility</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="./Typedefs.md#CustomAudience">CustomAudience</a> : <code>Object</code></dt>
<dd><p>A custom audience that will override the configuration of an individual module. Consists of
either a reference to an environment that already exists or a clientId and host for a
custom environment.</p>
</dd>
<dt><a href="./Typedefs.md#EdgeNode">EdgeNode</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="./Typedefs.md#Environments">Environments</a> : <code>Object.&lt;string, Audience&gt;</code></dt>
<dd><p>An object of audiences that corresponds to all the different environments available for a
single module.</p>
</dd>
<dt><a href="./Typedefs.md#Event">Event</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="./Typedefs.md#EventType">EventType</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="./Typedefs.md#EventTypesFromServer">EventTypesFromServer</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="./Typedefs.md#EventsFromServer">EventsFromServer</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="./Typedefs.md#ExternalModule">ExternalModule</a> : <code>Object</code></dt>
<dd><p>An external module to be integrated into the SDK as a first class citizen. Includes information
for authenticating and communicating with an individual API and the external module itself.</p>
</dd>
<dt><a href="./Typedefs.md#Facility">Facility</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="./Typedefs.md#FacilityGrouping">FacilityGrouping</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="./Typedefs.md#FacilityGroupingFacility">FacilityGroupingFacility</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="./Typedefs.md#FieldCategory">FieldCategory</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="./Typedefs.md#FieldGrouping">FieldGrouping</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="./Typedefs.md#FieldGroupingField">FieldGroupingField</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="./Typedefs.md#MachineAuthSessionInfo">MachineAuthSessionInfo</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="./Typedefs.md#MessageBusChannel">MessageBusChannel</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="./Typedefs.md#OutputField">OutputField</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="./Typedefs.md#OutputFieldData">OutputFieldData</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="./Typedefs.md#OutputFieldDataResponse">OutputFieldDataResponse</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="./Typedefs.md#PaginationMetadata">PaginationMetadata</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="./Typedefs.md#PaginationOptions">PaginationOptions</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="./Typedefs.md#SessionType">SessionType</a> : <code>Object</code></dt>
<dd><p>An adapter that allows the SDK to authenticate with different services and manage various tokens.
Can authenticate with a service like Auth0 and then with Contxt or can communicate directly
with Contxt. The adapter must implement required methods, but most methods are optional. Some of
the optional methods are documented below.</p>
</dd>
<dt><a href="./Typedefs.md#UserConfig">UserConfig</a> : <code>Object</code></dt>
<dd><p>User provided configuration options</p>
</dd>
<dt><a href="./Typedefs.md#UserProfile">UserProfile</a> : <code>Object</code></dt>
<dd></dd>
</dl>


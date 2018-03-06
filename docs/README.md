## Classes

<dl>
<dt><a href="./Facilities.md">Facilities</a></dt>
<dd><p>Module that provides access to, and the manipulation
of, information about different facilities</p>
</dd>
<dt><a href="./ContxtSdk.md">ContxtSdk</a></dt>
<dd><p>ContxtSdk constructor</p>
</dd>
<dt><a href="./Request.md">Request</a></dt>
<dd></dd>
<dt><a href="./Config.md">Config</a></dt>
<dd><p>Module that merges user assigned configurations with default configurations.</p>
</dd>
<dt><a href="./Auth0WebAuth.md">Auth0WebAuth</a> : <code>./Typedefs.md#SessionType</code></dt>
<dd><p>A SessionType that allows the user to initially authenticate with Auth0 and then gain a valid JWT
from the Contxt Auth service.</p>
</dd>
<dt><a href="./MachineAuth.md">MachineAuth</a> : <code>./Typedefs.md#SessionType</code></dt>
<dd><p>A SessionType that allows machine to machine communication between Node.js servers.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="./Typedefs.md#Facility">Facility</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="./Typedefs.md#SessionType">SessionType</a> : <code>Object</code></dt>
<dd><p>An adapter that allows the SDK to authenticate with different services and manage various tokens.
Can authenticate with a service like Auth0 and then with Contxt or can communicate directly
with Contxt. The adapter must implement required methods, but most methods are optional. Some of
the optional methods are documented below.</p>
</dd>
<dt><a href="./Typedefs.md#Audience">Audience</a> : <code>Object</code></dt>
<dd><p>A single audience used for authenticating and communicating with an individual API.</p>
</dd>
<dt><a href="./Typedefs.md#CustomAudience">CustomAudience</a> : <code>Object</code></dt>
<dd><p>A custom audience that will override the configuration of an individual module. Consists of
either a reference to an environment that already exists or a clientId and host for a
custom environment.</p>
</dd>
<dt><a href="./Typedefs.md#Environments">Environments</a> : <code>Object.&lt;string, Audience&gt;</code></dt>
<dd><p>An object of audiences that corresponds to all the different environments available for a
single module.</p>
</dd>
<dt><a href="./Typedefs.md#ExternalModule">ExternalModule</a> : <code>Object</code></dt>
<dd><p>An external module to be integrated into the SDK as a first class citizen. Includes information
for authenticating and communicating with an individual API and the external module itself.</p>
</dd>
<dt><a href="./Typedefs.md#UserConfig">UserConfig</a> : <code>Object</code></dt>
<dd><p>User provided configuration options</p>
</dd>
<dt><a href="./Typedefs.md#UserProfile">UserProfile</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="./Typedefs.md#Auth0WebAuthSessionInfo">Auth0WebAuthSessionInfo</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="./Typedefs.md#MachineAuthSessionInfo">MachineAuthSessionInfo</a> : <code>Object</code></dt>
<dd></dd>
</dl>


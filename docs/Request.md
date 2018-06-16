<a name="Request"></a>

## Request
**Kind**: global class  

* [Request](#Request)
    * [new Request(sdk, audienceName)](#new_Request_new)
    * [.delete()](#Request+delete) ⇒ <code>Promise</code>
    * [.get()](#Request+get) ⇒ <code>Promise</code>
    * [.head()](#Request+head) ⇒ <code>Promise</code>
    * [.options()](#Request+options) ⇒ <code>Promise</code>
    * [.patch()](#Request+patch) ⇒ <code>Promise</code>
    * [.post()](#Request+post) ⇒ <code>Promise</code>
    * [.put()](#Request+put) ⇒ <code>Promise</code>
    * [.request()](#Request+request) ⇒ <code>Promise</code>

<a name="new_Request_new"></a>

### new Request(sdk, audienceName)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>Object</code> | An instance of the SDK so the module can communicate with other modules |
| audienceName | <code>string</code> | The audience name for this instance. Used when grabbing a   Bearer token |

<a name="Request+delete"></a>

### request.delete() ⇒ <code>Promise</code>
Makes a DELETE request
See more at [axios](https://github.com/axios/axios)

**Kind**: instance method of [<code>Request</code>](#Request)  
**Fulfill**: <code>string\|number\|object\|array</code> data  
<a name="Request+get"></a>

### request.get() ⇒ <code>Promise</code>
Makes a GET request
See more at [axios](https://github.com/axios/axios)

**Kind**: instance method of [<code>Request</code>](#Request)  
**Fulfill**: <code>string\|number\|object\|array</code> data  
<a name="Request+head"></a>

### request.head() ⇒ <code>Promise</code>
Makes a HEAD request
See more at [axios](https://github.com/axios/axios)

**Kind**: instance method of [<code>Request</code>](#Request)  
**Fulfill**: <code>string\|number\|object\|array</code> data  
<a name="Request+options"></a>

### request.options() ⇒ <code>Promise</code>
Makes an OPTIONS request
See more at [axios](https://github.com/axios/axios)

**Kind**: instance method of [<code>Request</code>](#Request)  
**Fulfill**: <code>string\|number\|object\|array</code> data  
<a name="Request+patch"></a>

### request.patch() ⇒ <code>Promise</code>
Makes a PATCH request
See more at [axios](https://github.com/axios/axios)

**Kind**: instance method of [<code>Request</code>](#Request)  
**Fulfill**: <code>string\|number\|object\|array</code> data  
<a name="Request+post"></a>

### request.post() ⇒ <code>Promise</code>
Makes a POST request
See more at [axios](https://github.com/axios/axios)

**Kind**: instance method of [<code>Request</code>](#Request)  
**Fulfill**: <code>string\|number\|object\|array</code> data  
<a name="Request+put"></a>

### request.put() ⇒ <code>Promise</code>
Makes a PUT request
See more at [axios](https://github.com/axios/axios)

**Kind**: instance method of [<code>Request</code>](#Request)  
**Fulfill**: <code>string\|number\|object\|array</code> data  
<a name="Request+request"></a>

### request.request() ⇒ <code>Promise</code>
Makes a request
See more at [axios](https://github.com/axios/axios)

**Kind**: instance method of [<code>Request</code>](#Request)  
**Fulfill**: <code>string\|number\|object\|array</code> data  

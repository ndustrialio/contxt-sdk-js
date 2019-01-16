<a name="Files"></a>

## Files
Module that provides access to information about Files

**Kind**: global class  

* [Files](#Files)
    * [new Files(sdk, request)](#new_Files_new)
    * [.download(fileId)](#Files+download) ⇒ <code>Promise</code>
    * [.get(fileId)](#Files+get) ⇒ <code>Promise</code>

<a name="new_Files_new"></a>

### new Files(sdk, request)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>Object</code> | An instance of the SDK so the module can communicate with other modules |
| request | <code>Object</code> | An instance of the request module tied to this module's audience. |

<a name="Files+download"></a>

### contxtSdk.files.download(fileId) ⇒ <code>Promise</code>
Gets a temporary URL for the file in S3.

API Endpoint: '/files/:fileId/download'
Method: GET

**Kind**: instance method of [<code>Files</code>](#Files)  
**Fulfill**: [<code>FileToDownload</code>](./Typedefs.md#FileToDownload) Information needed to download the file  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| fileId | <code>string</code> | The ID of the file |

**Example**  
```js
contxtSdk.files
  .download('bbcdd201-58f7-4b69-a24e-752e9490a347')
  .then((file) => console.log(file))
  .catch((err) => console.log(err));
```
<a name="Files+get"></a>

### contxtSdk.files.get(fileId) ⇒ <code>Promise</code>
Gets metadata about a file. This does not return the actual file.

API Endpoint: '/files/:fileId'
Method: GET

**Kind**: instance method of [<code>Files</code>](#Files)  
**Fulfill**: [<code>File</code>](./Typedefs.md#File) Information about a file  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| fileId | <code>string</code> | The ID of the file |

**Example**  
```js
contxtSdk.files
  .get('bbcdd201-58f7-4b69-a24e-752e9490a347')
  .then((file) => console.log(file))
  .catch((err) => console.log(err));
```

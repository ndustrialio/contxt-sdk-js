<a name="Files"></a>

## Files
Module that provides access to information about Files

**Kind**: global class  

* [Files](#Files)
    * [new Files(sdk, request)](#new_Files_new)
    * [.create(fileInfo)](#Files+create) ⇒ <code>Promise</code>
    * [.delete(fileId)](#Files+delete) ⇒ <code>Promise</code>
    * [.download(fileId)](#Files+download) ⇒ <code>Promise</code>
    * [.get(fileId)](#Files+get) ⇒ <code>Promise</code>
    * [.getAll([filesFilters])](#Files+getAll) ⇒ <code>Promise</code>

<a name="new_Files_new"></a>

### new Files(sdk, request)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>Object</code> | An instance of the SDK so the module can communicate with other modules |
| request | <code>Object</code> | An instance of the request module tied to this module's audience. |

<a name="Files+create"></a>

### contxtSdk.files.create(fileInfo) ⇒ <code>Promise</code>
Creates a file record.

API Endpoint: '/files'
Method: POST

**Kind**: instance method of [<code>Files</code>](#Files)  
**Fulfill**: [<code>File</code>](./Typedefs.md#File)  
**Rejects**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| fileInfo | <code>Object</code> | Metadata about the file |
| fileInfo.contentType | <code>string</code> | The MIME type |
| [fileInfo.description] | <code>string</code> | A short description |
| fileInfo.filename | <code>string</code> | The filename |
| fileInfo.organizationId | <code>string</code> | The organization ID to which the   file belongs |

**Example**  
```js
contxtSdk.files
  .create({
    contentType: 'application/pdf',
    description:
      'Electric Bill from Hawkins National Labratory (October 2018)',
    filename: 'hawkins_national_labratory-hawkins_energy-october-2019.pdf',
    organizationId: '8ba33864-01ff-4388-a4e0-63eebf36fed3'
  })
  .then((file) => console.log(file))
  .catch((err) => console.log(err));
```
<a name="Files+delete"></a>

### contxtSdk.files.delete(fileId) ⇒ <code>Promise</code>
Deletes a file and associated file actions.

API Endpoint: '/files/:fileId'
Method: DELETE

**Kind**: instance method of [<code>Files</code>](#Files)  
**Fulfill**: <code>undefined</code>  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| fileId | <code>string</code> | The ID of the file |

**Example**  
```js
contxtSdk.files.delete('8704f900-28f2-4951-aaf0-1827fcd0b0cb');
```
<a name="Files+download"></a>

### contxtSdk.files.download(fileId) ⇒ <code>Promise</code>
Gets a temporary URL for the file.

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
<a name="Files+getAll"></a>

### contxtSdk.files.getAll([filesFilters]) ⇒ <code>Promise</code>
Gets a paginated list of files and their metadata. This does not return
the actual files.

API Endpoint: '/files'
Method: GET

**Kind**: instance method of [<code>Files</code>](#Files)  
**Fulfill**: [<code>FilesFromServer</code>](./Typedefs.md#FilesFromServer) Information about the files  
**Reject**: <code>Error</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [filesFilters] | <code>Object</code> |  |  |
| [filesFilters.limit] | <code>Number</code> | <code>100</code> | Maximum number of records to return per query |
| [filesFilters.offset] | <code>Number</code> | <code>0</code> | How many records from the first record to start the query |
| [filesFilters.orderBy] | <code>String</code> | <code>&#x27;createdAt&#x27;</code> | How many records from the first record to start the query |
| [filesFilters.reverseOrder] | <code>Boolean</code> | <code>false</code> | Determine the results should be sorted in reverse (ascending) order |
| [filesFilters.status] | <code>String</code> | <code>&#x27;ACTIVE&#x27;</code> | Filter by a file's current status |

**Example**  
```js
contxtSdk.files
  .getAll()
  .then((files) => console.log(files))
  .catch((err) => console.log(err));
```

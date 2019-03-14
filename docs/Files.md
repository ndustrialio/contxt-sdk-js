<a name="Files"></a>

## Files
Module that provides access to information about Files.
More information about the best way to use this module is available at:
https://contxt.readme.io/reference#files-overview

**Kind**: global class  

* [Files](#Files)
    * [new Files(sdk, request)](#new_Files_new)
    * [.create(fileInfo)](#Files+create) ⇒ <code>Promise</code>
    * [.createAndUpload(fileInfo)](#Files+createAndUpload) ⇒ <code>Promise</code>
    * [.delete(fileId)](#Files+delete) ⇒ <code>Promise</code>
    * [.download(fileId)](#Files+download) ⇒ <code>Promise</code>
    * [.get(fileId)](#Files+get) ⇒ <code>Promise</code>
    * [.getAll([filesFilters])](#Files+getAll) ⇒ <code>Promise</code>
    * [.setUploadComplete(fileId)](#Files+setUploadComplete) ⇒ <code>Promise</code>
    * [.setUploadFailed(fileId)](#Files+setUploadFailed) ⇒ <code>Promise</code>
    * [.upload(fileInfo)](#Files+upload) ⇒ <code>Promise</code>

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
**Fulfill**: [<code>FileWithUploadInformation</code>](./Typedefs.md#FileWithUploadInformation)  
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
<a name="Files+createAndUpload"></a>

### contxtSdk.files.createAndUpload(fileInfo) ⇒ <code>Promise</code>
A procedural method that takes care of:
  1. Creating a file record
  2. Uploading the file from information returned when creating the file
    record
  3. Updating the file record's status to indicate if the upload was
    successful or a failure
  4. Returning an updated copy of the file record OR an error indicating
    what failed, when it failed, and potentially, why it failed

**Kind**: instance method of [<code>Files</code>](#Files)  
**Fulfill**: [<code>File</code>](./Typedefs.md#File)  
**Rejects**: [<code>FileError</code>](./Typedefs.md#FileError)  

| Param | Type | Description |
| --- | --- | --- |
| fileInfo | <code>Object</code> |  |
| fileInfo.data | <code>ArrayBuffer</code> \| <code>Blob</code> \| <code>Buffer</code> \| [<code>File</code>](./Typedefs.md#File) \| <code>Stream</code> | The actual data of the file. |
| fileInfo.metadata | <code>Object</code> | Metadata about the file to be uploaded |
| fileInfo.metadata.contentType | <code>string</code> | The MIME type |
| [fileInfo.metadata.description] | <code>string</code> | A short description |
| fileInfo.metadata.filename | <code>string</code> | The filename |
| fileInfo.metadata.organizationId | <code>string</code> | The organization ID to which the file belongs |

**Example**  
```js
contxtSdk
  .createAndUpload({
    data: fs.readFileSync(
      path.join(
        __dirname,
        'hawkins_national_labratory-hawkins_energy-october-2019.pdf'
      )
    ),
    metadata: {
      contentType: 'application/pdf',
      description:
        'Electric Bill from Hawkins National Labratory (October 2018)',
      filename:
        'hawkins_national_labratory-hawkins_energy-october-2019.pdf',
      organizationId: '8ba33864-01ff-4388-a4e0-63eebf36fed3'
    }
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
<a name="Files+setUploadComplete"></a>

### contxtSdk.files.setUploadComplete(fileId) ⇒ <code>Promise</code>
Updates the upload status of a file to indicate the upload is complete.

API Endpoint: '/files/:fileId/complete'
Method: POST

**Kind**: instance method of [<code>Files</code>](#Files)  
**Fulfill**: <code>undefined</code>  
**Rejects**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| fileId | <code>string</code> | The ID of the file to update |

**Example**  
```js
contxtSdk.files
  .setUploadComplete('ecd0439e-d5be-4529-ad6a-4a9cbfa7202f')
  .catch((err) => console.log(err));
```
<a name="Files+setUploadFailed"></a>

### contxtSdk.files.setUploadFailed(fileId) ⇒ <code>Promise</code>
Updates the upload status of a file to indicate the upload has failed.

API Endpoint: '/files/:fileId/failed'
Method: POST

**Kind**: instance method of [<code>Files</code>](#Files)  
**Fulfill**: <code>undefined</code>  
**Rejects**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| fileId | <code>string</code> | The ID of the file to update |

**Example**  
```js
contxtSdk.files
  .setUploadFailed('ecd0439e-d5be-4529-ad6a-4a9cbfa7202f')
  .catch((err) => console.log(err));
```
<a name="Files+upload"></a>

### contxtSdk.files.upload(fileInfo) ⇒ <code>Promise</code>
Uploads a file to the provided URL. The URL and the headers should be
sourced from the response when initially creating a File record.

Method: PUT

**Kind**: instance method of [<code>Files</code>](#Files)  
**Fulfill**: <code>Object</code>  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| fileInfo | <code>Object</code> |  |
| fileInfo.data | <code>ArrayBuffer</code> \| <code>Blob</code> \| <code>Buffer</code> \| [<code>File</code>](./Typedefs.md#File) \| <code>Stream</code> | The data to be   uploaded |
| [fileInfo.headers] | <code>Object.&lt;string, string&gt;</code> | Headers to be appended   to the request. The key is the header name and the value is the included   value |
| fileInfo.url | <code>String</code> | The URL to use for the request |

**Example**  
```js
contxtSdk.files
  .upload({
    data: fs.readFileSync(
      path.join(
        __dirname,
        'hawkins_national_labratory-hawkins_energy-october-2019.pdf'
      )
    ),
    headers: {
      'Content-Type': 'application/pdf'
    },
    url:
      'https://files.ndustrial.example.org/hawkins_national_labratory-hawkins_energy-october-2019.pdf'
  })
  .catch((err) => console.log(err));
```

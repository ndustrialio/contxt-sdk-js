import axios from 'axios';
import { toCamelCase, toSnakeCase } from '../utils/objects';
import { formatPaginatedDataFromServer } from '../utils/pagination';

/**
 * @typedef {Object} File
 * @property {string} createdAt ISO 8601 Extended Format date/time string
 * @property {string} contentType The MIME type of the file
 * @property {string} description
 * @property {string} filename
 * @property {string} id UUID of the file
 * @property {string} organizationId UUID of the organization to which the file belongs
 * @property {string} ownerId The ID of the user who owns the file
 * @property {string} status The status of the File, e.g. "ACTIVE"
 * @property {string} updatedAt ISO 8601 Extended Format date/time string
 */

/**
 * @typedef {Object} FileWithUploadInformation
 * @property {string} createdAt ISO 8601 Extended Format date/time string
 * @property {string} contentType The MIME type of the file
 * @property {string} description
 * @property {string} filename
 * @property {string} id UUID of the file
 * @property {string} organizationId UUID of the organization to which the file
 *   belongs
 * @property {string} ownerId The ID of the user who owns the file
 * @property {string} status The status of the File, e.g. "ACTIVE"
 * @property {string} updatedAt ISO 8601 Extended Format date/time string
 * @property {Object} uploadInfo Information related to the uploading the
 *   underlying file
 * @property {string} uploadInfo.expiresAt A ISO 8601 Extended format date/time
 *   string indicating when the validity of the included URL expires
 * @property {Object.<string, string>} uploadInfo.headers to be appended to the
 *   request when uploading the file. The key is the header name and the value
 *   is the included value.
 * @property {string} uploadInfo.method The HTTP method to be used when
 *   uploading the file.
 * @property {string} uploadInfo.url The URL to be used when uploading the file.
 */

/**
 * @typedef {Object} FilesFromServer
 * @property {Object} _metadata Metadata about the pagination settings
 * @property {number} _metadata.offset Offset of records in subsequent queries
 * @property {number} _metadata.totalRecords Total number of files found
 * @property {File[]} records
 */

/**
 * @typedef {Object} FileToDownload
 * @property {string} createdAt ISO 8601 Extended Format date/time string
 * @property {string} contentType The MIME type of the file
 * @property {string} description
 * @property {Object} downloadInfo
 * @property {string} downloadInfo.attachmentUrl A URL that can be used to download the file from the external storage
 * @property {string} downloadInfo.expiresAt ISO 8601 Extended Format date/time indicating when the attachement and inline URLs expire
 * @property {string} downloadInfo.inlineUrl A URL that can be used for embedding the file into a page
 * @property {string} filename
 * @property {string} id UUID of the file
 * @property {string} organizationId UUID of the organization to which the file belongs
 * @property {string} ownerId The ID of the user who owns the file
 * @property {string} status The status of the File, e.g. "ACTIVE"
 * @property {string} updatedAt ISO 8601 Extended Format date/time string
 */

/**
 * @typedef {Error} FileError An error returned while creating and uploading an
 *   individual file
 * @property {Object} artifacts Records that may have been created while
 *   creating and uploading a file. Can be used to pick up the process manually
 *   or clean up before trying again.
 * @property {Object} [artifacts.file] A created File artifact
 * @property {Error} originalError The original error object that can be used
 *   for additional debugging purposes
 * @property {string} stage A string describing in what stage of the create and
 *   upload process the failure occurred. Possible choices are:
 *     - create (failed while creating the initial file record)
 *     - upload (failed while uploading the actual file for storage)
 *     - statusUpdate (failed while updating the upload status for the file record)
 *     - get (failed at the end while getting an updated file record)
 */

/**
 * Module that provides access to information about Files.
 * More information about the best way to use this module is available at:
 * https://contxt.readme.io/reference#files-overview
 *
 * @typicalname contxtSdk.files
 */
class Files {
  /**
   * @param {Object} sdk An instance of the SDK so the module can communicate with other modules
   * @param {Object} request An instance of the request module tied to this module's audience.
   */
  constructor(sdk, request) {
    const baseUrl = `${sdk.config.audiences.files.host}/v1`;

    this._baseUrl = baseUrl;
    this._request = request;
    this._sdk = sdk;
  }

  /**
   * Creates a file record.
   *
   * API Endpoint: '/files'
   * Method: POST
   *
   * @param {Object} fileInfo Metadata about the file
   * @param {string} fileInfo.contentType The MIME type
   * @param {string} [fileInfo.description] A short description
   * @param {string} fileInfo.filename The filename
   * @param {string} fileInfo.organizationId The organization ID to which the
   *   file belongs
   *
   * @returns {Promise}
   * @fulfill {FileWithUploadInformation}
   * @rejects {Error}
   *
   * @example
   * contxtSdk.files
   *   .create({
   *     contentType: 'application/pdf',
   *     description:
   *       'Electric Bill from Hawkins National Labratory (October 2018)',
   *     filename: 'hawkins_national_labratory-hawkins_energy-october-2019.pdf',
   *     organizationId: '8ba33864-01ff-4388-a4e0-63eebf36fed3'
   *   })
   *   .then((file) => console.log(file))
   *   .catch((err) => console.log(err));
   */
  create(fileInfo) {
    const requiredFields = ['contentType', 'filename', 'organizationId'];

    for (let i = 0; i < requiredFields.length; i++) {
      if (!fileInfo[requiredFields[i]]) {
        return Promise.reject(
          new Error(`A ${requiredFields[i]} is required to create a file`)
        );
      }
    }

    return this._request
      .post(`${this._baseUrl}/files`, toSnakeCase(fileInfo))
      .then(({ upload_info, ...createdFile }) => {
        return {
          ...toCamelCase(createdFile),
          uploadInfo: toCamelCase(upload_info, {
            deep: false,
            excludeTransform: ['headers']
          })
        };
      });
  }

  /**
   * A procedural method that takes care of:
   *   1. Creating a file record
   *   2. Uploading the file from information returned when creating the file
   *     record
   *   3. Updating the file record's status to indicate if the upload was
   *     successful or a failure
   *   4. Returning an updated copy of the file record OR an error indicating
   *     what failed, when it failed, and potentially, why it failed
   *
   * @param {Object} fileInfo
   * @param {ArrayBuffer|Blob|Buffer|File|Stream} fileInfo.data The actual data of the file.
   * @param {Object} fileInfo.metadata Metadata about the file to be uploaded
   * @param {string} fileInfo.metadata.contentType The MIME type
   * @param {string} [fileInfo.metadata.description] A short description
   * @param {string} fileInfo.metadata.filename The filename
   * @param {string} fileInfo.metadata.organizationId The organization ID to which the file belongs
   *
   * @returns {Promise}
   * @fulfill {File}
   * @rejects {FileError}
   *
   * @example
   * contxtSdk
   *   .createAndUpload({
   *     data: fs.readFileSync(
   *       path.join(
   *         __dirname,
   *         'hawkins_national_labratory-hawkins_energy-october-2019.pdf'
   *       )
   *     ),
   *     metadata: {
   *       contentType: 'application/pdf',
   *       description:
   *         'Electric Bill from Hawkins National Labratory (October 2018)',
   *       filename:
   *         'hawkins_national_labratory-hawkins_energy-october-2019.pdf',
   *       organizationId: '8ba33864-01ff-4388-a4e0-63eebf36fed3'
   *     }
   *   })
   *   .then((file) => console.log(file))
   *   .catch((err) => console.log(err));
   */
  createAndUpload(fileInfo) {
    const requiredFields = ['data', 'metadata'];

    for (let i = 0; i < requiredFields.length; i++) {
      if (!fileInfo[requiredFields[i]]) {
        return Promise.reject(
          this._generateError({
            message: `A \`${
              requiredFields[i]
            }\` field is required to create and upload a file`,
            stage: 'validation'
          })
        );
      }
    }

    const { data, metadata } = fileInfo;

    return this.create(metadata)
      .catch((originalError) => {
        throw this._generateError({
          originalError,
          message: 'There was a problem creating the file. Please try again.',
          stage: 'create'
        });
      })
      .then(({ uploadInfo, ...createdFile }) => {
        return Promise.resolve()
          .then(() => {
            return this.upload({
              data,
              headers: uploadInfo.headers,
              url: uploadInfo.url
            }).catch((originalError) => {
              this.setUploadFailed(createdFile.id);

              throw this._generateError({
                createdFile,
                originalError,
                message:
                  'There was a problem uploading the file. Please try again.',
                stage: 'upload'
              });
            });
          })
          .then(() => {
            return this.setUploadComplete(createdFile.id).catch(
              (originalError) => {
                throw this._generateError({
                  createdFile,
                  originalError,
                  message:
                    'There was a problem updating the file status. Please try again.',
                  stage: 'statusUpdate'
                });
              }
            );
          })
          .then(() => {
            return this.get(createdFile.id).catch((originalError) => {
              throw this._generateError({
                createdFile,
                originalError,
                message:
                  'There was a problem getting updated information about the file. Please try again.',
                stage: 'get'
              });
            });
          });
      });
  }

  /**
   * Deletes a file and associated file actions.
   *
   * API Endpoint: '/files/:fileId'
   * Method: DELETE
   *
   * @param {string} fileId The ID of the file
   *
   * @returns {Promise}
   * @fulfill {undefined}
   * @reject {Error}
   *
   * @example
   * contxtSdk.files.delete('8704f900-28f2-4951-aaf0-1827fcd0b0cb');
   */
  delete(fileId) {
    if (!fileId) {
      return Promise.reject(
        new Error('A file ID is required to delete a file')
      );
    }

    return this._request.delete(`${this._baseUrl}/files/${fileId}`);
  }

  /**
   * Gets a temporary URL for the file.
   *
   * API Endpoint: '/files/:fileId/download'
   * Method: GET
   *
   * @param {string} fileId The ID of the file
   *
   * @returns {Promise}
   * @fulfill {FileToDownload} Information needed to download the file
   * @reject {Error}
   *
   * @example
   * contxtSdk.files
   *   .download('bbcdd201-58f7-4b69-a24e-752e9490a347')
   *   .then((file) => console.log(file))
   *   .catch((err) => console.log(err));
   */
  download(fileId) {
    if (!fileId) {
      return Promise.reject(
        new Error('A file ID is required for downloading a file')
      );
    }

    return this._request
      .get(`${this._baseUrl}/files/${fileId}/download`)
      .then((file) => toCamelCase(file));
  }

  /**
   * Gets metadata about a file. This does not return the actual file.
   *
   * API Endpoint: '/files/:fileId'
   * Method: GET
   *
   * @param {string} fileId The ID of the file
   *
   * @returns {Promise}
   * @fulfill {File} Information about a file
   * @reject {Error}
   *
   * @example
   * contxtSdk.files
   *   .get('bbcdd201-58f7-4b69-a24e-752e9490a347')
   *   .then((file) => console.log(file))
   *   .catch((err) => console.log(err));
   */
  get(fileId) {
    if (!fileId) {
      return Promise.reject(
        new Error('A file ID is required for getting information about a file')
      );
    }

    return this._request
      .get(`${this._baseUrl}/files/${fileId}`)
      .then((file) => toCamelCase(file));
  }

  /**
   * Gets a paginated list of files and their metadata. This does not return
   * the actual files.
   *
   * API Endpoint: '/files'
   * Method: GET
   *
   * @param {Object} [filesFilters]
   * @param {Number} [filesFilters.limit = 100] Maximum number of records to return per query
   * @param {Number} [filesFilters.offset = 0] How many records from the first record to start the query
   * @param {String} [filesFilters.orderBy = 'createdAt'] How many records from the first record to start the query
   * @param {Boolean} [filesFilters.reverseOrder = false] Determine the results should be sorted in reverse (ascending) order
   * @param {String} [filesFilters.status = 'ACTIVE'] Filter by a file's current status
   *
   * @returns {Promise}
   * @fulfill {FilesFromServer} Information about the files
   * @reject {Error}
   *
   * @example
   * contxtSdk.files
   *   .getAll()
   *   .then((files) => console.log(files))
   *   .catch((err) => console.log(err));
   */
  getAll(filesFilters) {
    return this._request
      .get(`${this._baseUrl}/files`, {
        params: toSnakeCase(filesFilters)
      })
      .then((assetsData) => formatPaginatedDataFromServer(assetsData));
  }

  /**
   * Updates the upload status of a file to indicate the upload is complete.
   *
   * API Endpoint: '/files/:fileId/complete'
   * Method: POST
   *
   * @param {string} fileId The ID of the file to update
   *
   * @returns {Promise}
   * @fulfill {undefined}
   * @rejects {Error}
   *
   * @example
   * contxtSdk.files
   *   .setUploadComplete('ecd0439e-d5be-4529-ad6a-4a9cbfa7202f')
   *   .catch((err) => console.log(err));
   */
  setUploadComplete(fileId) {
    if (!fileId) {
      return Promise.reject(
        new Error('A file ID is required to mark a file upload as complete')
      );
    }

    return this._request.post(`${this._baseUrl}/files/${fileId}/complete`);
  }

  /**
   * Updates the upload status of a file to indicate the upload has failed.
   *
   * API Endpoint: '/files/:fileId/failed'
   * Method: POST
   *
   * @param {string} fileId The ID of the file to update
   *
   * @returns {Promise}
   * @fulfill {undefined}
   * @rejects {Error}
   *
   * @example
   * contxtSdk.files
   *   .setUploadFailed('ecd0439e-d5be-4529-ad6a-4a9cbfa7202f')
   *   .catch((err) => console.log(err));
   */
  setUploadFailed(fileId) {
    if (!fileId) {
      return Promise.reject(
        new Error('A file ID is required to mark a file upload as failed')
      );
    }

    return this._request.post(`${this._baseUrl}/files/${fileId}/failed`);
  }

  /**
   * Uploads a file to the provided URL. The URL and the headers should be
   * sourced from the response when initially creating a File record.
   *
   * Method: PUT
   *
   * @param {Object} fileInfo
   * @param {ArrayBuffer|Blob|Buffer|File|Stream} fileInfo.data The data to be
   *   uploaded
   * @param {Object.<string, string>} [fileInfo.headers] Headers to be appended
   *   to the request. The key is the header name and the value is the included
   *   value
   * @param {String} fileInfo.url The URL to use for the request
   *
   * @returns {Promise}
   * @fulfill {Object}
   * @reject {Error}
   *
   * @example
   * contxtSdk.files
   *   .upload({
   *     data: fs.readFileSync(
   *       path.join(
   *         __dirname,
   *         'hawkins_national_labratory-hawkins_energy-october-2019.pdf'
   *       )
   *     ),
   *     headers: {
   *       'Content-Type': 'application/pdf'
   *     },
   *     url:
   *       'https://files.ndustrial.example.org/hawkins_national_labratory-hawkins_energy-october-2019.pdf'
   *   })
   *   .catch((err) => console.log(err));
   */
  upload(fileInfo) {
    const requiredFields = ['data', 'url'];

    for (let i = 0; i < requiredFields.length; i++) {
      if (!fileInfo[requiredFields[i]]) {
        return Promise.reject(
          new Error(`A ${requiredFields[i]} is required to upload a file`)
        );
      }
    }

    const { data, headers, url } = fileInfo;

    return axios.put(url, data, { headers });
  }

  /**
   * Generates a consistent error message with information needed to debug why
   * creating and uploading a file may have failed.
   *
   * @param {Object} errorInfo
   * @param {Object} [errorInfo.createdFile] An object containing information
   *   about a created created by Files#create
   * @param {string} [errorInfo.message] The message to be applied to the new
   *   Error
   * @param {Error} errorInfo.originalError The original error that was thrown
   *   that will be included in the new Error's body
   * @param {string} errorInfo.stage A string describing in what stage of the
   *   create and upload process the failure occurred
   *
   * @returns {FileError}
   *
   * @private
   */
  _generateError({ createdFile, message, originalError, stage }) {
    const artifacts = {};
    const errorMsg = message || originalError.message;

    if (createdFile) {
      artifacts.file = createdFile;
    }

    return Object.assign(new Error(errorMsg), {
      artifacts,
      originalError,
      stage
    });
  }
}

export default Files;

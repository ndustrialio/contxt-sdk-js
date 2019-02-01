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
 * @typedef {Object} FilesFromServer
 * @property {Object} _metadata Metadata about the pagination settings
 * @property {number} _metadata.offset Offset of records in subsequent queries
 * @property {number} _metadata.totalRecords Total number of files found
 * @property {File[]} records
 */

/**
 * @typedef {Object} FileToDownload
 * @property {string} expiresAt ISO 8601 Extended Format date/time
 * @property {string} temporaryUrl A temporary URL that can be used to download the file
 */

/**
 * Module that provides access to information about Files
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
}

export default Files;

import { toCamelCase, toSnakeCase } from '../utils/objects';

/**
 * @typedef {Object} Feed
 * @property {string} createdAt ISO 8601 Extended Format date/time string
 * @property {Number} criticalThreshold
 * @property {Number} degradedThreshold
 * @property {Number} [downAfter]
 * @property {Number} facilityId
 * @property {Object} feedStatus
 * @property {Number} feedStatus.feedId
 * @property {Number} feedStatus.feedStatusId
 * @property {Number} feedStatus.id
 * @property {String} feedStatus.status
 * @property {String} feedStatus.updateAt ISO 8601 Extended Format date/time string
 * @property {Object} feedType
 * @property {String} feedType.createdAt ISO 8601 Extended Format date/time string
 * @property {Number} feedType.downAfter
 * @property {Number} feedType.id
 * @property {String} feedType.type
 * @property {String} feedType.updateAt ISO 8601 Extended Format date/time string
 * @property {Number} feedTypeId
 * @property {Number} id
 * @property {Boolean} isPaused
 * @property {String} key
 * @property {Object} owner
 * @property {String} owner.createdAt ISO 8601 Extended Format date/time string
 * @property {String} owner.email
 * @property {String} owner.firstName
 * @property {String} owner.id UUID corresponding with a user
 * @property {String} owner.lastName
 * @property {String} owner.updateAt ISO 8601 Extended Format date/time string
 * @property {String} ownerId Auth0 identifer of the user
 * @property {String} routingKeys
 * @property {String} status
 * @property {String} [statusEventId] UUID corresponding with an event
 * @property {String} timezone An IANA Time Zone Database string, i.e. America/Los_Angeles
 * @property {String} token
 * @property {String} updatedAt ISO 8601 Extended Format date/time string
 */

/**
 * @typedef {Object} FacilityFeedStatus
 * @param {FacilityGroupingStatus[]} groupings An array of field groupings associated with the feed
 * @param {Number} id
 * @param {String} key The unique key for the feed
 * @param {String} status The most recent status of the feed, e.g. "Healthy"
 * @param {string} updatedAt ISO 8601 Extended Format date/time string
 */

/**
 * @typedef {Object} FacilityGroupingStatus
 * @param {String} id UUID
 * @param {String} label The human readable name of the field grouping
 * @param {String} status The most recent status of the field grouping
 * @param {string} updatedAt ISO 8601 Extended Format date/time string
 */

/**
 * @typedef {Object} FacilityStatusFromServer
 * @property {FacilityFeedStatus[]} feeds
 */

/**
 * Module that provides access to feed information
 *
 * @typicalname contxtSdk.iot.feeds
 */
class Feeds {
  /**
   * @param {Object} sdk An instance of the SDK so the module can communicate
   *   with other modules
   * @param {Object} request An instance of the request module tied to this
   *   module's audience
   * @param {string} baseUrl The base URL provided by the parent module
   */
  constructor(sdk, request, baseUrl) {
    this._baseUrl = baseUrl;
    this._request = request;
    this._sdk = sdk;
  }

  /**
   * Gets all feeds from a specific facility
   *
   * API Endpoint: '/feeds'
   * Method: GET
   *
   * @param {Number} facilityId
   *
   * @returns {Promise}
   * @fulfill {Feeds[]} Information about the feeds that are assigned to specific facility
   * @reject {Error}
   *
   * @example
   * contxtSdk.iot.feeds
   *   .getByFacilityId(facilityId)
   *   .then((feeds) => console.log(feeds))
   *   .catch((err) => console.log(err));
   */
  getByFacilityId(facilityId) {
    if (!facilityId) {
      return Promise.reject(
        new Error('A facilityId is required to get feeds.')
      );
    }

    return this._request
      .get(`${this._baseUrl}/feeds`, {
        params: toSnakeCase({ facilityId })
      })
      .then((response) => toCamelCase(response));
  }

  /**
   * Gets current Feed and Grouping status for a given Facility
   *
   * API Endpoint: '/facilities/:facilityId/status'
   * Method: GET
   *
   * @param {Number} facilityId
   *
   * @returns {Promise}
   * @fulfill {FacilityStatusFromServer} Information about the Facility feed status
   * @reject {Error}
   *
   * @example
   * contxtSdk.iot.feeds
   *   .getStatusForFacility(563)
   *   .then((status) => console.log(status.feeds))
   *   .catch((err) => console.log(err));
   */
  getStatusForFacility(facilityId) {
    if (!facilityId) {
      return Promise.reject(
        new Error('A facilityId is required to get facility feed status.')
      );
    }

    return this._request
      .get(`${this._baseUrl}/facilities/${facilityId}/status`)
      .then((response) => toCamelCase(response));
  }
}

export default Feeds;

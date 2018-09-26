import isPlainObject from 'lodash.isplainobject';
import { formatEventUpdateToServer } from '../utils/events';
import { toCamelCase, toSnakeCase } from '../utils/objects';
import { formatPaginatedDataFromServer } from '../utils/pagination';

/**
 * @typedef {Object} Event
 * @property {boolean} allowOthersToTrigger Whether or not to allow non-owners to trigger the Event
 * @property {string} createdAt ISO 8601 Extended Format date/time string
 * @property {string} [deletedAt] ISO 8601 Extended Format date/time string
 * @property {Object} [eventType]
 * @property {string} [eventType.clientId] The ID of the client to which the event type belongs
 * @property {string} [eventType.createdAt] ISO 8601 Extended Format date/time string
 * @property {string} [eventType.description]
 * @property {string} [eventType.id] UUID formatted ID
 * @property {boolean} [eventType.isRealtimeEnabled]
 * @property {number} [eventType.level]
 * @property {string} [eventType.name]
 * @property {string} [eventType.slug]
 * @property {string} [eventType.updatedAt] ISO 8601 Extended Format date/time string
 * @property {string} [eventTypeId] UUID corresponding with an event type
 * @property {number} [facilityId] The facility associated with the event
 * @property {string} id UUID formatted ID
 * @property {boolean} [isPublic]
 * @property {string} name
 * @property {string} [organizationId] UUID of the organization to which the event belongs
 * @property {Object} [owner]
 * @property {string} [owner.createdAt]  ISO 8601 Extended Format date/time string
 * @property {string} [owner.email]
 * @property {string} [owner.firstName]
 * @property {string} [owner.id]
 * @property {boolean} [owner.isMachineUser]
 * @property {string} [owner.lastName]
 * @property {string} [owner.updatedAt]  ISO 8601 Extended Format date/time string
 * @property {string} [ownerId] The ID of the user who owns the event
 * @property {number} [topicArn] The Amazon Resource Name (ARN) associated with the event
 * @property {string} updatedAt ISO 8601 Extended Format date/time string
 */

/**
 * @typedef {Object} EventType
 * @property {string} client_id UUID corresponding with the client
 * @property {string} created_at ISO 8601 Extended Format date/time string
 * @property {string} description
 * @property {string} id UUID
 * @property {boolean} is_realtime_enabled Specifies whether that event types is enabled for realtime
 * @property {number} level Priority level associated with event type
 * @property {string} name
 * @property {string} slug
 * @property {string} updatedAt ISO 8601 Extended Format date/time string
 */

/**
 * @typedef {Object} EventTypesFromServer
 * @property {Object} _metadata Metadata about the pagination settings
 * @property {number} _metadata.offset Offset of records in subsequent queries
 * @property {number} _metadata.totalRecords Total number of asset types found
 * @property {EventType[]} records
 */

/**
 * @typedef {Object} EventsFromServer
 * @property {Object} _metadata Metadata about the pagination settings
 * @property {number} _metadata.offset Offset of records in subsequent queries
 * @property {number} _metadata.totalRecords Total number of asset types found
 * @property {Events[]} records
 */

/**
 * Module that provides access to, and the manipulation
 * of, information about different events
 *
 * @typicalname contxtSdk.events
 */
class Events {
  /**
   * @param {Object} sdk An instance of the SDK so the module can communicate with other modules
   * @param {Object} request An instance of the request module tied to this module's audience.
   */
  constructor(sdk, request) {
    const baseUrl = `${sdk.config.audiences.events.host}/v1`;

    this._baseUrl = baseUrl;
    this._request = request;
    this._sdk = sdk;
  }

  /**
   * Creates a new event
   *
   * API Endpoint: '/events'
   * Method: POST
   *
   * @param {Object} event
   * @param {boolean} [event.allowOthersToTrigger]
   * @param {string} event.eventTypeId UUID corresponding with an event type
   * @param {number} [event.facilityId]
   * @param {boolean} [event.isPublic]
   * @param {string} event.name
   * @param {string} event.organizationId UUID corresponding with an organization
   *
   * @returns {Promise}
   * @fulfill {Event} Information about the new event
   * @reject {Error}
   *
   * @example
   * contxtSdk.events
   *   .create({
   *     allowOthersToTrigger: false,
   *     eventTypeId: 'd47e5699-cc17-4631-a2c5-6cefceb7863d',
   *     isPublic: false,
   *     name: 'A Major Event',
   *     organizationId: '28cc036c-d87f-4f06-bd30-1e78c2701064'
   *   })
   *   .then((event) => console.log(event))
   *   .catch((err) => console.log(err));
   */
  create(event = {}) {
    const requiredFields = ['eventTypeId', 'name', 'organizationId'];

    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];

      if (!event[field]) {
        return Promise.reject(
          new Error(`A ${field} is required to create a new event.`)
        );
      }
    }

    return this._request
      .post(`${this._baseUrl}/events`, toSnakeCase(event))
      .then((response) => toCamelCase(response));
  }

  /**
   * Deletes an event
   *
   * API Endpoint: '/events/:eventId'
   * Method: DELETE
   *
   * @param {string} eventId The ID of the Event
   *
   * @returns {Promise}
   * @fulfill {undefined}
   * @reject {Error}
   *
   * @example
   * contxtSdk.events.delete('875afddd-091c-4385-bc21-0edf38804d27');
   */
  delete(eventId) {
    if (!eventId) {
      return Promise.reject(
        new Error('An event ID is required for deleting an event')
      );
    }

    return this._request.delete(`${this._baseUrl}/events/${eventId}`);
  }

  /**
   * Gets information about an event
   *
   * API Endpoint: '/events/:eventId'
   * Method: GET
   *
   * @param {string} eventId The ID of the event
   *
   * @returns {Promise}
   * @fulfill {Event} Information about an event
   * @reject {Error}
   *
   * @example
   * contxtSdk.events
   *   .get('875afddd-091c-4385-bc21-0edf38804d27')
   *   .then((event) => console.log(event))
   *   .catch((err) => console.log(err));
   */
  get(eventId) {
    if (!eventId) {
      return Promise.reject(
        new Error(
          'An event ID is required for getting information about an event'
        )
      );
    }

    return this._request
      .get(`${this._baseUrl}/events/${eventId}`)
      .then((event) => toCamelCase(event));
  }

  /**
   * Gets all event types for a client
   *
   * API Endpoint: '/clients/:clientId/types'
   * Method: GET
   *
   * @param {string} clientId The ID of the client
   *
   * @returns {Promise}
   * @fulfill {EventTypesFromServer} Event types from the server
   * @reject {Error}
   *
   * @example
   * contxtSdk.events
   *   .getEventTypesByClientId('CW4B1Ih6M1nNwwxk0XOKI21MVH04pGUL')
   *   .then((events) => console.log(events))
   *   .catch((err) => console.log(err));
   */
  getEventTypesByClientId(clientId) {
    if (!clientId) {
      return Promise.reject(
        new Error('A client ID is required for getting types')
      );
    }

    return this._request
      .get(`${this._baseUrl}/clients/${clientId}/types`)
      .then((response) => formatPaginatedDataFromServer(response));
  }
  /**
   * Gets all events by type
   *
   * API Endpoint: '/types/:typeId/events'
   * Method: GET
   *
   * @param {string} eventTypeId The ID of the type
   * @param {number} [eventsFilters.facilityId] ID of facility to restricti event types to
   * @param {string[]} [eventsFilters.include] List of event types to include in the query. Possible options are: 'triggered.latest'
   * @param {number} [eventsFilters.limit] Maximum number of records to return per query
   * @param {number} [eventsFilters.offset] How many records from the first record to start the query
   * @param {boolean} [latest = false] A boolean to determine if we only want to receive the most recent
   *
   * @returns {Promise}
   * @fulfill {EventsFromServer} Event from server
   * @reject {Error}
   *
   * @example
   * contxtSdk.events
   *   .getEventsByTypeId(
   *      '3e9b572b-6b39-4dd5-a9e5-075095eb0867',
   *      {
   *        limit: 10,
   *        offset: 0,
   *        include: ['triggered.latest']
   *      }
   *    )
   *   .then((events) => console.log(events))
   *   .catch((err) => console.log(err));
   */
  getEventsByTypeId(eventTypeId, eventFilters = {}) {
    if (!eventTypeId) {
      return Promise.reject(
        new Error('A type ID is required for getting events')
      );
    }

    return this._request
      .get(`${this._baseUrl}/types/${eventTypeId}/events`, {
        params: toSnakeCase(eventFilters)
      })
      .then((events) => {
        console.log(events);
        return formatPaginatedDataFromServer(events);
      });
  }

  /**
   * Updates an event
   *
   * API Endpoint: '/events/:eventId'
   * Method: PUT
   *
   * @param {number} eventId The ID of the event to update
   * @param {Object} update An object containing the updated data for the event
   * @param {number} [update.facilityId]
   * @param {boolean} [update.isPublic]
   * @param {string} [update.name]
   *
   * @returns {Promise}
   * @fulfill {undefined}
   * @reject {Error}
   *
   * @example
   * contxtSdk.events.update('875afddd-091c-4385-bc21-0edf38804d27', {
   *   name: 'Sgt. Pepper's Lonely Hearts Club Band Event'
   * });
   */
  update(eventId, update) {
    if (!eventId) {
      return Promise.reject(
        new Error('An event ID is required to update an event.')
      );
    }

    if (!update) {
      return Promise.reject(
        new Error('An update is required to update an event.')
      );
    }

    if (!isPlainObject(update)) {
      return Promise.reject(
        new Error(
          'The event update must be a well-formed object with the data you wish to update.'
        )
      );
    }

    const formattedUpdate = formatEventUpdateToServer(update);

    return this._request.put(
      `${this._baseUrl}/events/${eventId}`,
      formattedUpdate
    );
  }
}

export default Events;

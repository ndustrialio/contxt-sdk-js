import isPlainObject from 'lodash.isplainobject';
import { toCamelCase, toSnakeCase } from '../utils/objects';

/**
 * @typedef {Object} MessageBusChannel
 * @property {string} id UUID formatted ID
 * @property {string} name
 * @property {string} organizationId UUID of the organization to which the channel belongs
 * @property {string} serviceId
 */

/**
 * Module that provides access to message bus channels
 *
 * @typicalname contxtSdk.bus.channels
 */
class Channels {
  /**
   * @param {Object} sdk An instance of the SDK so the module can communicate with other modules
   * @param {Object} request An instance of the request module tied to this module's audience.
   * @param {string} baseUrl The base URL provided by the parent module
   */
  constructor(sdk, request, baseUrl) {
    this._baseUrl = baseUrl;
    this._request = request;
    this._sdk = sdk;
  }

  /**
   * Creates a new message bus channel
   *
   * API Endpoint: '/organizations/:organizationId/services/:serviceId/channels'
   * Method: POST
   *
   * @param {Object} channel
   * @param {string} channel.name
   * @param {string} channel.organizationId UUID corresponding with an organization
   * @param {string} channel.serviceId ID of a service
   *
   * @returns {Promise}
   * @fulfill {MessageBusChannel} Information about the new channel
   * @reject {Error}
   *
   * @example
   * contxtSdk.bus.channels
   *   .create({
   *     name: 'Channel 46',
   *     organizationId: '28cc036c-d87f-4f06-bd30-1e78c2701064',
   *     serviceId: 'abc123service'
   *   })
   *   .then((channel) => console.log(channel))
   *   .catch((err) => console.log(err));
   */
  create(channel = {}) {
    const requiredFields = ['name', 'organizationId', 'serviceId'];

    for (let i = 0; requiredFields.length > i; i++) {
      const field = requiredFields[i];

      if (!channel[field]) {
        return Promise.reject(
          new Error(
            `A ${field} is required to create a new message bus channel.`
          )
        );
      }
    }

    return this._request
      .post(
        `${this._baseUrl}/organizations/${channel.organizationId}/services/${
          channel.serviceId
        }/channels`,
        toSnakeCase(channel)
      )
      .then((response) => toCamelCase(response));
  }

  /**
   * Deletes a message bus channel
   *
   * API Endpoint: '/organizations/:organizationId/services/:serviceId/channels/:channelId'
   * Method: DELETE
   *
   * @param {string} organizationId UUID of the organization
   * @param {string} serviceId ID of the service
   * @param {string} channelId UUID of the channel
   *
   * @returns {Promise}
   * @fulfill {undefined}
   * @reject {Error}
   *
   * @example
   * contxtSdk.bus.channels
   *   .delete(
   *     '875afddd-091c-4385-bc21-0edf38804d27',
   *     'ab123service',
   *     '175afdec-291c-4385-bc21-0edf38804d21'
   *   );
   */
  delete(organizationId, serviceId, channelId) {
    let errorMsg;

    if (!organizationId) {
      errorMsg =
        'An organizationId is required to delete a message bus channel.';
    } else if (!serviceId) {
      errorMsg = 'A serviceId is required to delete a message bus channel.';
    } else if (!channelId) {
      errorMsg = 'A channelId is required to delete a message bus channel.';
    }

    if (errorMsg) {
      return Promise.reject(new Error(errorMsg));
    }

    return this._request.delete(
      `${
        this._baseUrl
      }/organizations/${organizationId}/services/${serviceId}/channels/${channelId}`
    );
  }

  /**
   * Gets information about a message bus channel
   *
   * API Endpoint: '/organizations/:organizationId/services/:serviceId/channels/:channelId'
   * Method: GET
   *
   * @param {string} organizationId UUID of the organization
   * @param {string} serviceId ID of the service
   * @param {string} channelId UUID of the channel
   *
   * @returns {Promise}
   * @fulfill {MessageBusChannel} Information about an event
   * @reject {Error}
   *
   * @example
   * contxtSdk.bus.channels
   *   .get(
   *     '875afddd-091c-4385-bc21-0edf38804d27',
   *     'ab123service',
   *     '175afdec-291c-4385-bc21-0edf38804d21'
   *   )
   *   .then((channel) => console.log(channel))
   *   .catch((err) => console.log(err));
   */
  get(organizationId, serviceId, channelId) {
    let errorMsg;

    if (!organizationId) {
      errorMsg = 'An organizationId is required to get a message bus channel.';
    } else if (!serviceId) {
      errorMsg = 'A serviceId is required to get a message bus channel.';
    } else if (!channelId) {
      errorMsg = 'A channelId is required to get a message bus channel.';
    }

    if (errorMsg) {
      return Promise.reject(new Error(errorMsg));
    }

    return this._request
      .get(
        `${
          this._baseUrl
        }/organizations/${organizationId}/services/${serviceId}/channels/${channelId}`
      )
      .then((response) => toCamelCase(response));
  }

  /**
   * Updates a message bus channel
   *
   * API Endpoint: '/organizations/:organizationId/services/:serviceId/channels/:channelId'
   * Method: PUT
   *
   * @param {string} organizationId UUID of the organization
   * @param {string} serviceId ID of the service
   * @param {string} channelId UUID of the channel to update
   * @param {Object} update An object containing the updated data for the channel
   * @param {string} [update.name]
   *
   * @returns {Promise}
   * @fulfill {undefined}
   * @reject {Error}
   *
   * @example
   * contxtSdk.bus.channels
   *   .update(
   *     '875afddd-091c-4385-bc21-0edf38804d27',
   *     'ab123service',
   *     '175afdec-291c-4385-bc21-0edf38804d21'
   *     { name: 'An Updated Channel Name' }
   *   );
   */
  update(organizationId, serviceId, channelId, update) {
    let errorMsg;

    if (!organizationId) {
      errorMsg =
        'An organizationId is required to delete a message bus channel.';
    } else if (!serviceId) {
      errorMsg = 'A serviceId is required to delete a message bus channel.';
    } else if (!channelId) {
      errorMsg = 'A channelId is required to delete a message bus channel.';
    }

    if (errorMsg) {
      return Promise.reject(new Error(errorMsg));
    }

    if (!update) {
      return Promise.reject(
        new Error('An update is required to update a message bus channel.')
      );
    }

    if (!isPlainObject(update)) {
      return Promise.reject(
        new Error(
          'The message bus channel update must be a well-formed object with the data you wish to update.'
        )
      );
    }

    return this._request.put(
      `${
        this._baseUrl
      }/organizations/${organizationId}/services/${serviceId}/channels/${channelId}`,
      toSnakeCase(update)
    );
  }
}

export default Channels;

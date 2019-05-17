import { toCamelCase, toSnakeCase } from '../utils/objects';

/**
 * @typedef {Object} ContxtUser
 * @property {string} createdAt ISO 8601 Extended Format date/time string
 * @property {string} email
 * @property {string} firstName
 * @property {string} id
 * @property {boolean} isActivated
 * @property {boolean} isSuperuser
 * @property {string} lastName
 * @property {string} [phoneNumber]
 * @property {string} updatedAt ISO 8601 Extended Format date/time string
 */

/**
 * Module that provides access to contxt users
 *
 * @typicalname contxtSdk.coordinator.users
 */
class Users {
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
   * Activates a new user
   *
   * API Endpoint: '/users/:userId/activate'
   * Method: POST
   *
   * Note: Only valid for web users using auth0WebAuth session type
   *
   * @param {string} userId The ID of the user to activate
   * @param {Object} user
   * @param {string} user.email The email address of the user
   * @param {string} user.password The password to set for the user
   * @param {string} user.userToken The JWT token provided by the invite link
   *
   * @returns {Promise}
   * @fulfill {undefined}
   * @reject {Error}
   *
   * @example
   * contxtSdk.coordinator.users
   *   .activate('7bb79bdf-7492-45c2-8640-2dde63535827', {
   *     email: 'bob.sagat56@gmail.com',
   *     password: 'ds32jX32jaMM1Nr',
   *     userToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
   *   })
   *   .then(() => console.log("User Activated"))
   *   .catch((err) => console.log(err));
   */
  activate(userId, user = {}) {
    if (!userId) {
      return Promise.reject(
        new Error('A user ID is required for activating a user')
      );
    }

    const requiredFields = ['email', 'password', 'userToken'];

    for (let i = 0; requiredFields.length > i; i++) {
      const field = requiredFields[i];

      if (!user[field]) {
        return Promise.reject(
          new Error(`A ${field} is required to activate a user.`)
        );
      }
    }

    return this._request.post(
      `${this._baseUrl}/users/${userId}/activate`,
      toSnakeCase(user)
    );
  }

  /**
   * Gets information about a contxt user
   *
   * API Endpoint: '/users/:userId'
   * Method: GET
   *
   * @param {string} userId The ID of the user
   *
   * @returns {Promise}
   * @fulfill {ContxtUser} Information about a contxt user
   * @reject {Error}
   *
   * @example
   * contxtSdk.coordinator.users
   *   .get('auth0|12345')
   *   .then((user) => console.log(user))
   *   .catch((err) => console.log(err));
   */
  get(userId) {
    if (!userId) {
      return Promise.reject(
        new Error('A user ID is required for getting information about a user')
      );
    }

    return this._request
      .get(`${this._baseUrl}/users/${userId}`)
      .then((user) => toCamelCase(user));
  }

  /**
   * Gets a list of users for a contxt organization
   *
   * API Endpoint: '/organizations/:organizationId/users'
   * Method: GET
   *
   * @param {string} organizationId The ID of the organization
   *
   * @returns {Promise}
   * @fulfill {ContxtUser[]} List of users for a contxt organization
   * @reject {Error}
   *
   * @example
   * contxtSdk.coordinator.users
   *   .getByOrganizationId('36b8421a-cc4a-4204-b839-1397374fb16b')
   *   .then((orgUsers) => console.log(orgUsers))
   *   .catch((err) => console.log(err));
   */
  getByOrganizationId(organizationId) {
    if (!organizationId) {
      return Promise.reject(
        new Error(
          'An organization ID is required for getting a list of users for an organization'
        )
      );
    }

    return this._request
      .get(`${this._baseUrl}/organizations/${organizationId}/users`)
      .then((orgUsers) => toCamelCase(orgUsers));
  }

  /**
   * Creates a new contxt user, adds them to an organization, and
   * sends them an email invite link to do final account setup.
   *
   * API Endpoint: '/organizations/:organizationId/users'
   * Method: POST
   *
   * Note: Only valid for web users using auth0WebAuth session type
   *
   * @param {string} organizationId The ID of the organization
   * @param {Object} user
   * @param {string} user.email The email address of the new user
   * @param {string} user.firstName The first name of the new user
   * @param {string} user.lastName The last name of the new user
   * @param {string} user.redirectUrl The url that the user will be redirected
   * to after using the invite email link. Typically this is an /activate
   * endpoint that accepts url query params userToken and userId and uses them
   * to do final activation on the user's account.
   *
   * @returns {Promise}
   * @fulfill {ContxtUser} The new user
   * @reject {Error}
   *
   * @example
   * contxtSdk.coordinator.users
   *   .invite('fdf01507-a26a-4dfe-89a2-bc91861169b8', {
   *     email: 'bob.sagat56@gmail.com',
   *     firstName: 'Bob',
   *     lastName: 'Sagat',
   *     redirectUrl: 'https://contxt.ndustrial.io/activate'
   *   })
   *   .then((newUser) => console.log(newUser))
   *   .catch((err) => console.log(err));
   */
  invite(organizationId, user = {}) {
    if (!organizationId) {
      return Promise.reject(
        new Error('An organization ID is required for inviting a new user')
      );
    }

    const requiredFields = ['email', 'firstName', 'lastName', 'redirectUrl'];

    for (let i = 0; requiredFields.length > i; i++) {
      const field = requiredFields[i];

      if (!user[field]) {
        return Promise.reject(
          new Error(`A ${field} is required to create a new user.`)
        );
      }
    }

    return this._request
      .post(
        `${this._baseUrl}/organizations/${organizationId}/users`,
        toSnakeCase(user)
      )
      .then((response) => toCamelCase(response));
  }

  /**
   * Removes a user from an organization
   *
   * API Endpoint: '/organizations/:organizationId/users/:userId'
   * Method: DELETE
   *
   * @param {string} organizationId The ID of the organization
   * @param {string} userId The ID of the user
   *
   * @returns {Promise}
   * @fulfill {undefined}
   * @reject {Error}
   *
   * @example
   * contxtSdk.coordinator.users
   *   .remove('ed2e8e24-79ef-4404-bf5f-995ef31b2298', '4a577e87-7437-4342-b183-00c18ec26d52')
   *   .catch((err) => console.log(err));
   */
  remove(organizationId, userId) {
    if (!organizationId) {
      return Promise.reject(
        new Error(
          'An organization ID is required for removing a user from an organization'
        )
      );
    }

    if (!userId) {
      return Promise.reject(
        new Error(
          'A user ID is required for removing a user from an organization'
        )
      );
    }

    return this._request.delete(
      `${this._baseUrl}/organizations/${organizationId}/users/${userId}`
    );
  }
}

export default Users;

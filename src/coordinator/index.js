import EdgeNodes from './edgeNodes';
import { toCamelCase, toSnakeCase } from '../utils/objects';

/**
 * @typedef {Object} ContxtApplication
 * @property {string} clientId
 * @property {string} clientSecret
 * @property {string} createdAt ISO 8601 Extended Format date/time string
 * @property {string} currentVersionId
 * @property {string} description
 * @property {string} iconUrl
 * @property {number} id
 * @property {string} name
 * @property {number} serviceId
 * @property {string} type
 * @property {string} updatedAt ISO 8601 Extended Format date/time string
 */

/**
 * @typedef {Object} ContxtOrganization
 * @property {string} createdAt ISO 8601 Extended Format date/time string
 * @property {string} id UUID formatted ID
 * @property {number} legacyOrganizationId
 * @property {string} name
 * @property {string} updatedAt ISO 8601 Extended Format date/time string
 */

/**
 * @typedef {Object} ContxtOrganizationFeaturedApplication
 * @property {number} applicationId
 * @property {string} createdAt ISO 8601 Extended Format date/time string
 * @property {string} id
 * @property {string} organizationId
 * @property {string} updatedAt ISO 8601 Extended Format date/time string
 */

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
 * @typedef {Object} ContxtUserFavoriteApplication
 * @property {number} applicationId
 * @property {string} createdAt ISO 8601 Extended Format date/time string
 * @property {string} id
 * @property {string} updatedAt ISO 8601 Extended Format date/time string
 * @property {string} userId
 */

/**
 * Module that provides access to information about Contxt
 *
 * @typicalname contxtSdk.coordinator
 */
class Coordinator {
  /**
   * @param {Object} sdk An instance of the SDK so the module can communicate with other modules
   * @param {Object} request An instance of the request module tied to this module's audience.
   */
  constructor(sdk, request) {
    const baseUrl = `${sdk.config.audiences.coordinator.host}/v1`;

    this._baseUrl = baseUrl;
    this._request = request;
    this._sdk = sdk;

    this.edgeNodes = new EdgeNodes(sdk, request, baseUrl);
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
   * contxtSdk.coordinator.
   *   .activateNewUser('7bb79bdf-7492-45c2-8640-2dde63535827', {
   *     email: 'bob.sagat56@gmail.com',
   *     password: 'ds32jX32jaMM1Nr',
   *     userToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
   *   })
   *   .then(() => console.log("User Activated"))
   *   .catch((err) => console.log(err));
   */
  activateNewUser(userId, user = {}) {
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
   * Adds an application to the current user's list of favorited applications
   *
   * API Endpoint: '/applications/:applicationId/favorites'
   * Method: POST
   *
   * Note: Only valid for web users using auth0WebAuth session type
   *
   * @param {number} applicationId The ID of the application
   *
   * @returns {Promise}
   * @fulfill {ContxtUserFavoriteApplication} Information about the contxt application favorite
   * @reject {Error}
   *
   * @example
   * contxtSdk.coordinator
   *   .createFavoriteApplication(25)
   *   .then((favoriteApplication) => console.log(favoriteApplication))
   *   .catch((err) => console.log(err));
   */
  createFavoriteApplication(applicationId) {
    if (!applicationId) {
      return Promise.reject(
        new Error(
          'An application ID is required for creating a favorite application'
        )
      );
    }

    return this._request
      .post(`${this._baseUrl}/applications/${applicationId}/favorites`)
      .then((favoriteApplication) => toCamelCase(favoriteApplication));
  }

  /**
   * Removes an application from the current user's list of favorited applications
   *
   * API Endpoint: '/applications/:applicationId/favorites'
   * Method: DELETE
   *
   * Note: Only valid for web users using auth0WebAuth session type
   *
   * @param {number} applicationId The ID of the application
   *
   * @returns {Promise}
   * @fulfill {undefined}
   * @reject {Error}
   *
   * @example
   * contxtSdk.coordinator
   *   .deleteFavoriteApplication(25)
   *   .catch((err) => console.log(err));
   */
  deleteFavoriteApplication(applicationId) {
    if (!applicationId) {
      return Promise.reject(
        new Error(
          'An application ID is required for deleting a favorite application'
        )
      );
    }

    return this._request.delete(
      `${this._baseUrl}/applications/${applicationId}/favorites`
    );
  }

  /**
   * Gets information about all contxt applications
   *
   * API Endpoint: '/applications'
   * Method: GET
   *
   * @returns {Promise}
   * @fulfill {ContxtApplication[]} Information about all contxt applications
   * @reject {Error}
   *
   * @example
   * contxtSdk.coordinator
   *   .getAllApplications()
   *   .then((apps) => console.log(apps))
   *   .catch((err) => console.log(err));
   */
  getAllApplications() {
    return this._request
      .get(`${this._baseUrl}/applications`)
      .then((apps) => apps.map((app) => toCamelCase(app)));
  }

  /**
   * Gets information about all contxt organizations
   *
   * API Endpoint: '/organizations'
   * Method: GET
   *
   * @returns {Promise}
   * @fulfill {ContxtOrganization[]} Information about all contxt organizations
   * @reject {Error}
   *
   * @example
   * contxtSdk.coordinator
   *   .getAllOrganizations()
   *   .then((orgs) => console.log(orgs))
   *   .catch((err) => console.log(err));
   */
  getAllOrganizations() {
    return this._request
      .get(`${this._baseUrl}/organizations`)
      .then((orgs) => orgs.map((org) => toCamelCase(org)));
  }

  /**
   * Gets the current user's list of favorited applications
   *
   * API Endpoint: '/applications/favorites'
   * Method: GET
   *
   * Note: Only valid for web users using auth0WebAuth session type
   *
   * @returns {Promise}
   * @fulfill {ContxtUserFavoriteApplication[]} A list of favorited applications
   * @reject {Error}
   *
   * @example
   * contxtSdk.coordinator
   *   .getFavoriteApplications()
   *   .then((favoriteApplications) => console.log(favoriteApplications))
   *   .catch((err) => console.log(err));
   */
  getFavoriteApplications() {
    return this._request
      .get(`${this._baseUrl}/applications/favorites`)
      .then((favoriteApps) => toCamelCase(favoriteApps));
  }

  /**
   * Gets an organization's list of featured applications
   *
   * API Endpoint: '/organizations/:organizationId/applications/featured'
   * Method: GET
   *
   * Note: Only valid for web users using auth0WebAuth session type
   *
   * @param {string} organizationId The ID of the organization
   *
   * @returns {Promise}
   * @fulfill {ContxtOrganizationFeaturedApplication[]} A list of featured applications
   * @reject {Error}
   *
   * @example
   * contxtSdk.coordinator
   *   .getFeaturedApplications('36b8421a-cc4a-4204-b839-1397374fb16b')
   *   .then((featuredApplications) => console.log(featuredApplications))
   *   .catch((err) => console.log(err));
   */
  getFeaturedApplications(organizationId) {
    if (!organizationId) {
      return Promise.reject(
        new Error(
          'An organization ID is required for getting featured applications for an organization'
        )
      );
    }

    return this._request
      .get(
        `${this._baseUrl}/organizations/${organizationId}/applications/featured`
      )
      .then((featuredApplications) => toCamelCase(featuredApplications));
  }

  /**
   * Gets information about a contxt organization
   *
   * API Endpoint: '/organizations/:organizationId'
   * Method: GET
   *
   * @param {string} organizationId The ID of the organization
   *
   * @returns {Promise}
   * @fulfill {ContxtOrganization} Information about a contxt organization
   * @reject {Error}
   *
   * @example
   * contxtSdk.coordinator
   *   .getOrganizationById('36b8421a-cc4a-4204-b839-1397374fb16b')
   *   .then((org) => console.log(org))
   *   .catch((err) => console.log(err));
   */
  getOrganizationById(organizationId) {
    if (!organizationId) {
      return Promise.reject(
        new Error(
          'An organization ID is required for getting information about an organization'
        )
      );
    }

    return this._request
      .get(`${this._baseUrl}/organizations/${organizationId}`)
      .then((org) => toCamelCase(org));
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
   * contxtSdk.coordinator
   *   .getUsersByOrganization('36b8421a-cc4a-4204-b839-1397374fb16b')
   *   .then((orgUsers) => console.log(orgUsers))
   *   .catch((err) => console.log(err));
   */
  getUsersByOrganization(organizationId) {
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
   * contxtSdk.coordinator
   *   .getUser('auth0|12345')
   *   .then((user) => console.log(user))
   *   .catch((err) => console.log(err));
   */
  getUser(userId) {
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
   * Gets a map of permission scopes to which the user has access
   *
   * API Endpoint: '/users/:userId/permissions'
   * Method: GET
   *
   * @param {string} userId The ID of the user
   *
   * @returns {Promise}
   * @fulfill {Object.<string, string[]>} A map of user permissions where the
   *   key corresponds to a service ID (i.e. the ID generated by Auth0) and the
   *   value is an array of permission scopes that are managed by Contxt (e.g.
   *   `read:facilities` and `write:facilities`)
   * @reject {Error}
   *
   * @example
   * contxtSdk.coordinator
   *   .getUserPermissionsMap('auth0|12345')
   *   .then((permissionsMap) => console.log(permissionsMap))
   *   .catch((err) => console.log(err));
   */
  getUserPermissionsMap(userId) {
    if (!userId) {
      return Promise.reject(
        new Error(
          "A user ID is required for getting information about a user's permissions map"
        )
      );
    }

    // NOTE: This response is not run through the `toCamelCase` method because
    // it could errantly remove underscores from service IDs.
    return this._request.get(`${this._baseUrl}/users/${userId}/permissions`);
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
   * contxtSdk.coordinator.
   *   .inviteNewUserToOrganization('fdf01507-a26a-4dfe-89a2-bc91861169b8', {
   *     email: 'bob.sagat56@gmail.com',
   *     firstName: 'Bob',
   *     lastName: 'Sagat',
   *     redirectUrl: 'https://contxt.ndustrial.io/activate'
   *   })
   *   .then((newUser) => console.log(newUser))
   *   .catch((err) => console.log(err));
   */
  inviteNewUserToOrganization(organizationId, user = {}) {
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
   * contxtSdk.coordinator
   *   .removeUserFromOrganization('ed2e8e24-79ef-4404-bf5f-995ef31b2298', '4a577e87-7437-4342-b183-00c18ec26d52')
   *   .catch((err) => console.log(err));
   */
  removeUserFromOrganization(organizationId, userId) {
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

export default Coordinator;

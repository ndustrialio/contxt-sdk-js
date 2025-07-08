import axios from 'axios';

import ObjectUtils from '../utils/objects';

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
 * @typedef {Object} ContxtUserApplication
 * @property {string} applicationId
 * @property {string} createdAt ISO 8601 Extended Format date/time string
 * @property {string} id
 * @property {string} userId
 * @property {string} updatedAt ISO 8601 Extended Format date/time string
 */

/**
 * @typedef {Object} ContxtUserRole
 * @property {string} createdAt ISO 8601 Extended Format date/time string
 * @property {string} id
 * @property {boolean} mappedFromExternalGroup
 * @property {string} userId
 * @property {string} roleId
 * @property {string} updatedAt ISO 8601 Extended Format date/time string
 */

/**
 * @typedef {Object} ContxtUserProjectEnvironment
 * @property {string} accessType Access Type of the user for this project with options "reader", "admin"
 * @property {string} createdAt ISO 8601 Extended Format date/time string
 * @property {string} id
 * @property {string} userId
 * @property {string} projectEnvironmentId
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
   * @param {string} [tenantBaseUrl] The tenant base URL provided by the parent module
   * @param {string} [legacyBaseUrl] The legacy base URL provided by the parent module
   * @param {string} [organizationId] The organization ID to be used in tenant url requests
   */
  constructor(
    sdk,
    request,
    baseUrl,
    tenantBaseUrl = null,
    legacyBaseUrl = null,
    organizationId = null
  ) {
    this._baseUrl = baseUrl;
    this._tenantBaseUrl = tenantBaseUrl;
    this._legacyBaseUrl = legacyBaseUrl;
    this._request = request;
    this._sdk = sdk;
    this._organizationId = organizationId;
  }

  _getBaseUrl(type) {
    switch (type) {
      case 'legacy':
        return this._legacyBaseUrl || this._baseUrl;

      case 'access':
        return this._baseUrl;

      default:
        return this._tenantBaseUrl || this._baseUrl;
    }
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

    // Uses axios directly instead of this.request to bypass authorization interceptors
    return axios.post(
      `${this._getBaseUrl('access')}/users/${userId}/activate`,
      ObjectUtils.toSnakeCase(user)
    );
  }

  /**
   * Adds a application to a user
   *
   * API Endpoint: '/users/:userId/applications/:applicationId'
   * Method: GET
   *
   * @param {string} userId The ID of the user
   * @param {string} applicationId The ID of the application
   *
   * @returns {Promise}
   * @fulfill {ContxtUserApplication} The newly created user application
   * @reject {Error}
   *
   * @example
   * contxtSdk.coordinator.users
   *   .addApplication('36b8421a-cc4a-4204-b839-1397374fb16b', '007ca9ee-ece7-4931-9d11-9b4fd97d4d58')
   *   .then((userApplication) => console.log(userApplication))
   *   .catch((err) => console.log(err));
   */
  addApplication(userId, applicationId) {
    if (!userId) {
      return Promise.reject(
        new Error('A user ID is required for adding a application to a user')
      );
    }

    if (!applicationId) {
      return Promise.reject(
        new Error(
          'An application ID is required for adding a application to a user'
        )
      );
    }

    return this._request
      .post(
        `${this._getBaseUrl()}/users/${userId}/applications/${applicationId}`
      )
      .then((response) => ObjectUtils.toCamelCase(response));
  }

  /**
   * Adds a role to a user
   *
   * API Endpoint: '/users/:userId/roles/:roleId'
   * Method: POST
   *
   * @param {string} userId The ID of the user
   * @param {string} roleId The ID of the role
   *
   * @returns {Promise}
   * @fulfill {ContxtUserRole} The newly created user role
   * @reject {Error}
   *
   * @example
   * contxtSdk.coordinator.users
   *   .addRole('36b8421a-cc4a-4204-b839-1397374fb16b', '007ca9ee-ece7-4931-9d11-9b4fd97d4d58')
   *   .then((userRole) => console.log(userRole))
   *   .catch((err) => console.log(err));
   */
  addRole(userId, roleId) {
    if (!userId) {
      return Promise.reject(
        new Error('A user ID is required for adding a role to a user')
      );
    }

    if (!roleId) {
      return Promise.reject(
        new Error('A role ID is required for adding a role to a user')
      );
    }

    return this._request
      .post(`${this._getBaseUrl()}/users/${userId}/roles/${roleId}`)
      .then((response) => ObjectUtils.toCamelCase(response));
  }

  /**
   * Adds a project environment to a user
   *
   * API Endpoint: '/users/:userId/project_environments/:projectEnvironmentSlug
   * Method: POST
   *
   * @param {string} userId The ID of the user
   * @param {string} projectEnvironmentSlug The slug of the project environment
   * @param {'reader' | 'admin'} accessType The level of access for the user
   *
   * @returns {Promise}
   * @fulfill {ContxtUserProjectEnvironment} The newly created user project environment
   * @reject {Error}
   *
   * @example
   * contxtSdk.coordinator.users
   *   .addProjectEnvironment('36b8421a-cc4a-4204-b839-1397374fb16b', 'project-environment-slug', 'admin')
   *   .then((userProject) => console.log(userProject))
   *   .catch((err) => console.log(err));
   */
  addProjectEnvironment(userId, projectEnvironmentId, accessType) {
    if (!userId) {
      return Promise.reject(
        new Error(
          'A user ID is required for adding a project environment to a user'
        )
      );
    }

    if (!projectEnvironmentId) {
      return Promise.reject(
        new Error(
          'A project environment slug is required for adding a project environment to a user.'
        )
      );
    }

    if (['reader', 'admin'].indexOf(accessType) === -1) {
      return Promise.reject(
        new Error(
          'An access type of "reader" or "admin" is required for adding a project environment to a user'
        )
      );
    }

    return this._request
      .post(
        `${this._getBaseUrl()}/users/${userId}/project_environments/${projectEnvironmentId}`,
        {
          access_type: accessType
        }
      )
      .then((response) => ObjectUtils.toCamelCase(response));
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
      .get(`${this._getBaseUrl('access')}/users/${userId}`)
      .then((user) => ObjectUtils.toCamelCase(user));
  }

  /**
   * Gets a list of users for a contxt organization
   *
   * Legacy API Endpoint: '/organizations/:organizationId/users'
   * API Endpoint: '/users'
   * Method: GET
   *
   * @param {string} organizationId The ID of the organization, optional when using the tenant API and an organization ID has been set
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
    if (this._organizationId) {
      return this._request
        .get(`${this._getBaseUrl()}/users`)
        .then((orgUsers) => ObjectUtils.toCamelCase(orgUsers));
    }

    if (!organizationId) {
      return Promise.reject(
        new Error(
          'An organization ID is required for getting a list of users for an organization'
        )
      );
    }

    return this._request
      .get(
        `${this._getBaseUrl('legacy')}/organizations/${organizationId}/users`
      )
      .then((orgUsers) => ObjectUtils.toCamelCase(orgUsers));
  }

  /**
   * Creates a new contxt user, adds them to an organization, and
   * sends them an email invite link to do final account setup.
   *
   * Legacy API Endpoint: '/organizations/:organizationId/users'
   * API Endpoint: '/users'
   * Method: POST
   *
   * Note: Only valid for web users using auth0WebAuth session type
   *
   * @param {string} organizationId The ID of the organization, optional when using the tenant API and an organization ID has been set
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
    if (this._organizationId) {
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
        .post(`${this._getBaseUrl()}/users`, ObjectUtils.toSnakeCase(user))
        .then((response) => ObjectUtils.toCamelCase(response));
    }

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
        `${this._getBaseUrl('legacy')}/organizations/${organizationId}/users`,
        ObjectUtils.toSnakeCase(user)
      )
      .then((response) => ObjectUtils.toCamelCase(response));
  }

  /**
   * Removes a user from an organization
   *
   * Legacy API Endpoint: '/organizations/:organizationId/users/:userId'
   * API Endpoint: '/users/:userId'
   * Method: DELETE
   *
   * @param {string} organizationId The ID of the organization, optional when using the tenant API and an organization ID has been set
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
    if (this._organizationId) {
      if (!userId) {
        return Promise.reject(
          new Error(
            'A user ID is required for removing a user from an organization'
          )
        );
      }

      return this._request.delete(`${this._getBaseUrl()}/users/${userId}`);
    }

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
      `${this._getBaseUrl(
        'legacy'
      )}/organizations/${organizationId}/users/${userId}`
    );
  }

  /**
   * Removes a application from a user
   *
   * API Endpoint: '/users/:userId/applications/:applicationId'
   * Method: DELETE
   *
   * @param {string} userId The ID of the user
   * @param {string} applicationId The ID of the application
   *
   * @returns {Promise}
   * @fulfill {undefined}
   * @reject {Error}
   *
   * @example
   * contxtSdk.coordinator.users
   *   .removeApplication('36b8421a-cc4a-4204-b839-1397374fb16b', '007ca9ee-ece7-4931-9d11-9b4fd97d4d58')
   *   .catch((err) => console.log(err));
   */
  removeApplication(userId, applicationId) {
    if (!userId) {
      return Promise.reject(
        new Error(
          'A user ID is required for removing a application from a user'
        )
      );
    }

    if (!applicationId) {
      return Promise.reject(
        new Error(
          'An application ID is required for removing a application from a user'
        )
      );
    }

    return this._request.delete(
      `${this._getBaseUrl()}/users/${userId}/applications/${applicationId}`
    );
  }

  /**
   * Removes a role from a user
   *
   * API Endpoint: '/users/:userId/roles/:roleId'
   * Method: DELETE
   *
   * @param {string} userId The ID of the user
   * @param {string} roleId The ID of the role
   *
   * @returns {Promise}
   * @fulfill {undefined}
   * @reject {Error}
   *
   * @example
   * contxtSdk.coordinator.users
   *   .removeRole('36b8421a-cc4a-4204-b839-1397374fb16b', '007ca9ee-ece7-4931-9d11-9b4fd97d4d58')
   *   .catch((err) => console.log(err));
   */
  removeRole(userId, roleId) {
    if (!userId) {
      return Promise.reject(
        new Error('A user ID is required for removing a role from a user')
      );
    }

    if (!roleId) {
      return Promise.reject(
        new Error('A role ID is required for removing a role from a user')
      );
    }

    return this._request.delete(
      `${this._getBaseUrl()}/users/${userId}/roles/${roleId}`
    );
  }

  /**
   * Removes a project environment from a user
   *
   * API Endpoint: 'users/:userId/project_environments/:projectEnvironmentSlug
   * Method: DELETE
   *
   * @param {string} userId The ID of the user
   * @param {string} projectEnvironmentSlug The slug of the project environment
   *
   * @returns {Promise}
   * @fulfill {undefined}
   * @reject {Error}
   *
   * @example
   * contxtSdk.coordinator.users
   *   .removeProjectEnvironment('36b8421a-cc4a-4204-b839-1397374fb16b', 'project-environment-slug')
   *   .catch((err) => console.log(err));
   */
  removeProjectEnvironment(userId, projectEnvironmentId) {
    if (!userId) {
      return Promise.reject(
        new Error(
          'A user ID is required for removing a project environment from a user'
        )
      );
    }

    if (!projectEnvironmentId) {
      return Promise.reject(
        new Error(
          'A project environment slug is required for removing a project environment from a user.'
        )
      );
    }

    return this._request.delete(
      `${this._getBaseUrl()}/users/${userId}/project_environments/${projectEnvironmentId}`
    );
  }

  /**
   * Syncs the user's roles and application access with the external auth provider
   *
   * API Endpoint: '/users/:userId/sync'
   * Method: GET
   *
   * @param {string} userId The ID of the user
   *
   * @returns {Promise}
   * @fulfill {undefined}
   * @reject {Error}
   *
   * @example
   * contxtSdk.coordinator.users
   *   .sync('36b8421a-cc4a-4204-b839-1397374fb16b')
   *   .catch((err) => console.log(err));
   */
  sync(userId) {
    if (!userId) {
      return Promise.reject(
        new Error('A user ID is required for syncing user permissions')
      );
    }

    return this._request.get(
      `${this._getBaseUrl('access')}/users/${userId}/sync`
    );
  }
}

export default Users;

import EdgeNodes from './edgeNodes';
import Roles from './roles';
import Users from './users';
import { toCamelCase } from '../utils/objects';

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
 * @typedef {Object} ContxtStack
 * @property {string} clientId
 * @property {string} clusterId
 * @property {string} createdAt ISO 8601 Extended Format date/time string
 * @property {string} currentVersionId
 * @property {string} description
 * @property {string} documentationUrl
 * @property {string} icon
 * @property {number} id
 * @property {string} name
 * @property {string} organizationId
 * @property {string} ownerId
 * @property {string} type
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
 * @typedef {Object} ContxtUserPermissions
 * @property {number[]} applicationsExplicit Application ids the user has directly been given access to
 * @property {number[]} applicationsImplicit Application ids the user has access to from a role or being the owner
 * @property {string[]} roles Role ids that the user belongs to
 * @property {number[]} stacksExplicit Stack ids the user has directly been given access to
 * @property {number[]} stacksImplicit Stack ids the user has access to from a role or being the owner
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
    this.roles = new Roles(sdk, request, baseUrl);
    this.users = new Users(sdk, request, baseUrl);
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
   * Gets a list of user permissions for an organization
   *
   * API Endpoint: '/organizations/:organizationId/users/permissions'
   * Method: GET
   *
   * @param {string} organizationId The ID of the organization
   *
   * @returns {Promise}
   * @fulfill {ContxtUserPermissions[]} A collection of user permissions
   * @reject {Error}
   *
   * @example
   * contxtSdk.coordinator
   *   .getUsersPermissionsByOrganization('36b8421a-cc4a-4204-b839-1397374fb16b')
   *   .then((usersPermissions) => console.log(usersPermissions))
   *   .catch((err) => console.log(err));
   */
  getUsersPermissionsByOrganization(organizationId) {
    if (!organizationId) {
      return Promise.reject(
        new Error(
          'An organization ID is required for getting users permissions for an organization'
        )
      );
    }

    return this._request
      .get(`${this._baseUrl}/organizations/${organizationId}/users/permissions`)
      .then((userPermissions) => toCamelCase(userPermissions));
  }
}

export default Coordinator;

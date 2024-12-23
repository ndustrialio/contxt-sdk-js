import ObjectUtils from '../utils/objects';

/**
 * @typedef {Object} ContxtRole
 * @property {ContxtApplication[]} applications
 * @property {string} createdAt ISO 8601 Extended Format date/time string
 * @property {string} description
 * @property {string} id
 * @property {string} name
 * @property {string} organizationId
 * @property {ContxtProjectEnvironment[]} projectEnvironments
 * @property {string} updatedAt ISO 8601 Extended Format date/time string
 */
/**
 * @typedef {Object} ContxtRoleApplication
 * @property {number} applicationId
 * @property {string} createdAt ISO 8601 Extended Format date/time string
 * @property {number} id
 * @property {string} roleId
 * @property {string} updatedAt ISO 8601 Extended Format date/time string
 */

/**
 * @typedef {Object} ContxtRoleProjectEnvironment
 * @property {string} accessType Access Type of the user for this project with options "reader", "admin"
 * @property {string} createdAt ISO 8601 Extended Format date/time string
 * @property {string} userId
 * @property {string} environmentId
 * @property {string} updatedAt ISO 8601 Extended Format date/time string
 */

/**
 * @typedef {Object} ContxtProjectEnvironment
 * @property {string} createdAt ISO 8601 Extended Format date/time string
 * @property {string} updatedAt ISO 8601 Extended Format date/time string
 * @property {string} id
 * @property {string} organizationId
 * @property {number} projectId
 * @property {string} clusterId
 * @property {string} slug
 * @property {string} name
 * @property {string} type
 * @property {string} description
 */

/**
 * Module that provides access to contxt roles
 *
 * @typicalname contxtSdk.coordinator.roles
 */
class Roles {
  /**
   * @param {Object} sdk An instance of the SDK so the module can communicate with other modules
   * @param {Object} request An instance of the request module tied to this module's audience.
   * @param {string} baseUrl The base URL provided by the parent module
   * @param {string} [organizationId] The organization ID to be used in tenant url requests
   */
  constructor(sdk, request, baseUrl, organizationId = null) {
    this._baseUrl = baseUrl;
    this._request = request;
    this._sdk = sdk;
    this._organizationId = organizationId;
  }

  /**
   * Add an application to a role
   *
   * API Endpoint: '/roles/:roleId/applications/:applicationId'
   * Method: POST
   *
   * @param {string} roleId The UUID formatted ID of the role
   * @param {number} applicationId The ID of the application
   *
   * @returns {Promise}
   * @fulfill {ContxtRoleApplication}
   * @reject {Error}
   *
   * @example
   * contxtSdk.roles
   *   .addApplication('36b8421a-cc4a-4204-b839-1397374fb16b', 42)
   *   .then((roleApplication) => console.log(roleApplication))
   *   .catch((err) => console.log(err));
   */
  addApplication(roleId, applicationId) {
    if (!roleId) {
      return Promise.reject(
        new Error('A roleId is required for adding an application to a role.')
      );
    }

    if (!applicationId) {
      return Promise.reject(
        new Error(
          'An applicationId is required for adding an application to a role.'
        )
      );
    }

    return this._request
      .post(`${this._baseUrl}/roles/${roleId}/applications/${applicationId}`)
      .then((response) => ObjectUtils.toCamelCase(response));
  }

  /**
   * Add a project environment to a role
   *
   * API Endpoint: 'roles/:roleId/project_environments/:projectEnvironmentSlug'
   * Method: POST
   *
   * @param {string} roleId The UUID formatted ID of the role
   * @param {string} projectEnvironmentSlug The slug of the project environment
   * @param {'reader' | 'admin'} accessType The level of access for the role
   *
   * @returns {Promise}
   * @fulfill {ContxtRoleProjectEnvironment}
   * @reject {Error}
   *
   * @example
   * contxtSdk.roles
   *   .addProjectEnvironment('36b8421a-cc4a-4204-b839-1397374fb16b', 'project-environment-slug', 'admin')
   *   .then((roleProject) => console.log(roleProject))
   *   .catch((err) => console.log(err));
   */
  addProjectEnvironment(roleId, projectEnvironmentId, accessType) {
    if (!roleId) {
      return Promise.reject(
        new Error(
          'A roleId is required for adding a project environment to a role.'
        )
      );
    }

    if (!projectEnvironmentId) {
      return Promise.reject(
        new Error(
          'A project environment slug is required for adding a project environment to a role.'
        )
      );
    }

    if (['reader', 'admin'].indexOf(accessType) === -1) {
      return Promise.reject(
        new Error(
          'An accessType of "reader" or "admin" is required for adding a project environment to a role.'
        )
      );
    }

    return this._request
      .post(
        `${
          this._baseUrl
        }/roles/${roleId}/project_environments/${projectEnvironmentId}`,
        {
          access_type: accessType
        }
      )
      .then((response) => ObjectUtils.toCamelCase(response));
  }

  /**
   * Create a new role for an organization
   *
   * @param {string} organizationId The ID of the organization, optional when using the tenant API and an organization ID has been set
   * @param {Object} role
   * @param {string} role.name The name of the new role
   * @param {string} role.description Some text describing the purpose of the role
   *
   * @returns {Promise}
   * @fulfill {ContxtRole} The newly created role
   * @reject {Error}
   *
   * @example
   * contxtSdk.coordinator.roles
   *   .create('36b8421a-cc4a-4204-b839-1397374fb16b', {
   *     name: 'view-myapp',
   *     description: 'Give this role for viewing myapp'
   *    })
   *   .then((role) => console.log(role))
   *   .catch((err) => console.log(err));
   */
  create(organizationId, role = {}) {
    if (this._organizationId) {
      if (!role.name) {
        return Promise.reject(
          new Error(`A name is required to create a new role.`)
        );
      }

      if (!role.description) {
        return Promise.reject(
          new Error(`A description is required to create a new role.`)
        );
      }

      return this._request
        .post(`${this._baseUrl}/roles`, ObjectUtils.toSnakeCase(role))
        .then((response) => ObjectUtils.toCamelCase(response));
    }

    if (!organizationId) {
      return Promise.reject(
        new Error(
          'An organizationId is required for creating roles for an organization.'
        )
      );
    }

    if (!role.name) {
      return Promise.reject(
        new Error(`A name is required to create a new role.`)
      );
    }

    if (!role.description) {
      return Promise.reject(
        new Error(`A description is required to create a new role.`)
      );
    }

    return this._request
      .post(
        `${this._baseUrl}/organizations/${organizationId}/roles`,
        ObjectUtils.toSnakeCase(role)
      )
      .then((response) => ObjectUtils.toCamelCase(response));
  }

  /**
   * Deletes a role from an organization
   *
   * Legacy API Endpoint: '/organizations/:organizationId/roles/:roleId'
   * API Endpiont: '/roles/:roleId'
   * Method: DELETE
   *
   * @param {string} organizationId The ID of the organization, optional when using the tenant API and an organization ID has been set
   * @param {string} roleId The UUID formatted ID of the role
   *
   * @returns {Promise}
   * @fulfill {undefined}
   * @reject {Error}
   *
   * @example
   * contxtSdk.roles.delete('4f0e51c6-728b-4892-9863-6d002e61204d', '8b64fb12-e649-46be-b330-e672d28eed99s');
   */
  delete(organizationId, roleId) {
    if (this._organizationId) {
      if (!roleId) {
        return Promise.reject(
          new Error('A roleId is required for deleting a role.')
        );
      }

      return this._request.delete(`${this._baseUrl}/roles/${roleId}`);
    }

    if (!organizationId) {
      return Promise.reject(
        new Error('An organizationId is required for deleting a role.')
      );
    }

    if (!roleId) {
      return Promise.reject(
        new Error('A roleId is required for deleting a role.')
      );
    }

    return this._request.delete(
      `${this._baseUrl}/organizations/${organizationId}/roles/${roleId}`
    );
  }

  /**
   * Gets an organization's list of roles
   *
   * Legacy API Endpoint: '/organizations/:organizationId/roles'
   * API Endpoint: '/roles'
   * Method: GET
   *
   * @param {string} organizationId The ID of the organization, optional when using the tenant API and an organization ID has been set
   *
   * @returns {Promise}
   * @fulfill {ContxtRole[]} A list of roles
   * @reject {Error}
   *
   * @example
   * contxtSdk.coordinator.roles
   *   .getByOrganizationId('36b8421a-cc4a-4204-b839-1397374fb16b')
   *   .then((roles) => console.log(roles))
   *   .catch((err) => console.log(err));
   */
  getByOrganizationId(organizationId) {
    if (this._organizationId) {
      return this._request
        .get(`${this._baseUrl}/roles`)
        .then((roles) => ObjectUtils.toCamelCase(roles));
    }

    if (!organizationId) {
      return Promise.reject(
        new Error(
          'An organizationId is required for getting roles for an organization.'
        )
      );
    }

    return this._request
      .get(`${this._baseUrl}/organizations/${organizationId}/roles`)
      .then((roles) => ObjectUtils.toCamelCase(roles));
  }

  /**
   * Remove an application from a role
   *
   * API Endpoint: '/roles/:roleId/applications/:applicationId'
   * Method: DELETE
   *
   * @param {string} roleId The UUID formatted ID of the role
   * @param {number} applicationId The ID of the application
   *
   * @returns {Promise}
   * @fulfill {undefined}
   * @reject {Error}
   *
   * @example
   * contxtSdk.roles
   *   .removeApplication('36b8421a-cc4a-4204-b839-1397374fb16b', 42)
   *   .catch((err) => console.log(err));
   */
  removeApplication(roleId, applicationId) {
    if (!roleId) {
      return Promise.reject(
        new Error(
          'A roleId is required for removing an application from a role.'
        )
      );
    }

    if (!applicationId) {
      return Promise.reject(
        new Error(
          'An applicationId is required for removing an application from a role.'
        )
      );
    }

    return this._request.delete(
      `${this._baseUrl}/roles/${roleId}/applications/${applicationId}`
    );
  }

  /**
   * Remove a project environment from a role
   *
   * API Endpoint: 'roles/:roleId/project_environments/:projectEnvironmentSlug'
   * Method: DELETE
   *
   * @param {string} roleId The UUID formatted ID of the role
   * @param {string} projectEnvironmentSlug The slug of the project environment
   *
   * @returns {Promise}
   * @fulfill {undefined}
   * @reject {Error}
   *
   * @example
   * contxtSdk.roles
   *   .removeProjectEnvironment('36b8421a-cc4a-4204-b839-1397374fb16b', 'project-environment-slug')
   *   .catch((err) => console.log(err));
   */
  removeProjectEnvironment(roleId, projectEnvironmentId) {
    if (!roleId) {
      return Promise.reject(
        new Error(
          'A roleId is required for removing a project environment from a role.'
        )
      );
    }

    if (!projectEnvironmentId) {
      return Promise.reject(
        new Error(
          'A project environment slug is required for removing a project environment from a role.'
        )
      );
    }

    return this._request.delete(
      `${
        this._baseUrl
      }/roles/${roleId}/project_environments/${projectEnvironmentId}`
    );
  }
}

export default Roles;

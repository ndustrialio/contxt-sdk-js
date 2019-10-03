import Applications from './applications';
import Consent from './consent';
import EdgeNodes from './edgeNodes';
import Organizations from './organizations';
import Permissions from './permissions';
import Roles from './roles';
import Users from './users';

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

    this._accessBaseUrl = null;
    this._deployBaseUrl = null;
    this._organizationId = null;

    this.applications = new Applications(sdk, request, baseUrl);
    this.consent = new Consent(sdk, request, baseUrl);
    this.edgeNodes = new EdgeNodes(sdk, request, baseUrl);
    this.organizations = new Organizations(sdk, request, baseUrl);
    this.permissions = new Permissions(sdk, request, baseUrl);
    this.roles = new Roles(sdk, request, baseUrl);
    this.users = new Users(sdk, request, baseUrl);
  }

  /**
   * Sets a selected oranization ID to be used in tenant based requests
   *
   * @param {string} organizationId the ID of the organization
   *
   * @example
   * contxtSdk.coordinator
   *   .setOrganizationId('36b8421a-cc4a-4204-b839-1397374fb16b');
   */
  setOrganizationId(organizationId) {
    this._organizationId = organizationId;

    this._accessBaseUrl = this._organizationId
      ? `${this._sdk.config.audiences.coordinator.host}/access/v1/${
          this._organizationId
        }`
      : null;

    this._deployBaseUrl = this._organizationId
      ? `${this._sdk.config.audiences.coordinator.host}/deploy/v1/${
          this._organizationId
        }`
      : null;

    this.applications = new Applications(
      this._sdk,
      this._request,
      this._deployBaseUrl || this._baseUrl,
      this._organizationId
    );
    this.consent = new Consent(
      this._sdk,
      this._request,
      this._deployBaseUrl || this._baseUrl,
      this._organizationId
    );
    this.edgeNodes = new EdgeNodes(
      this._sdk,
      this._request,
      this._deployBaseUrl || this._baseUrl,
      this._organizationId
    );
    this.organizations = new Organizations(
      this._sdk,
      this._request,
      this._accessBaseUrl || this._baseUrl,
      this._organizationId
    );
    this.permissions = new Permissions(
      this._sdk,
      this._request,
      this._accessBaseUrl || this._baseUrl,
      this._organizationId
    );
    this.roles = new Roles(
      this._sdk,
      this._request,
      this._accessBaseUrl || this._baseUrl,
      this._organizationId
    );
    this.users = new Users(
      this._sdk,
      this._request,
      this._accessBaseUrl || this._baseUrl,
      this._organizationId
    );
  }
}

export default Coordinator;

import { toCamelCase } from '../utils/objects';

/**
 * @typedef {Object} ContxtApplicationConsent
 * @param {string} clientId
 * @param {string} clientSecret
 * @param {string} createdAt ISO 8601 Extended Format date/time string
 * @param {ContxtApplicationVersion} currentVersion The current application version
 * @param {string} description Application's description
 * @param {string} iconUrl Application's icon url
 * @param {number} id Application's ID
 * @param {string} name Application's name
 * @param {number} serviceId Application's service ID
 * @param {string} updatedAt ISO 8601 Extended Format date/time string
 */

/**
 * @typedef {Object} ContxtApplicationVersion
 * @param {number} applicationId
 * @param {ContxtConsent} [consent] The consent model associated with this application version
 * @param {string} consentId
 * @param {string} createdAt ISO 8601 Extended Format date/time string
 * @param {string} description
 * @param {string} id UUID
 * @param {string} label
 * @param {string} updatedAt ISO 8601 Extended Format date/time string
 */

/**
 * @typedef {Object} ContxtConsent
 * @param {string} createdAt ISO 8601 Extended Format date/time string
 * @param {string} [effectiveEndDate] ISO 8601 Extended Format date/time string
 * @param {string} effectiveStartDate ISO 8601 Extended Format date/time string
 * @param {string} id UUID
 * @param {string} text The body of the consent form in HTML
 * @param {string} updatedAt ISO 8601 Extended Format date/time string
 * @param {ContxtUser[]} userApproval An array of users. If empty, the user has not consented
 */

/**
 * @typedef {Object} ContxtUserConsentApproval
 * @param {string} consentId
 * @param {string} createdAt ISO 8601 Extended Format date/time string
 * @param {string} id UUID
 * @param {string} updatedAt ISO 8601 Extended Format date/time string
 * @param {string} userId UUID
 */

/**
 * Module for managing application consent
 *
 * @typicalname contxtSdk.coordinator.consent
 */
class Consent {
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
   * Accepts a user's consent to an application
   *
   *
   * API Endpoint: '/consents/:consentId/accept'
   * Method: POST
   *
   * @param {string} consentId The ID of the consent form the user is accepting
   *
   * Note: Only valid for web users using auth0WebAuth session type
   *
   * @returns {Promise}
   * @fulfill {ContxtUserConsentApproval}
   * @reject {Error}
   *
   * @example
   * contxtSdk.coordinator.consent
   *   .accept('36b8421a-cc4a-4204-b839-1397374fb16b')
   *   .then((userApproval) => console.log(userApproval))
   *   .catch((err) => console.log(err));
   */
  accept(consentId) {
    if (!consentId) {
      return Promise.reject(
        new Error('A consent ID is required for accepting consent')
      );
    }

    return this._sdk.auth.getCurrentAccessToken().then((accessToken) => {
      if (!accessToken) {
        return Promise.reject(new Error('A valid JWT token is required'));
      }

      return this._request
        .post(`${this._baseUrl}/consents/${consentId}/accept`, {
          access_token: accessToken
        })
        .then((userApproval) => toCamelCase(userApproval));
    });
  }

  /**
   * Gets the current application version's consent forms. The current
   * access_token will be used to derive which application is being consented to.
   *
   *
   * API Endpoint: '/applications/consent'
   * Method: POST
   *
   * Note: Only valid for web users using auth0WebAuth session type
   *
   * @returns {Promise}
   * @fulfill {ContxtApplicationConsent}
   * @reject {Error}
   *
   * @example
   * contxtSdk.coordinator.consent
   *   .getForCurrentApplication()
   *   .then((applicationConsent) => console.log(applicationConsent))
   *   .catch((err) => console.log(err));
   */
  getForCurrentApplication() {
    return this._sdk.auth.getCurrentAccessToken().then((accessToken) => {
      if (!accessToken) {
        return Promise.reject(new Error('A valid JWT token is required'));
      }

      return this._request
        .post(`${this._baseUrl}/applications/consent`, {
          access_token: accessToken
        })
        .then((applicationConsent) => toCamelCase(applicationConsent));
    });
  }
}

export default Consent;

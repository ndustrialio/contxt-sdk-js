import { formatPaginatedDataFromServer } from '../utils/pagination';

/**
 * Module that provides access to information about Contxt
 *
 * @typicalname contxtSdk.health
 */
class Health {
  /**
   * @param {Object} sdk An instance of the SDK so the module can communicate with other modules
   * @param {Object} request An instance of the request module tied to this module's audience.
   */
  constructor(sdk, request, organizationId = null) {
    const baseUrl = `${sdk.config.audiences.health.host}/v1`;

    this._baseUrl = baseUrl;
    this._request = request;
    this._sdk = sdk;

    this._organizationId = organizationId;
  }

  static status = {
    GOOD: 'healthy',
    BAD: 'unhealthy'
  };

  getAll({
    organizationId = this._organizationId,
    limit,
    offset,
    orderBy,
    sortBy
  }) {
    if (!organizationId) {
      return Promise.reject(new Error('An organization ID is required'));
    }

    return this._request
      .get(`${this._baseUrl}/${organizationId}/assets`, {
        params: {
          limit,
          offset,
          orderBy,
          sortBy
        }
      })
      .then((response) => formatPaginatedDataFromServer(response));
  }

  getByAssetId({
    assetId,
    organizationId = this._organizationId,
    limit,
    offset,
    orderBy,
    sortBy
  }) {
    if (!assetId) {
      return Promise.reject(new Error('An asset ID is required'));
    }

    if (!organizationId) {
      return Promise.reject(new Error('An organization ID is required'));
    }

    return this._request
      .get(`${this._baseUrl}/${organizationId}/assets/${assetId}`, {
        params: {
          limit,
          offset,
          orderBy,
          sortBy
        }
      })
      .then((response) => formatPaginatedDataFromServer(response));
  }

  post({ assetId, organizationId = this._organizationId, status, timestamp }) {
    if (!assetId) {
      return Promise.reject(new Error('An asset ID is required'));
    }

    if (!organizationId) {
      return Promise.reject(new Error('An organization ID is required'));
    }

    if (!Object.values(Health.status).includes(status)) {
      return Promise.reject(
        new Error(
          `Status must equal one of: ${Object.values(Health.status).join(', ')}`
        )
      );
    }

    return this._request.post(
      `${this._baseUrl}/${organizationId}/assets/${assetId}`,
      {
        status,
        timestamp
      }
    );
  }
}

export default Health;

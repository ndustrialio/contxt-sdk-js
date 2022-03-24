/**
 * Module that provides access to Nionic platform.
 *
 * @typicalname contxtSdk.nionic
 */
class Nionic {
  /**
   * @param {Object} sdk An instance of the SDK so the module can communicate with other modules.
   * @param {Object} request An instance of the request module tied to this module's audience.
   */
  constructor(sdk, request) {
    this._baseUrl = `${sdk.config.audiences.nionic.host}`;
    this._request = request;
    this._sdk = sdk;

    // Backwards compatibility for legacy uuid's
    this._orgIdToTenantId = {
      '18d8b68e-3e59-418e-9f23-47b7cd6bdd6b': 'genan',
      '02efa741-a96f-4124-a463-ae13a704b8fc': 'lineage',
      '5209751f-ea46-4b3e-a5dd-b8d03311b791': 'ndustrial',
      '2fe29680-fc3d-4888-9e9b-44be1e59c22c': 'sfnt'
    };
    this._tenants = new Set(Object.values(this._orgIdToTenantId));
  }

  _getTenantId(orgOrTenantId) {
    if (!orgOrTenantId) throw Error('Tenant is required');
    if (
      !(orgOrTenantId in this._orgIdToTenantId) &&
      !this._tenants.has(orgOrTenantId)
    ) {
      throw Error(
        `Tenant is either unrecognized or not yet supported: ${orgOrTenantId}`
      );
    }
    return this._orgIdToTenantId[orgOrTenantId] || orgOrTenantId;
  }

  _query(orgOrTenantId, options) {
    const tenantId = this._getTenantId(orgOrTenantId);
    const url = `${this._baseUrl.replace('<tenant>', tenantId)}/graphql`;
    return this._request.post(url, options).then((resp) => {
      if (resp.data && resp.data.errors) {
        return Promise.reject(Error(resp.data.errors));
      }
      return Promise.resolve(resp.data);
    });
  }

  executeQuery(orgOrTenantId, query, variables = {}) {
    return this._query(orgOrTenantId, { query, variables });
  }

  getAllFacilities(orgOrTenantId) {
    return this._query(orgOrTenantId, {
      query: `
        query {
          facilities {
            nodes {
              id
              name
              slug
              address
              city
              state
              zip
              timezone: timezoneName
              createdAt
              updatedAt
            }
          }
        }
    `
    }).then((data) => data.facilities.nodes);
  }

  getFacility(orgOrTenantId, facilityId) {
    return this._query(orgOrTenantId, {
      query: `
        query {
          facility(id: "${facilityId}") {
            nodes {
              id
              name
              slug
              address
              city
              state
              zip
              timezone: timezoneName
              createdAt
              updatedAt
            }
          }
        }
    `
    }).then((resp) => resp.data.facility);
  }

  getFacilityMetricLabels(orgOrTenantId, { facilityId }) {
    return this._query(orgOrTenantId, {
      query: `
        query($facilityId: Int!) {
          facility(id: $facilityId) {
            metricLabels {
              sourceId
              label
            }
          }
        }
      `,
      variables: { facilityId }
    }).then((resp) => resp.facility.metricLabels);
  }

  getFacilityMetrics(orgOrTenantId, { facilityId, metricLabel }) {
    return this._query(orgOrTenantId, {
      query: `
        query($facilityId: Int!, $metricLabel: String!) {
          facility(id: $facilityId) {
            metricData(label: $metricLabel) {
              nodes {
                time
                sourceId
                label
                data
              }
            }
          }
        }
      `,
      variables: { facilityId, metricLabel }
    }).then((resp) => resp.facility.metricData.nodes);
  }
}

export default Nionic;

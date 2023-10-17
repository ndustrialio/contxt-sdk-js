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
      '2fe29680-fc3d-4888-9e9b-44be1e59c22c': 'sfnt',
      'b2c6705d-1727-467f-a450-207f110c9966': 'trenton',
      'c5517437-8497-400a-8c6d-a9de88669c70': 'blackline',
      '65be9a9d-5cc1-4318-8762-da74e454ea51': 'vcv',
      'bc071c66-d030-44c7-9c2a-cfe3161cdf3e': 'lsc-communications',
      '5a4bbead-7208-499e-a853-9cb174a71c63': 'uscold',
      '513b06ea-0169-4436-b3b2-77318bd77e94': 'wlgore',
      '7b9457e8-99cd-46da-9477-4c2806884a8f': 'jci',
      '3b1c4ddf-6068-4875-83f3-6960630c5b37': 'gargill',
      '94b653fd-8ea2-4fea-be38-0f08ca734820': 'emergent',
      'c18cf4fb-13ec-4e19-9475-cc1be484ba27': 'waterbridge'
    };
  }

  static queryDefaults = {
    additionalFields: []
  };

  _getTenantId(orgOrTenantId) {
    if (!orgOrTenantId) throw Error('Tenant is required');
    return this._orgIdToTenantId[orgOrTenantId] || orgOrTenantId;
  }

  _query(orgOrTenantId, options) {
    const tenantId = this._getTenantId(orgOrTenantId);
    const url = `${this._baseUrl.replace('<tenant>', tenantId)}/graphql`;
    return this._request.post(url, options).then((resp) => {
      if (resp.errors) {
        return Promise.reject(Error(JSON.stringify(resp.errors)));
      }
      return Promise.resolve(resp.data);
    });
  }

  executeQuery(orgOrTenantId, query, variables = {}) {
    return this._query(orgOrTenantId, { query, variables });
  }

  getAllFacilities(orgOrTenantId, options = Nionic.queryDefaults) {
    const { additionalFields } = options;
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
              ${additionalFields.join('\n')}
            }
          }
        }
    `
    }).then((data) => data.facilities.nodes);
  }

  getFacility(orgOrTenantId, facilityId, options = Nionic.queryDefaults) {
    const { additionalFields } = options;
    return this._query(orgOrTenantId, {
      query: `
        query($facilityId: Int!) {
          facility(id: $facilityId) {
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
            ${additionalFields.join('\n')}
          }
        }
    `,
      variables: { facilityId: parseInt(facilityId) }
    }).then((resp) => resp.facility);
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
      variables: { facilityId: parseInt(facilityId) }
    }).then((resp) => resp.facility.metricLabels);
  }

  getFacilityMetrics(
    orgOrTenantId,
    { facilityId, metricLabel, mutableOnly = false },
    options = Nionic.queryDefaults
  ) {
    const { additionalFields } = options;
    return this._query(orgOrTenantId, {
      query: `
        query($facilityId: Int!, $metricLabel: String!) {
          facility(id: $facilityId) {
            ${
              mutableOnly ? 'mutableMetricData' : 'metricData'
            }(label: $metricLabel) {
              nodes {
                time
                sourceId
                label
                data
                ${additionalFields.join('\n')}
              }
            }
          }
        }
      `,
      variables: { facilityId: parseInt(facilityId), metricLabel }
    }).then((resp) => resp.facility.metricData.nodes);
  }
}

export default Nionic;

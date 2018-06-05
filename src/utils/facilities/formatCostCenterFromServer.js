import { formatFacilityFromServer } from './index';
/**
 * Normalizes the cost center object returned from the API server
 *
 * @param {Object} input
 * @param {string} input.created_at ISO 8601 Extended Format date/time string
 * @param {string} input.description
 * @param {Facility[]} [input.facilities]
 * @param {string} input.id UUID
 * @param {string} input.name
 * @param {string} input.organization_id UUID
 * @param {string} input.updated_at ISO 8601 Extended Format date/time string
 *
 * @returns {CostCenter}
 *
 * @private
 */

function formatCostCenterFromServer(input = {}) {
  const costCenter = {
    createdAt: input.created_at,
    description: input.description,
    id: input.id,
    name: input.name,
    organizationId: input.organization_id,
    updatedAt: input.updated_at
  };

  if (input.facilities) {
    costCenter.facilities = input.facilities.map(formatFacilityFromServer);
  }

  return costCenter;
}

export default formatCostCenterFromServer;

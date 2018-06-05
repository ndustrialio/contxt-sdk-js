/**
 * Normalizes the cost center facility object returned from the API server
 *
 * @param {Object} input
 * @param {string} input.cost_center_id UUID
 * @param {string} input.created_at ISO 8601 Extended Format date/time string
 * @param {number} input.facility_id
 * @param {string} input.id UUID
 * @param {string} input.updated_at ISO 8601 Extended Format date/time string
 *
 * @returns {CostCenterFacility}
 *
 * @private
 */
function formatCostCenterFacilityFromServer(input = {}) {
  return {
    costCenterId: input.cost_center_id,
    createdAt: input.created_at,
    facilityId: input.facility_id,
    id: input.id,
    updatedAt: input.updated_at
  };
}

export default formatCostCenterFacilityFromServer;

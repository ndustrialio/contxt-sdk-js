/**
 * Normalizes the facility grouping object returned from the API server
 *
 * @param {Object} input
 * @param {string} input.created_at ISO 8601 Extended Format date/time string
 * @param {string} input.facility_grouping_id UUID
 * @param {number} input.facility_id
 * @param {string} input.id UUID
 * @param {string} input.updated_at ISO 8601 Extended Format date/time string
 *
 * @returns {FacilityGroupingFacility}
 *
 * @private
 */
function formatGroupingFacilityFromServer(input = {}) {
  return {
    createdAt: input.created_at,
    facilityGroupingId: input.facility_grouping_id,
    facilityId: input.facility_id,
    id: input.id,
    updatedAt: input.updated_at
  };
}

export default formatGroupingFacilityFromServer;

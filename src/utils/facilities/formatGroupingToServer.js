/**
 * Normalizes the facility object being sent to the API server
 *
 * @param {FacilityGrouping} input
 *
 * @returns {Object} output
 * @returns {string} [output.description]
 * @returns {boolean} [output.is_private]
 * @returns {string} output.name
 * @returns {string} output.organization_id UUID
 * @returns {string} output.owner_id Auth0 identifer of the owner
 * @returns {string} [output.parent_grouping_id] UUID
 *
 * @private
 */
function formatGroupingToServer(input = {}) {
  return {
    description: input.description,
    is_private: input.isPrivate,
    name: input.name,
    organization_id: input.organizationId,
    owner_id: input.ownerId,
    parent_grouping_id: input.parentGroupingId
  };
}

export default formatGroupingToServer;

/**
 * Normalizes the facility object being sent to the API server
 *
 * @param {FacilityGrouping} input
 *
 * @param {Object} output
 * @param {string} output.description
 * @param {boolean} output.is_private
 * @param {string} output.name
 * @param {string} output.organization_id UUID
 * @param {string} output.owner_id Auth0 identifer of the owner
 * @param {string} output.parent_grouping_id UUID
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

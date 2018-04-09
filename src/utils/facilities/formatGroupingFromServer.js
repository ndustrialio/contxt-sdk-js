/**
 * Normalizes the facility grouping object returned from the API server
 *
 * @param {Object} input
 * @param {string} input.created_at ISO 8601 Extended Format date/time string
 * @param {string} input.description
 * @param {string} input.id UUID
 * @param {boolean} input.is_private
 * @param {string} input.name
 * @param {string} input.organization_id UUID
 * @param {string} input.owner_id Auth0 identifer of the owner
 * @param {string} input.parent_grouping_id UUID
 * @param {string} input.updated_at ISO 8601 Extended Format date/time string
 *
 * @returns {FacilityGrouping}
 *
 * @private
 */

function formatGroupingFromServer(input = {}) {
  return {
    createdAt: input.created_at,
    description: input.description,
    id: input.id,
    isPrivate: input.is_private,
    name: input.name,
    organizationId: input.organization_id,
    ownerId: input.owner_id,
    parentGroupingId: input.parent_grouping_id,
    updatedAt: input.updated_at
  };
}

export default formatGroupingFromServer;

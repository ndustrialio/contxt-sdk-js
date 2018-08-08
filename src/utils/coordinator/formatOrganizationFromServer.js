/**
 * Normalizes the organization object returned from the API server
 *
 * @param {Object} input
 * @param {string} input.created_at ISO 8601 Extended Format date/time string
 * @param {string} input.id UUID
 * @param {number} input.legacy_organization_id
 * @param {string} input.name
 * @param {string} input.updated_at ISO 8601 Extended Format date/time string
 *
 * @returns {ContxtOrganization}
 *
 * @private
 */
function formatOrganizationFromServer(input = {}) {
  return {
    createdAt: input.created_at,
    id: input.id,
    legacyOrganizationId: input.legacy_organization_id,
    name: input.name,
    updatedAt: input.updated_at
  };
}

export default formatOrganizationFromServer;

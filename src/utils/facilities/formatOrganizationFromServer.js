/**
 * Normalizes the organization object returned from the API server
 *
 * @param {Object} input
 * @param {string} input.created_at ISO 8601 Extended Format date/time string
 * @param {string} input.id UUID
 * @param {string} input.name
 * @param {string} input.updated_at
 *
 * @returns {Object} output
 * @returns {string} output.createdAt ISO 8601 Extended Format date/time string
 * @returns {string} output.id UUID formatted id
 * @returns {string} output.name
 * @returns {string} output.updatedAt ISO 8601 Extended Format date/time string
 *
 * @private
 */
function formatOrganizationFromServer(input = {}) {
  return {
    createdAt: input.created_at,
    id: input.id,
    name: input.name,
    updatedAt: input.updated_at
  };
}

export default formatOrganizationFromServer;

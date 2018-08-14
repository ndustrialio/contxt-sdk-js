/**
 * Normalizes the edge node object returned from the API server
 *
 * @param {Object} input
 * @param {string} input.client_id
 * @param {string} input.created_at ISO 8601 Extended Format date/time string
 * @param {string} [input.description]
 * @param {string} input.id UUID
 * @param {string} input.name
 * @param {string} input.organization_id UUID
 * @param {string} input.updated_at ISO 8601 Extended Format date/time string
 *
 * @returns {EdgeNode}
 *
 * @private
 */
function formatEdgeNodeFromServer(input = {}) {
  return {
    clientId: input.client_id,
    createdAt: input.created_at,
    description: input.description,
    id: input.id,
    name: input.name,
    organizationId: input.organization_id,
    updatedAt: input.updated_at
  };
}

export default formatEdgeNodeFromServer;

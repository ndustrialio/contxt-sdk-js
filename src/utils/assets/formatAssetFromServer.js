/**
 * Normalizes the asset object returned from the API server
 *
 * @param {Object} input
 * @param {string} input.asset_type_id UUID
 * @param {string} input.created_at ISO 8601 Extended Format date/time string
 * @param {string} [input.description]
 * @param {string} input.id UUID
 * @param {string} input.label
 * @param {string} input.organization_id UUID
 * @param {string} input.updated_at ISO 8601 Extended Format date/time string
 *
 * @returns {Asset}
 *
 * @private
 */
function formatAssetFromServer(input = {}) {
  return {
    assetTypeId: input.asset_type_id,
    createdAt: input.created_at,
    description: input.description,
    id: input.id,
    label: input.label,
    organizationId: input.organization_id,
    updatedAt: input.updated_at
  };
}

export default formatAssetFromServer;

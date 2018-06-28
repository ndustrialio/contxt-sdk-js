/**
 * Normalizes the asset object being sent to the API server
 *
 * @param {Asset} input
 *
 * @returns {Object} output
 * @returns {string} output.asset_type_id UUID
 * @returns {string} output.description
 * @returns {string} output.label
 * @returns {string} output.organization_id UUID
 *
 * @private
 */
function formatAssetToServer(input = {}) {
  return {
    asset_type_id: input.assetTypeId,
    description: input.description,
    label: input.label,
    organization_id: input.organizationId
  };
}

export default formatAssetToServer;

/**
 * Normalizes the asset type object being sent to the API server
 *
 * @param {AssetType} input
 *
 * @returns {Object} output
 * @returns {string} output.description
 * @returns {string} output.label
 * @returns {string} output.organization_id UUID
 *
 * @private
 */
function formatAssetTypeToServer(input = {}) {
  return {
    description: input.description,
    label: input.label,
    organization_id: input.organizationId
  };
}

export default formatAssetTypeToServer;

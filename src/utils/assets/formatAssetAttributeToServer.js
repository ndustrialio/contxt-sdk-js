/**
 * Normalizes the asset attribute object being sent to the API server
 *
 * @param {AssetAttribute} input
 *
 * @returns {Object} output
 * @returns {string} output.description
 * @returns {boolean} [output.is_required]
 * @returns {string} output.label
 * @returns {string} output.organization_id UUID corresponding with the organization
 * @returns {string} [output.units]
 *
 * @private
 */
function formatAssetAttributeToServer(input = {}) {
  return {
    description: input.description,
    is_required: input.isRequired,
    label: input.label,
    organization_id: input.organizationId,
    units: input.units
  };
}

export default formatAssetAttributeToServer;

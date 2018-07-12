/**
 * Normalizes the asset attribute object returned from the API server
 *
 * @param {Object} input
 * @param {string} input.asset_type_id UUID corresponding with the asset type
 * @param {string} input.created_at ISO 8601 Extended Format date/time string
 * @param {string} input.description
 * @param {string} input.id UUID
 * @param {boolean} input.is_required
 * @param {string} input.label
 * @param {string} input.organization_id UUID corresponding with the organization
 * @param {string} [input.units]
 * @param {string} input.updated_at ISO 8601 Extended Format date/time string
 *
 * @returns {AssetAttribute}
 *
 * @private
 */
function formatAssetAttributeFromServer(input = {}) {
  return {
    assetTypeId: input.asset_type_id,
    createdAt: input.created_at,
    description: input.description,
    id: input.id,
    isRequired: input.is_required,
    label: input.label,
    organizationId: input.organization_id,
    units: input.units,
    updatedAt: input.updated_at
  };
}

export default formatAssetAttributeFromServer;

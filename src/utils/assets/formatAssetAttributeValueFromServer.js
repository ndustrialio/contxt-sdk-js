/**
 * Normalizes the asset attribute value object returned from the API server
 *
 * @param {Object} input
 * @param {string} input.assetAttributeId UUID corresponding to the asset attribute
 * @param {string} input.assetId UUID corresponding to the asset
 * @param {string} input.createdAt ISO 8601 Extended Format date/time string
 * @param {string} input.effectiveDate ISO 8601 Extended Format date/time string
 * @param {string} input.id UUID
 * @param {string} input.notes
 * @param {string} input.updatedAt ISO 8601 Extended Format date/time string
 * @param {string} input.value
 *
 * @returns {AssetAttributeValue}
 *
 * @private
 */
function formatAssetAttributeValueFromServer(input = {}) {
  return {
    assetAttributeId: input.asset_attribute_id,
    assetId: input.asset_id,
    createdAt: input.created_at,
    effectiveDate: input.effective_date,
    id: input.id,
    notes: input.notes,
    updatedAt: input.updated_at,
    value: input.value
  };
}

export default formatAssetAttributeValueFromServer;

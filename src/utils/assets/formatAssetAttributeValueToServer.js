/**
 * Normalizes the asset attribute value object being sent to the API server
 *
 * @param {AssetAttributeValue} input
 *
 * @returns {Object} output
 * @returns {string} output.asset_attribute_id UUID corresponding to the asset attribute
 * @returns {string} output.asset_id UUID corresponding to the asset
 * @returns {string} output.effective_date ISO 8601 Extended Format date/time string
 * @returns {string} [output.notes]
 * @returns {string} output.value
 *
 * @private
 */
function formatAssetAttributeValueToServer(input = {}) {
  return {
    asset_attribute_id: input.assetAttributeId,
    asset_id: input.assetId,
    asset_label: input.assetLabel,
    effective_date: input.effectiveDate,
    label: input.label,
    notes: input.notes,
    value: input.value
  };
}

export default formatAssetAttributeValueToServer;

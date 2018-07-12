/**
 * Normalizes asset attribute value filters sent to the API server
 *)
 * @param {Object} input Specific information that is used to filter the
 *   list of asset attribute values
 * @param {String} input.attributeLabel Label of the parent asset attribute
 * @param {String} input.effectiveDate Effective date of the asset attribute
 *
 * @returns {Object} output Specific information that is used to filter the
 *   list of asset attribute values
 * @returns {String} output.attribute_label Label of the parent asset attribute
 * @returns {String} output.effective_date Effective date of the asset attribute
 *
 * @private
 */
function formatAssetAttributeValueFiltersToServer(input = {}) {
  return {
    attribute_label: input.attributeLabel,
    effective_date: input.effectiveDate
  };
}

export default formatAssetAttributeValueFiltersToServer;

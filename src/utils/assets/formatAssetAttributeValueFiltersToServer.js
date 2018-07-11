function formatAssetAttributeValueFiltersToServer(input = {}) {
  return {
    attribute_label: input.attributeLabel,
    effective_date: input.effectiveDate
  };
}

export default formatAssetAttributeValueFiltersToServer;

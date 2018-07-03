/**
 * Normalizes the output field returned from the API server
 *
 * @param {Object} input
 * @param {Boolean} input.can_aggregate
 * @param {Number} input.divisor
 * @param {String} input.feed_key
 * @param {String} input.field_descriptor
 * @param {String} input.field_human_name
 * @param {String} [input.field_name]
 * @param {Number} input.id
 * @param {Boolean} input.is_default
 * @param {Boolean} input.is_hidden
 * @param {Boolean} input.is_totalizer
 * @param {Boolean} input.is_windowed
 * @param {String} [input.label]
 * @param {Number} input.output_id
 * @param {Number} input.scalar
 * @param {String} [input.status]
 * @param {String} [input.units]
 * @param {String} input.value_type
 *
 * @returns {OutputField}
 *
 * @private
 */
function formatOutputFieldFromServer(input = {}) {
  return {
    canAggregate: input.can_aggregate,
    divisor: input.divisor,
    feedKey: input.feed_key,
    fieldDescriptor: input.field_descriptor,
    fieldHumanName: input.field_human_name,
    fieldName: input.field_name,
    id: input.id,
    isDefault: input.is_default,
    isHidden: input.is_hidden,
    isTotalizer: input.is_totalizer,
    isWindowed: input.is_windowed,
    label: input.label,
    outputId: input.output_id,
    scalar: input.scalar,
    status: input.status,
    units: input.units,
    valueType: input.value_type
  };
}

export default formatOutputFieldFromServer;

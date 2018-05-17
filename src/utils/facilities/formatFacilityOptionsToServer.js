/**
 * Normalizes the options provided when retrieving facilities
 *
 * @param {Object} options
 * @param {Boolean} [options.includeGroupings] Boolean flag for including groupings data with each facility
 *
 * @returns {Object} output
 * @returns {Boolean} output.include_groupings
 *
 * @private
 */

function formatFacilityOptionsToServer(options) {
  const output = {
    ...options,
    include_groupings: options && options.includeGroupings ? options.includeGroupings : false
  };

  delete output.includeGroupings;

  return output;
}

export default formatFacilityOptionsToServer;

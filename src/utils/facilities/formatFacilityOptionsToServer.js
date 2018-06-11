/**
 * Normalizes the options provided when retrieving facilities
 *
 * @param {Object} options
 * @param {Boolean} [options.includeCostCenters] Boolean flag to include cost centers data with each facility
 * @param {Boolean} [options.includeGroupings] Boolean flag for including groupings data with each facility
 *
 * @returns {Object} output
 * @returns {Boolean} output.include_cost_centers
 * @returns {Boolean} output.include_groupings
 *
 * @private
 */

function formatFacilityOptionsToServer(options = {}) {
  const output = {
    ...options,
    include_cost_centers: !!options.includeCostCenters,
    include_groupings: !!options.includeGroupings
  };

  delete output.includeCostCenters;
  delete output.includeGroupings;

  return output;
}

export default formatFacilityOptionsToServer;

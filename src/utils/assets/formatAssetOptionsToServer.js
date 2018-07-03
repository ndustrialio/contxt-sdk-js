/**
 * Normalizes the options provided when retrieving assets
 *
 * @param {Object} options
 * @param {string} [options.assetTypeId] ID of the asset type to use for filtering
 *
 * @returns {Object} output
 * @returns {string} [output.asset_type_id]
 *
 * @private
 */
function formatAssetOptionsToServer(options = {}) {
  const output = {
    ...options
  };

  if (options.assetTypeId) {
    output.asset_type_id = options.assetTypeId;
    delete output.assetTypeId;
  }

  return output;
}

export default formatAssetOptionsToServer;

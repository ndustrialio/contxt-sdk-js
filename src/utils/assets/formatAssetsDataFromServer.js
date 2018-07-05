import { formatAssetFromServer } from './index';

/**
 * Normalizes the paginated assets returns from the API server
 *
 * @param {Object} input
 * @param {string} input._metadata Metadata about the pagination settings
 * @param {number} input._metadata.offset Offset of records in subsequent queries
 * @param {number} input._metadata.totalRecords Total number of assets found
 * @param {Asset[]} input.records
 *
 * @returns {Object} output
 * @returns {Object} output._metadata
 * @returns {number} output._metadata.offset
 * @returns {number} output._metadata.totalRecords
 * @returns {Asset[]} output.records
 *
 *
 * @private
 */
function formatAssetsDataFromServer(input = {}) {
  const _metadata = input._metadata || {};
  const records = input.records || [];

  return {
    _metadata: {
      offset: _metadata.offset,
      totalRecords: _metadata.totalRecords
    },
    records: records.map((record) => formatAssetFromServer(record))
  };
}

export default formatAssetsDataFromServer;

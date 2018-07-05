import { formatAssetTypeFromServer } from './index';

/**
 * Normalizes the paginated asset types returns from the API server
 *
 * @param {Object} input
 * @param {string} input._metadata Metadata about the pagination settings
 * @param {number} input._metadata.offset Offset of records in subsequent queries
 * @param {number} input._metadata.totalRecords Total number of asset types found
 * @param {AssetType[]} input.records
 *
 * @returns {Object} output
 * @returns {Object} output._metadata
 * @returns {number} output._metadata.offset
 * @returns {number} output._metadata.totalRecords
 * @returns {AssetType[]} output.records
 *
 * @private
 */
function formatAssetTypesFromServer(input = {}) {
  const _metadata = input._metadata || {};
  const records = input.records || [];

  return {
    _metadata: {
      offset: _metadata.offset,
      totalRecords: _metadata.totalRecords
    },
    records: records.map((record) => formatAssetTypeFromServer(record))
  };
}

export default formatAssetTypesFromServer;

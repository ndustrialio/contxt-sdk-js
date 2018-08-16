import { toCamelCase } from '../objects';

/**
 * Default formatter. Returns the original value in case no formatter is
 * provided.
 *
 * @param {Any} value
 *
 * @returns {Any} output
 *
 * @private
 */
function defaultFormatter(value) {
  return toCamelCase(value);
}

/**
 * Normalizes paginated data returned from the API server
 *
 * @param {Object} input
 * @param {PaginationMetadata} input._metadata Metadata about the pagination
 *   position
 * @param {Array} input.records
 * @param {Function} [recordFormatter = defaultFormatter] A formatter for each
 *   individual record. If not provided, it will return the record untouched.
 *
 * @returns {Object} output
 * @returns {PaginationMetadata} output._metadata Metadata about the pagination settings
 * @returns {Array} output.records
 *
 * @private
 */
function formatPaginatedDataFromServer(
  input = {},
  recordFormatter = defaultFormatter
) {
  const _metadata = input._metadata || {};
  const records = input.records || [];

  return {
    _metadata: toCamelCase(_metadata),
    records: records.map(recordFormatter)
  };
}

export default formatPaginatedDataFromServer;

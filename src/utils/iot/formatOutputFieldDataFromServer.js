import { parseOutputFieldNextPageUrlMetadata } from './index';
import { toCamelCase } from '../objects';

/**
 * Normalizes the output field data and metadata returned from the API server
 *
 * @returns {Object} input
 * @returns {Object} input.meta Metadata about the output field data query
 * @returns {Number} input.meta.count Total number of field data records found
 * @returns {Boolean} input.meta.has_more Indicates if there are more records
 *   to retrieve
 * @returns {String} [input.meta.next_page_url] URL that can be used to request
 *   the next page of results
 * @returns {Number} [input.meta.next_record_time] UNIX timestamp indicating a
 *   `timeStart` that would return new values
 * @param {Object[]} input.records
 * @param {String} input.records[].event_time
 * @param {String} input.records[].value
 *
 * @returns {Object} output
 * @returns {Object} output.meta Metadata about the request
 * @returns {Number} output.meta.count Total number of field data records
 * @returns {Boolean} output.meta.hasMore Indicates if there are more records
 *   to retrieve
 * @returns {Number} [output.meta.limit] Number of records to return
 * @returns {Number} [output.nextRecordTime] UNIX timestamp indicating a
 *   `timeStart` that would return new values
 * @returns {Number} [output.meta.timeEnd] UNIX timestamp indicating the end of
 *   the query window
 * @returns {Number} [output.meta.timeStart] UNIX timestamp indicating the
 *   start of the query window
 * @returns {Number} [output.meta.window] The sampling window for records.
 *   Required if including a timeEnd or timeStart.
 *   Valid options include: `0`, `60`, `900`, and `3600`
 * @returns {OutputFieldData[]} output.records
 *
 * @private
 */
function formatOutputFieldDataFromServer(input = {}) {
  const meta = input.meta || {};
  const query = parseOutputFieldNextPageUrlMetadata(meta.next_page_url);
  const records = input.records || [];

  return {
    meta: {
      ...toCamelCase(input.meta, { excludeKeys: ['next_page_url'] }),
      ...query
    },
    records: toCamelCase(records)
  };
}

export default formatOutputFieldDataFromServer;

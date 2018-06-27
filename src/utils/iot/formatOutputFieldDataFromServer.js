/**
 * Normalizes the output field data and metadata returned from the API server
 *
 *
 * @returns {Object} output
 * @returns {Object} output.meta Metadata about the output field data query
 * @returns {Number} output.meta.count Total number of field data records found
 * @returns {Boolean} output.meta.hasMore Indicates if there are more records
 *   to retrieve
 * @returns {String} [output.meta.nextPageUrl] URL that can be used to request
 *   the next page of results
 * @returns {Number} [output.meta.nextRecordTime] UNIX timestamp indicating a
 *   `timeStart` that would return new values
 *
 * @returns {OutputFieldData[]} output.records
 *
 * @private
 */
function formatOutputFieldDataFromServer(input = {}) {
  const meta = input.meta || {};
  const records = input.records || [];

  return {
    meta: {
      count: meta.count,
      hasMore: meta.has_more,
      nextPageUrl: meta.next_page_url,
      nextRecordTime: meta.next_record_time
    },
    records: records.map((record) => ({
      eventTime: record.event_time,
      value: record.value
    }))
  };
}

export default formatOutputFieldDataFromServer;

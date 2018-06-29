import URL from 'url-parse';

/**
 * Parses metadata from the provided url. Will coerce fields that should be
 * numbers from `String` to `Number`
 *
 * @param {String} url
 *
 * @returns {Object} output
 * @returns {Number} [output.limit] Number of records to return
 * @returns {Number} [output.timeEnd] UNIX timestamp indicating the end of the
 *   query window
 * @returns {Number} [output.timeStart] UNIX timestamp indicating the start of
 *   the query window
 * @returns {Number} [output.window] The sampling window for records.
 *   Required if including a timeEnd or timeStart.
 *   Valid options include: `0`, `60`, `900`, and `3600`
 *
 * @private
 */
function parseOutputFieldNextPageUrlMetadata(url) {
  const query = new URL(url, true).query;

  return ['limit', 'timeEnd', 'timeStart', 'window'].reduce((memo, key) => {
    if (memo[key]) {
      memo[key] = parseInt(memo[key], 10);
    }

    return memo;
  }, query);
}

export default parseOutputFieldNextPageUrlMetadata;

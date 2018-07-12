/**
 * Normalizes pagination options sent to the API server
 *
 * @param {PaginationOptions} input
 *
 * @returns {PaginationOptions}
 *
 * @private
 */
function formatPaginationOptionsToServer(input = {}) {
  return {
    limit: input.limit,
    offset: input.offset
  };
}

export default formatPaginationOptionsToServer;

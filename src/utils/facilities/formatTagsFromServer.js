/**
 * Normalizes the tags array returned from the API server
 *
 * @param {Object[]} input
 * @param {string} input[].created_at ISO 8601 Extended Format date/time string
 * @param {number} input[].facility_id Id corresponding with the parent facility
 * @param {number} input[].id
 * @param {string} input[].name
 * @param {string} input[].updated_at ISO 8601 Extended Format date/time string
 *
 * @returns {Object[]} output
 * @returns {string} output[].createdAt ISO 8601 Extended Format date/time string
 * @returns {number} output[].id
 * @returns {number} output[].facilityId
 * @returns {string} output[].name
 * @returns {string} output[].updatedAt ISO 8601 Extended Format date/time string
 *
 * @private
 */
function formatTagsFromServer(input = []) {
  return input.map((tag) => {
    return {
      createdAt: tag.created_at,
      facilityId: tag.facility_id,
      id: tag.id,
      name: tag.name,
      updatedAt: tag.updated_at
    };
  });
}

export default formatTagsFromServer;

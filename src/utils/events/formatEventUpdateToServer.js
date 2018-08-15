/**
 * Normalizes the event update object being sent to the API server
 *
 * @param {Event} input
 *
 * @returns {Object} output
 * @returns {string} [output.facility_id]
 * @returns {boolean} [output.is_public]
 * @returns {string} [output.name]
 *
 * @private
 */
function formatEventUpdateToServer(input = {}) {
  return {
    facility_id: input.facilityId,
    is_public: input.isPublic,
    name: input.name
  };
}

export default formatEventUpdateToServer;

/**
 * Normalizes the event update object being sent to the API server
 *
 * NOTE: This endpoint specifically whitelists the keys below as the only
 * allowed keys. We are using this formatter versus the generic `toSnakeCase` so
 * that this endpoint behaves the same as others (as in, it does not throw an
 * error if passing in extra information beyond what is listed in the JSDocs).
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

/**
 * Normalizes the event object being sent to the API server
 *
 * @param {Event} input
 *
 * @returns {Object} output
 * @returns {boolean} [output.allow_others_to_trigger]
 * @returns {string} output.event_type_id
 * @returns {string} [output.facility_id]
 * @returns {boolean} [output.is_public]
 * @returns {string} output.name
 * @returns {string} output.organization_id UUID
 *
 * @private
 */
function formatEventToServer(input = {}) {
  return {
    allow_others_to_trigger: input.allowOthersToTrigger,
    event_type_id: input.eventTypeId,
    facility_id: input.facilityId,
    is_public: input.isPublic,
    name: input.name,
    organization_id: input.organizationId
  };
}

export default formatEventToServer;

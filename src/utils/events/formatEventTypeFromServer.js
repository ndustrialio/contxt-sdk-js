/**
 * Normalizes the event type object from the API server
 *
 * @param {Object} input
 * @param {string} input.client_id The ID of the client to which the event type belongs
 * @param {string} input.created_at ISO 8601 Extended Format date/time string
 * @param {string} input.description A description of the event type
 * @param {string} input.id UUID corresponding with the event type
 * @param {boolean} input.is_realtime_enabled
 * @param {number} input.level The level of the event type
 * @param {string} input.name The name of the event type
 * @param {string} input.slug The slug of the event type
 * @param {string} input.updated_at ISO 8601 Extended Format date/time string
 *
 * @returns {Object} output
 * @returns {string} output.clientId
 * @returns {string} output.createdAt
 * @returns {string} output.description
 * @returns {string} output.id
 * @returns {boolean} output.isRealtimeEnabled
 * @returns {number} output.level
 * @returns {string} output.name
 * @returns {string} output.slug
 * @returns {string} output.updatedAt
 *
 * @private
 */
function formatEventTypeFromServer(input) {
  return {
    clientId: input.client_id,
    createdAt: input.created_at,
    description: input.description,
    id: input.id,
    isRealtimeEnabled: input.is_realtime_enabled,
    level: input.level,
    name: input.name,
    slug: input.slug,
    updatedAt: input.updated_at
  };
}

export default formatEventTypeFromServer;

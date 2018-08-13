/**
 * Normalizes the message bus channel object being sent to the API server
 *
 * @param {MessageBusChannel} input
 *
 * @returns {Object} output
 * @returns {string} output.id
 * @returns {string} output.name
 * @returns {string} output.organization_id
 * @returns {string} output.service_id
 *
 * @private
 */
function formatChannelToServer(input = {}) {
  const output = {
    id: input.id,
    name: input.name,
    organization_id: input.organizationId,
    service_id: input.serviceId
  };

  return output;
}

export default formatChannelToServer;

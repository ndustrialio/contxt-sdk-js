/**
 * Normalizes the message bus channel object returned from the server
 *
 * @param {Object} input
 * @param {string} input.id UUID formatted id
 * @param {string} input.name
 * @param {string} input.organization_id UUID
 * @param {string} input.service_id
 *
 * @returns {MessageBusChannel}
 *
 * @private
 */
function formatChannelFromServer(input = {}) {
  const output = {
    id: input.id,
    name: input.name,
    organizationId: input.organization_id,
    serviceId: input.service_id
  };

  return output;
}

export default formatChannelFromServer;

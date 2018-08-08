/**
 * Normalizes the user object returned from the API server
 *
 * @param {Object} input
 * @param {string} input.created_at ISO 8601 Extended Format date/time string
 * @param {string} input.email
 * @param {string} input.first_name
 * @param {string} input.id Auth0 ID for the user
 * @param {boolean} input.is_activated
 * @param {boolean} input.is_superuser
 * @param {string} input.last_name
 * @param {string} [input.phone_number]
 * @param {string} input.updated_at ISO 8601 Extended Format date/time string
 *
 * @returns {ContxtUser}
 *
 * @private
 */
function formatUserFromServer(input = {}) {
  return {
    createdAt: input.created_at,
    email: input.email,
    firstName: input.first_name,
    id: input.id,
    isActivated: input.is_activated,
    isSuperuser: input.is_superuser,
    lastName: input.last_name,
    phoneNumber: input.phone_number,
    updatedAt: input.updated_at
  };
}

export default formatUserFromServer;

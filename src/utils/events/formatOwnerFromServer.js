/**
 * Normalizes the owner from the API server
 *
 * @param {Object} input
 * @param {string} input.created_at ISO 8601 Extended Format date/time string
 * @param {string} input.email The email address of the owner
 * @param {string} input.first_name The first name of the owner
 * @param {string} input.id The ID of the user who owns the event
 * @param {string} input.is_machine_user
 * @param {string} input.last_name The last name of the owner
 * @param {string} input.updated_at ISO 8601 Extended Format date/time string
 *
 * @returns {Object} output
 * @returns {string} output.createdAt
 * @returns {string} output.email
 * @returns {string} output.firstName
 * @returns {string} output.id
 * @returns {string} output.isMachineUser
 * @returns {number} output.lastName
 * @returns {string} output.updatedAt
 *
 * @private
 */
function formatOwnerFromServer(input) {
  return {
    createdAt: input.created_at,
    email: input.email,
    firstName: input.first_name,
    id: input.id,
    isMachineUser: input.is_machine_user,
    lastName: input.last_name,
    updatedAt: input.updated_at
  };
}

export default formatOwnerFromServer;

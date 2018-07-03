/**
 * Normalizes the cost center object being sent to the API server
 *
 * @param {CostCenter} input
 *
 * @returns {Object} output
 * @returns {string} [output.description]
 * @returns {string} output.name
 * @returns {string} output.organization_id UUID
 *
 * @private
 */
function formatCostCenterToServer(input = {}) {
  return {
    description: input.description,
    name: input.name,
    organization_id: input.organizationId
  };
}

export default formatCostCenterToServer;

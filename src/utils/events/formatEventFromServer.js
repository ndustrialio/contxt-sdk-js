import { formatEventTypeFromServer, formatOwnerFromServer } from './index';

/**
 * Normalizes the event object returned from the API server
 *
 * @param {Object} input
 * @param {booelan} input.allow_others_to_trigger Whether or not non-owners can trigger the event
 * @param {string} input.created_at ISO 8601 Extended Format date/time string
 * @param {string} input.deleted_at ISO 8601 Extended Format date/time string
 * @param {Object} input.EventType
 * @param {string} input.EventType.client_id The ID of the client to which the event type belongs
 * @param {string} input.EventType.created_at ISO 8601 Extended Format date/time string
 * @param {string} input.EventType.description A description of the event type
 * @param {string} input.EventType.id UUID corresponding with the event type
 * @param {string} input.EventType.is_realtime_enabled
 * @param {number} input.EventType.level The level of the event type
 * @param {string} input.EventType.name The name of the event type
 * @param {string} input.EventType.slug The slug of the event type
 * @param {string} input.EventType.updated_at ISO 8601 Extended Format date/time string
 * @param {string} input.event_type_id UUID corresponding with the event type
 * @param {number} input.facility_id The Facility to which the event belongs
 * @param {string} input.id UUID corresponding with the event
 * @param {boolean} input.is_public Whether or not the event is public
 * @param {string} input.name The name of the event
 * @param {string} input.organization_id UUID corresponding with the organization
 * @param {string} input.Owner
 * @param {string} input.Owner.created_at ISO 8601 Extended Format date/time string
 * @param {string} input.Owner.email The email address of the owner
 * @param {string} input.Owner.first_name The first name of the owner
 * @param {string} input.Owner.id The ID of the user who owns the event
 * @param {string} input.Owner.is_machine_user
 * @param {string} input.Owner.last_name The last name of the owner
 * @param {string} input.Owner.updated_at ISO 8601 Extended Format date/time string
 * @param {string} input.owner_id The ID of the user who owns the event
 * @param {string} input.topic_arn The Amazon Resource Name (ARN) associated with the event
 * @param {string} input.updated_at ISO 8601 Extended Format date/time string
 *
 * @returns {Event}
 *
 * @private
 */
function formatEventFromServer(input = {}) {
  const eventObj = {
    allowOthersToTrigger: input.allow_others_to_trigger,
    createdAt: input.created_at,
    deletedAt: input.deleted_at,
    eventTypeId: input.event_type_id,
    facilityId: input.facility_id,
    id: input.id,
    isPublic: input.is_public,
    name: input.name,
    organizationId: input.organization_id,
    ownerId: input.owner_id,
    topicArn: input.topic_arn,
    updatedAt: input.updated_at
  };

  if (input.EventType) {
    eventObj.eventType = formatEventTypeFromServer(input.EventType);
  }

  if (input.Owner) {
    eventObj.owner = formatOwnerFromServer(input.Owner);
  }

  return eventObj;
}

export default formatEventFromServer;

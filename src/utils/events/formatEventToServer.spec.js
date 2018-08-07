import omit from 'lodash.omit';
import formatEventToServer from './formatEventToServer';

describe('utils/events/formatEventToServer', function() {
  let expectedEvent;
  let event;
  let formattedEvent;

  beforeEach(function() {
    event = fixture.build('event');
    expectedEvent = omit(
      {
        ...event,
        allow_others_to_trigger: event.allowOthersToTrigger,
        event_type_id: event.eventTypeId,
        facility_id: event.facilityId,
        is_public: event.isPublic,
        organization_id: event.organizationId
      },
      [
        'allowOthersToTrigger',
        'createdAt',
        'deletedAt',
        'eventType',
        'eventTypeId',
        'facilityId',
        'id',
        'isPublic',
        'organizationId',
        'owner',
        'ownerId',
        'topicArn',
        'updatedAt'
      ]
    );

    formattedEvent = formatEventToServer(event);
  });

  it('converts the object keys to snake case and capitalizes certain keys', function() {
    expect(formattedEvent).to.deep.equal(expectedEvent);
  });
});

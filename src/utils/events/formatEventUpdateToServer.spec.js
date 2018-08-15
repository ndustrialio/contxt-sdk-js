import omit from 'lodash.omit';
import formatEventUpdateToServer from './formatEventUpdateToServer';

describe('utils/events/formatEventUpdateToServer', function() {
  let expectedEvent;
  let event;
  let formattedEvent;

  beforeEach(function() {
    event = fixture.build('event');
    expectedEvent = omit(
      {
        ...event,
        facility_id: event.facilityId,
        is_public: event.isPublic
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

    formattedEvent = formatEventUpdateToServer(event);
  });

  it('converts the object keys to snake case and capitalizes certain keys', function() {
    expect(formattedEvent).to.deep.equal(expectedEvent);
  });
});

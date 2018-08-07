import omit from 'lodash.omit';
import formatEventFromServer from './formatEventFromServer';
import * as eventsUtils from './index';

describe('utils/events/formatEventFromServer', function() {
  let formatEventTypeFromServer;
  let formatOwnerFromServer;

  beforeEach(function() {
    this.sandbox = sandbox.create();

    formatEventTypeFromServer = this.sandbox
      .stub(eventsUtils, 'formatEventTypeFromServer')
      .callsFake((eventType) => eventType);

    formatOwnerFromServer = this.sandbox
      .stub(eventsUtils, 'formatOwnerFromServer')
      .callsFake((owner) => owner);
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  context(
    'when all of the possible fields are in the event object',
    function() {
      let event;
      let expectedEvent;
      let formattedEvent;

      beforeEach(function() {
        event = fixture.build('event', null, {
          fromServer: true
        });

        expectedEvent = omit(
          {
            ...event,
            allowOthersToTrigger: event.allow_others_to_trigger,
            createdAt: event.created_at,
            deletedAt: event.deleted_at,
            eventType: event.EventType,
            eventTypeId: event.event_type_id,
            facilityId: event.facility_id,
            isPublic: event.is_public,
            organizationId: event.organization_id,
            owner: event.Owner,
            ownerId: event.owner_id,
            topicArn: event.topic_arn,
            updatedAt: event.updated_at
          },
          [
            'allow_others_to_trigger',
            'created_at',
            'deleted_at',
            'event_type_id',
            'EventType',
            'facility_id',
            'is_public',
            'topic_arn',
            'organization_id',
            'Owner',
            'owner_id',
            'updated_at'
          ]
        );

        formattedEvent = formatEventFromServer(event);
      });

      it('formats the necessary child objects', function() {
        expect(formatEventTypeFromServer).to.be.calledWith(event.EventType);
        expect(formatOwnerFromServer).to.be.calledWith(event.Owner);
      });
      it('converts the object keys to the camelCase', function() {
        expect(formattedEvent).to.deep.equal(expectedEvent);
      });
    }
  );

  context(
    'when the event object does not have all of the possible fields',
    function() {
      it('does not include event type if the event type is not in the initial data', function() {
        const event = fixture.build('event', null, {
          fromServer: true
        });
        delete event.EventType;
        const formattedEvent = formatEventFromServer(event);
        expect(formattedEvent).to.not.include.keys(['eventType']);
      });

      it('does not include owner if the owner is not in the initial data', function() {
        const event = fixture.build('event', null, {
          fromServer: true
        });
        delete event.Owner;
        const formattedEvent = formatEventFromServer(event);
        expect(formattedEvent).to.not.include.keys(['owner']);
      });
    }
  );
});

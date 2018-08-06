import omit from 'lodash.omit';
import formatEventTypeFromServer from './formatEventTypeFromServer';

describe('utils/events/formatEventTypeFromServer', function() {
  let expectedEventType;
  let formattedEventType;
  let eventType;

  beforeEach(function() {
    eventType = fixture.build('eventType', null, { fromServer: true });
    expectedEventType = omit(
      {
        ...eventType,
        clientId: eventType.client_id,
        createdAt: eventType.created_at,
        isRealtimeEnabled: eventType.is_realtime_enabled,
        updatedAt: eventType.updated_at
      },
      ['client_id', 'created_at', 'is_realtime_enabled', 'updated_at']
    );

    formattedEventType = formatEventTypeFromServer(eventType);
  });

  it('converts the object keys to camelCase', function() {
    expect(formattedEventType).to.deep.equal(expectedEventType);
  });
});

import omit from 'lodash.omit';
import Events from './index';
import * as eventsUtils from '../utils/events';
import * as objectUtils from '../utils/objects';
import * as paginationUtils from '../utils/pagination';

describe('Events', function() {
  let baseRequest;
  let baseSdk;
  let expectedHost;

  beforeEach(function() {
    baseRequest = {
      delete: sinon.stub().resolves(),
      get: sinon.stub().resolves(),
      post: sinon.stub().resolves(),
      put: sinon.stub().resolves()
    };

    baseSdk = {
      config: {
        audiences: {
          events: fixture.build('audience')
        }
      }
    };
    expectedHost = faker.internet.url();
  });

  afterEach(function() {
    sinon.restore();
  });

  describe('constructor', function() {
    let events;

    beforeEach(function() {
      events = new Events(baseSdk, baseRequest);
    });

    it('sets a base url for the class instance', function() {
      expect(events._baseUrl).to.equal(
        `${baseSdk.config.audiences.events.host}/v1`
      );
    });

    it('appends the supplied request module to the class instance', function() {
      expect(events._request).to.deep.equal(baseRequest);
    });

    it('appends the supplied sdk to the class instance', function() {
      expect(events._sdk).to.deep.equal(baseSdk);
    });
  });

  describe('create', function() {
    context('when all required information is supplied', function() {
      let eventFromServerAfterFormat;
      let eventFromServerBeforeFormat;
      let eventToServerAfterFormat;
      let eventToServerBeforeFormat;
      let promise;
      let request;
      let toCamelCase;
      let toSnakeCase;

      beforeEach(function() {
        eventFromServerAfterFormat = fixture.build('event');
        eventFromServerBeforeFormat = fixture.build(
          'event',
          eventFromServerAfterFormat,
          { fromServer: true }
        );
        eventToServerBeforeFormat = fixture.build('event');
        eventToServerAfterFormat = fixture.build(
          'event',
          eventToServerBeforeFormat,
          { fromServer: true }
        );

        request = {
          ...baseRequest,
          post: sinon.stub().resolves(eventFromServerBeforeFormat)
        };

        toCamelCase = sinon
          .stub(objectUtils, 'toCamelCase')
          .returns(eventFromServerAfterFormat);

        toSnakeCase = sinon
          .stub(objectUtils, 'toSnakeCase')
          .returns(eventToServerAfterFormat);

        const events = new Events(baseSdk, request);
        events._baseUrl = expectedHost;

        promise = events.create(eventToServerBeforeFormat);
      });

      it('formats the submitted event object to send to the server', function() {
        expect(toSnakeCase).to.be.deep.calledWith(eventToServerBeforeFormat);
      });

      it('creates a new event', function() {
        expect(request.post).to.be.deep.calledWith(
          `${expectedHost}/events`,
          eventToServerAfterFormat
        );
      });

      it('formats the returned object', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.deep.calledWith(
            eventFromServerBeforeFormat
          );
        });
      });

      it('returns a fulfilled promise with the new event information', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
          eventFromServerAfterFormat
        );
      });
    });

    context('when there is missing required information', function() {
      ['eventTypeId', 'name', 'organizationId'].forEach((field) => {
        it(`it throws an error when ${field} is missing`, function() {
          const event = fixture.build('event');

          const events = new Events(baseSdk, baseRequest);
          const promise = events.create(omit(event, [field]));

          return expect(promise).to.be.rejectedWith(
            `A ${field} is required to create a new event.`
          );
        });
      });
    });
  });

  describe('delete', function() {
    context('the event ID is provided', function() {
      let event;
      let promise;

      beforeEach(function() {
        event = fixture.build('event');

        const events = new Events(baseSdk, baseRequest);
        events._baseUrl = expectedHost;

        promise = events.delete(event.id);
      });

      it('requests to delete the event', function() {
        expect(baseRequest.delete).to.be.calledWith(
          `${expectedHost}/events/${event.id}`
        );
      });

      it('returns a resolved promise', function() {
        return expect(promise).to.be.fulfilled;
      });
    });

    context('the event ID is not provided', function() {
      it('throws an error', function() {
        const events = new Events(baseSdk, baseRequest);
        const promise = events.delete();

        return expect(promise).to.be.rejectedWith(
          'An event ID is required for deleting an event'
        );
      });
    });
  });

  describe('get', function() {
    context('the event ID is provided', function() {
      let eventFromServerAfterFormat;
      let eventFromServerBeforeFormat;
      let expectedEventId;
      let promise;
      let request;
      let toCamelCase;

      beforeEach(function() {
        expectedEventId = faker.random.uuid();
        eventFromServerAfterFormat = fixture.build('event', {
          id: expectedEventId
        });

        eventFromServerBeforeFormat = fixture.build(
          'event',
          { id: expectedEventId },
          { fromServer: true }
        );

        request = {
          ...baseRequest,
          get: sinon.stub().resolves(eventFromServerBeforeFormat)
        };

        toCamelCase = sinon
          .stub(objectUtils, 'toCamelCase')
          .returns(eventFromServerAfterFormat);

        const events = new Events(baseSdk, request);
        events._baseUrl = expectedHost;

        promise = events.get(expectedEventId);
      });

      it('gets the event from the server', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/events/${expectedEventId}`
        );
      });

      it('formats the event object', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.calledWith(eventFromServerBeforeFormat);
        });
      });

      it('returns the requested event', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
          eventFromServerAfterFormat
        );
      });
    });

    context('the event Id is not provided', function() {
      it('throws an error', function() {
        const events = new Events(baseSdk, baseRequest);
        const promise = events.get();

        return expect(promise).to.be.rejectedWith(
          'An event ID is required for getting information about an event'
        );
      });
    });
  });

  describe('getEventTypesByClientId', function() {
    context('the clientId is provided', function() {
      let clientId;
      let eventTypeFromServerBeforeFormat;
      let eventTypeFromServerAfterFormat;
      let formatPaginatedDataFromServer;
      let paginationOptionsAfterFormat;
      let paginationOptionsBeforeFormat;
      let promise;
      let request;
      let toSnakeCase;

      beforeEach(function() {
        clientId = faker.random.uuid();
        eventTypeFromServerAfterFormat = {
          _metadata: fixture.build('paginationMetadata'),
          records: fixture.buildList(
            'eventType',
            faker.random.number({ min: 5, max: 10 })
          )
        };
        eventTypeFromServerBeforeFormat = {
          ...eventTypeFromServerAfterFormat,
          records: eventTypeFromServerAfterFormat.records.map((values) =>
            fixture.build('eventType', values, { fromServer: true })
          )
        };
        paginationOptionsBeforeFormat = {
          limit: faker.random.number({ min: 10, max: 1000 }),
          offset: faker.random.number({ max: 1000 })
        };
        paginationOptionsAfterFormat = {
          ...paginationOptionsBeforeFormat
        };

        formatPaginatedDataFromServer = sinon
          .stub(paginationUtils, 'formatPaginatedDataFromServer')
          .returns(eventTypeFromServerAfterFormat);
        request = {
          ...baseRequest,
          get: sinon.stub().resolves(eventTypeFromServerBeforeFormat)
        };
        toSnakeCase = sinon
          .stub(objectUtils, 'toSnakeCase')
          .returns(paginationOptionsAfterFormat);

        const events = new Events(baseSdk, request);
        events._baseUrl = expectedHost;

        promise = events.getEventTypesByClientId(
          clientId,
          paginationOptionsBeforeFormat
        );
      });

      it('formats the pagination options', function() {
        expect(toSnakeCase).to.be.calledWith(paginationOptionsBeforeFormat);
      });

      it('gets the eventType from the server', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/clients/${clientId}/types`,
          { params: paginationOptionsAfterFormat }
        );
      });

      it('formats the eventType object', function() {
        return promise.then(() => {
          expect(formatPaginatedDataFromServer).to.be.calledWith(
            eventTypeFromServerBeforeFormat
          );
        });
      });

      it('returns the requested event type', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.equal(
          eventTypeFromServerAfterFormat
        );
      });
    });

    context('the clientId is not provided', function() {
      it('throws an error', function() {
        const events = new Events(baseSdk, baseRequest);
        const promise = events.getEventTypesByClientId();

        return expect(promise).to.be.rejectedWith(
          'A client ID is required for getting types'
        );
      });
    });
  });

  describe('getEventsByTypeId', function() {
    let events;
    let eventId;
    let eventsFiltersAfterFormat;
    let eventsFiltersBeforeFormat;
    let eventsFromServerAfterFormat;
    let eventsFromServerBeforeFormat;
    let formatPaginatedDataFromServer;
    let promise;
    let request;
    let toSnakeCase;
    let typeId;

    context('all required params are passed', function() {
      beforeEach(function() {
        typeId = faker.random.uuid();
        eventsFiltersBeforeFormat = {
          include: ['triggered.latest'],
          facilityId: faker.random.number(),
          limit: faker.random.number({ min: 10, max: 1000 }),
          offset: faker.random.number({ max: 1000 })
        };
        eventsFiltersAfterFormat = { ...eventsFiltersBeforeFormat };
        eventId = fixture.build('assetType').id;
        eventsFromServerAfterFormat = {
          _metadata: fixture.build('paginationMetadata'),
          records: fixture.buildList(
            'event',
            faker.random.number({ min: 5, max: 20 }),
            { eventId }
          )
        };
        eventsFromServerBeforeFormat = {
          ...eventsFromServerAfterFormat,
          records: eventsFromServerAfterFormat.records.map((values) =>
            fixture.build('event', values, { fromServer: true })
          )
        };

        toSnakeCase = sinon
          .stub(objectUtils, 'toSnakeCase')
          .returns(eventsFiltersAfterFormat);
        formatPaginatedDataFromServer = sinon
          .stub(paginationUtils, 'formatPaginatedDataFromServer')
          .returns(eventsFromServerAfterFormat);
        request = {
          ...baseRequest,
          get: sinon.stub().resolves(eventsFromServerBeforeFormat)
        };

        events = new Events(baseSdk, request);
        events._baseUrl = expectedHost;
        promise = events.getEventsByTypeId(typeId, eventsFiltersBeforeFormat);
      });

      it('formats the parameters before sending', function() {
        expect(toSnakeCase).to.be.deep.calledWith(eventsFiltersBeforeFormat);
      });

      it('gets the events from the server', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/types/${typeId}/events`,
          { params: eventsFiltersAfterFormat }
        );
      });

      it('formats the events object', function() {
        return promise.then(() => {
          expect(formatPaginatedDataFromServer).to.be.calledWith(
            eventsFromServerBeforeFormat
          );
        });
      });

      it('returns the requested events', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.equal(
          eventsFromServerAfterFormat
        );
      });
    });
  });

  context('the type id is not provided', function() {
    it('throws an error', function() {
      const events = new Events(baseSdk, baseRequest);
      const promise = events.getEventsByTypeId();

      return expect(promise).to.be.rejectedWith(
        'A type ID is required for getting events'
      );
    });
  });

  describe('update', function() {
    context('when all required information is available', function() {
      let eventFromServerBeforeFormat;
      let eventToServerAfterFormat;
      let eventToServerBeforeFormat;
      let formatEventUpdateToServer;
      let request;
      let promise;

      beforeEach(function() {
        eventFromServerBeforeFormat = fixture.build('event', null, {
          fromServer: true
        });
        eventToServerAfterFormat = fixture.build(
          'event',
          eventFromServerBeforeFormat,
          { fromServer: true }
        );
        eventToServerBeforeFormat = fixture.build('event');

        formatEventUpdateToServer = sinon
          .stub(eventsUtils, 'formatEventUpdateToServer')
          .returns(eventToServerAfterFormat);

        request = {
          ...baseRequest,
          put: sinon.stub().resolves()
        };

        const events = new Events(baseSdk, request);
        events._baseUrl = expectedHost;

        promise = events.update(
          eventToServerBeforeFormat.id,
          eventToServerBeforeFormat
        );
      });

      it('formats the data into the right format', function() {
        expect(formatEventUpdateToServer).to.be.deep.calledWith(
          eventToServerBeforeFormat
        );
      });

      it('updates the event', function() {
        expect(request.put).to.be.deep.calledWith(
          `${expectedHost}/events/${eventToServerBeforeFormat.id}`,
          eventToServerAfterFormat
        );
      });

      it('returns a fulfilled promise', function() {
        return expect(promise).to.be.fulfilled;
      });
    });

    context(
      'when there is missing or malformed required information',
      function() {
        let events;

        beforeEach(function() {
          events = new Events(baseSdk, baseRequest);
        });

        it('throws an error when there is no provided event id', function() {
          const eventUpdate = fixture.build('event');
          const promise = events.update(null, eventUpdate);

          return expect(promise).to.be.rejectedWith(
            'An event ID is required to update an event'
          );
        });

        it('throws an error when there is no update provided', function() {
          const eventUpdate = fixture.build('event');
          const promise = events.update(eventUpdate.id);

          return expect(promise).to.be.rejectedWith(
            'An update is required to update an event'
          );
        });

        it('throws an error when the update is not a well-formed object', function() {
          const eventUpdate = fixture.build('event');
          const promise = events.update(eventUpdate.id, [eventUpdate]);

          return expect(promise).to.be.rejectedWith(
            'The event update must be a well-formed object with the data you wish to update'
          );
        });
      }
    );
  });

  describe('createEventType', function() {
    context('when all required information is supplied', function() {
      let eventTypeFromServerAfterFormat;
      let eventTypeFromServerBeforeFormat;
      let eventTypeToServerAfterFormat;
      let eventTypeToServerBeforeFormat;
      let promise;
      let request;
      let toCamelCase;
      let toSnakeCase;

      beforeEach(function() {
        eventTypeFromServerAfterFormat = fixture.build('eventType');
        eventTypeFromServerBeforeFormat = fixture.build(
          'eventType',
          eventTypeFromServerAfterFormat,
          { fromServer: true }
        );
        eventTypeToServerBeforeFormat = fixture.build('eventType');
        eventTypeToServerAfterFormat = fixture.build(
          'eventType',
          eventTypeToServerBeforeFormat,
          { fromServer: true }
        );

        request = {
          ...baseRequest,
          post: sinon.stub().resolves(eventTypeFromServerBeforeFormat)
        };

        toCamelCase = sinon
          .stub(objectUtils, 'toCamelCase')
          .returns(eventTypeFromServerAfterFormat);

        toSnakeCase = sinon
          .stub(objectUtils, 'toSnakeCase')
          .returns(eventTypeToServerAfterFormat);

        const events = new Events(baseSdk, request);
        events._baseUrl = expectedHost;

        promise = events.createEventType(eventTypeToServerBeforeFormat);
      });

      it('formats the submitted event type object to send to the server', function() {
        expect(toSnakeCase).to.be.calledWith(eventTypeToServerBeforeFormat);
      });

      it('creates a new event type', function() {
        expect(request.post).to.be.calledWith(
          `${expectedHost}/types`,
          eventTypeToServerAfterFormat
        );
      });

      it('formats the returned object', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.calledWith(eventTypeFromServerBeforeFormat);
        });
      });

      it('returns a fulfilled promise with the new event type information', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.equal(
          eventTypeFromServerAfterFormat
        );
      });
    });

    context('when there is missing required information', function() {
      [
        'name',
        'description',
        'clientId',
        'slug',
        'isRealtimeEnabled',
        'isOngoingEvent'
      ].forEach((field) => {
        it(`it throws an error when ${field} is missing`, function() {
          const eventType = fixture.build('eventType');

          const events = new Events(baseSdk, baseRequest);
          const promise = events.createEventType(omit(eventType, [field]));

          return expect(promise).to.be.rejectedWith(
            `A ${field} is required to create a new event type.`
          );
        });
      });
    });
  });

  describe('subscribeUser', function() {
    context('when all the required parameters are provided', function() {
      let expectedSubscription;
      let promise;
      let request;
      let event;
      let user;
      let subscriptionFromServer;
      let toCamelCase;

      beforeEach(function() {
        event = fixture.build('event');
        user = fixture.build('contxtUser');

        expectedSubscription = fixture.build('userEventSubscription');
        subscriptionFromServer = fixture.build(
          'userEventSubscription',
          expectedSubscription,
          {
            fromServer: true
          }
        );

        request = {
          ...baseRequest,
          post: sinon.stub().resolves(subscriptionFromServer)
        };
        toCamelCase = sinon
          .stub(objectUtils, 'toCamelCase')
          .returns(expectedSubscription);

        const events = new Events(baseSdk, request);
        events._baseUrl = expectedHost;

        promise = events.subscribeUser(user.id, event.id);
      });

      it('creates the user event subscription', function() {
        expect(request.post).to.be.calledWith(
          `${expectedHost}/users/${user.id}/events/${event.id}`
        );
      });

      it('formats the returned user event subscription', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.calledWith(subscriptionFromServer);
        });
      });

      it('returns a fulfilled promise with the new user event subscription', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.equal(
          expectedSubscription
        );
      });
    });

    context('when the user ID is not provided', function() {
      it('throws an error', function() {
        const userEventSubscription = fixture.build('userEventSubscription');

        const events = new Events(baseSdk, baseRequest);
        const promise = events.subscribeUser(
          null,
          userEventSubscription.eventId
        );

        return expect(promise).to.be.rejectedWith(
          'A user ID is required for subscribing a user to an event'
        );
      });
    });

    context('when the event ID is not provided', function() {
      it('throws an error', function() {
        const user = fixture.build('contxtUser');

        const events = new Events(baseSdk, baseRequest);
        const promise = events.subscribeUser(user.id, null);

        return expect(promise).to.be.rejectedWith(
          'An event ID is required for subscribing a user to an event'
        );
      });
    });
  });

  describe('unsubscribeUser', function() {
    context('when all required parameters are provided', function() {
      let userEventSubscription;
      let user;
      let promise;

      beforeEach(function() {
        userEventSubscription = fixture.build('userEventSubscription');
        user = fixture.build('contxtUser');

        const events = new Events(baseSdk, baseRequest);
        events._baseUrl = expectedHost;

        promise = events.unsubscribeUser(user.id, userEventSubscription.id);
      });

      it('sends a request to unsubscribe the user from the event', function() {
        expect(baseRequest.delete).to.be.calledWith(
          `${expectedHost}/users/${user.id}/subscriptions/${
            userEventSubscription.id
          }`
        );
      });

      it('returns a resolved promise', function() {
        return expect(promise).to.be.fulfilled;
      });
    });

    context('when the user ID is not provided', function() {
      it('throws an error', function() {
        const userEventSubscription = fixture.build('userEventSubscription');
        const events = new Events(baseSdk, baseRequest);
        const promise = events.unsubscribeUser(null, userEventSubscription.id);

        return expect(promise).to.be.rejectedWith(
          'A user ID is required to unsubscribe a user from an event'
        );
      });
    });

    context('when the user event subscription ID is not provided', function() {
      it('throws an error', function() {
        const user = fixture.build('contxtUser');
        const events = new Events(baseSdk, baseRequest);
        const promise = events.unsubscribeUser(user.id, null);

        return expect(promise).to.be.rejectedWith(
          'A user event subscription ID is required for unsubscribing a user from an event'
        );
      });
    });
  });
});

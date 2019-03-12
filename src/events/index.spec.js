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
    this.sandbox = sandbox.create();

    baseRequest = {
      delete: this.sandbox.stub().resolves(),
      get: this.sandbox.stub().resolves(),
      post: this.sandbox.stub().resolves(),
      put: this.sandbox.stub().resolves()
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
    this.sandbox.restore();
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
          post: this.sandbox.stub().resolves(eventFromServerBeforeFormat)
        };

        toCamelCase = this.sandbox
          .stub(objectUtils, 'toCamelCase')
          .returns(eventFromServerAfterFormat);

        toSnakeCase = this.sandbox
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
          get: this.sandbox.stub().resolves(eventFromServerBeforeFormat)
        };

        toCamelCase = this.sandbox
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

        formatPaginatedDataFromServer = this.sandbox
          .stub(paginationUtils, 'formatPaginatedDataFromServer')
          .returns(eventTypeFromServerAfterFormat);
        request = {
          ...baseRequest,
          get: this.sandbox.stub().resolves(eventTypeFromServerBeforeFormat)
        };
        toSnakeCase = this.sandbox
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

        toSnakeCase = this.sandbox
          .stub(objectUtils, 'toSnakeCase')
          .returns(eventsFiltersAfterFormat);
        formatPaginatedDataFromServer = this.sandbox
          .stub(paginationUtils, 'formatPaginatedDataFromServer')
          .returns(eventsFromServerAfterFormat);
        request = {
          ...baseRequest,
          get: this.sandbox.stub().resolves(eventsFromServerBeforeFormat)
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

        formatEventUpdateToServer = this.sandbox
          .stub(eventsUtils, 'formatEventUpdateToServer')
          .returns(eventToServerAfterFormat);

        request = {
          ...baseRequest,
          put: this.sandbox.stub().resolves()
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
          post: this.sandbox.stub().resolves(eventTypeFromServerBeforeFormat)
        };

        toCamelCase = this.sandbox
          .stub(objectUtils, 'toCamelCase')
          .returns(eventTypeFromServerAfterFormat);

        toSnakeCase = this.sandbox
          .stub(objectUtils, 'toSnakeCase')
          .returns(eventTypeToServerAfterFormat);

        const events = new Events(baseSdk, request);
        events._baseUrl = expectedHost;

        promise = events.createEventType(eventTypeToServerBeforeFormat);
      });

      it('formats the submitted event type object to send to the server', function() {
        expect(toSnakeCase).to.be.deep.calledWith(
          eventTypeToServerBeforeFormat
        );
      });

      it('creates a new event type', function() {
        expect(request.post).to.be.deep.calledWith(
          `${expectedHost}/types`,
          eventTypeToServerAfterFormat
        );
      });

      it('formats the returned object', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.deep.calledWith(
            eventTypeFromServerBeforeFormat
          );
        });
      });

      it('returns a fulfilled promise with the new event type information', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
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
});

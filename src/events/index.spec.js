import { omit, times } from 'lodash';
import Events from './index';
import * as eventsUtils from '../utils/events';
import * as objectUtils from '../utils/objects';

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

    context('the event Id is not provided', function() {
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

  describe('getEventTypesByClient', function() {
    context('the clientId is provided', function() {
      let clientId = faker.random.uuid();
      let promise;
      let request;
      let eventTypeFromServer;

      beforeEach(function() {
        eventTypeFromServer = fixture.build('eventType', { fromServer: true });

        request = {
          ...baseRequest,
          get: this.sandbox.stub().resolves(eventTypeFromServer)
        };

        const events = new Events(baseSdk, request);
        events._baseUrl = expectedHost;

        promise = events.getEventTypesByClient(clientId);
      });

      it('gets the eventType from the server', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/clients/${clientId}/types`
        );
      });

      it('returns the requested event type', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
          eventTypeFromServer
        );
      });
    });

    context('the clientId is not provided', function() {
      it('throws an error', function() {
        const events = new Events(baseSdk, baseRequest);
        const promise = events.getEventTypesByClient();

        return expect(promise).to.be.rejectedWith(
          'A client ID is required for getting types'
        );
      });
    });
  });

  describe('getEventsByType', function() {
    let typeId = faker.random.uuid();
    let facilityId = faker.random.uuid();
    let promise;
    let request;
    let eventsFromServer;

    beforeEach(function() {
      eventsFromServer = times(
        fixture.build('event', { fromServer: true }),
        10
      );

      request = {
        ...baseRequest,
        get: this.sandbox.stub().resolves(eventsFromServer)
      };

      const events = new Events(baseSdk, request);
      events._baseUrl = expectedHost;

      promise = events.getEventsByType(typeId, facilityId);
    });

    context('all required params are passed', function() {
      it('gets the events from the server', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/types/${typeId}/events`
        );
      });

      it('returns the requested events', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
          eventsFromServer
        );
      });
    });

    context('the type id is not provided', function() {
      it('throws an error', function() {
        const events = new Events(baseSdk, baseRequest);
        const promise = events.getEventsByType(null, facilityId);

        return expect(promise).to.be.rejectedWith(
          'A type id is required for getting events'
        );
      });
    });

    context('the facility id is not provided', function() {
      it('throws an error', function() {
        const events = new Events(baseSdk, baseRequest);
        const promise = events.getEventsByType(typeId, null);

        return expect(promise).to.be.rejectedWith(
          'A facility id is required for getting events'
        );
      });
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
});

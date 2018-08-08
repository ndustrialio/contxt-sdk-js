import omit from 'lodash.omit';
import Events from './index';
import * as eventsUtils from '../utils/events';

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
      let formatEventFromServer;
      let formatEventToServer;
      let promise;
      let request;

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

        formatEventFromServer = this.sandbox
          .stub(eventsUtils, 'formatEventFromServer')
          .returns(eventFromServerAfterFormat);
        formatEventToServer = this.sandbox
          .stub(eventsUtils, 'formatEventToServer')
          .returns(eventToServerAfterFormat);

        request = {
          ...baseRequest,
          post: this.sandbox.stub().resolves(eventFromServerBeforeFormat)
        };

        const events = new Events(baseSdk, request);
        events._baseUrl = expectedHost;

        promise = events.create(eventToServerBeforeFormat);
      });

      it('formats the submitted event object to send to the server', function() {
        expect(formatEventToServer).to.be.deep.calledWith(
          eventToServerBeforeFormat
        );
      });

      it('creates a new event', function() {
        expect(request.post).to.be.deep.calledWith(
          `${expectedHost}/events`,
          eventToServerAfterFormat
        );
      });

      it('formats the returned object', function() {
        return promise.then(() => {
          expect(formatEventFromServer).to.be.deep.calledWith(
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
      let formatEventFromServer;
      let promise;
      let request;

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

        formatEventFromServer = this.sandbox
          .stub(eventsUtils, 'formatEventFromServer')
          .returns(eventFromServerAfterFormat);

        request = {
          ...baseRequest,
          get: this.sandbox.stub().resolves(eventFromServerBeforeFormat)
        };

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
          expect(formatEventFromServer).to.be.calledWith(
            eventFromServerBeforeFormat
          );
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

  describe('update', function() {
    context('when all required information is available', function() {
      let eventFromServerBeforeFormat;
      let eventToServerAfterFormat;
      let eventToServerBeforeFormat;
      let formatEventToServer;
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

        formatEventToServer = this.sandbox
          .stub(eventsUtils, 'formatEventToServer')
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
        expect(formatEventToServer).to.be.deep.calledWith(
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

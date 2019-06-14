import { Server, WebSocket } from 'mock-socket';
import proxyquire from 'proxyquire';

import Channels from './channels';
import WebSocketConnection from './webSocketConnection';

describe('Bus', function() {
  let baseRequest;
  let baseSdk;
  let Bus;

  before(function() {
    proxyquire.noCallThru();
    proxyquire.preserveCache();

    Bus = proxyquire('./index', {
      ws: WebSocket
    }).default;
  });

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
          bus: fixture.build('audience')
        }
      }
    };
  });

  afterEach(function() {
    sinon.restore();
  });

  describe('constructor', function() {
    let bus;

    beforeEach(function() {
      bus = new Bus(baseSdk, baseRequest);
    });

    it('sets a base url for the class instance', function() {
      expect(bus._baseUrl).to.equal(`${baseSdk.config.audiences.bus.host}`);
    });

    it('sets a base websocket url for the class instance', function() {
      expect(bus._baseWebSocketUrl).to.equal(
        `${baseSdk.config.audiences.bus.webSocket}`
      );
    });

    it('appends the supplied request module to the class instance', function() {
      expect(bus._request).to.equal(baseRequest);
    });

    it('appends the supplied sdk to the class instance', function() {
      expect(bus._sdk).to.equal(baseSdk);
    });

    it('appends an instance of Fields to the class instance', function() {
      expect(bus.channels).to.be.an.instanceof(Channels);
    });

    it('sets websockets to an empty object', function() {
      expect(bus._webSockets).to.be.empty;
    });
  });

  describe('connect', function() {
    let expectedHost;
    let expectedOrganization;

    beforeEach(function() {
      expectedHost = `wss://${faker.internet.domainName()}`;
      expectedOrganization = fixture.build('organization');
    });

    context('when a websocket already exists for the organization', function() {
      let expectedSocket;
      let promise;
      let sdk;
      let server;

      beforeEach(function() {
        sdk = {
          ...baseSdk,
          auth: {
            ...baseSdk.auth,
            getCurrentApiToken: sinon.stub().resolves()
          }
        };

        server = new Server(
          `${expectedHost}/organizations/${expectedOrganization.id}/stream`
        );

        expectedSocket = new WebSocketConnection(
          new WebSocket(
            `${expectedHost}/organizations/${expectedOrganization.id}/stream`
          ),
          expectedOrganization.id
        );

        const bus = new Bus(sdk, baseRequest);
        bus._baseWebSocketUrl = expectedHost;
        bus._webSockets[expectedOrganization.id] = expectedSocket;

        promise = bus.connect(expectedOrganization.id);
      });

      afterEach(function() {
        server.stop();
      });

      it('fulfills the promise', function() {
        return expect(promise).to.be.fulfilled;
      });

      it('does not fetch an api token', function() {
        return promise.then(() => {
          expect(sdk.auth.getCurrentApiToken).to.not.be.called;
        });
      });

      it('resolves the promise with the existing socket', function() {
        return promise.then((socket) => {
          expect(socket).to.deep.equal(expectedSocket);
        });
      });
    });

    context(
      'when a websocket does not already exist for the organization',
      function() {
        context('when successfully connecting to the message bus', function() {
          let bus;
          let expectedApiToken;
          let promise;
          let sdk;
          let server;

          beforeEach(function() {
            expectedApiToken = faker.internet.password();

            sdk = {
              ...baseSdk,
              auth: {
                ...baseSdk.auth,
                getCurrentApiToken: sinon.stub().resolves(expectedApiToken)
              }
            };

            server = new Server(
              `${expectedHost}/organizations/${expectedOrganization.id}/stream`
            );

            bus = new Bus(sdk, baseRequest);
            bus._baseWebSocketUrl = expectedHost;

            promise = bus.connect(expectedOrganization.id);
          });

          afterEach(function() {
            server.stop();
          });

          context('when initially connecting', function() {
            it('gets an api token', function() {
              return promise.then(() => {
                expect(sdk.auth.getCurrentApiToken).to.be.calledWith(
                  'contxtAuth'
                );
              });
            });

            it('stores a copy of the websocket', function() {
              return promise.then((resolvedWebSocket) => {
                const ws = bus._webSockets[expectedOrganization.id];

                expect(resolvedWebSocket).to.deep.equal(ws);
              });
            });
          });

          context('when the connection closes', function() {
            beforeEach(function() {
              return promise.then(() => {
                server.close();
              });
            });

            it('clears out the stored copy of the websocket', function() {
              return promise.then(() => {
                expect(bus._webSockets[expectedOrganization.id]).to.be.null;
              });
            });
          });
        });

        context('when there is a problem getting an API token', function() {
          let expectedError;
          let promise;
          let sdk;

          beforeEach(function() {
            expectedError = new Error(faker.hacker.phrase());

            sdk = {
              ...baseSdk,
              auth: {
                ...baseSdk.auth,
                getCurrentApiToken: sinon.stub().rejects(expectedError)
              }
            };

            const bus = new Bus(sdk, baseRequest);
            bus._baseWebSocketUrl = expectedHost;

            promise = bus.connect(expectedOrganization.id);
          });

          it('rejects with the error', function() {
            return expect(promise).to.be.rejectedWith(expectedError);
          });
        });

        context(
          'when unsuccessful at connecting to the message bus',
          function() {
            let expectedApiToken;
            let promise;
            let sdk;
            let server;

            beforeEach(function() {
              expectedApiToken = faker.internet.password();

              sdk = {
                ...baseSdk,
                auth: {
                  ...baseSdk.auth,
                  getCurrentApiToken: sinon.stub().resolves(expectedApiToken)
                }
              };

              server = new Server(
                `${expectedHost}/organizations/${
                  expectedOrganization.id
                }/stream`,
                {
                  // set up the connection to fail every time
                  verifyClient: () => false
                }
              );

              const bus = new Bus(sdk, baseRequest);
              bus._baseWebSocketUrl = expectedHost;

              promise = bus.connect(expectedOrganization.id);
            });

            afterEach(function() {
              server.stop();
            });

            it('gets an api token', function() {
              return promise.catch(() => {
                expect(sdk.auth.getCurrentApiToken).to.be.calledWith(
                  'contxtAuth'
                );
              });
            });

            it('rejects the promise', function() {
              return expect(promise).to.be.rejected;
            });

            it('rejects with an error event', function() {
              return promise.catch((event) => {
                expect(event.type).to.equal('error');
              });
            });
          }
        );
      }
    );
  });

  describe('getWebSocketConnection', function() {
    let bus;
    let expectedOrganization;
    let expectedWebSocket;

    beforeEach(function() {
      expectedOrganization = fixture.build('organization');
      expectedWebSocket = new WebSocketConnection(
        new WebSocket(
          `wss://${faker.internet.domainName()}/organizations/${
            expectedOrganization.id
          }/stream`
        ),
        expectedOrganization.id
      );

      bus = new Bus(baseSdk, baseRequest);
      bus._webSockets[expectedOrganization.id] = expectedWebSocket;
    });

    context('when an organization id is passed in', function() {
      context('when a websocket connection exists', function() {
        let webSocketConnection;

        beforeEach(function() {
          webSocketConnection = bus.getWebSocketConnection(
            expectedOrganization.id
          );
        });

        it('returns the socket', function() {
          expect(webSocketConnection).to.deep.equal(expectedWebSocket);
        });
      });

      context('when a websocket connection does not exist', function() {
        let webSocketConnection;

        beforeEach(function() {
          webSocketConnection = bus.getWebSocketConnection(faker.random.uuid());
        });

        it('returns undefined', function() {
          expect(webSocketConnection).to.be.undefined;
        });
      });
    });

    context('when an organization id is not passed in', function() {
      let webSocketConnection;

      beforeEach(function() {
        webSocketConnection = bus.getWebSocketConnection();
      });

      it('returns undefined', function() {
        expect(webSocketConnection).to.be.undefined;
      });
    });
  });
});

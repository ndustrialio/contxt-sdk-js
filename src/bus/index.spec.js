import { Server, WebSocket } from 'mock-socket';
import proxyquire from 'proxyquire';

import Channels from './channels';
import Socket from './socket';

describe.only('Bus', function() {
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
          bus: fixture.build('audience')
        }
      }
    };
  });

  afterEach(function() {
    this.sandbox.restore();
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
    let server;

    beforeEach(function() {
      expectedHost = `wss://${faker.internet.domainName()}`;
      expectedOrganization = fixture.build('organization');

      server = new Server(
        `${expectedHost}/organizations/${expectedOrganization.id}/stream`
      );
    });

    afterEach(function() {
      server.stop();
    });

    context('when a websocket already exists for the organization', function() {
      let bus;
      let expectedSocket;
      let promise;
      let sdk;

      beforeEach(function() {
        sdk = {
          ...baseSdk,
          auth: {
            ...baseSdk.auth,
            getCurrentApiToken: this.sandbox.stub().resolves()
          }
        };

        bus = new Bus(sdk, baseRequest);
        bus._baseWebSocketUrl = expectedHost;

        expectedSocket = new Socket(
          new WebSocket(
            `${expectedHost}/organizations/${expectedOrganization.id}/stream`
          ),
          expectedOrganization.id
        );

        bus._webSockets[expectedOrganization.id] = expectedSocket;

        promise = bus.connect(expectedOrganization.id);
      });

      it('fulfills the promise', function() {
        expect(promise).to.be.fulfilled;
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

          beforeEach(function() {
            expectedApiToken = faker.internet.password();

            sdk = {
              ...baseSdk,
              auth: {
                ...baseSdk.auth,
                getCurrentApiToken: this.sandbox
                  .stub()
                  .resolves(expectedApiToken)
              }
            };

            bus = new Bus(sdk, baseRequest);
            bus._baseWebSocketUrl = expectedHost;

            promise = bus.connect(expectedOrganization.id);
          });

          context('when initially opening the websocket', function() {
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
        });

        context(
          'when unsuccessful at connecting to the message bus',
          function() {
            let bus;
            let expectedApiToken;
            let promise;
            let sdk;

            beforeEach(function() {
              expectedApiToken = faker.internet.password();

              sdk = {
                ...baseSdk,
                auth: {
                  ...baseSdk.auth,
                  getCurrentApiToken: this.sandbox
                    .stub()
                    .resolves(expectedApiToken)
                }
              };

              bus = new Bus(sdk, baseRequest);
              bus._baseWebSocketUrl = expectedHost;

              promise = bus.connect(expectedOrganization.id);

              server.simulate('error');
            });

            it('gets an api token', function() {
              return promise.catch(() => {
                expect(sdk.auth.getCurrentApiToken).to.be.calledWith(
                  'contxtAuth'
                );
              });
            });

            it('rejects the promise', function() {
              expect(promise).to.be.rejected;
            });

            it('triggers an error event', function() {
              return promise.catch((event) => {
                expect(event.type).to.equal('error');
              });
            });
          }
        );

        context(
          'when a websocket connection is already established',
          function() {
            let bus;
            let sdk;
            let ws;

            beforeEach(function() {
              sdk = {
                ...baseSdk,
                auth: {
                  ...baseSdk.auth,
                  getCurrentApiToken: this.sandbox.stub().resolves()
                }
              };

              bus = new Bus(sdk, baseRequest);

              bus._baseWebSocketUrl = expectedHost;

              ws = new WebSocket(
                `${bus._baseWebSocketUrl}/organizations/${
                  expectedOrganization.id
                }/stream`
              );

              bus._webSockets[expectedOrganization.id] = new Socket(
                ws,
                expectedOrganization.id
              );
            });

            context('when close is called on the websocket', function() {
              beforeEach(function() {
                ws.close();
              });

              it('clears out the stored copy of the websocket', function() {
                setTimeout(() => {
                  expect(bus._webSockets[expectedOrganization.id]).to.be.null;
                }, 1000);
              });
            });

            context('when close emitted from the server', function() {
              beforeEach(function() {
                server.emit('close');
              });

              it('clears out the stored copy of the websocket', function() {
                setTimeout(() => {
                  expect(bus._webSockets[expectedOrganization.id]).to.be.null;
                }, 1000);
              });
            });
          }
        );
      }
    );
  });
});

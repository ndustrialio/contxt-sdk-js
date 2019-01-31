import { Server, WebSocket } from 'mock-socket';
import proxyquire from 'proxyquire';

import Channels from './channels';
import Socket from './socket';

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

    it('appends the supplied request module to the class instance', function() {
      expect(bus._request).to.equal(baseRequest);
    });

    it('appends the supplied sdk to the class instance', function() {
      expect(bus._sdk).to.equal(baseSdk);
    });

    it('appends an instance of Fields to the class instance', function() {
      expect(bus.channels).to.be.an.instanceof(Channels);
    });

    it("returns a function called 'connect'", function() {
      expect(bus.connect).to.be.a('function');
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
      let socket;

      beforeEach(function() {
        sdk = {
          ...baseSdk,
          auth: {
            ...baseSdk.auth,
            getCurrentApiToken: this.sandbox.stub().resolves()
          }
        };

        bus = new Bus(sdk, baseRequest);
        bus._baseSocketUrl = expectedHost;

        socket = new WebSocket(
          `${expectedHost}/organizations/${expectedOrganization.id}/stream`
        );
        expectedSocket = new Socket(socket, expectedOrganization.id);

        bus._sockets[expectedOrganization.id] = expectedSocket;

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
          expect(socket).to.be.an.instanceof(Socket);
          expect(socket._organizationId).to.equal(expectedOrganization.id);
          expect(socket._socket.url).to.equal(
            `${expectedHost}/organizations/${expectedOrganization.id}/stream`
          );
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
            bus._baseSocketUrl = expectedHost;

            promise = bus.connect(expectedOrganization.id);
          });

          context('when intially opening the websocket', function() {
            it('gets an api token', function() {
              return promise.then(() => {
                expect(sdk.auth.getCurrentApiToken).to.be.calledWith(
                  'contxtAuth'
                );
              });
            });

            it('stores a copy of the websocket', function() {
              return promise.then(() => {
                const socket = bus._sockets[expectedOrganization.id];

                expect(socket).to.be.an.instanceof(Socket);
                expect(socket._organizationId).to.equal(
                  expectedOrganization.id
                );
                expect(socket._socket.url).to.equal(
                  `${expectedHost}/organizations/${
                    expectedOrganization.id
                  }/stream`
                );
              });
            });
          });

          context('when the websocket closes', function() {
            beforeEach(function() {
              return promise.then(() => {
                server.close();
              });
            });

            it('clears out the stored copy of the websocket when it closes', function() {
              return promise.then(() => {
                expect(bus._sockets[expectedOrganization.id]).to.be.null;
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
            let socketUrl;

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

              socketUrl = `wss://${faker.internet.domainName()}`;
              bus = new Bus(sdk, baseRequest);

              bus._baseSocketUrl = socketUrl;

              promise = bus.connect(expectedOrganization.id);
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
                expect(event.target.url).to.equal(
                  `${socketUrl}/organizations/${expectedOrganization.id}/stream`
                );
              });
            });
          }
        );
      }
    );
  });
});

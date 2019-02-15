import { Server, WebSocket } from 'mock-socket';
import WebSocketConnection from './webSocketConnection';

describe('WebSocketConnection', function() {
  let expectedWebSocket;
  let webSocketServer;
  let webSocketUrl;

  beforeEach(function() {
    this.sandbox = sandbox.create();

    webSocketUrl = `wss://${faker.internet.domainName()}`;
    webSocketServer = new Server(webSocketUrl);
    expectedWebSocket = new WebSocket(webSocketUrl);
  });

  afterEach(function() {
    this.sandbox.restore();

    expectedWebSocket.onmessage = null;
    expectedWebSocket.onerror = null;

    expectedWebSocket.close();

    webSocketServer.close();
  });

  describe('constructor', function() {
    let expectedOrganization;
    let ws;

    beforeEach(function() {
      expectedOrganization = fixture.build('organization');
      ws = new WebSocketConnection(expectedWebSocket, expectedOrganization.id);
    });

    it('sets a socket for the class instance', function() {
      expect(ws._webSocket).to.deep.equal(expectedWebSocket);
    });

    it('sets an organization id for the class instance', function() {
      expect(ws._organizationId).to.equal(expectedOrganization.id);
    });
  });

  describe('authorize', function() {
    context('on a successful message', function() {
      context('when the message has a matching jsonRpcId', function() {
        context('when a user is authorized', function() {
          let expectedMessage;
          let expectedOrganization;
          let expectedJsonRpc;
          let jsonRpcId;
          let promise;
          let send;
          let token;
          let ws;

          beforeEach(function() {
            expectedOrganization = fixture.build('organization');
            send = this.sandbox.spy(expectedWebSocket, 'send');
            token = faker.internet.password();

            ws = new WebSocketConnection(
              expectedWebSocket,
              expectedOrganization.id
            );

            jsonRpcId = ws._jsonRpcId;

            expectedMessage = { jsonrpc: '2.0', id: jsonRpcId, result: null };

            expectedJsonRpc = JSON.stringify({
              jsonrpc: '2.0',
              method: 'MessageBus.Authorize',
              params: {
                token
              },
              id: jsonRpcId
            });

            promise = ws.authorize(token);

            webSocketServer.on('connection', (socket) => {
              socket.send(JSON.stringify(expectedMessage));
            });
          });

          it('sends a message to the message bus', function() {
            return promise.then(function() {
              expect(send).to.be.calledWith(expectedJsonRpc);
            });
          });

          it('increments the jsonRpcId', function() {
            return promise.then(function() {
              expect(ws._jsonRpcId).to.equal(jsonRpcId + 1);
            });
          });

          it('fulfills the promise', function() {
            expect(promise).to.be.fulfilled;
          });

          it('tears down the onmessage handler', function() {
            return promise.then(function() {
              expect(ws._webSocket.onmessage).to.be.undefined;
            });
          });
        });

        context('when a user is not authorized', function() {
          let expectedMessage;
          let expectedOrganization;
          let jsonRpcId;
          let promise;
          let token;
          let ws;

          beforeEach(function() {
            expectedOrganization = fixture.build('organization');
            token = faker.internet.password();

            ws = new WebSocketConnection(
              expectedWebSocket,
              expectedOrganization.id
            );

            jsonRpcId = ws._jsonRpcId;

            expectedMessage = {
              jsonrpc: '2.0',
              id: jsonRpcId,
              error: {
                status: 401,
                message: 'user is not authorized'
              }
            };

            promise = ws.authorize(token);

            webSocketServer.on('connection', (socket) => {
              socket.send(JSON.stringify(expectedMessage));
            });
          });

          it('rejects the promise', function() {
            expect(promise).to.be.rejectedWith(expectedMessage.error);
          });
        });
      });
    });

    context('when the message does not have a matching jsonRpcId', function() {
      let expectedMessage;
      let expectedOrganization;
      let promise;
      let token;
      let ws;

      beforeEach(function() {
        expectedOrganization = fixture.build('organization');
        token = faker.internet.password();

        ws = new WebSocketConnection(
          expectedWebSocket,
          expectedOrganization.id
        );

        expectedMessage = {
          jsonrpc: '2.0',
          id: faker.random.uuid(),
          result: null
        };

        promise = ws.authorize(token);

        webSocketServer.on('connection', (socket) => {
          socket.send(JSON.stringify(expectedMessage));
        });
      });

      it('does not resolve the promise', function(done) {
        expect(promise).to.not.be.fulfilled;
        expect(promise).to.not.be.rejected;
        done();
      });
    });

    context('on a WebSocket error', function() {
      let expectedOrganization;
      let expectedJsonRpc;
      let jsonRpcId;
      let promise;
      let send;
      let token;
      let ws;

      beforeEach(function() {
        expectedOrganization = fixture.build('organization');
        send = this.sandbox.spy(expectedWebSocket, 'send');
        token = faker.internet.password();

        ws = new WebSocketConnection(
          expectedWebSocket,
          expectedOrganization.id
        );

        jsonRpcId = ws._jsonRpcId;

        expectedJsonRpc = JSON.stringify({
          jsonrpc: '2.0',
          method: 'MessageBus.Authorize',
          params: {
            token
          },
          id: jsonRpcId
        });

        promise = ws.authorize(token);

        webSocketServer.simulate('error');
      });

      it('sends a message to the message bus', function() {
        return promise.catch(function() {
          expect(send).to.be.calledWith(expectedJsonRpc);
        });
      });

      it('increments the jsonRpcId', function() {
        return promise.catch(function() {
          expect(ws._jsonRpcId).to.equal(jsonRpcId + 1);
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
    });

    context('when the websocket is null', function() {
      let expectedOrganization;
      let jsonRpcId;
      let promise;
      let send;
      let token;
      let ws;

      beforeEach(function() {
        expectedOrganization = fixture.build('organization');
        send = this.sandbox.spy(expectedWebSocket, 'send');
        token = faker.internet.password();

        ws = new WebSocketConnection(null, expectedOrganization.id);

        jsonRpcId = ws._jsonRpcId;

        promise = ws.authorize(token);
      });

      it('does not send a message to the message bus', function() {
        return promise.catch(function() {
          expect(send).to.not.be.called;
        });
      });

      it('does not increment the jsonRpcId', function() {
        return promise.catch(function() {
          expect(ws._jsonRpcId).to.equal(jsonRpcId);
        });
      });

      it('rejects the promise', function() {
        expect(promise).to.be.rejectedWith('WebSocket connection not open');
      });
    });

    context('when the websocket is not open', function() {
      let expectedOrganization;
      let jsonRpcId;
      let promise;
      let send;
      let token;
      let ws;

      beforeEach(function(done) {
        expectedOrganization = fixture.build('organization');
        send = this.sandbox.spy(expectedWebSocket, 'send');
        token = faker.internet.password();

        ws = new WebSocketConnection(
          expectedWebSocket,
          expectedOrganization.id
        );

        jsonRpcId = ws._jsonRpcId;

        ws.close();

        expectedWebSocket.onclose = () => {
          expectedWebSocket.OPEN = 0;
          promise = ws.authorize(token);
          done();
        };
      });

      it('does not send a message to the message bus', function() {
        return promise.catch(function() {
          expect(send).to.not.be.called;
        });
      });

      it('does not increment the jsonRpcId', function() {
        return promise.catch(function() {
          expect(ws._jsonRpcId).to.equal(jsonRpcId);
        });
      });

      it('rejects the promise', function() {
        expect(promise).to.be.rejectedWith('WebSocket connection not open');
      });
    });

    context('when there is not a token sent', function() {
      let expectedOrganization;
      let jsonRpcId;
      let promise;
      let send;
      let ws;

      beforeEach(function() {
        expectedOrganization = fixture.build('organization');
        send = this.sandbox.spy(expectedWebSocket, 'send');

        ws = new WebSocketConnection(
          expectedWebSocket,
          expectedOrganization.id
        );

        jsonRpcId = ws._jsonRpcId;

        promise = ws.authorize();
      });

      it('does not send a message to the message bus', function() {
        return promise.catch(function() {
          expect(send).to.not.be.called;
        });
      });

      it('does not increment the jsonRpcId', function() {
        return promise.catch(function() {
          expect(ws._jsonRpcId).to.equal(jsonRpcId);
        });
      });

      it('rejects the promise', function() {
        expect(promise).to.be.rejectedWith(
          'A token is required for authorization'
        );
      });
    });
  });

  describe('close', function() {
    let close;
    let expectedOrganization;
    let ws;

    beforeEach(function() {
      expectedOrganization = fixture.build('organization');

      close = this.sandbox.stub(expectedWebSocket, 'close');

      ws = new WebSocketConnection(expectedWebSocket, expectedOrganization.id);

      ws.close();
    });

    it('calls close on the web socket', function() {
      expect(close).to.be.calledOnce;
    });
  });
});

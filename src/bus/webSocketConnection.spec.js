import { Server, WebSocket } from 'mock-socket';
import sinon from 'sinon';
import WebSocketConnection from './webSocketConnection';

const DELAY = 5;

describe('Bus/WebSocketConnection', function() {
  let expectedWebSocket;
  let webSocketServer;
  let webSocketUrl;

  beforeEach(function(done) {
    this.sandbox = sandbox.create();

    webSocketUrl = `wss://${faker.internet.domainName()}`;
    webSocketServer = new Server(webSocketUrl);
    expectedWebSocket = new WebSocket(webSocketUrl);

    // Wait to allow `mock-socket` to set everything up
    setTimeout(done, DELAY);
  });

  afterEach(function() {
    this.sandbox.restore();
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
      context('when a user is authorized', function() {
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

          webSocketServer.emit(
            'message',
            JSON.stringify({ jsonrpc: '2.0', id: jsonRpcId, result: null })
          );
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

        it('tears down the onmessage handler', function() {
          return promise.then(function() {
            expect(ws._webSocket.onmessage).to.be.undefined;
          });
        });

        it('tears down the onerror handler', function() {
          return promise.then(function() {
            expect(ws._webSocket.onerror).to.be.undefined;
          });
        });

        it('fulfills the promise', function() {
          return expect(promise).to.be.fulfilled;
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

          webSocketServer.emit('message', JSON.stringify(expectedMessage));
        });

        it('tears down the onmessage handler', function() {
          return promise.catch(function() {
            expect(ws._webSocket.onmessage).to.be.undefined;
          });
        });

        it('tears down the onerror handler', function() {
          return promise.catch(function() {
            expect(ws._webSocket.onerror).to.be.undefined;
          });
        });

        it('rejects the promise with the authorization error', function() {
          return expect(promise).to.be.rejectedWith(expectedMessage.error);
        });
      });

      context(
        'when receiving a different message than the expected message (i.e. the message does not have a matching jsonRpcId)',
        function() {
          let clock;
          let expectedOrganization;
          let promise;
          let resolvedIndicator;
          let token;
          let waitTime;
          let ws;

          beforeEach(function() {
            clock = sinon.useFakeTimers();

            expectedOrganization = fixture.build('organization');
            token = faker.internet.password();
            resolvedIndicator = Symbol(faker.hacker.noun());
            waitTime = 1 * 60 * 1000; // 1 minute

            ws = new WebSocketConnection(
              expectedWebSocket,
              expectedOrganization.id
            );

            promise = Promise.race([
              ws.authorize(token),
              new Promise((resolve, reject) => {
                setTimeout(resolve, waitTime, resolvedIndicator);
              })
            ]);

            webSocketServer.emit(
              'message',
              JSON.stringify({
                jsonrpc: '2.0',
                id: faker.random.uuid(),
                result: null
              })
            );
          });

          afterEach(function() {
            clock.restore();
          });

          it('does not resolve or reject the promise within 1 minute', function() {
            clock.tick(waitTime);

            return promise.then(
              (value) => {
                expect(value).to.equal(
                  resolvedIndicator,
                  'Promise should not have been resolved'
                );
              },
              () => {
                throw new Error('Promise should not have been rejected');
              }
            );
          });
        }
      );
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

      it('tears down the onmessage handler', function() {
        return promise.catch(function() {
          expect(ws._webSocket.onmessage).to.be.undefined;
        });
      });

      it('tears down the onerror handler', function() {
        return promise.catch(function() {
          expect(ws._webSocket.onerror).to.be.undefined;
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
        return expect(promise).to.be.rejectedWith(
          'WebSocket connection not open'
        );
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
        return expect(promise).to.be.rejectedWith(
          'WebSocket connection not open'
        );
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
        return expect(promise).to.be.rejectedWith(
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

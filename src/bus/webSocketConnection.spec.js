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
    context(
      'when there is a token and the websocket connection is open',
      function() {
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

          promise = ws.authorize(token);

          jsonRpcId = Object.keys(ws._messageHandlers)[0];

          expectedJsonRpc = JSON.stringify({
            jsonrpc: '2.0',
            method: 'MessageBus.Authorize',
            params: {
              token
            },
            id: jsonRpcId
          });
        });

        it('sends a message to the message bus', function() {
          expect(send).to.be.calledWith(expectedJsonRpc);
        });

        it('sets up a message handler', function() {
          expect(ws._messageHandlers[jsonRpcId]).to.be.a('function');
        });

        context('when a message is recieved', function() {
          context('when a user is authorized', function() {
            beforeEach(function() {
              ws._messageHandlers[jsonRpcId]({
                jsonrpc: '2.0',
                id: jsonRpcId,
                result: null
              });
            });

            it('fulfills the promise', function() {
              return expect(promise).to.be.fulfilled;
            });

            it('tears down the on message handler after it recieves a message', function() {
              return promise.then(function() {
                expect(ws._messageHandlers[jsonRpcId]).to.be.undefined;
              });
            });
          });

          context('when a user is not authorized', function() {
            let expectedMessage;

            beforeEach(function() {
              expectedMessage = {
                jsonrpc: '2.0',
                id: jsonRpcId,
                error: {
                  status: 401,
                  message: 'user is not authorized'
                }
              };

              ws._messageHandlers[jsonRpcId](expectedMessage);
            });

            it('rejects the promise with the authorization error', function() {
              return expect(promise).to.be.rejectedWith(expectedMessage.error);
            });

            it('tears down the on message handler after it recieves a message', function() {
              return promise.catch(function() {
                expect(ws._messageHandlers[jsonRpcId]).to.be.undefined;
              });
            });
          });

          context(
            'when receiving a different message than the expected message (i.e. the message does not have a matching jsonRpcId)',
            function() {
              let clock;
              let resolvedIndicator;
              let waitTime;

              beforeEach(function() {
                clock = sinon.useFakeTimers();

                resolvedIndicator = Symbol(faker.hacker.noun());
                waitTime = 1 * 60 * 1000; // 1 minute

                promise = Promise.race([
                  ws.authorize(token),
                  new Promise((resolve, reject) => {
                    setTimeout(resolve, waitTime, resolvedIndicator);
                  })
                ]);

                jsonRpcId = Object.keys(ws._messageHandlers)[0];

                ws._messageHandlers[jsonRpcId]({
                  jsonrpc: '2.0',
                  id: jsonRpcId,
                  result: null
                });
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
      }
    );

    context('when the websocket is null', function() {
      let expectedOrganization;
      let promise;
      let send;
      let token;
      let ws;

      beforeEach(function() {
        expectedOrganization = fixture.build('organization');
        send = this.sandbox.spy(expectedWebSocket, 'send');
        token = faker.internet.password();

        ws = new WebSocketConnection(null, expectedOrganization.id);

        promise = ws.authorize(token);
      });

      it('does not send a message to the message bus', function() {
        return promise.catch(function() {
          expect(send).to.not.be.called;
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

      it('rejects the promise', function() {
        return expect(promise).to.be.rejectedWith(
          'WebSocket connection not open'
        );
      });
    });

    context('when there is not a token sent', function() {
      let expectedOrganization;
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

        promise = ws.authorize();
      });

      it('does not send a message to the message bus', function() {
        return promise.catch(function() {
          expect(send).to.not.be.called;
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

  describe('_onError', function() {
    let expectedError;
    let expectedOrganization;
    let ws;

    beforeEach(function() {
      expectedError = faker.random.words();
      expectedOrganization = fixture.build('organization');

      ws = new WebSocketConnection(expectedWebSocket, expectedOrganization.id);

      ws._messageHandlers = {
        [faker.random.uuid()]: this.sandbox.stub()
      };

      ws._onError(expectedError);
    });

    it('resets the messageHandlers', function() {
      expect(ws._messageHandlers).to.be.empty;
    });
  });

  describe('_onMessage', function() {
    context('when message handlers exist for the message id', function() {
      context('when the message is a valid json string', function() {
        let expectedMessage;
        let expectedMessageHandlers;
        let expectedOrganization;
        let expectedUUID;
        let ws;

        beforeEach(function() {
          expectedOrganization = fixture.build('organization');
          expectedUUID = faker.random.uuid();
          expectedMessage = {
            jsonrpc: '2.0',
            id: expectedUUID,
            result: null
          };
          expectedMessageHandlers = {
            [expectedUUID]: this.sandbox.stub()
          };

          ws = new WebSocketConnection(
            expectedWebSocket,
            expectedOrganization.id
          );

          ws._messageHandlers = expectedMessageHandlers;

          ws._onMessage({ data: JSON.stringify(expectedMessage) });
        });

        it('calls the onmessage function for the message handler', function() {
          expect(expectedMessageHandlers[expectedUUID]).to.be.calledWith(
            expectedMessage
          );
        });
      });

      context('when the message is not a valid json string', function() {
        let expectedMessage;
        let expectedMessageHandlers;
        let expectedOrganization;
        let ws;

        beforeEach(function() {
          expectedMessage = {
            jsonrpc: '2.0',
            id: faker.random.uuid(),
            result: null
          };
          expectedOrganization = fixture.build('organization');

          ws = new WebSocketConnection(
            expectedWebSocket,
            expectedOrganization.id
          );

          ws._messageHandlers = expectedMessageHandlers;
        });

        it('throws an error', function() {
          expect(() => ws._onMessage({ data: expectedMessage })).to.throw(
            'Invalid JSON in message'
          );
        });
      });
    });

    context("when message handlers don't exist for a message id", function() {
      let expectedMessage;
      let expectedMessageHandlers;
      let expectedOrganization;
      let expectedUUID;
      let ws;

      beforeEach(function() {
        expectedMessage = {
          jsonrpc: '2.0',
          id: faker.random.uuid(),
          result: null
        };
        expectedOrganization = fixture.build('organization');
        expectedUUID = faker.random.uuid();
        expectedMessageHandlers = {
          [expectedUUID]: this.sandbox.stub()
        };

        ws = new WebSocketConnection(
          expectedWebSocket,
          expectedOrganization.id
        );

        ws._messageHandlers = expectedMessageHandlers;

        ws._onMessage({ data: JSON.stringify(expectedMessage) });
      });

      it('does not call the onmessage function for the message handler', function() {
        expect(expectedMessageHandlers[expectedUUID]).to.not.be.called;
      });
    });
  });

  describe('publish', function() {
    context(
      'when there is a serviceClientId, channel, message, and the websocket connection is open',
      function() {
        let channel;
        let expectedOrganization;
        let expectedJsonRpc;
        let jsonRpcId;
        let message;
        let promise;
        let send;
        let serviceId;
        let ws;

        beforeEach(function() {
          channel = faker.random.word();
          expectedOrganization = fixture.build('organization');
          message = {
            example: 1
          };
          send = this.sandbox.spy(expectedWebSocket, 'send');
          serviceId = faker.random.uuid();

          ws = new WebSocketConnection(
            expectedWebSocket,
            expectedOrganization.id
          );

          promise = ws.publish(serviceId, channel, message);

          jsonRpcId = Object.keys(ws._messageHandlers)[0];

          expectedJsonRpc = JSON.stringify({
            jsonrpc: '2.0',
            method: 'MessageBus.Publish',
            params: {
              service_id: serviceId,
              channel,
              message
            },
            id: jsonRpcId
          });
        });

        it('sends a message to the message bus', function() {
          expect(send).to.be.calledWith(expectedJsonRpc);
        });

        it('creates an onmessage handler', function() {
          expect(ws._messageHandlers[jsonRpcId]).to.be.a('function');
        });

        context('on a successful message', function() {
          context('when publish succeeds', function() {
            beforeEach(function() {
              ws._messageHandlers[jsonRpcId]({
                jsonrpc: '2.0',
                id: jsonRpcId,
                result: null
              });
            });

            it('fulfills the promise', function() {
              expect(promise).to.be.fulfilled;
            });

            it('tears down the on message handler', function() {
              return promise.then(function() {
                expect(ws._messageHandlers[jsonRpcId]).to.be.undefined;
              });
            });
          });

          context('when publish fails', function() {
            let expectedMessage;

            beforeEach(function() {
              expectedMessage = {
                jsonrpc: '2.0',
                id: jsonRpcId,
                error: {
                  status: 500,
                  message: 'publish failed'
                }
              };

              ws._messageHandlers[jsonRpcId](expectedMessage);
            });

            it('rejects the promise with the publication error', function() {
              return expect(promise).to.be.rejectedWith(expectedMessage.error);
            });

            it('tears down the on message handler', function() {
              return promise.catch(function() {
                expect(ws._messageHandlers[jsonRpcId]).to.be.undefined;
              });
            });
          });

          context(
            'when receiving a different message than the expected message (i.e. the message does not have a matching jsonRpcId)',
            function() {
              let clock;
              let expectedMessage;
              let resolvedIndicator;
              let waitTime;

              beforeEach(function() {
                clock = sinon.useFakeTimers();
                expectedMessage = {
                  jsonrpc: '2.0',
                  id: faker.random.uuid(),
                  result: null
                };
                resolvedIndicator = Symbol(faker.hacker.noun());
                serviceId = faker.random.uuid();
                waitTime = 1 * 60 * 1000; // 1 minute

                promise = Promise.race([
                  ws.publish(serviceId, channel, expectedMessage),
                  new Promise((resolve, reject) => {
                    setTimeout(resolve, waitTime, resolvedIndicator);
                  })
                ]);

                ws._messageHandlers[jsonRpcId]({
                  jsonrpc: '2.0',
                  id: faker.random.uuid(),
                  result: null
                });
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
      }
    );

    context('when the websocket is null', function() {
      let channel;
      let expectedOrganization;
      let jsonRpcId;
      let message;
      let promise;
      let send;
      let serviceId;
      let ws;

      beforeEach(function() {
        channel = faker.random.word();
        expectedOrganization = fixture.build('organization');
        message = {
          example: 1
        };
        send = this.sandbox.spy(expectedWebSocket, 'send');
        serviceId = faker.random.uuid();

        ws = new WebSocketConnection(null, expectedOrganization.id);

        promise = ws.publish(serviceId, channel, message);

        jsonRpcId = Object.keys(ws._messageHandlers)[0];
      });

      it('does not send a message to the message bus', function() {
        return promise.catch(function() {
          expect(send).to.not.be.called;
        });
      });

      it('rejects the promise', function() {
        return expect(promise).to.be.rejectedWith(
          'WebSocket connection not open'
        );
      });

      it('does not create the on message handler', function() {
        return promise.catch(function() {
          expect(ws._messageHandlers[jsonRpcId]).to.be.undefined;
        });
      });
    });

    context('when the websocket is not open', function() {
      let channel;
      let expectedOrganization;
      let jsonRpcId;
      let message;
      let promise;
      let send;
      let serviceId;
      let ws;

      beforeEach(function(done) {
        channel = faker.random.word();
        expectedOrganization = fixture.build('organization');
        message = {
          example: 1
        };
        send = this.sandbox.spy(expectedWebSocket, 'send');
        serviceId = faker.random.uuid();

        ws = new WebSocketConnection(
          expectedWebSocket,
          expectedOrganization.id
        );

        ws.close();

        expectedWebSocket.onclose = () => {
          promise = ws.publish(serviceId, channel, message);
          jsonRpcId = Object.keys(ws._messageHandlers)[0];
          done();
        };
      });

      it('does not send a message to the message bus', function() {
        return promise.catch(function() {
          expect(send).to.not.be.called;
        });
      });

      it('rejects the promise', function() {
        return expect(promise).to.be.rejectedWith(
          'WebSocket connection not open'
        );
      });

      it('does not create the on message handler', function() {
        return promise.catch(function() {
          expect(ws._messageHandlers[jsonRpcId]).to.be.undefined;
        });
      });
    });

    context('when there is not a service id sent', function() {
      let channel;
      let expectedOrganization;
      let jsonRpcId;
      let message;
      let promise;
      let send;
      let serviceId;
      let ws;

      beforeEach(function() {
        channel = faker.random.word();
        expectedOrganization = fixture.build('organization');
        message = {
          example: 1
        };
        send = this.sandbox.spy(expectedWebSocket, 'send');
        serviceId = null;

        ws = new WebSocketConnection(
          expectedWebSocket,
          expectedOrganization.id
        );

        promise = ws.publish(serviceId, channel, message);

        jsonRpcId = Object.keys(ws._messageHandlers)[0];
      });

      it('does not send a message to the message bus', function() {
        return promise.catch(function() {
          expect(send).to.not.be.called;
        });
      });

      it('rejects the promise', function() {
        return expect(promise).to.be.rejectedWith(
          'A service client id is required for publishing'
        );
      });

      it('does not create the on message handler', function() {
        return promise.catch(function() {
          expect(ws._messageHandlers[jsonRpcId]).to.be.undefined;
        });
      });
    });

    context('when there is not a channel sent', function() {
      let channel;
      let expectedOrganization;
      let jsonRpcId;
      let message;
      let promise;
      let send;
      let serviceId;
      let ws;

      beforeEach(function() {
        channel = null;
        expectedOrganization = fixture.build('organization');
        message = {
          example: 1
        };
        send = this.sandbox.spy(expectedWebSocket, 'send');
        serviceId = faker.random.uuid();

        ws = new WebSocketConnection(
          expectedWebSocket,
          expectedOrganization.id
        );

        promise = ws.publish(serviceId, channel, message);

        jsonRpcId = Object.keys(ws._messageHandlers)[0];
      });

      it('does not send a message to the message bus', function() {
        return promise.catch(function() {
          expect(send).to.not.be.called;
        });
      });

      it('rejects the promise', function() {
        return expect(promise).to.be.rejectedWith(
          'A channel is required for publishing'
        );
      });

      it('does not create the on message handler', function() {
        return promise.catch(function() {
          expect(ws._messageHandlers[jsonRpcId]).to.be.undefined;
        });
      });
    });

    context('when there is not a message sent', function() {
      let channel;
      let expectedOrganization;
      let jsonRpcId;
      let message;
      let promise;
      let send;
      let serviceId;
      let ws;

      beforeEach(function() {
        channel = faker.random.word();
        expectedOrganization = fixture.build('organization');
        message = null;
        send = this.sandbox.spy(expectedWebSocket, 'send');
        serviceId = faker.random.uuid();

        ws = new WebSocketConnection(
          expectedWebSocket,
          expectedOrganization.id
        );

        promise = ws.publish(serviceId, channel, message);

        jsonRpcId = Object.keys(ws._messageHandlers)[0];
      });

      it('does not send a message to the message bus', function() {
        return promise.catch(function() {
          expect(send).to.not.be.called;
        });
      });

      it('rejects the promise', function() {
        return expect(promise).to.be.rejectedWith(
          'A message is required for publishing'
        );
      });

      it('does not create the on message handler', function() {
        return promise.catch(function() {
          expect(ws._messageHandlers[jsonRpcId]).to.be.undefined;
        });
      });
    });
  });
});

import { Server, WebSocket } from 'mock-socket';
import WebSocketConnection from './webSocketConnection';

const DELAY = 5;

describe('Bus/WebSocketConnection', function() {
  let expectedWebSocket;
  let webSocketServer;
  let webSocketUrl;

  beforeEach(function(done) {
    webSocketUrl = `wss://${faker.internet.domainName()}`;
    webSocketServer = new Server(webSocketUrl);
    expectedWebSocket = new WebSocket(webSocketUrl);

    // Wait to allow `mock-socket` to set everything up
    setTimeout(done, DELAY);
  });

  afterEach(function() {
    sinon.restore();
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
          send = sinon.spy(expectedWebSocket, 'send');
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
        send = sinon.spy(expectedWebSocket, 'send');
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
        send = sinon.spy(expectedWebSocket, 'send');
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
        send = sinon.spy(expectedWebSocket, 'send');

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

      close = sinon.stub(expectedWebSocket, 'close');

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
        [faker.random.uuid()]: sinon.stub()
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
            [expectedUUID]: sinon.stub()
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
          [expectedUUID]: sinon.stub()
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
          send = sinon.spy(expectedWebSocket, 'send');
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
        send = sinon.spy(expectedWebSocket, 'send');
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
        send = sinon.spy(expectedWebSocket, 'send');
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
        send = sinon.spy(expectedWebSocket, 'send');
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
        send = sinon.spy(expectedWebSocket, 'send');
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
        send = sinon.spy(expectedWebSocket, 'send');
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

  describe('subscribe', function() {
    context(
      'when there is a serviceClientId, channel, group, and the websocket connection is open',
      function() {
        let channel;
        let expectedOrganization;
        let expectedJsonRpc;
        let group;
        let jsonRpcId;
        let promise;
        let send;
        let serviceId;
        let ws;

        beforeEach(function() {
          channel = faker.random.word();
          group = faker.random.word();
          expectedOrganization = fixture.build('organization');
          send = sinon.spy(expectedWebSocket, 'send');
          serviceId = faker.random.uuid();

          ws = new WebSocketConnection(
            expectedWebSocket,
            expectedOrganization.id
          );

          promise = ws.subscribe(serviceId, channel, group, () => {}, () => {});

          jsonRpcId = Object.keys(ws._messageHandlers)[0];

          expectedJsonRpc = JSON.stringify({
            jsonrpc: '2.0',
            method: 'MessageBus.Subscribe',
            params: {
              service_id: serviceId,
              channel,
              group
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
          context('when subscribe succeeds', function() {
            let subscription;

            beforeEach(function() {
              subscription = faker.random.uuid();
              ws._messageHandlers[jsonRpcId]({
                jsonrpc: '2.0',
                id: jsonRpcId,
                result: {
                  subscription
                }
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

            it('creates a handler for the subscription', function() {
              return promise.then(function() {
                expect(ws._messageHandlers[subscription]).to.be.a('function');
              });
            });
          });

          context('when subscribe fails', function() {
            let expectedMessage;

            beforeEach(function() {
              expectedMessage = {
                jsonrpc: '2.0',
                id: jsonRpcId,
                error: {
                  status: 500,
                  message: 'subscribe failed'
                }
              };

              ws._messageHandlers[jsonRpcId](expectedMessage);
            });

            it('rejects the promise with the subscription error', function() {
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
              let resolvedIndicator;
              let subscription;
              let waitTime;

              beforeEach(function() {
                clock = sinon.useFakeTimers();
                subscription = faker.random.uuid();
                resolvedIndicator = Symbol(faker.hacker.noun());
                serviceId = faker.random.uuid();
                waitTime = 1 * 60 * 1000; // 1 minute

                promise = Promise.race([
                  ws.subscribe(serviceId, channel, group, () => {}, () => {}),
                  new Promise((resolve, reject) => {
                    setTimeout(resolve, waitTime, resolvedIndicator);
                  })
                ]);

                ws._messageHandlers[jsonRpcId]({
                  jsonrpc: '2.0',
                  id: faker.random.uuid(),
                  result: {
                    subscription
                  }
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
      let group;
      let jsonRpcId;
      let promise;
      let send;
      let serviceId;
      let ws;

      beforeEach(function() {
        channel = faker.random.word();
        expectedOrganization = fixture.build('organization');
        group = faker.random.word();
        send = sinon.spy(expectedWebSocket, 'send');
        serviceId = faker.random.uuid();

        ws = new WebSocketConnection(null, expectedOrganization.id);

        promise = ws.subscribe(serviceId, channel, group, () => {}, () => {});

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
      let group;
      let jsonRpcId;
      let promise;
      let send;
      let serviceId;
      let ws;

      beforeEach(function(done) {
        channel = faker.random.word();
        expectedOrganization = fixture.build('organization');
        group = faker.random.word();
        send = sinon.spy(expectedWebSocket, 'send');
        serviceId = faker.random.uuid();

        ws = new WebSocketConnection(
          expectedWebSocket,
          expectedOrganization.id
        );

        ws.close();

        expectedWebSocket.onclose = () => {
          promise = ws.subscribe(serviceId, channel, group, () => {}, () => {});
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
      let group;
      let jsonRpcId;
      let promise;
      let send;
      let serviceId;
      let ws;

      beforeEach(function() {
        channel = faker.random.word();
        expectedOrganization = fixture.build('organization');
        group = faker.random.word();
        send = sinon.spy(expectedWebSocket, 'send');
        serviceId = null;

        ws = new WebSocketConnection(
          expectedWebSocket,
          expectedOrganization.id
        );

        promise = ws.subscribe(serviceId, channel, group, () => {}, () => {});

        jsonRpcId = Object.keys(ws._messageHandlers)[0];
      });

      it('does not send a message to the message bus', function() {
        return promise.catch(function() {
          expect(send).to.not.be.called;
        });
      });

      it('rejects the promise', function() {
        return expect(promise).to.be.rejectedWith(
          'A service client id is required for subscribing'
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
      let group;
      let jsonRpcId;
      let promise;
      let send;
      let serviceId;
      let ws;

      beforeEach(function() {
        channel = null;
        expectedOrganization = fixture.build('organization');
        group = faker.random.word();
        send = sinon.spy(expectedWebSocket, 'send');
        serviceId = faker.random.uuid();

        ws = new WebSocketConnection(
          expectedWebSocket,
          expectedOrganization.id
        );

        promise = ws.subscribe(serviceId, channel, group, () => {}, () => {});

        jsonRpcId = Object.keys(ws._messageHandlers)[0];
      });

      it('does not send a message to the message bus', function() {
        return promise.catch(function() {
          expect(send).to.not.be.called;
        });
      });

      it('rejects the promise', function() {
        return expect(promise).to.be.rejectedWith(
          'A channel is required for subscribing'
        );
      });

      it('does not create the on message handler', function() {
        return promise.catch(function() {
          expect(ws._messageHandlers[jsonRpcId]).to.be.undefined;
        });
      });
    });

    context('when there is not a group', function() {
      let channel;
      let expectedJsonRpc;
      let expectedOrganization;
      let group;
      let jsonRpcId;
      let send;
      let serviceId;
      let ws;

      beforeEach(function() {
        channel = faker.random.word();
        expectedOrganization = fixture.build('organization');
        group = null;
        send = sinon.spy(expectedWebSocket, 'send');
        serviceId = faker.random.uuid();

        ws = new WebSocketConnection(
          expectedWebSocket,
          expectedOrganization.id
        );

        ws.subscribe(serviceId, channel, group, () => {}, () => {});

        jsonRpcId = Object.keys(ws._messageHandlers)[0];

        expectedJsonRpc = JSON.stringify({
          jsonrpc: '2.0',
          method: 'MessageBus.Subscribe',
          params: {
            service_id: serviceId,
            channel
          },
          id: jsonRpcId
        });
      });

      it('sends a message to the message bus', function() {
        expect(send).to.be.calledWith(expectedJsonRpc);
      });
    });

    context('when there is not a message handler', function() {
      let channel;
      let expectedOrganization;
      let group;
      let promise;
      let serviceId;
      let ws;

      context('with a group', function() {
        beforeEach(function() {
          channel = faker.random.word();
          expectedOrganization = fixture.build('organization');
          group = null;
          serviceId = faker.random.uuid();

          ws = new WebSocketConnection(
            expectedWebSocket,
            expectedOrganization.id
          );

          promise = ws.subscribe(serviceId, channel, group);
        });

        it('rejects with a missing error handler message', function() {
          expect(promise).to.be.rejectedWith(
            'A message handler is required for subscribing'
          );
        });
      });

      context('without a group', function() {
        beforeEach(function() {
          channel = faker.random.word();
          expectedOrganization = fixture.build('organization');
          group = null;
          serviceId = faker.random.uuid();

          ws = new WebSocketConnection(
            expectedWebSocket,
            expectedOrganization.id
          );

          promise = ws.subscribe(serviceId, channel);
        });

        it('rejects with a missing error handler message', function() {
          expect(promise).to.be.rejectedWith(
            'A message handler is required for subscribing'
          );
        });
      });
    });

    context('when there is not an error handler', function() {
      let channel;
      let expectedOrganization;
      let group;
      let promise;
      let serviceId;
      let ws;

      context('with a group', function() {
        beforeEach(function() {
          channel = faker.random.word();
          expectedOrganization = fixture.build('organization');
          group = null;
          serviceId = faker.random.uuid();

          ws = new WebSocketConnection(
            expectedWebSocket,
            expectedOrganization.id
          );

          promise = ws.subscribe(serviceId, channel, group, () => {});
        });

        it('rejects with a missing error handler message', function() {
          expect(promise).to.be.rejectedWith(
            'An error handler is required for subscribing'
          );
        });
      });

      context('without a group', function() {
        beforeEach(function() {
          channel = faker.random.word();
          expectedOrganization = fixture.build('organization');
          group = null;
          serviceId = faker.random.uuid();

          ws = new WebSocketConnection(
            expectedWebSocket,
            expectedOrganization.id
          );

          promise = ws.subscribe(serviceId, channel, () => {});
        });

        it('rejects with a missing error handler message', function() {
          expect(promise).to.be.rejectedWith(
            'An error handler is required for subscribing'
          );
        });
      });
    });

    context('when a message is received', function() {
      let acknowledge;
      let channel;
      let expectedOrganization;
      let group;
      let handler;
      let jsonRpcId;
      let message;
      let promise;
      let serviceId;
      let subscription;
      let ws;

      beforeEach(function() {
        channel = faker.random.word();
        expectedOrganization = fixture.build('organization');
        group = null;
        handler = sinon.stub().returns(null);
        serviceId = faker.random.uuid();
        message = faker.random.word();
        subscription = faker.random.uuid();

        ws = new WebSocketConnection(
          expectedWebSocket,
          expectedOrganization.id
        );
        acknowledge = sinon.stub(ws, '_acknowledge').resolves();
      });

      context('with a group', function() {
        context(
          'and the handler completes successfully inline without calling the ack',
          function() {
            beforeEach(function() {
              handler = sinon.stub().returns(null);

              promise = ws.subscribe(
                serviceId,
                channel,
                group,
                handler,
                () => {}
              );

              jsonRpcId = Object.keys(ws._messageHandlers)[0];

              ws._messageHandlers[jsonRpcId]({
                result: {
                  subscription
                }
              });
            });

            it('calls the handler with the message', function() {
              return promise
                .then(() => {
                  return ws._messageHandlers[subscription]({
                    result: {
                      body: message
                    }
                  });
                })
                .then(() => {
                  expect(handler).to.be.calledWith(message);
                });
            });

            it('calls acknowledge automatically', function() {
              return promise
                .then(() => {
                  return ws._messageHandlers[subscription]({
                    result: {
                      body: message
                    }
                  });
                })
                .then(() => {
                  expect(acknowledge).to.be.calledOnce;
                });
            });
          }
        );

        context(
          'and the handler completes successfully inline while calling the ack',
          function() {
            beforeEach(function() {
              handler = sinon.stub().callsFake(function(m, a) {
                a();
              });

              promise = ws.subscribe(
                serviceId,
                channel,
                group,
                handler,
                () => {}
              );

              jsonRpcId = Object.keys(ws._messageHandlers)[0];

              ws._messageHandlers[jsonRpcId]({
                result: {
                  subscription
                }
              });
            });

            it('calls acknowledge once', function() {
              return promise
                .then(() => {
                  return ws._messageHandlers[subscription]({
                    result: {
                      body: message
                    }
                  });
                })
                .then(() => {
                  expect(acknowledge).to.be.calledOnce;
                });
            });
          }
        );

        context(
          'and the handler completes successfully as a promise',
          function() {
            beforeEach(function() {
              handler = sinon.stub().callsFake(function(m, a) {
                return Promise.resolve(null);
              });

              promise = ws.subscribe(
                serviceId,
                channel,
                group,
                handler,
                () => {}
              );

              jsonRpcId = Object.keys(ws._messageHandlers)[0];

              ws._messageHandlers[jsonRpcId]({
                result: {
                  subscription
                }
              });
            });

            it('calls acknowledge automatically', function() {
              return promise
                .then(() => {
                  return ws._messageHandlers[subscription]({
                    result: {
                      body: message
                    }
                  });
                })
                .then(() => {
                  expect(acknowledge).to.be.calledOnce;
                });
            });
          }
        );

        context(
          'and the handler completes successfully as a promise while calling the ack',
          function() {
            beforeEach(function() {
              handler = sinon.stub().callsFake(function(m, a) {
                return new Promise((resolve, reject) => {
                  a();

                  resolve();
                });
              });

              promise = ws.subscribe(
                serviceId,
                channel,
                group,
                handler,
                () => {}
              );

              jsonRpcId = Object.keys(ws._messageHandlers)[0];

              ws._messageHandlers[jsonRpcId]({
                result: {
                  subscription
                }
              });
            });

            it('calls acknowledge once', function() {
              return promise
                .then(() => {
                  return ws._messageHandlers[subscription]({
                    result: {
                      body: message
                    }
                  });
                })
                .then(() => {
                  expect(acknowledge).to.be.calledOnce;
                });
            });
          }
        );

        context('and the handler throws an error', function() {
          beforeEach(function() {
            handler = sinon.stub().callsFake(function(m, a) {
              throw Error();
            });

            promise = ws.subscribe(
              serviceId,
              channel,
              group,
              handler,
              () => {}
            );

            jsonRpcId = Object.keys(ws._messageHandlers)[0];

            ws._messageHandlers[jsonRpcId]({
              result: {
                subscription
              }
            });
          });

          it('does not call acknowledge', function() {
            return promise
              .then(() => {
                return ws._messageHandlers[subscription]({
                  result: {
                    body: message
                  }
                });
              })
              .catch(() => {
                expect(acknowledge).to.not.be.calledOnce;
              });
          });
        });

        context('and the handler throws an error in a promise', function() {
          beforeEach(function() {
            handler = sinon.stub().callsFake(function(m, a) {
              return new Promise((resolve, reject) => {
                reject(Error());
              });
            });

            promise = ws.subscribe(
              serviceId,
              channel,
              group,
              handler,
              () => {}
            );

            jsonRpcId = Object.keys(ws._messageHandlers)[0];

            ws._messageHandlers[jsonRpcId]({
              result: {
                subscription
              }
            });
          });

          it('does not call acknowledge', function() {
            return promise
              .then(() => {
                return ws._messageHandlers[subscription]({
                  result: {
                    body: message
                  }
                });
              })
              .catch(() => {
                expect(acknowledge).to.not.be.calledOnce;
              });
          });
        });

        context(
          'and the handler throws an error but acknowledges before it',
          function() {
            beforeEach(function() {
              handler = sinon.stub().callsFake(function(m, a) {
                a();

                throw Error();
              });

              promise = ws.subscribe(
                serviceId,
                channel,
                group,
                handler,
                () => {}
              );

              jsonRpcId = Object.keys(ws._messageHandlers)[0];

              ws._messageHandlers[jsonRpcId]({
                result: {
                  subscription
                }
              });
            });

            it('calls acknowledge once', function() {
              return promise
                .then(() => {
                  return ws._messageHandlers[subscription]({
                    result: {
                      body: message
                    }
                  });
                })
                .catch(() => {
                  expect(acknowledge).to.be.calledOnce;
                });
            });
          }
        );

        context(
          'and the handler throws an error in a promise but acknowledges before it',
          function() {
            beforeEach(function() {
              handler = sinon.stub().callsFake(function(m, a) {
                return new Promise((resolve, reject) => {
                  a();
                  reject(Error());
                });
              });

              promise = ws.subscribe(
                serviceId,
                channel,
                group,
                handler,
                () => {}
              );

              jsonRpcId = Object.keys(ws._messageHandlers)[0];

              ws._messageHandlers[jsonRpcId]({
                result: {
                  subscription
                }
              });
            });

            it('calls acknowledge once', function() {
              return promise
                .then(() => {
                  return ws._messageHandlers[subscription]({
                    result: {
                      body: message
                    }
                  });
                })
                .catch(() => {
                  expect(acknowledge).to.be.calledOnce;
                });
            });
          }
        );

        context('and the message is an error', function() {
          let errorHandler;

          beforeEach(function() {
            handler = sinon.stub().returns(null);
            errorHandler = sinon.stub().returns(null);

            promise = ws.subscribe(
              serviceId,
              channel,
              group,
              handler,
              errorHandler
            );

            jsonRpcId = Object.keys(ws._messageHandlers)[0];

            ws._messageHandlers[jsonRpcId]({
              result: {
                subscription
              }
            });
          });

          it('calls the error handler', function() {
            return promise
              .then(() => {
                return ws._messageHandlers[subscription]({
                  result: {
                    error: message
                  }
                });
              })
              .catch(() => {
                expect(errorHandler).to.be.calledOnce;
              });
          });

          it('does not automatically call acknowledge', function() {
            return promise
              .then(() => {
                return ws._messageHandlers[subscription]({
                  result: {
                    error: message
                  }
                });
              })
              .catch(() => {
                expect(acknowledge).to.not.be.called;
              });
          });
        });
      });

      context('without a group', function() {
        context(
          'and the handler completes successfully inline without calling the ack',
          function() {
            beforeEach(function() {
              handler = sinon.stub().returns(null);

              promise = ws.subscribe(serviceId, channel, handler, () => {});

              jsonRpcId = Object.keys(ws._messageHandlers)[0];

              ws._messageHandlers[jsonRpcId]({
                result: {
                  subscription
                }
              });
            });

            it('calls the handler with the message', function() {
              return promise
                .then(() => {
                  return ws._messageHandlers[subscription]({
                    result: {
                      body: message
                    }
                  });
                })
                .then(() => {
                  expect(handler).to.be.calledWith(message);
                });
            });

            it('calls acknowledge automatically', function() {
              return promise
                .then(() => {
                  return ws._messageHandlers[subscription]({
                    result: {
                      body: message
                    }
                  });
                })
                .then(() => {
                  expect(acknowledge).to.be.calledOnce;
                });
            });
          }
        );

        context(
          'and the handler completes successfully inline while calling the ack',
          function() {
            beforeEach(function() {
              handler = sinon.stub().callsFake(function(m, a) {
                a();
              });

              promise = ws.subscribe(serviceId, channel, handler, () => {});

              jsonRpcId = Object.keys(ws._messageHandlers)[0];

              ws._messageHandlers[jsonRpcId]({
                result: {
                  subscription
                }
              });
            });

            it('calls acknowledge once', function() {
              return promise
                .then(() => {
                  return ws._messageHandlers[subscription]({
                    result: {
                      body: message
                    }
                  });
                })
                .then(() => {
                  expect(acknowledge).to.be.calledOnce;
                });
            });
          }
        );

        context(
          'and the handler completes successfully as a promise',
          function() {
            beforeEach(function() {
              handler = sinon.stub().callsFake(function(m, a) {
                return Promise.resolve(null);
              });

              promise = ws.subscribe(serviceId, channel, handler, () => {});

              jsonRpcId = Object.keys(ws._messageHandlers)[0];

              ws._messageHandlers[jsonRpcId]({
                result: {
                  subscription
                }
              });
            });

            it('calls acknowledge automatically', function() {
              return promise
                .then(() => {
                  return ws._messageHandlers[subscription]({
                    result: {
                      body: message
                    }
                  });
                })
                .then(() => {
                  expect(acknowledge).to.be.calledOnce;
                });
            });
          }
        );

        context(
          'and the handler completes successfully as a promise while calling the ack',
          function() {
            beforeEach(function() {
              handler = sinon.stub().callsFake(function(m, a) {
                return new Promise((resolve, reject) => {
                  a();

                  resolve();
                });
              });

              promise = ws.subscribe(serviceId, channel, handler, () => {});

              jsonRpcId = Object.keys(ws._messageHandlers)[0];

              ws._messageHandlers[jsonRpcId]({
                result: {
                  subscription
                }
              });
            });

            it('calls acknowledge once', function() {
              return promise
                .then(() => {
                  return ws._messageHandlers[subscription]({
                    result: {
                      body: message
                    }
                  });
                })
                .then(() => {
                  expect(acknowledge).to.be.calledOnce;
                });
            });
          }
        );

        context('and the handler throws an error', function() {
          beforeEach(function() {
            handler = sinon.stub().callsFake(function(m, a) {
              throw Error();
            });

            promise = ws.subscribe(serviceId, channel, handler, () => {});

            jsonRpcId = Object.keys(ws._messageHandlers)[0];

            ws._messageHandlers[jsonRpcId]({
              result: {
                subscription
              }
            });
          });

          it('does not call acknowledge', function() {
            return promise
              .then(() => {
                return ws._messageHandlers[subscription]({
                  result: {
                    body: message
                  }
                });
              })
              .catch(() => {
                expect(acknowledge).to.not.be.calledOnce;
              });
          });
        });

        context('and the handler throws an error in a promise', function() {
          beforeEach(function() {
            handler = sinon.stub().callsFake(function(m, a) {
              return new Promise((resolve, reject) => {
                reject(Error());
              });
            });

            promise = ws.subscribe(serviceId, channel, handler, () => {});

            jsonRpcId = Object.keys(ws._messageHandlers)[0];

            ws._messageHandlers[jsonRpcId]({
              result: {
                subscription
              }
            });
          });

          it('does not call acknowledge', function() {
            return promise
              .then(() => {
                return ws._messageHandlers[subscription]({
                  result: {
                    body: message
                  }
                });
              })
              .catch(() => {
                expect(acknowledge).to.not.be.calledOnce;
              });
          });
        });

        context(
          'and the handler throws an error but acknowledges before it',
          function() {
            beforeEach(function() {
              handler = sinon.stub().callsFake(function(m, a) {
                a();

                throw Error();
              });

              promise = ws.subscribe(serviceId, channel, handler, () => {});

              jsonRpcId = Object.keys(ws._messageHandlers)[0];

              ws._messageHandlers[jsonRpcId]({
                result: {
                  subscription
                }
              });
            });

            it('calls acknowledge once', function() {
              return promise
                .then(() => {
                  return ws._messageHandlers[subscription]({
                    result: {
                      body: message
                    }
                  });
                })
                .catch(() => {
                  expect(acknowledge).to.be.calledOnce;
                });
            });
          }
        );

        context(
          'and the handler throws an error in a promise but acknowledges before it',
          function() {
            beforeEach(function() {
              handler = sinon.stub().callsFake(function(m, a) {
                return new Promise((resolve, reject) => {
                  a();
                  reject(Error());
                });
              });

              promise = ws.subscribe(serviceId, channel, handler, () => {});

              jsonRpcId = Object.keys(ws._messageHandlers)[0];

              ws._messageHandlers[jsonRpcId]({
                result: {
                  subscription
                }
              });
            });

            it('calls acknowledge once', function() {
              return promise
                .then(() => {
                  return ws._messageHandlers[subscription]({
                    result: {
                      body: message
                    }
                  });
                })
                .catch(() => {
                  expect(acknowledge).to.be.calledOnce;
                });
            });
          }
        );

        context('and the message is an error', function() {
          let errorHandler;

          beforeEach(function() {
            handler = sinon.stub().returns(null);
            errorHandler = sinon.stub().returns(null);

            promise = ws.subscribe(serviceId, channel, handler, errorHandler);

            jsonRpcId = Object.keys(ws._messageHandlers)[0];

            ws._messageHandlers[jsonRpcId]({
              result: {
                subscription
              }
            });
          });

          it('is fulfilled', function() {
            expect(
              promise.then(() => {
                return ws._messageHandlers[subscription]({
                  error: message
                });
              })
            ).to.be.fulfilled;
          });

          it('resolves with the results of the error handler', function() {
            expect(
              promise.then(() => {
                return ws._messageHandlers[subscription]({
                  error: message
                });
              })
            ).to.eventually.equal(errorHandler(message));
          });

          it('calls the error handler', function() {
            return promise
              .then(() => {
                return ws._messageHandlers[subscription]({
                  error: message
                });
              })
              .catch(() => {
                expect(errorHandler).to.be.calledOnce;
              });
          });

          it('does not automatically call acknowledge', function() {
            return promise
              .then(() => {
                return ws._messageHandlers[subscription]({
                  error: message
                });
              })
              .catch(() => {
                expect(acknowledge).to.not.be.called;
              });
          });
        });
      });
    });
  });

  describe('acknowledge', function() {
    context(
      'when there is a messageId and the websocket connection is open',
      function() {
        let expectedOrganization;
        let expectedJsonRpc;
        let jsonRpcId;
        let messageId;
        let send;
        let ws;

        beforeEach(function() {
          expectedOrganization = fixture.build('organization');
          send = sinon.spy(expectedWebSocket, 'send');
          messageId = faker.random.uuid();

          ws = new WebSocketConnection(
            expectedWebSocket,
            expectedOrganization.id
          );

          ws._acknowledge(messageId);

          jsonRpcId = Object.keys(ws._messageHandlers)[0];

          expectedJsonRpc = JSON.stringify({
            jsonrpc: '2.0',
            method: 'MessageBus.Acknowledge',
            params: {
              message_id: messageId
            },
            id: jsonRpcId
          });
        });

        it('sends a message to the message bus', function() {
          expect(send).to.be.calledWith(expectedJsonRpc);
        });
      }
    );

    context(
      'when there is a messageId and the websocket connection is closed',
      function() {
        let expectedOrganization;
        let messageId;
        let promise;
        let send;
        let ws;

        beforeEach(function() {
          expectedOrganization = fixture.build('organization');
          send = sinon.spy(expectedWebSocket, 'send');
          messageId = faker.random.uuid();

          ws = new WebSocketConnection(
            expectedWebSocket,
            expectedOrganization.id
          );
          sinon.stub(ws, '_isConnected').returns(false);

          promise = ws._acknowledge(messageId);
        });

        it('does not send a message to the message bus', function() {
          return promise.catch(function() {
            expect(send).to.not.be.called;
          });
        });

        it('rejects with an error', function() {
          return expect(promise).to.be.rejectedWith(
            'WebSocket connection not open'
          );
        });
      }
    );

    context('when the websocket returns an error', function() {
      let expectedOrganization;
      let jsonRpcId;
      let messageId;
      let promise;
      let send;
      let ws;

      beforeEach(function() {
        expectedOrganization = fixture.build('organization');
        send = sinon.spy(expectedWebSocket, 'send');
        messageId = faker.random.uuid();

        ws = new WebSocketConnection(
          expectedWebSocket,
          expectedOrganization.id
        );

        promise = ws._acknowledge(messageId);

        jsonRpcId = Object.keys(ws._messageHandlers)[0];

        ws._messageHandlers[jsonRpcId]({
          error: 'message not acknowledged'
        });
      });

      it('sends a message to the message bus', function() {
        return promise.catch(function() {
          expect(send).to.be.calledOnce;
        });
      });

      it('rejects with an error', function() {
        return expect(promise).to.be.rejectedWith('message not acknowledged');
      });
    });
  });
});

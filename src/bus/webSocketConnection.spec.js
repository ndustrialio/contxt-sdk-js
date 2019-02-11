import { WebSocket } from 'mock-socket';
import WebScoketConnection from './webSocketConnection';

describe('WebScoketConnection', function() {
  let expectedWebSocket;
  let webSocketUrl;

  beforeEach(function() {
    this.sandbox = sandbox.create();

    webSocketUrl = `wss://${faker.internet.domainName()}`;
    expectedWebSocket = new WebSocket(webSocketUrl);
  });

  afterEach(function() {
    this.sandbox.restore();

    expectedWebSocket.close();
  });

  describe('constructor', function() {
    let expectedOrganization;
    let ws;

    beforeEach(function() {
      expectedOrganization = fixture.build('organization');
      ws = new WebScoketConnection(expectedWebSocket, expectedOrganization.id);
    });

    it('sets a socket for the class instance', function() {
      expect(ws._webSocket).to.deep.equal(expectedWebSocket);
    });

    it('sets an organization id for the class instance', function() {
      expect(ws._organizationId).to.equal(expectedOrganization.id);
    });
  });

  describe('close', function() {
    let close;
    let expectedOrganization;
    let ws;

    beforeEach(function() {
      expectedOrganization = fixture.build('organization');

      close = this.sandbox.stub(expectedWebSocket, 'close');

      ws = new WebScoketConnection(expectedWebSocket, expectedOrganization.id);

      ws.close();
    });

    it('calls close on the web socket', function() {
      expect(close).to.be.calledOnce;
    });
  });
});

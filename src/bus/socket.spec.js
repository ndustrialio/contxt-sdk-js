import { WebSocket } from 'mock-socket';
import Socket from './socket';

describe('Socket', function() {
  let socketUrl;
  let webSocket;

  beforeEach(function() {
    this.sandbox = sandbox.create();

    socketUrl = `wss://${faker.internet.domainName()}`;
    webSocket = new WebSocket(socketUrl);
  });

  afterEach(function() {
    this.sandbox.restore();

    webSocket.close();
  });

  describe('constructor', function() {
    let expectedOrganization;
    let socket;

    beforeEach(function() {
      expectedOrganization = fixture.build('organization');
      socket = new Socket(webSocket, expectedOrganization.id);
    });

    it('sets a socket for the class instance', function() {
      expect(socket._socket).to.deep.equal(webSocket);
    });

    it('sets an organization id for the class instance', function() {
      expect(socket._organizationId).to.equal(expectedOrganization.id);
    });

    it("returns a function called 'close'", function() {
      expect(socket.close).to.be.a('function');
    });
  });

  describe('close', function() {
    let close;
    let expectedOrganization;
    let socket;

    beforeEach(function() {
      close = this.sandbox.stub(webSocket, 'close');
      expectedOrganization = fixture.build('organization');
      socket = new Socket(webSocket, expectedOrganization.id);
      socket.close();
    });

    it('calls close on the web socket', function() {
      expect(close).to.be.calledOnce;
    });
  });
});

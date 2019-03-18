import WebSocketConnection from './webSocketConnection.browser';

describe('Bus/WebSocketConnection (Browser)', function() {
  describe('constructor', function() {
    it('throws an error when trying to instatiate a new instance', function() {
      expect(() => new WebSocketConnection()).to.throw(
        'The Message Bus is not currently supported in browser environments'
      );
    });
  });
});

import ContxtSdk from './index';

describe('ContxtSdk', function() {
  describe('constructor', function() {
    let contxtSdk;

    beforeEach(function() {
      contxtSdk = new ContxtSdk();
    });

    it('sets if it is an example to be true', function() {
      expect(contxtSdk.example).to.be.true;
    });
  });
});

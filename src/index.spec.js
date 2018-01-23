import ContxtSdk from './index';
import Request from './request';

describe('ContxtSdk', function() {
  describe('constructor', function() {
    let contxtSdk;

    beforeEach(function() {
      contxtSdk = new ContxtSdk();
    });

    it('sets an instance of Auth');

    it('sets an instance of Request', function() {
      expect(contxtSdk.request).to.be.an.instanceof(Request);
    });
  });
});

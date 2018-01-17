import NdustrialSdk from './index';

describe('NdustrialSdk', function() {
  describe('constructor', function() {
    let ndustrialSdk;

    beforeEach(function() {
      ndustrialSdk = new NdustrialSdk();
    });

    it('sets if it is an example to be true', function() {
      expect(ndustrialSdk.example).to.be.true;
    });
  });
});

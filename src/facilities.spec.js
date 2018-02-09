import Facilities from './facilities';
import Request from './request';

describe('Facilities', function() {
  let baseSdk;

  beforeEach(function() {
    this.sandbox = sandbox.create();

    baseSdk = {};
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  describe('constructor', function() {
    let facilities;

    beforeEach(function() {
      facilities = new Facilities(baseSdk);
    });

    it('sets an instance of Request', function() {
      expect(facilities._request).to.be.an.instanceof(Request);
    });

    it('appends the supplied sdk to the class instance', function() {
      expect(facilities._sdk).to.equal(baseSdk);
    });
  });

  describe('getAll', function() {
    let expectedFacilities;
    let get;
    let promise;

    beforeEach(function() {
      expectedFacilities = [faker.helpers.createTransaction()];

      const facilities = new Facilities();
      get = this.sandbox.stub(facilities._request, 'get').resolves({ data: expectedFacilities });

      promise = facilities.getAll();
    });

    it('gets a list of facilities from the server', function() {
      expect(get).to.be.calledWith('https://facilities.api.ndustrial.io/v1/facilities');
    });

    it('returns a list of facilities', function() {
      return expect(promise).to.be.fulfilled
        .and.to.eventually.equal(expectedFacilities);
    });
  });
});

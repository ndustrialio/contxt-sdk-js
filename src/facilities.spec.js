import Facilities from './facilities';

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

    it('appends the supplied sdk to the class instance', function() {
      expect(facilities._sdk).to.equal(baseSdk);
    });
  });

  describe('getAll', function() {
    let expectedFacilities;
    let promise;
    let sdk;

    beforeEach(function() {
      expectedFacilities = [faker.helpers.createTransaction()];

      sdk = {
        ...baseSdk,
        request: {
          get: this.sandbox.stub().callsFake(() => {
            return Promise.resolve({
              data: expectedFacilities
            });
          })
        }
      };

      const facilities = new Facilities(sdk);
      promise = facilities.getAll();
    });

    it('gets a list of facilities from the server', function() {
      expect(sdk.request.get).to.be.calledWith('https://facilities.api.ndustrial.io/v1/facilities');
    });

    it('returns a list of facilities', function() {
      return expect(promise).to.be.fulfilled
        .and.to.eventually.equal(expectedFacilities);
    });
  });
});

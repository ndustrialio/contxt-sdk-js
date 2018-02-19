import Facilities from './facilities';

describe('Facilities', function() {
  let baseRequest;
  let baseSdk;

  beforeEach(function() {
    this.sandbox = sandbox.create();

    baseRequest = {};
    baseSdk = {
      config: {
        audiences: {
          facilities: fixture.build('audience')
        }
      }
    };
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  describe('constructor', function() {
    let facilities;

    beforeEach(function() {
      facilities = new Facilities(baseSdk, baseRequest);
    });

    it('sets a base url for the class instance', function() {
      expect(facilities._baseUrl).to.equal(`${baseSdk.config.audiences.facilities.host}/v1`);
    });

    it('appends the supplied request module to the class instance', function() {
      expect(facilities._request).to.equal(baseRequest);
    });

    it('appends the supplied sdk to the class instance', function() {
      expect(facilities._sdk).to.equal(baseSdk);
    });
  });

  describe('getAll', function() {
    let expectedFacilities;
    let expectedHost;
    let promise;
    let request;

    beforeEach(function() {
      expectedFacilities = [faker.helpers.createTransaction()];
      expectedHost = faker.internet.url();
      request = {
        ...baseRequest,
        get: this.sandbox.stub().resolves({ data: expectedFacilities })
      };

      const facilities = new Facilities(baseSdk, request);
      facilities._baseUrl = expectedHost;

      promise = facilities.getAll();
    });

    it('gets a list of facilities from the server', function() {
      expect(request.get)
        .to.be.calledWith(`${expectedHost}/facilities`);
    });

    it('returns a list of facilities', function() {
      return expect(promise).to.be.fulfilled
        .and.to.eventually.equal(expectedFacilities);
    });
  });
});

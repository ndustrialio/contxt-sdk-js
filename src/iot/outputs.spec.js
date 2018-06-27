import Outputs from './outputs';

describe('Iot/Outputs', function() {
  let baseRequest;
  let baseSdk;
  let expectedHost;

  beforeEach(function() {
    this.sandbox = sandbox.create();

    baseRequest = {
      delete: this.sandbox.stub().resolves(),
      get: this.sandbox.stub().resolves(),
      post: this.sandbox.stub().resolves(),
      put: this.sandbox.stub().resolves()
    };
    baseSdk = {
      config: {
        audiences: {
          iot: fixture.build('audience')
        }
      }
    };
    expectedHost = faker.internet.url();
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  describe('constructor', function() {
    let outputs;

    beforeEach(function() {
      outputs = new Outputs(baseSdk, baseRequest, expectedHost);
    });

    it('sets a base url for the class instance', function() {
      expect(outputs._baseUrl).to.equal(expectedHost);
    });

    it('appends the supplied request module to the class instance', function() {
      expect(outputs._request).to.equal(baseRequest);
    });

    it('appends the supplied sdk to the class instance', function() {
      expect(outputs._sdk).to.equal(baseSdk);
    });
  });

  describe('getFieldData', function() {
    context('when all required information is provided', function() {
      let expectedFieldHumanName;
      let expectedOutputData;
      let expectedOutputId;
      let promise;
      let request;

      beforeEach(function() {
        expectedFieldHumanName = fixture.build('outputField').fieldHumanName;
        expectedOutputData = [];
        expectedOutputId = faker.random.number();

        request = {
          ...baseRequest,
          get: this.sandbox.stub().resolves(expectedOutputData)
        };
        const outputs = new Outputs(baseSdk, request);
        outputs._baseUrl = expectedHost;

        promise = outputs.getFieldData(
          expectedOutputId,
          expectedFieldHumanName
        );
      });

      it('gets the output field data from the server', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/outputs/${expectedOutputId}/fields/${expectedFieldHumanName}/data`
        );
      });

      it('returns the requested output data', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.equal(
          expectedOutputData
        );
      });
    });

    context('when there is missing required information', function() {
      it('throws an error when there is no provided output ID', function() {
        const { humanFieldName } = fixture.build('outputField');
        const outputs = new Outputs(baseSdk, baseRequest);
        const promise = outputs.getFieldData(null, humanFieldName);

        return expect(promise).to.be.rejectedWith(
          'An outputId is required for getting data about a specific output'
        );
      });

      it('throws an error when there is no provided output ID', function() {
        const outputs = new Outputs(baseSdk, baseRequest);
        const promise = outputs.getFieldData(faker.random.number(), null);

        return expect(promise).to.be.rejectedWith(
          "A fieldHumanName is required for getting a specific field's output data"
        );
      });
    });
  });
});

import Iot from './iot';
import * as iotUtils from './utils/iot';

describe('Iot', function() {
  let baseRequest;
  let baseSdk;
  let expectedHost;

  beforeEach(function() {
    this.sandbox = sandbox.create();

    baseRequest = {
      get: this.sandbox.stub().resolves()
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
    let iot;

    beforeEach(function() {
      iot = new Iot(baseSdk, baseRequest);
    });

    it('sets a base url for the class instance', function() {
      expect(iot._baseUrl).to.equal(`${baseSdk.config.audiences.iot.host}/v1`);
    });

    it('appends the supplied request module to the class instance', function() {
      expect(iot._request).to.equal(baseRequest);
    });

    it('appends the supplied sdk to the class instance', function() {
      expect(iot._sdk).to.equal(baseSdk);
    });
  });

  describe('getOutputField', function() {
    context('the output field ID is provided', function() {
      let expectedOutputField;
      let formatOutputFieldFromServer;
      let promise;
      let rawOutputField;
      let request;

      beforeEach(function() {
        expectedOutputField = fixture.build('outputField');
        rawOutputField = fixture.build('outputField', expectedOutputField, {
          fromServer: true
        });

        formatOutputFieldFromServer = this.sandbox
          .stub(iotUtils, 'formatOutputFieldFromServer')
          .returns(expectedOutputField);
        request = {
          ...baseRequest,
          get: this.sandbox.stub().resolves(rawOutputField)
        };

        const iot = new Iot(baseSdk, request);
        iot._baseUrl = expectedHost;

        promise = iot.getOutputField(expectedOutputField.id);
      });

      it('gets the output field from the server', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/fields/${expectedOutputField.id}`
        );
      });

      it('formats the output field', function() {
        return promise.then(() => {
          expect(formatOutputFieldFromServer).to.be.calledWith(rawOutputField);
        });
      });

      it('returns the requested output field', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.equal(
          expectedOutputField
        );
      });
    });

    context('the output field ID is not provided', function() {
      it('throws an error', function() {
        const iot = new Iot(baseSdk, baseRequest);
        const promise = iot.getOutputField();

        return expect(promise).to.be.rejectedWith(
          'An outputFieldId is required for getting information about an output field'
        );
      });
    });
  });

  describe('getOutputFieldData', function() {
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
        const iot = new Iot(baseSdk, request);
        iot._baseUrl = expectedHost;

        promise = iot.getOutputFieldData(
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
        const iot = new Iot(baseSdk, baseRequest);
        const promise = iot.getOutputFieldData(null, humanFieldName);

        return expect(promise).to.be.rejectedWith(
          'An outputId is required for getting data about a specific output'
        );
      });

      it('throws an error when there is no provided output ID', function() {
        const iot = new Iot(baseSdk, baseRequest);
        const promise = iot.getOutputFieldData(faker.random.number(), null);

        return expect(promise).to.be.rejectedWith(
          "A fieldHumanName is required for getting a specific field's output data"
        );
      });
    });
  });
});

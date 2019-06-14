import Outputs from './outputs';
import * as iotUtils from '../utils/iot';

describe('Iot/Outputs', function() {
  let baseRequest;
  let baseSdk;
  let expectedHost;

  beforeEach(function() {
    baseRequest = {
      delete: sinon.stub().resolves(),
      get: sinon.stub().resolves(),
      post: sinon.stub().resolves(),
      put: sinon.stub().resolves()
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
    sinon.restore();
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
      let expectedOptions;
      let expectedOutputFieldData;
      let expectedOutputId;
      let formatOutputFieldDataFromServer;
      let promise;
      let rawOutputFieldData;
      let request;

      beforeEach(function() {
        expectedFieldHumanName = fixture.build('outputField').fieldHumanName;
        expectedOptions = {
          limit: faker.random.number(),
          timeEnd: Math.floor(faker.date.recent().getTime() / 1000),
          timeStart: Math.floor(faker.date.past().getTime() / 1000),
          window: faker.random.arrayElement([0, 60, 900, 3600])
        };
        expectedOutputFieldData = {
          meta: { count: faker.random.number() },
          records: fixture.buildList(
            'outputFieldData',
            faker.random.number({ min: 1, max: 10 })
          )
        };
        expectedOutputId = faker.random.number();
        rawOutputFieldData = {
          meta: expectedOutputFieldData.meta,
          records: expectedOutputFieldData.records.map((record) =>
            fixture.build('outputFieldData', record, { fromServer: true })
          )
        };

        formatOutputFieldDataFromServer = sinon
          .stub(iotUtils, 'formatOutputFieldDataFromServer')
          .returns(expectedOutputFieldData);
        request = {
          ...baseRequest,
          get: sinon.stub().resolves(rawOutputFieldData)
        };
        const outputs = new Outputs(baseSdk, request);
        outputs._baseUrl = expectedHost;

        promise = outputs.getFieldData(
          expectedOutputId,
          expectedFieldHumanName,
          expectedOptions
        );
      });

      it('gets the output field data from the server', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/outputs/${expectedOutputId}/fields/${expectedFieldHumanName}/data`,
          { params: expectedOptions }
        );
      });

      it('formats the output field data', function() {
        return promise.then(() => {
          expect(formatOutputFieldDataFromServer).to.be.calledWith(
            rawOutputFieldData
          );
        });
      });

      it('returns the requested output data', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.equal(
          expectedOutputFieldData
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

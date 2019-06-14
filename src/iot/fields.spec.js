import Fields from './fields';
import * as objectUtils from '../utils/objects';

describe('Iot/Fields', function() {
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
    let fields;

    beforeEach(function() {
      fields = new Fields(baseSdk, baseRequest, expectedHost);
    });

    it('sets a base url for the class instance', function() {
      expect(fields._baseUrl).to.equal(expectedHost);
    });

    it('appends the supplied request module to the class instance', function() {
      expect(fields._request).to.equal(baseRequest);
    });

    it('appends the supplied sdk to the class instance', function() {
      expect(fields._sdk).to.equal(baseSdk);
    });
  });

  describe('get', function() {
    context('the output field ID is provided', function() {
      let expectedOutputField;
      let promise;
      let rawOutputField;
      let request;
      let toCamelCase;

      beforeEach(function() {
        expectedOutputField = fixture.build('outputField');
        rawOutputField = fixture.build('outputField', expectedOutputField, {
          fromServer: true
        });

        request = {
          ...baseRequest,
          get: sinon.stub().resolves(rawOutputField)
        };
        toCamelCase = sinon
          .stub(objectUtils, 'toCamelCase')
          .returns(expectedOutputField);

        const fields = new Fields(baseSdk, request);
        fields._baseUrl = expectedHost;

        promise = fields.get(expectedOutputField.id);
      });

      it('gets the output field from the server', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/fields/${expectedOutputField.id}`
        );
      });

      it('formats the output field', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.calledWith(rawOutputField);
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
        const fields = new Fields(baseSdk, baseRequest);
        const promise = fields.get();

        return expect(promise).to.be.rejectedWith(
          'An outputFieldId is required for getting information about an output field'
        );
      });
    });
  });
});

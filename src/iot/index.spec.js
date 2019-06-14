import Fields from './fields';
import Iot from './index';
import Outputs from './outputs';

describe('Iot', function() {
  let baseRequest;
  let baseSdk;

  beforeEach(function() {
    this.sandbox = sinon.createSandbox();

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

    it('appends an instance of Fields to the class instance', function() {
      expect(iot.fields).to.be.an.instanceof(Fields);
    });

    it('appends an instance of Outputs to the class instance', function() {
      expect(iot.outputs).to.be.an.instanceof(Outputs);
    });
  });
});

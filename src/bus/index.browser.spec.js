import Bus from './index.browser';
import Channels from './channels';

describe('Bus (Browser)', function() {
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
          bus: fixture.build('audience')
        }
      }
    };
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  describe('constructor', function() {
    let bus;

    beforeEach(function() {
      bus = new Bus(baseSdk, baseRequest);
    });

    it('sets a base url for the class instance', function() {
      expect(bus._baseUrl).to.equal(`${baseSdk.config.audiences.bus.host}`);
    });

    it('appends the supplied request module to the class instance', function() {
      expect(bus._request).to.equal(baseRequest);
    });

    it('appends the supplied sdk to the class instance', function() {
      expect(bus._sdk).to.equal(baseSdk);
    });

    it('appends an instance of Fields to the class instance', function() {
      expect(bus.channels).to.be.an.instanceof(Channels);
    });
  });

  describe('connect', function() {
    let bus;
    let expectedOrganization;

    beforeEach(function() {
      expectedOrganization = fixture.build('organization');

      bus = new Bus(baseSdk, baseRequest);
    });

    it('throws an error when trying to connect', function() {
      expect(() => bus.connect(expectedOrganization.id)).to.throw(
        'The Message Bus is not currently supported in browser environments'
      );
    });
  });

  describe('getWebSocketConnection', function() {
    let bus;
    let expectedOrganization;

    beforeEach(function() {
      expectedOrganization = fixture.build('organization');

      bus = new Bus(baseSdk, baseRequest);
    });

    it('throws an error when trying to get a WebSocketConnection', function() {
      expect(() =>
        bus.getWebSocketConnection(expectedOrganization.id)
      ).to.throw(
        'The Message Bus is not currently supported in browser environments'
      );
    });
  });
});

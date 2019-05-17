import Coordinator from './index';
import Applications from './applications';
import EdgeNodes from './edgeNodes';
import Roles from './roles';
import Organizations from './organizations';
import Users from './users';

describe('Coordinator', function() {
  let baseRequest;
  let baseSdk;

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
          coordinator: fixture.build('audience')
        }
      }
    };
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  describe('constructor', function() {
    let coordinator;

    beforeEach(function() {
      coordinator = new Coordinator(baseSdk, baseRequest);
    });

    it('sets a base url for the class instance', function() {
      expect(coordinator._baseUrl).to.equal(
        `${baseSdk.config.audiences.coordinator.host}/v1`
      );
    });

    it('appends the supplied request module to the class instance', function() {
      expect(coordinator._request).to.deep.equal(baseRequest);
    });

    it('appends the supplied sdk to the class instance', function() {
      expect(coordinator._sdk).to.deep.equal(baseSdk);
    });

    it('appends an instance of Applications to the class instance', function() {
      expect(coordinator.applications).to.be.an.instanceof(Applications);
    });

    it('appends an instance of EdgeNodes to the class instance', function() {
      expect(coordinator.edgeNodes).to.be.an.instanceof(EdgeNodes);
    });

    it('appends an instance of Roles to the class instance', function() {
      expect(coordinator.roles).to.be.an.instanceof(Roles);
    });

    it('appends an instance of Organizations to the class instance', function() {
      expect(coordinator.organizations).to.be.an.instanceof(Organizations);
    });

    it('appends an instance of Users to the class instance', function() {
      expect(coordinator.users).to.be.an.instanceof(Users);
    });
  });
});

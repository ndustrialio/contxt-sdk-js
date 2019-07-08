import Applications from './applications';
import Consent from './consent';
import Coordinator from './index';
import EdgeNodes from './edgeNodes';
import Organizations from './organizations';
import Permissions from './permissions';
import Roles from './roles';
import Users from './users';

describe('Coordinator', function() {
  let baseRequest;
  let baseSdk;

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
          coordinator: fixture.build('audience')
        }
      }
    };
  });

  afterEach(function() {
    sinon.restore();
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

    it('appends an instance of Consent to the class instance', function() {
      expect(coordinator.consent).to.be.an.instanceof(Consent);
    });

    it('appends an instance of EdgeNodes to the class instance', function() {
      expect(coordinator.edgeNodes).to.be.an.instanceof(EdgeNodes);
    });

    it('appends an instance of Organizations to the class instance', function() {
      expect(coordinator.organizations).to.be.an.instanceof(Organizations);
    });

    it('appends an instance of Permissions to the class instance', function() {
      expect(coordinator.permissions).to.be.an.instanceof(Permissions);
    });

    it('appends an instance of Roles to the class instance', function() {
      expect(coordinator.roles).to.be.an.instanceof(Roles);
    });

    it('appends an instance of Users to the class instance', function() {
      expect(coordinator.users).to.be.an.instanceof(Users);
    });
  });
});

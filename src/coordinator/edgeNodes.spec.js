import EdgeNodes from './edgeNodes';
import * as objectUtils from '../utils/objects';

describe('edgeNodes', function() {
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
          edgeNodes: fixture.build('audience')
        }
      }
    };
    expectedHost = faker.internet.url();
  });

  afterEach(function() {
    sinon.restore();
  });

  describe('constructor', function() {
    context('when an organization ID is provided', function() {
      let edgeNodes;
      let organizationId;

      beforeEach(function() {
        organizationId = fixture.build('organization').id;

        edgeNodes = new EdgeNodes(
          baseSdk,
          baseRequest,
          expectedHost,
          organizationId
        );
      });

      it('sets a base url for the class instance', function() {
        expect(edgeNodes._baseUrl).to.equal(expectedHost);
      });

      it('appends the supplied request module to the class instance', function() {
        expect(edgeNodes._request).to.deep.equal(baseRequest);
      });

      it('appends the supplied sdk to the class instance', function() {
        expect(edgeNodes._sdk).to.deep.equal(baseSdk);
      });

      it('sets the organization ID for the class instance', function() {
        expect(edgeNodes._organizationId).to.equal(organizationId);
      });
    });

    context('when an organization ID is not provided', function() {
      let edgeNodes;

      beforeEach(function() {
        edgeNodes = new EdgeNodes(baseSdk, baseRequest, expectedHost);
      });

      it('sets a base url for the class instance', function() {
        expect(edgeNodes._baseUrl).to.equal(expectedHost);
      });

      it('appends the supplied request module to the class instance', function() {
        expect(edgeNodes._request).to.deep.equal(baseRequest);
      });

      it('appends the supplied sdk to the class instance', function() {
        expect(edgeNodes._sdk).to.deep.equal(baseSdk);
      });

      it('sets the organization ID for the class instance to null', function() {
        expect(edgeNodes._organizationId).to.equal(null);
      });
    });
  });

  describe('get', function() {
    context('legacy API', function() {
      context('all required params are provided', function() {
        let edgeNodeFromServerAfterFormat;
        let edgeNodeFromServerBeforeFormat;
        let expectedEdgeNodeId;
        let expectedOrganizationId;
        let promise;
        let request;
        let toCamelCase;

        beforeEach(function() {
          edgeNodeFromServerAfterFormat = fixture.build('edgeNode');
          expectedEdgeNodeId = edgeNodeFromServerAfterFormat.id;
          expectedOrganizationId = edgeNodeFromServerAfterFormat.organizationId;
          edgeNodeFromServerBeforeFormat = fixture.build(
            'edgeNode',
            edgeNodeFromServerAfterFormat,
            { fromServer: true }
          );

          request = {
            ...baseRequest,
            get: sinon.stub().resolves(edgeNodeFromServerBeforeFormat)
          };
          toCamelCase = sinon
            .stub(objectUtils, 'toCamelCase')
            .returns(edgeNodeFromServerAfterFormat);

          const edgeNodes = new EdgeNodes(baseSdk, request);
          edgeNodes._baseUrl = expectedHost;
          promise = edgeNodes.get(expectedOrganizationId, expectedEdgeNodeId);
        });

        it('gets the edge node from the server', function() {
          expect(request.get).to.be.calledWith(
            `${expectedHost}/organizations/${expectedOrganizationId}/edgenodes/${expectedEdgeNodeId}`
          );
        });

        it('formats the edge node object', function() {
          return promise.then(() => {
            expect(toCamelCase).to.be.calledWith(
              edgeNodeFromServerBeforeFormat
            );
          });
        });

        it('returns the requested edge node', function() {
          return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
            edgeNodeFromServerAfterFormat
          );
        });
      });

      context('the organization ID is not provided', function() {
        it('throws an error', function() {
          const edgeNodes = new EdgeNodes(baseSdk, baseRequest);
          const promise = edgeNodes.get(null, faker.random.uuid());

          return expect(promise).to.be.rejectedWith(
            'An organizationId is required for getting an edge node.'
          );
        });
      });

      context('the edge node client ID is not provided', function() {
        it('throws an error', function() {
          const edgeNodes = new EdgeNodes(baseSdk, baseRequest);
          const promise = edgeNodes.get(faker.random.uuid());

          return expect(promise).to.be.rejectedWith(
            'An edgeNodeClientId is required for getting an edge node.'
          );
        });
      });
    });

    context('tenant API', function() {
      context('all params are provided', function() {
        let edgeNodeFromServerAfterFormat;
        let edgeNodeFromServerBeforeFormat;
        let expectedEdgeNodeId;
        let expectedOrganizationId;
        let promise;
        let request;
        let toCamelCase;

        beforeEach(function() {
          edgeNodeFromServerAfterFormat = fixture.build('edgeNode');
          expectedEdgeNodeId = edgeNodeFromServerAfterFormat.id;
          expectedOrganizationId = edgeNodeFromServerAfterFormat.organizationId;
          edgeNodeFromServerBeforeFormat = fixture.build(
            'edgeNode',
            edgeNodeFromServerAfterFormat,
            { fromServer: true }
          );

          request = {
            ...baseRequest,
            get: sinon.stub().resolves(edgeNodeFromServerBeforeFormat)
          };
          toCamelCase = sinon
            .stub(objectUtils, 'toCamelCase')
            .returns(edgeNodeFromServerAfterFormat);

          const edgeNodes = new EdgeNodes(
            baseSdk,
            request,
            null,
            expectedOrganizationId
          );
          edgeNodes._baseUrl = expectedHost;
          promise = edgeNodes.get(expectedOrganizationId, expectedEdgeNodeId);
        });

        it('gets the edge node from the server and does not use the organization ID provided', function() {
          expect(request.get).to.be.calledWith(
            `${expectedHost}/edgenodes/${expectedEdgeNodeId}`
          );
        });

        it('formats the edge node object', function() {
          return promise.then(() => {
            expect(toCamelCase).to.be.calledWith(
              edgeNodeFromServerBeforeFormat
            );
          });
        });

        it('returns the requested edge node', function() {
          return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
            edgeNodeFromServerAfterFormat
          );
        });
      });

      context('the organization ID is not provided', function() {
        let edgeNodeFromServerAfterFormat;
        let edgeNodeFromServerBeforeFormat;
        let expectedEdgeNodeId;
        let expectedOrganizationId;
        let promise;
        let request;
        let toCamelCase;

        beforeEach(function() {
          edgeNodeFromServerAfterFormat = fixture.build('edgeNode');
          expectedEdgeNodeId = edgeNodeFromServerAfterFormat.id;
          expectedOrganizationId = edgeNodeFromServerAfterFormat.organizationId;
          edgeNodeFromServerBeforeFormat = fixture.build(
            'edgeNode',
            edgeNodeFromServerAfterFormat,
            { fromServer: true }
          );

          request = {
            ...baseRequest,
            get: sinon.stub().resolves(edgeNodeFromServerBeforeFormat)
          };
          toCamelCase = sinon
            .stub(objectUtils, 'toCamelCase')
            .returns(edgeNodeFromServerAfterFormat);

          const edgeNodes = new EdgeNodes(
            baseSdk,
            request,
            null,
            expectedOrganizationId
          );
          edgeNodes._baseUrl = expectedHost;

          promise = edgeNodes.get(null, expectedEdgeNodeId);
        });

        it('gets the edge node from the server', function() {
          expect(request.get).to.be.calledWith(
            `${expectedHost}/edgenodes/${expectedEdgeNodeId}`
          );
        });

        it('formats the edge node object', function() {
          return promise.then(() => {
            expect(toCamelCase).to.be.calledWith(
              edgeNodeFromServerBeforeFormat
            );
          });
        });

        it('returns the requested edge node', function() {
          return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
            edgeNodeFromServerAfterFormat
          );
        });
      });

      context('the edge node client ID is not provided', function() {
        it('throws an error', function() {
          const organizationId = fixture.build('organization').id;
          const edgeNodes = new EdgeNodes(
            baseSdk,
            baseRequest,
            null,
            organizationId
          );
          const promise = edgeNodes.get(organizationId);

          return expect(promise).to.be.rejectedWith(
            'An edgeNodeClientId is required for getting an edge node.'
          );
        });
      });
    });
  });
});

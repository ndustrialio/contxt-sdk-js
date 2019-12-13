import Health from './index';
import * as paginationUtils from '../utils/pagination';

describe('Health', function() {
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
          health: fixture.build('audience')
        }
      }
    };
  });

  afterEach(function() {
    sinon.restore();
  });

  describe('constructor', function() {
    let health;
    let organizationId;

    beforeEach(function() {
      organizationId = fixture.build('organization').id;

      health = new Health(baseSdk, baseRequest, organizationId);
    });

    it('sets a base url for the class instance', function() {
      expect(health._baseUrl).to.equal(
        `${baseSdk.config.audiences.health.host}/v1`
      );
    });

    it('sets an organizationId for the class instance', function() {
      expect(health._organizationId).to.equal(organizationId);
    });

    it('appends the supplied request module to the class instance', function() {
      expect(health._request).to.deep.equal(baseRequest);
    });

    it('appends the supplied sdk to the class instance', function() {
      expect(health._sdk).to.deep.equal(baseSdk);
    });
  });

  describe('getAll', function() {
    context(
      'when the class instance does not have an organizationId',
      function() {
        let health;

        beforeEach(function() {
          health = new Health(baseSdk, baseRequest);
        });

        context('when getAll is called without an organizationId', function() {
          it('throws an error', function() {
            let promise = health.getAll({
              organizationId: null
            });

            return expect(promise).to.be.rejectedWith(
              'An organization ID is required'
            );
          });
        });

        context('when getAll is called with an organizationId', function() {
          it('does not throw an error', function() {
            let promise = health.getAll({
              organizationId: fixture.build('organization').id
            });

            return expect(promise).to.be.not.throw;
          });
        });
      }
    );

    context('when the class instance does have an organizationId', function() {
      let health;
      let organizationId;
      let paginationOptions;

      beforeEach(function() {
        organizationId = fixture.build('organization').id;

        health = new Health(baseSdk, baseRequest, organizationId);
        paginationOptions = {
          limit: faker.random.number(),
          offset: faker.random.number(),
          orderBy: faker.random.arrayElement(['asc', 'desc']),
          sortBy: null
        };
      });

      context('when getAll is called without an organizationId', function() {
        it('calls the api with the class instance organizationId', function() {
          health.getAll({}, paginationOptions);

          expect(baseRequest.get).to.be.calledWith(
            `${baseSdk.config.audiences.health.host}/v1/${
              health._organizationId
            }/assets`
          );
        });
      });

      context('when getAll is called with an organizationId', function() {
        it('calls the api with the provided organizationId', function() {
          let organizationId = fixture.build('organization').id;
          health.getAll({
            organizationId
          });

          expect(baseRequest.get).to.be.calledWith(
            `${
              baseSdk.config.audiences.health.host
            }/v1/${organizationId}/assets`
          );
        });
      });
    });

    context('when all required parameters are supplied', function() {
      let health;
      let organizationId;
      let paginationOptions;
      let formatPaginatedDataFromServer;

      beforeEach(function() {
        organizationId = fixture.build('organization').id;

        health = new Health(baseSdk, baseRequest, organizationId);

        paginationOptions = {
          limit: faker.random.number(),
          offset: faker.random.number(),
          orderBy: faker.random.arrayElement(['asc', 'desc']),
          sortBy: null
        };

        formatPaginatedDataFromServer = sinon.stub(
          paginationUtils,
          'formatPaginatedDataFromServer'
        );
      });

      it('calls the api with the requested pagination options', function() {
        health.getAll({}, paginationOptions);

        expect(baseRequest.get).to.be.calledWith(
          `${baseSdk.config.audiences.health.host}/v1/${
            health._organizationId
          }/assets`,
          { params: paginationOptions }
        );
      });

      it('formats the response with formatPaginatedDataFromServer()', function() {
        let promise = health.getAll({}, paginationOptions);

        return promise.then(() => {
          expect(formatPaginatedDataFromServer).to.be.called;
        });
      });
    });
  });

  describe('getByAssetId', function() {
    context(
      'when the class instance does not have an organizationId',
      function() {
        let health;
        let assetId;

        beforeEach(function() {
          assetId = fixture.build('asset').id;
          health = new Health(baseSdk, baseRequest);
        });

        context(
          'when getByAssetId is called without an organizationId',
          function() {
            it('throws an error', function() {
              let promise = health.getByAssetId({
                assetId,
                organizationId: null
              });

              return expect(promise).to.be.rejectedWith(
                'An organization ID is required'
              );
            });
          }
        );

        context(
          'when getByAssetId is called with an organizationId',
          function() {
            it('does not throw an error', function() {
              let promise = health.getByAssetId({
                assetId,
                organizationId: fixture.build('organization').id
              });

              return expect(promise).to.be.not.throw;
            });
          }
        );
      }
    );

    context('when the class instance does have an organizationId', function() {
      let health;
      let organizationId;
      let paginationOptions;
      let assetId;

      beforeEach(function() {
        organizationId = fixture.build('organization').id;
        assetId = fixture.build('asset').id;

        health = new Health(baseSdk, baseRequest, organizationId);
        paginationOptions = {
          limit: faker.random.number(),
          offset: faker.random.number(),
          orderBy: faker.random.arrayElement(['asc', 'desc']),
          sortBy: null
        };
      });

      context(
        'when getByAssetId is called without an organizationId',
        function() {
          it('calls the api with the class instance organizationId', function() {
            health.getByAssetId({ assetId }, paginationOptions);

            expect(baseRequest.get).to.be.calledWith(
              `${baseSdk.config.audiences.health.host}/v1/${
                health._organizationId
              }/assets/${assetId}`
            );
          });
        }
      );

      context('when getByAssetId is called with an organizationId', function() {
        it('calls the api with the provided organizationId', function() {
          health.getByAssetId({
            assetId,
            organizationId
          });

          expect(baseRequest.get).to.be.calledWith(
            `${
              baseSdk.config.audiences.health.host
            }/v1/${organizationId}/assets/${assetId}`
          );
        });
      });
    });

    context('when the assetId is not supplied', function() {
      let health;
      let organizationId;

      beforeEach(function() {
        organizationId = fixture.build('organization').id;

        health = new Health(baseSdk, baseRequest, organizationId);
      });

      it('throws an error', function() {
        let promise = health.getByAssetId({
          organizationId
        });

        return expect(promise).to.be.rejectedWith('An asset ID is required');
      });
    });

    context('when all required parameters are supplied', function() {
      let health;
      let assetId;
      let organizationId;
      let paginationOptions;
      let formatPaginatedDataFromServer;

      beforeEach(function() {
        assetId = fixture.build('asset').id;
        organizationId = fixture.build('organization').id;

        health = new Health(baseSdk, baseRequest, organizationId);

        paginationOptions = {
          limit: faker.random.number(),
          offset: faker.random.number(),
          orderBy: faker.random.arrayElement(['asc', 'desc']),
          sortBy: null
        };

        formatPaginatedDataFromServer = sinon.stub(
          paginationUtils,
          'formatPaginatedDataFromServer'
        );
      });

      it('calls the api with the requested pagination options', function() {
        health.getByAssetId({ assetId }, paginationOptions);

        expect(baseRequest.get).to.be.calledWith(
          `${baseSdk.config.audiences.health.host}/v1/${
            health._organizationId
          }/assets/${assetId}`,
          { params: paginationOptions }
        );
      });

      it('formats the response with formatPaginatedDataFromServer()', function() {
        let promise = health.getByAssetId({ assetId }, paginationOptions);

        return promise.then(() => {
          expect(formatPaginatedDataFromServer).to.be.called;
        });
      });
    });
  });

  describe('post', function() {
    context(
      'when the class instance does not have an organizationId',
      function() {
        let health;
        let assetId;
        let status;

        beforeEach(function() {
          assetId = fixture.build('asset').id;
          status = faker.random.arrayElement(Object.values(Health.status));
          health = new Health(baseSdk, baseRequest);
        });

        context('when post is called without an organizationId', function() {
          it('throws an error', function() {
            let promise = health.post({
              assetId,
              organizationId: null,
              status
            });

            return expect(promise).to.be.rejectedWith(
              'An organization ID is required'
            );
          });
        });

        context('when post is called with an organizationId', function() {
          it('does not throw an error', function() {
            let promise = health.post({
              assetId,
              organizationId: fixture.build('organization').id,
              status
            });

            return expect(promise).to.be.not.throw;
          });
        });
      }
    );

    context('when the class instance does have an organizationId', function() {
      let health;
      let organizationId;
      let assetId;
      let status;

      beforeEach(function() {
        organizationId = fixture.build('organization').id;
        assetId = fixture.build('asset').id;
        status = faker.random.arrayElement(Object.values(Health.status));

        health = new Health(baseSdk, baseRequest, organizationId);
      });

      context('when post is called without an organizationId', function() {
        it('calls the api with the class instance organizationId', function() {
          health.post({ assetId, status });

          expect(baseRequest.post).to.be.calledWith(
            `${baseSdk.config.audiences.health.host}/v1/${
              health._organizationId
            }/assets/${assetId}`
          );
        });
      });

      context('when post is called with an organizationId', function() {
        it('calls the api with the provided organizationId', function() {
          health.post({
            assetId,
            organizationId,
            status
          });

          expect(baseRequest.post).to.be.calledWith(
            `${
              baseSdk.config.audiences.health.host
            }/v1/${organizationId}/assets/${assetId}`
          );
        });
      });
    });

    context('when the assetId is not supplied', function() {
      let health;
      let organizationId;
      let status;

      beforeEach(function() {
        organizationId = fixture.build('organization').id;
        status = faker.random.arrayElement(Object.values(Health.status));

        health = new Health(baseSdk, baseRequest, organizationId);
      });

      it('throws an error', function() {
        let promise = health.post({
          organizationId,
          status
        });

        return expect(promise).to.be.rejectedWith('An asset ID is required');
      });
    });

    context('when the status is not supplied', function() {
      let health;
      let assetId;
      let organizationId;

      beforeEach(function() {
        organizationId = fixture.build('organization').id;
        assetId = fixture.build('asset').id;

        health = new Health(baseSdk, baseRequest, organizationId);
      });

      it('throws an error', function() {
        let promise = health.post({
          organizationId,
          assetId
        });

        return expect(promise).to.be.rejectedWith(
          'Status must equal one of: healthy, unhealthy'
        );
      });
    });

    context('when all required parameters are supplied', function() {
      let health;
      let assetId;
      let organizationId;
      let status;
      let timestamp;

      beforeEach(function() {
        assetId = fixture.build('asset').id;
        organizationId = fixture.build('organization').id;
        status = faker.random.arrayElement(Object.values(Health.status));
        timestamp = new Date();

        health = new Health(baseSdk, baseRequest, organizationId);
      });

      it('calls the api with the requested pagination options', function() {
        health.post({ assetId, organizationId, status, timestamp });

        expect(baseRequest.post).to.be.calledWith(
          `${baseSdk.config.audiences.health.host}/v1/${
            health._organizationId
          }/assets/${assetId}`,
          { status, timestamp }
        );
      });
    });
  });
});

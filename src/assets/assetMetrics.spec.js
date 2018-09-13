import omit from 'lodash.omit';
import AssetMetrics from './assetMetrics';
import * as objectUtils from '../utils/objects';
import * as paginationUtils from '../utils/pagination';

describe('Assets/Metrics', function() {
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
          facilities: fixture.build('audience')
        }
      }
    };
    expectedHost = faker.internet.url();
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  describe('constructor', function() {
    let assetMetrics;

    beforeEach(function() {
      assetMetrics = new AssetMetrics(baseSdk, baseRequest, expectedHost);
    });

    it('sets a base url for the class instance', function() {
      expect(assetMetrics._baseUrl).to.equal(expectedHost);
    });

    it('appends the supplied request module to the class instance', function() {
      expect(assetMetrics._request).to.deep.equal(baseRequest);
    });

    it('appends the supplied sdk to the class instance', function() {
      expect(assetMetrics._sdk).to.deep.equal(baseSdk);
    });
  });

  describe('create', function() {
    context('when all required information is supplied', function() {
      let assetMetricFromServerAfterFormat;
      let assetMetricFromServerBeforeFormat;
      let assetMetricToServerAfterFormat;
      let assetMetricToServerBeforeFormat;
      let assetTypeId;
      let promise;
      let request;
      let toCamelCase;
      let toSnakeCase;

      beforeEach(function() {
        assetMetricFromServerAfterFormat = fixture.build('assetMetric');
        assetMetricFromServerBeforeFormat = fixture.build('assetMetric', null, {
          fromServer: true
        });
        assetMetricToServerAfterFormat = fixture.build('assetMetric', null, {
          fromServer: true
        });
        assetMetricToServerBeforeFormat = fixture.build('assetMetric');

        assetTypeId = fixture.build('assetType').id;

        request = {
          ...baseRequest,
          post: this.sandbox.stub().resolves(assetMetricFromServerBeforeFormat)
        };
        toCamelCase = this.sandbox
          .stub(objectUtils, 'toCamelCase')
          .returns(assetMetricFromServerAfterFormat);
        toSnakeCase = this.sandbox
          .stub(objectUtils, 'toSnakeCase')
          .returns(assetMetricToServerAfterFormat);

        const assetMetrics = new AssetMetrics(baseSdk, request, expectedHost);

        promise = assetMetrics.create(
          assetTypeId,
          assetMetricToServerBeforeFormat
        );
      });

      it('formats the submitted asset metric object to send to the server', function() {
        expect(toSnakeCase).to.be.deep.calledWith(
          assetMetricToServerBeforeFormat
        );
      });

      it('creates a new asset metric', function() {
        expect(request.post).to.be.deep.calledWith(
          `${expectedHost}/assets/types/${assetTypeId}/metrics`,
          assetMetricToServerAfterFormat
        );
      });

      it('formats the returned asset metric object', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.deep.calledWith(
            assetMetricFromServerBeforeFormat
          );
        });
      });

      it('returns a fulfilled promise with the new asset metric information', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
          assetMetricFromServerAfterFormat
        );
      });
    });

    context('when there is missing required information', function() {
      let assetMetric;
      let assetMetrics;
      let assetTypeId;
      let promise;

      beforeEach(function() {
        assetMetric = fixture.build('assetMetric');
        assetMetrics = new AssetMetrics(baseSdk, baseRequest, expectedHost);
        assetTypeId = fixture.build('assetType').id;
      });

      it('throws an error if there is no asset type ID provided', function() {
        promise = assetMetrics.create(null, assetMetric);

        return expect(promise).to.be.rejectedWith(
          'An asset type ID is required for creating an asset metric.'
        );
      });

      ['description', 'label', 'organizationId', 'timeInterval'].forEach(
        (field) => {
          it(`throws an error when ${field} is missing`, function() {
            promise = assetMetrics.create(
              assetTypeId,
              omit(assetMetric, [field])
            );

            return expect(promise).to.be.rejectedWith(
              `A ${field} is required to create a new asset metric.`
            );
          });
        }
      );
    });
  });

  describe('delete', function() {
    context('when all required information is supplied', function() {
      let expectedAssetMetricId;
      let promise;

      beforeEach(function() {
        expectedAssetMetricId = fixture.build('assetMetric').id;

        const assetMetrics = new AssetMetrics(
          baseSdk,
          baseRequest,
          expectedHost
        );

        promise = assetMetrics.delete(expectedAssetMetricId);
      });

      it('requests to delete the asset attribute', function() {
        expect(baseRequest.delete).to.be.calledWith(
          `${expectedHost}/assets/metrics/${expectedAssetMetricId}`
        );
      });

      it('returns a fulfilled promise', function() {
        return expect(promise).to.be.fulfilled;
      });
    });

    context('when there is missing required information', function() {
      it('throws an error when the asset metric ID is missing', function() {
        const assetMetrics = new AssetMetrics(
          baseSdk,
          baseRequest,
          expectedHost
        );

        const promise = assetMetrics.delete();

        return expect(promise).to.be.rejectedWith(
          'An asset metric ID is required for deleting an asset metric.'
        );
      });
    });
  });

  describe('get', function() {
    context('the asset attribute ID is provided', function() {
      let assetMetricFromServerAfterFormat;
      let assetMetricFromServerBeforeFormat;
      let expectedAssetMetricId;
      let promise;
      let request;
      let toCamelCase;

      beforeEach(function() {
        expectedAssetMetricId = fixture.build('assetMetric').id;
        assetMetricFromServerAfterFormat = fixture.build('assetMetric', {
          id: expectedAssetMetricId
        });
        assetMetricFromServerBeforeFormat = fixture.build(
          'assetMetric',
          assetMetricFromServerAfterFormat,
          { fromServer: true }
        );

        request = {
          ...baseRequest,
          get: this.sandbox.stub().resolves(assetMetricFromServerBeforeFormat)
        };
        toCamelCase = this.sandbox
          .stub(objectUtils, 'toCamelCase')
          .returns(assetMetricFromServerAfterFormat);

        const assetMetrics = new AssetMetrics(baseSdk, request, expectedHost);

        promise = assetMetrics.get(expectedAssetMetricId);
      });

      it('gets the asset metric from the server', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/assets/metrics/${expectedAssetMetricId}`
        );
      });

      it('formats the asset metric object', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.deep.calledWith(
            assetMetricFromServerBeforeFormat
          );
        });
      });

      it('returns the requested asset metric', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
          assetMetricFromServerAfterFormat
        );
      });
    });

    context('the asset metric ID is not provided', function() {
      it('throws an error', function() {
        const assetMetrics = new AssetMetrics(
          baseSdk,
          baseRequest,
          expectedHost
        );
        const promise = assetMetrics.get();

        return expect(promise).to.be.rejectedWith(
          'An asset metric ID is required for getting information about an asset metric.'
        );
      });
    });
  });

  describe('getAll', function() {
    context('when all required information is supplied', function() {
      let assetTypeId;
      let formatPaginatedDataFromServer;
      let numberOfAssetMetrics;
      let paginationOptionsAfterFormat;
      let paginationOptionsBeforeFormat;
      let promise;
      let request;
      let toSnakeCase;
      let valuesFromServerAfterFormat;
      let valuesFromServerBeforeFormat;

      beforeEach(function() {
        numberOfAssetMetrics = faker.random.number({ min: 1, max: 10 });
        assetTypeId = fixture.build('assetType').id;
        paginationOptionsBeforeFormat = {
          limit: faker.random.number({ min: 10, max: 1000 }),
          offset: faker.random.number({ max: 1000 })
        };
        paginationOptionsAfterFormat = {
          limit: faker.random.number({ min: 10, max: 1000 }),
          offset: faker.random.number({ max: 1000 })
        };
        valuesFromServerAfterFormat = {
          _metadata: fixture.build('paginationMetadata'),
          records: fixture.buildList('assetMetric', numberOfAssetMetrics, {
            assetTypeId
          })
        };
        valuesFromServerBeforeFormat = {
          ...valuesFromServerAfterFormat,
          records: valuesFromServerAfterFormat.records.map((values) =>
            fixture.build('assetMetric', values, { fromServer: true })
          )
        };

        formatPaginatedDataFromServer = this.sandbox
          .stub(paginationUtils, 'formatPaginatedDataFromServer')
          .returns(valuesFromServerAfterFormat);
        request = {
          ...baseRequest,
          get: this.sandbox.stub().resolves(valuesFromServerBeforeFormat)
        };
        toSnakeCase = this.sandbox
          .stub(objectUtils, 'toSnakeCase')
          .returns(paginationOptionsAfterFormat);

        const assetMetrics = new AssetMetrics(baseSdk, request, expectedHost);
        promise = assetMetrics.getAll(
          assetTypeId,
          paginationOptionsBeforeFormat
        );
      });

      it('formats the pagination options sent to the server', function() {
        expect(toSnakeCase).to.be.calledWith(paginationOptionsBeforeFormat);
      });

      it('gets a list of the asset metrics from the server', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/assets/types/${assetTypeId}/metrics`,
          { params: paginationOptionsAfterFormat }
        );
      });

      it('formats the asset metric data', function() {
        return promise.then(() => {
          expect(formatPaginatedDataFromServer).to.be.calledWith(
            valuesFromServerBeforeFormat
          );
        });
      });

      it('resolves with a list of asset metrics', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
          valuesFromServerAfterFormat
        );
      });
    });

    context('when there is missing required information', function() {
      let promise;

      beforeEach(function() {
        const assetMetrics = new AssetMetrics(
          baseSdk,
          baseRequest,
          expectedHost
        );

        promise = assetMetrics.getAll();
      });
      it('throws an error when the asset type ID is missing', function() {
        return expect(promise).to.be.rejectedWith(
          'An asset type ID is required to get a list of all asset metrics.'
        );
      });
    });
  });

  describe('update', function() {
    context('when all required information is supplied', function() {
      let assetMetricToServerAfterFormat;
      let assetMetricToServerBeforeFormat;
      let toSnakeCase;
      let promise;

      beforeEach(function() {
        assetMetricToServerAfterFormat = fixture.build('assetMetric', null, {
          fromServer: true
        });
        assetMetricToServerBeforeFormat = fixture.build('assetMetric');

        toSnakeCase = this.sandbox
          .stub(objectUtils, 'toSnakeCase')
          .returns(assetMetricToServerAfterFormat);

        const assetMetrics = new AssetMetrics(
          baseSdk,
          baseRequest,
          expectedHost
        );

        promise = assetMetrics.update(
          assetMetricToServerBeforeFormat.id,
          assetMetricToServerBeforeFormat
        );
      });

      it('formats the data into the right format', function() {
        expect(toSnakeCase).to.be.deep.calledWith(
          assetMetricToServerBeforeFormat,
          {
            excludeKeys: [
              'createdAt',
              'id',
              'label',
              'organizationId',
              'updatedAt'
            ]
          }
        );
      });

      it('updates the asset metric', function() {
        expect(baseRequest.put).to.be.deep.calledWith(
          `${expectedHost}/assets/metrics/${
            assetMetricToServerBeforeFormat.id
          }`,
          assetMetricToServerAfterFormat
        );
      });

      it('returns a fulfilled promise', function() {
        return expect(promise).to.be.fulfilled;
      });
    });

    context(
      'when there is missing or malformed required information',
      function() {
        let assetMetrics;

        beforeEach(function() {
          assetMetrics = new AssetMetrics(baseSdk, baseRequest, expectedHost);
        });

        it('throws an error when there is not provided asset metric ID', function() {
          const assetAttributeUpdate = fixture.build('assetMetric');
          const promise = assetMetrics.update(null, assetAttributeUpdate);

          return expect(promise).to.be.rejectedWith(
            'An asset metric ID is required to update an asset metric.'
          );
        });

        it('throws an error when there is no update provided', function() {
          const assetAttributeUpdate = fixture.build('assetMetric');
          const promise = assetMetrics.update(assetAttributeUpdate.id);

          return expect(promise).to.be.rejectedWith(
            'An update is required to update an asset metric.'
          );
        });

        it('throws an error when the update is not a well-formed object', function() {
          const assetAttributeUpdate = fixture.build('assetMetric');
          const promise = assetMetrics.update(assetAttributeUpdate.id, [
            assetAttributeUpdate
          ]);

          return expect(promise).to.be.rejectedWith(
            'The asset metric update must be a well-formed object with the data you wish to update.'
          );
        });
      }
    );
  });
});

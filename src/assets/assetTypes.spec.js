import omit from 'lodash.omit';
import AssetTypes from './assetTypes';
import * as objectUtils from '../utils/objects';
import * as paginationUtils from '../utils/pagination';

describe('Assets/Types', function() {
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
          facilities: fixture.build('audience')
        }
      }
    };
    expectedHost = faker.internet.url();
  });

  afterEach(function() {
    sinon.restore();
  });

  describe('constructor', function() {
    let assetTypes;

    beforeEach(function() {
      assetTypes = new AssetTypes(baseSdk, baseRequest, expectedHost);
    });

    it('sets a base url for the class instance', function() {
      expect(assetTypes._baseUrl).to.equal(expectedHost);
    });

    it('appends the supplied request module to the class instance', function() {
      expect(assetTypes._request).to.deep.equal(baseRequest);
    });

    it('appends the supplied sdk to the class instance', function() {
      expect(assetTypes._sdk).to.deep.equal(baseSdk);
    });
  });

  describe('create', function() {
    context(
      'when creating an asset type tied to a specific organization',
      function() {
        let assetTypeFromServerAfterFormat;
        let assetTypeFromServerBeforeFormat;
        let assetTypeToServerAfterFormat;
        let assetTypeToServerBeforeFormat;
        let promise;
        let request;
        let toCamelCase;
        let toSnakeCase;

        beforeEach(function() {
          assetTypeFromServerAfterFormat = fixture.build('assetType');
          assetTypeFromServerBeforeFormat = fixture.build('assetType', null, {
            fromServer: true
          });
          assetTypeToServerAfterFormat = fixture.build('assetType', null, {
            fromServer: true
          });
          assetTypeToServerBeforeFormat = fixture.build('assetType');

          request = {
            ...baseRequest,
            post: sinon.stub().resolves(assetTypeFromServerBeforeFormat)
          };
          toCamelCase = sinon
            .stub(objectUtils, 'toCamelCase')
            .returns(assetTypeFromServerAfterFormat);
          toSnakeCase = sinon
            .stub(objectUtils, 'toSnakeCase')
            .returns(assetTypeToServerAfterFormat);

          const assetTypes = new AssetTypes(baseSdk, request, expectedHost);

          promise = assetTypes.create(assetTypeToServerBeforeFormat);
        });

        it('formats the submitted asset type object to send to the server', function() {
          expect(toSnakeCase).to.be.deep.calledWith(
            assetTypeToServerBeforeFormat
          );
        });

        it('creates a new asset type', function() {
          expect(request.post).to.be.deep.calledWith(
            `${expectedHost}/assets/types`,
            assetTypeToServerAfterFormat
          );
        });

        it('formats the returned asset type object', function() {
          return promise.then(() => {
            expect(toCamelCase).to.be.deep.calledWith(
              assetTypeFromServerBeforeFormat
            );
          });
        });

        it('returns a fulfilled promise with the new asset type information', function() {
          return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
            assetTypeFromServerAfterFormat
          );
        });
      }
    );

    context('when creating a global asset type', function() {
      let assetTypeFromServerAfterFormat;
      let assetTypeFromServerBeforeFormat;
      let assetTypeToServerAfterFormat;
      let assetTypeToServerBeforeFormat;
      let promise;
      let request;
      let toCamelCase;
      let toSnakeCase;

      beforeEach(function() {
        assetTypeFromServerBeforeFormat = fixture.build('assetType', {
          organizationId: null
        });
        assetTypeFromServerAfterFormat = fixture.build(
          'assetType',
          assetTypeToServerBeforeFormat,
          { fromServer: true }
        );
        assetTypeToServerBeforeFormat = fixture.build('assetType', {
          organizationId: null
        });
        assetTypeToServerAfterFormat = fixture.build(
          'assetType',
          assetTypeToServerBeforeFormat,
          { fromServer: true }
        );

        request = {
          ...baseRequest,
          post: sinon.stub().resolves(assetTypeFromServerBeforeFormat)
        };
        toCamelCase = sinon
          .stub(objectUtils, 'toCamelCase')
          .returns(assetTypeFromServerAfterFormat);
        toSnakeCase = sinon
          .stub(objectUtils, 'toSnakeCase')
          .returns(assetTypeToServerAfterFormat);

        const assetTypes = new AssetTypes(baseSdk, request, expectedHost);

        promise = assetTypes.create(assetTypeToServerBeforeFormat);
      });

      it('formats the submitted asset type object to send to the server', function() {
        expect(toSnakeCase).to.be.deep.calledWith(
          assetTypeToServerBeforeFormat
        );
      });

      it('creates a new asset type', function() {
        expect(request.post).to.be.deep.calledWith(
          `${expectedHost}/assets/types`,
          assetTypeToServerAfterFormat
        );
      });

      it('formats the returned asset type object', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.deep.calledWith(
            assetTypeFromServerBeforeFormat
          );
        });
      });

      it('returns a fulfilled promise with the new asset type information', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
          assetTypeFromServerAfterFormat
        );
      });
    });

    context('when there is missing required information', function() {
      ['description', 'label', 'organizationId'].forEach((field) => {
        it(`it throws an error when ${field} is missing`, function() {
          const assetType = fixture.build('assetType');
          const assetTypes = new AssetTypes(baseSdk, baseRequest, expectedHost);

          const promise = assetTypes.create(omit(assetType, [field]));

          return expect(promise).to.be.rejectedWith(
            `A ${field} is required to create a new asset type.`
          );
        });
      });
    });
  });

  describe('delete', function() {
    context('when all required information is supplied', function() {
      let expectedAssetTypeId;
      let promise;

      beforeEach(function() {
        expectedAssetTypeId = fixture.build('assetType').id;

        const assetTypes = new AssetTypes(baseSdk, baseRequest, expectedHost);

        promise = assetTypes.delete(expectedAssetTypeId);
      });

      it('request to deletes the asset type', function() {
        expect(baseRequest.delete).to.be.calledWith(
          `${expectedHost}/assets/types/${expectedAssetTypeId}`
        );
      });

      it('returns a fulfilled promise', function() {
        return expect(promise).to.be.fulfilled;
      });
    });

    context('when there is missing required information', function() {
      it('throws an error when the asset type ID is missing', function() {
        const assetTypes = new AssetTypes(baseSdk, baseRequest, expectedHost);

        const promise = assetTypes.delete();

        return expect(promise).to.be.rejectedWith(
          'An asset type ID is required for deleting an asset type.'
        );
      });
    });
  });

  describe('get', function() {
    context('the asset type ID is provided', function() {
      let assetTypeFromServerAfterFormat;
      let assetTypeFromServerBeforeFormat;
      let expectedAssetTypeId;
      let promise;
      let request;
      let toCamelCase;

      beforeEach(function() {
        expectedAssetTypeId = fixture.build('assetType').id;
        assetTypeFromServerAfterFormat = fixture.build('assetType', {
          id: expectedAssetTypeId
        });
        assetTypeFromServerBeforeFormat = fixture.build(
          'assetType',
          assetTypeFromServerAfterFormat,
          { fromServer: true }
        );

        request = {
          ...baseRequest,
          get: sinon.stub().resolves(assetTypeFromServerBeforeFormat)
        };
        toCamelCase = sinon
          .stub(objectUtils, 'toCamelCase')
          .returns(assetTypeFromServerAfterFormat);

        const assetTypes = new AssetTypes(baseSdk, request, expectedHost);

        promise = assetTypes.get(expectedAssetTypeId);
      });

      it('gets the asset type from the server', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/assets/types/${expectedAssetTypeId}`
        );
      });

      it('formats the asset type object', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.deep.calledWith(
            assetTypeFromServerBeforeFormat
          );
        });
      });

      it('returns the requested asset type', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
          assetTypeFromServerAfterFormat
        );
      });
    });

    context('the asset type ID is not provided', function() {
      it('throws an error', function() {
        const assetTypes = new AssetTypes(baseSdk, baseRequest, expectedHost);
        const promise = assetTypes.get();

        return expect(promise).to.be.rejectedWith(
          'An asset type ID is required for getting information about an asset type.'
        );
      });
    });
  });

  describe('getAll', function() {
    let assetTypesFromServerAfterFormat;
    let assetTypesFromServerBeforeFormat;
    let formatPaginatedDataFromServer;
    let numberOfAssetTypes;
    let paginationOptionsAfterFormat;
    let paginationOptionsBeforeFormat;
    let promise;
    let request;
    let toSnakeCase;

    beforeEach(function() {
      numberOfAssetTypes = faker.random.number({ min: 1, max: 10 });
      assetTypesFromServerAfterFormat = {
        _metadata: fixture.build('paginationMetadata'),
        records: fixture.buildList('assetType', numberOfAssetTypes)
      };
      assetTypesFromServerBeforeFormat = {
        ...assetTypesFromServerAfterFormat,
        records: assetTypesFromServerAfterFormat.records.map((asset) =>
          fixture.build('assetType', asset, { fromServer: true })
        )
      };
      paginationOptionsBeforeFormat = {
        limit: faker.random.number({ min: 10, max: 1000 }),
        offset: faker.random.number({ max: 1000 })
      };
      paginationOptionsAfterFormat = {
        ...paginationOptionsBeforeFormat
      };

      formatPaginatedDataFromServer = sinon
        .stub(paginationUtils, 'formatPaginatedDataFromServer')
        .returns(assetTypesFromServerAfterFormat);
      request = {
        ...baseRequest,
        get: sinon.stub().resolves(assetTypesFromServerBeforeFormat)
      };
      toSnakeCase = sinon
        .stub(objectUtils, 'toSnakeCase')
        .returns(paginationOptionsAfterFormat);

      const assetTypes = new AssetTypes(baseSdk, request, expectedHost);

      promise = assetTypes.getAll(paginationOptionsBeforeFormat);
    });

    it('formats the pagination options', function() {
      expect(toSnakeCase).to.be.calledWith(paginationOptionsBeforeFormat);
    });

    it('gets a list of the asset types from the server', function() {
      expect(request.get).to.be.calledWith(`${expectedHost}/assets/types`, {
        params: paginationOptionsAfterFormat
      });
    });

    it('formats the asset type object', function() {
      return promise.then(() => {
        expect(formatPaginatedDataFromServer).to.be.calledWith(
          assetTypesFromServerBeforeFormat
        );
      });
    });

    it('returns a list of asset types', function() {
      return expect(promise).to.be.fulfilled.and.to.eventually.equal(
        assetTypesFromServerAfterFormat
      );
    });
  });

  describe('getAllByOrganizationId', function() {
    context('the organization ID is provided', function() {
      let assetTypesFromServerAfterFormat;
      let assetTypesFromServerBeforeFormat;
      let expectedOrganizationId;
      let formatPaginatedDataFromServer;
      let numberOfAssetTypes;
      let paginationOptionsAfterFormat;
      let paginationOptionsBeforeFormat;
      let promise;
      let request;
      let toSnakeCase;

      beforeEach(function() {
        expectedOrganizationId = fixture.build('organization').id;
        numberOfAssetTypes = faker.random.number({ min: 1, max: 10 });
        assetTypesFromServerAfterFormat = {
          _metadata: fixture.build('paginationMetadata'),
          records: fixture.buildList('assetType', numberOfAssetTypes)
        };
        assetTypesFromServerBeforeFormat = {
          ...assetTypesFromServerAfterFormat,
          records: assetTypesFromServerAfterFormat.records.map((asset) =>
            fixture.build('assetType', asset, { fromServer: true })
          )
        };
        paginationOptionsBeforeFormat = {
          limit: faker.random.number({ min: 10, max: 1000 }),
          offset: faker.random.number({ max: 1000 })
        };
        paginationOptionsAfterFormat = {
          ...paginationOptionsBeforeFormat
        };

        formatPaginatedDataFromServer = sinon
          .stub(paginationUtils, 'formatPaginatedDataFromServer')
          .returns(assetTypesFromServerAfterFormat);
        request = {
          ...baseRequest,
          get: sinon.stub().resolves(assetTypesFromServerBeforeFormat)
        };
        toSnakeCase = sinon
          .stub(objectUtils, 'toSnakeCase')
          .returns(paginationOptionsAfterFormat);

        const assetTypes = new AssetTypes(baseSdk, request, expectedHost);

        promise = assetTypes.getAllByOrganizationId(
          expectedOrganizationId,
          paginationOptionsBeforeFormat
        );
      });

      it('formats the pagination options', function() {
        expect(toSnakeCase).to.be.calledWith(paginationOptionsBeforeFormat);
      });

      it('gets a list of asset types for an organization from the server', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/organizations/${expectedOrganizationId}/assets/types`,
          { params: paginationOptionsAfterFormat }
        );
      });

      it('formats the asset type object', function() {
        return promise.then(() => {
          expect(formatPaginatedDataFromServer).to.be.calledWith(
            assetTypesFromServerBeforeFormat
          );
        });
      });

      it('returns a list of asset types', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.equal(
          assetTypesFromServerAfterFormat
        );
      });
    });

    context('the organization ID is not provided', function() {
      it('throws an error', function() {
        const assetTypes = new AssetTypes(baseSdk, baseRequest, expectedHost);
        const promise = assetTypes.getAllByOrganizationId();

        return expect(promise).to.be.rejectedWith(
          "An organization ID is required for getting a list of an organization's asset types."
        );
      });
    });
  });

  describe('update', function() {
    context('when all required information is available', function() {
      let assetTypeToServerAfterFormat;
      let assetTypeToServerBeforeFormat;
      let promise;
      let toSnakeCase;

      beforeEach(function() {
        assetTypeToServerAfterFormat = fixture.build('assetType', null, {
          fromServer: true
        });
        assetTypeToServerBeforeFormat = fixture.build('assetType');

        toSnakeCase = sinon
          .stub(objectUtils, 'toSnakeCase')
          .returns(assetTypeToServerAfterFormat);

        const assetTypes = new AssetTypes(baseSdk, baseRequest, expectedHost);

        promise = assetTypes.update(
          assetTypeToServerBeforeFormat.id,
          assetTypeToServerBeforeFormat
        );
      });

      it('formats the data into the right format', function() {
        expect(toSnakeCase).to.be.calledWith(assetTypeToServerBeforeFormat, {
          excludeKeys: ['id', 'label', 'organizationId']
        });
      });

      it('updates the asset type', function() {
        expect(baseRequest.put).to.be.deep.calledWith(
          `${expectedHost}/assets/types/${assetTypeToServerBeforeFormat.id}`
        );
      });

      it('returns a fulfilled promise', function() {
        return expect(promise).to.be.fulfilled;
      });
    });

    context(
      'when there is missing or malformed required information',
      function() {
        let assetTypes;

        beforeEach(function() {
          assetTypes = new AssetTypes(baseSdk, baseRequest, expectedHost);
        });

        it('throws an error when there is no provided asset type ID', function() {
          const assetTypeUpdate = fixture.build('assetType');
          const promise = assetTypes.update(null, assetTypeUpdate);

          return expect(promise).to.be.rejectedWith(
            'An asset type ID is required to update an asset type.'
          );
        });

        it('throws an error when there is no updated provided', function() {
          const assetTypeUpdate = fixture.build('assetType');
          const promise = assetTypes.update(assetTypeUpdate.id);

          return expect(promise).to.be.rejectedWith(
            'An update is required to update an asset type.'
          );
        });

        it('throws an error when the update is not a well-formed object', function() {
          const assetTypeUpdate = fixture.build('assetType');
          const promise = assetTypes.update(assetTypeUpdate.id, [
            assetTypeUpdate
          ]);

          return expect(promise).to.be.rejectedWith(
            'The asset type update must be a well-formed object with the data you wish to update.'
          );
        });
      }
    );
  });
});

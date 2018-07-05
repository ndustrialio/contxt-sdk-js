import omit from 'lodash.omit';
import AssetTypes from './assetTypes';
import * as assetsUtils from '../utils/assets';

describe('Assets/Types', function() {
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
    context('when all required information is supplied', function() {
      let assetTypeFromServerAfterFormat;
      let assetTypeFromServerBeforeFormat;
      let assetTypeToServerAfterFormat;
      let assetTypeToServerBeforeFormat;
      let formatAssetTypeFromServer;
      let formatAssetTypeToServer;
      let promise;
      let request;

      beforeEach(function() {
        assetTypeFromServerAfterFormat = fixture.build('assetType');
        assetTypeFromServerBeforeFormat = fixture.build('assetType', null, {
          fromServer: true
        });
        assetTypeToServerAfterFormat = fixture.build('assetType', null, {
          fromServer: true
        });
        assetTypeToServerBeforeFormat = fixture.build('assetType');

        formatAssetTypeFromServer = this.sandbox
          .stub(assetsUtils, 'formatAssetTypeFromServer')
          .returns(assetTypeFromServerAfterFormat);
        formatAssetTypeToServer = this.sandbox
          .stub(assetsUtils, 'formatAssetTypeToServer')
          .returns(assetTypeToServerAfterFormat);

        request = {
          ...baseRequest,
          post: this.sandbox.stub().resolves(assetTypeFromServerBeforeFormat)
        };

        const assetTypes = new AssetTypes(baseSdk, request, expectedHost);

        promise = assetTypes.create(assetTypeToServerBeforeFormat);
      });

      it('formats the submitted asset type object to send to the server', function() {
        expect(formatAssetTypeToServer).to.be.deep.calledWith(
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
          expect(formatAssetTypeFromServer).to.be.deep.calledWith(
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
      let formatAssetTypeFromServer;
      let promise;
      let request;

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

        formatAssetTypeFromServer = this.sandbox
          .stub(assetsUtils, 'formatAssetTypeFromServer')
          .returns(assetTypeFromServerAfterFormat);

        request = {
          ...baseRequest,
          get: this.sandbox.stub().resolves(assetTypeFromServerBeforeFormat)
        };

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
          expect(formatAssetTypeFromServer).to.be.deep.calledWith(
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
    let formatAssetTypesDataFromServer;
    let numberOfAssetTypes;
    let offset;
    let promise;
    let request;

    beforeEach(function() {
      offset = faker.random.number({ min: 0, max: 100 });
      numberOfAssetTypes = faker.random.number({ min: 1, max: 10 });
      assetTypesFromServerAfterFormat = fixture.buildList(
        'assetType',
        numberOfAssetTypes
      );
      assetTypesFromServerBeforeFormat = fixture.buildList(
        'assetType',
        numberOfAssetTypes,
        null,
        { fromServer: true }
      );

      formatAssetTypesDataFromServer = this.sandbox
        .stub(assetsUtils, 'formatAssetTypesDataFromServer')
        .returns({
          _metadata: {
            offset,
            totalRecords: assetTypesFromServerBeforeFormat.length
          },
          records: assetTypesFromServerAfterFormat
        });

      request = {
        ...baseRequest,
        get: this.sandbox.stub().resolves({
          records: assetTypesFromServerBeforeFormat,
          _metadata: { offset: 0, totalRecords: numberOfAssetTypes }
        })
      };

      const assetTypes = new AssetTypes(baseSdk, request, expectedHost);

      promise = assetTypes.getAll();
    });

    it('gets a list of the asset types from the server', function() {
      expect(request.get).to.be.calledWith(`${expectedHost}/assets/types`);
    });

    it('formats the asset type object', function() {
      return promise.then(() => {
        expect(formatAssetTypesDataFromServer).to.be.calledOnce;
      });
    });

    it('returns a list of asset types', function() {
      return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal({
        records: assetTypesFromServerAfterFormat,
        _metadata: {
          offset,
          totalRecords: numberOfAssetTypes
        }
      });
    });
  });

  describe('getAllByOrganizationId', function() {
    context('the organization ID is provided', function() {
      let assetTypesFromServerAfterFormat;
      let assetTypesFromServerBeforeFormat;
      let expectedOrganizationId;
      let formatAssetTypesDataFromServer;
      let numberOfAssetTypes;
      let offset;
      let promise;
      let request;

      beforeEach(function() {
        offset = faker.random.number({ min: 0, max: 100 });
        expectedOrganizationId = fixture.build('organization').id;
        numberOfAssetTypes = faker.random.number({ min: 1, max: 10 });

        assetTypesFromServerAfterFormat = fixture.buildList(
          'assetType',
          numberOfAssetTypes
        );
        assetTypesFromServerBeforeFormat = fixture.buildList(
          'assetType',
          numberOfAssetTypes,
          null,
          { fromServer: true }
        );

        formatAssetTypesDataFromServer = this.sandbox
          .stub(assetsUtils, 'formatAssetTypesDataFromServer')
          .returns({
            _metadata: {
              offset,
              totalRecords: assetTypesFromServerBeforeFormat.length
            },
            records: assetTypesFromServerAfterFormat
          });

        request = {
          ...baseRequest,
          get: this.sandbox.stub().resolves({
            records: assetTypesFromServerBeforeFormat,
            _metadata: { offset: 0, totalRecords: numberOfAssetTypes }
          })
        };

        const assetTypes = new AssetTypes(baseSdk, request, expectedHost);

        promise = assetTypes.getAllByOrganizationId(expectedOrganizationId);
      });

      it('gets a list of asset types for an organization from the server', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/organizations/${expectedOrganizationId}/assets/types`
        );
      });

      it('formats the asset type object', function() {
        return promise.then(() => {
          expect(formatAssetTypesDataFromServer).to.be.calledOnce;
        });
      });

      it('returns a list of asset types', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal({
          records: assetTypesFromServerAfterFormat,
          _metadata: {
            offset,
            totalRecords: numberOfAssetTypes
          }
        });
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
      let formatAssetTypeToServer;
      let promise;

      beforeEach(function() {
        assetTypeToServerAfterFormat = fixture.build('assetType', null, {
          fromServer: true
        });
        assetTypeToServerBeforeFormat = fixture.build('assetType');

        formatAssetTypeToServer = this.sandbox
          .stub(assetsUtils, 'formatAssetTypeToServer')
          .returns(assetTypeToServerAfterFormat);

        const assetTypes = new AssetTypes(baseSdk, baseRequest, expectedHost);

        promise = assetTypes.update(
          assetTypeToServerBeforeFormat.id,
          assetTypeToServerBeforeFormat
        );
      });

      it('formats the data into the right format', function() {
        expect(formatAssetTypeToServer).to.be.deep.calledWith(
          assetTypeToServerBeforeFormat
        );
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

import omit from 'lodash.omit';
import AssetAttributes from './assetAttributes';
import * as assetsUtils from '../utils/assets';

describe('Assets/Attributes', function() {
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
    let assetAttributes;

    beforeEach(function() {
      assetAttributes = new AssetAttributes(baseSdk, baseRequest, expectedHost);
    });

    it('sets a base url for the class instance', function() {
      expect(assetAttributes._baseUrl).to.equal(expectedHost);
    });

    it('appends the supplied request module to the class instance', function() {
      expect(assetAttributes._request).to.deep.equal(baseRequest);
    });

    it('appends the supplied sdk to the class instance', function() {
      expect(assetAttributes._sdk).to.deep.equal(baseSdk);
    });
  });

  describe('create', function() {
    context('when all required information is supplied', function() {
      let assetAttributeFromServerAfterFormat;
      let assetAttributeFromServerBeforeFormat;
      let assetAttributeToServerAfterFormat;
      let assetAttributeToServerBeforeFormat;
      let assetTypeId;
      let formatAssetAttributeFromServer;
      let formatAssetAttributeToServer;
      let promise;
      let request;

      beforeEach(function() {
        assetAttributeFromServerAfterFormat = fixture.build('assetAttribute');
        assetAttributeFromServerBeforeFormat = fixture.build(
          'assetAttribute',
          null,
          { fromServer: true }
        );
        assetAttributeToServerAfterFormat = fixture.build(
          'assetAttribute',
          null,
          { fromServer: true }
        );
        assetAttributeToServerBeforeFormat = fixture.build('assetAttribute');

        assetTypeId = fixture.build('assetType').id;

        formatAssetAttributeFromServer = this.sandbox
          .stub(assetsUtils, 'formatAssetAttributeFromServer')
          .returns(assetAttributeFromServerAfterFormat);
        formatAssetAttributeToServer = this.sandbox
          .stub(assetsUtils, 'formatAssetAttributeToServer')
          .returns(assetAttributeToServerAfterFormat);

        request = {
          ...baseRequest,
          post: this.sandbox
            .stub()
            .resolves(assetAttributeFromServerBeforeFormat)
        };

        const assetAttributes = new AssetAttributes(
          baseSdk,
          request,
          expectedHost
        );

        promise = assetAttributes.create(
          assetTypeId,
          assetAttributeToServerBeforeFormat
        );
      });

      it('formats the submitted asset attribute object to send to the server', function() {
        expect(formatAssetAttributeToServer).to.be.deep.calledWith(
          assetAttributeToServerBeforeFormat
        );
      });

      it('creates a new asset attribute', function() {
        expect(request.post).to.be.deep.calledWith(
          `${expectedHost}/assets/types/${assetTypeId}/attributes`,
          assetAttributeToServerAfterFormat
        );
      });

      it('formats the returned asset attribute object', function() {
        return promise.then(() => {
          expect(formatAssetAttributeFromServer).to.be.deep.calledWith(
            assetAttributeFromServerBeforeFormat
          );
        });
      });

      it('returns a fulfilled promise with the new asset attribute information', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
          assetAttributeFromServerAfterFormat
        );
      });
    });

    context('when there is missing required information', function() {
      let assetAttribute;
      let assetAttributes;
      let assetTypeId;
      let promise;

      beforeEach(function() {
        assetAttribute = fixture.build('assetAttribute');
        assetAttributes = new AssetAttributes(
          baseSdk,
          baseRequest,
          expectedHost
        );
        assetTypeId = fixture.build('assetType').id;
      });

      it('throws an error if there is no asset type ID provided', function() {
        promise = assetAttributes.create(null, assetAttribute);

        return expect(promise).to.be.rejectedWith(
          'An asset type ID is required to create a new asset attribute.'
        );
      });

      ['description', 'label', 'organizationId'].forEach((field) => {
        it(`throws an error when ${field} is missing`, function() {
          promise = assetAttributes.create(
            assetTypeId,
            omit(assetAttribute, [field])
          );

          return expect(promise).to.be.rejectedWith(
            `A ${field} is required to create a new asset attribute.`
          );
        });
      });
    });
  });

  describe('delete', function() {
    context('when all required information is supplied', function() {
      let expectedAssetAttributeId;
      let promise;

      beforeEach(function() {
        expectedAssetAttributeId = fixture.build('assetAttribute').id;

        const assetAttributes = new AssetAttributes(
          baseSdk,
          baseRequest,
          expectedHost
        );

        promise = assetAttributes.delete(expectedAssetAttributeId);
      });

      it('requres to delete the asset attribute', function() {
        expect(baseRequest.delete).to.be.calledWith(
          `${expectedHost}/assets/attributes/${expectedAssetAttributeId}`
        );
      });

      it('returns a fulfilled promise', function() {
        return expect(promise).to.be.fulfilled;
      });
    });

    context('when there is missing required information', function() {
      it('throws an error when the asset attribute ID is missing', function() {
        const assetAttributes = new AssetAttributes(
          baseSdk,
          baseRequest,
          expectedHost
        );

        const promise = assetAttributes.delete();

        return expect(promise).to.be.rejectedWith(
          'An asset attribute ID is required for deleting an asset attribute.'
        );
      });
    });
  });

  describe('get', function() {
    context('the asset attribute ID is provided', function() {
      let assetAttributeFromServerAfterFormat;
      let assetAttributeFromServerBeforeFormat;
      let expectedAssetAttributeId;
      let formatAssetAttributeFromServer;
      let promise;
      let request;

      beforeEach(function() {
        expectedAssetAttributeId = fixture.build('assetAttribute').id;
        assetAttributeFromServerAfterFormat = fixture.build('assetAttribute', {
          id: expectedAssetAttributeId
        });
        assetAttributeFromServerBeforeFormat = fixture.build(
          'assetAttribute',
          assetAttributeFromServerAfterFormat,
          { fromServer: true }
        );

        formatAssetAttributeFromServer = this.sandbox
          .stub(assetsUtils, 'formatAssetAttributeFromServer')
          .returns(assetAttributeFromServerAfterFormat);

        request = {
          ...baseRequest,
          get: this.sandbox
            .stub()
            .resolves(assetAttributeFromServerBeforeFormat)
        };

        const assetAttributes = new AssetAttributes(
          baseSdk,
          request,
          expectedHost
        );

        promise = assetAttributes.get(expectedAssetAttributeId);
      });

      it('gets the asset attribute from the server', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/assets/attributes/${expectedAssetAttributeId}`
        );
      });

      it('formats the asset attribute object', function() {
        return promise.then(() => {
          expect(formatAssetAttributeFromServer).to.be.deep.calledWith(
            assetAttributeFromServerBeforeFormat
          );
        });
      });

      it('returns the requested asset attribute', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
          assetAttributeFromServerAfterFormat
        );
      });
    });

    context('the asset attribute ID is not provided', function() {
      it('throws an error', function() {
        const assetAttributes = new AssetAttributes(
          baseSdk,
          baseRequest,
          expectedHost
        );
        const promise = assetAttributes.get();

        return expect(promise).to.be.rejectedWith(
          'An asset attribute ID is required for getting information about an asset attribute.'
        );
      });
    });
  });

  describe('getAll', function() {
    context('when all required information is supplied', function() {
      let assetAttributesFromServerAfterFormat;
      let assetAttributesFromServerBeforeFormat;
      let assetTypeId;
      let formatAssetAttributeDataFromServer;
      let numberOfAssetAttributes;
      let offset;
      let promise;
      let request;

      beforeEach(function() {
        offset = faker.random.number({ min: 0, max: 100 });
        numberOfAssetAttributes = faker.random.number({ min: 1, max: 10 });
        assetTypeId = fixture.build('assetType').id;
        assetAttributesFromServerAfterFormat = fixture.buildList(
          'assetAttribute',
          numberOfAssetAttributes,
          { assetTypeId }
        );
        assetAttributesFromServerBeforeFormat = fixture.buildList(
          'assetAttribute',
          numberOfAssetAttributes,
          { assetTypeId },
          { fromServer: true }
        );

        formatAssetAttributeDataFromServer = this.sandbox
          .stub(assetsUtils, 'formatAssetAttributeDataFromServer')
          .returns({
            _metadata: {
              offset,
              totalRecords: numberOfAssetAttributes
            },
            records: assetAttributesFromServerAfterFormat
          });

        request = {
          ...baseRequest,
          get: this.sandbox.stub().resolves({
            _metadata: { offset, totalRecords: numberOfAssetAttributes },
            records: assetAttributesFromServerBeforeFormat
          })
        };

        const assetAttributes = new AssetAttributes(
          baseSdk,
          request,
          expectedHost
        );

        promise = assetAttributes.getAll(assetTypeId);
      });

      it('gets a list of the asset attributes from the server', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/assets/types/${assetTypeId}/attributes`
        );
      });

      it('formats the asset attribute data', function() {
        return promise.then(() => {
          expect(formatAssetAttributeDataFromServer).to.be.calledOnce;
        });
      });

      it('returns a list of asset attributes', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal({
          _metadata: {
            offset,
            totalRecords: numberOfAssetAttributes
          },
          records: assetAttributesFromServerAfterFormat
        });
      });
    });

    context('when there is missing required information', function() {
      let promise;

      beforeEach(function() {
        const assetAttributes = new AssetAttributes(
          baseSdk,
          baseRequest,
          expectedHost
        );

        promise = assetAttributes.getAll();
      });
      it('throws an error when the asset type ID is missing', function() {
        expect(promise).to.be.rejectedWith(
          'An asset type ID is required to get a list of all asset attributes.'
        );
      });
    });
  });

  describe('update', function() {
    context('when all required information is supplied', function() {
      let assetAttributeToServerAfterFormat;
      let assetAttributeToServerBeforeFormat;
      let formatAssetAttributeToServer;
      let promise;

      beforeEach(function() {
        assetAttributeToServerAfterFormat = fixture.build(
          'assetAttribute',
          null,
          { fromServer: true }
        );
        assetAttributeToServerBeforeFormat = fixture.build('assetAttribute');

        formatAssetAttributeToServer = this.sandbox
          .stub(assetsUtils, 'formatAssetAttributeToServer')
          .returns(assetAttributeToServerAfterFormat);

        const assetAttributes = new AssetAttributes(
          baseSdk,
          baseRequest,
          expectedHost
        );

        promise = assetAttributes.update(
          assetAttributeToServerBeforeFormat.id,
          assetAttributeToServerBeforeFormat
        );
      });

      it('formats the data into the right format', function() {
        expect(formatAssetAttributeToServer).to.be.deep.calledWith(
          assetAttributeToServerBeforeFormat
        );
      });

      it('updates the asset attribute', function() {
        expect(baseRequest.put).to.be.deep.calledWith(
          `${expectedHost}/assets/attributes/${
            assetAttributeToServerBeforeFormat.id
          }`,
          assetAttributeToServerAfterFormat
        );
      });

      it('returns a fulfilled promise', function() {
        return expect(promise).to.be.fulfilled;
      });
    });

    context(
      'when there is missing or malformed required information',
      function() {
        let assetAttributes;

        beforeEach(function() {
          assetAttributes = new AssetAttributes(
            baseSdk,
            baseRequest,
            expectedHost
          );
        });

        it('throws an error when there is not provided asset attribute ID', function() {
          const assetAttributeUpdate = fixture.build('assetAttribute');
          const promise = assetAttributes.update(null, assetAttributeUpdate);

          return expect(promise).to.be.rejectedWith(
            'An asset attribute ID is required to update an asset attribute.'
          );
        });

        it('throws an error when there is no update provided', function() {
          const assetAttributeUpdate = fixture.build('assetAttribute');
          const promise = assetAttributes.update(assetAttributeUpdate.id);

          return expect(promise).to.be.rejectedWith(
            'An update is required to update an asset attribute.'
          );
        });

        it('throws an error when the update is not a well-formed object', function() {
          const assetAttributeUpdate = fixture.build('assetAttribute');
          const promise = assetAttributes.update(assetAttributeUpdate.id, [
            assetAttributeUpdate
          ]);

          return expect(promise).to.be.rejectedWith(
            'The asset attribute update must be a well-formed object with the data you wish to update.'
          );
        });
      }
    );
  });

  describe('createValue', function() {
    context('when all required information is supplied', function() {
      let assetAttributeValueFromServerAfterFormat;
      let assetAttributeValueFromServerBeforeFormat;
      let assetAttributeValueToServerAfterFormat;
      let assetAttributeValueToServerBeforeFormat;
      let assetId;
      let formatAssetAttributeValueFromServer;
      let formatAssetAttributeValueToServer;
      let promise;
      let request;

      beforeEach(function() {
        assetAttributeValueToServerBeforeFormat = fixture.build(
          'assetAttributeValue'
        );
        assetAttributeValueToServerAfterFormat = fixture.build(
          'assetAttributeValue',
          assetAttributeValueToServerBeforeFormat,
          {
            fromServer: true
          }
        );
        assetAttributeValueFromServerAfterFormat = fixture.build(
          'assetAttributeValue'
        );
        assetAttributeValueFromServerBeforeFormat = fixture.build(
          'assetAttributeValue',
          assetAttributeValueFromServerAfterFormat,
          { fromServer: true }
        );
        assetId = fixture.build('asset').id;

        formatAssetAttributeValueFromServer = this.sandbox
          .stub(assetsUtils, 'formatAssetAttributeValueFromServer')
          .returns(assetAttributeValueFromServerAfterFormat);
        formatAssetAttributeValueToServer = this.sandbox
          .stub(assetsUtils, 'formatAssetAttributeValueToServer')
          .returns(assetAttributeValueToServerAfterFormat);
        request = {
          ...baseRequest,
          post: this.sandbox
            .stub()
            .resolves(assetAttributeValueFromServerBeforeFormat)
        };

        const assetAttributes = new AssetAttributes(
          baseSdk,
          request,
          expectedHost
        );

        promise = assetAttributes.createValue(
          assetId,
          assetAttributeValueToServerBeforeFormat
        );
      });

      it('formats the submitted asset attribute value object to send to the server ', function() {
        expect(formatAssetAttributeValueToServer).to.be.calledWith(
          assetAttributeValueToServerBeforeFormat
        );
      });

      it('creates a new asset attribute value', function() {
        expect(request.post).to.be.calledWith(
          `${expectedHost}/assets/${assetId}/values`,
          assetAttributeValueToServerAfterFormat
        );
      });

      it('formats the returned asset attribute object', function() {
        return promise.then(() => {
          expect(formatAssetAttributeValueFromServer).to.be.calledWith(
            assetAttributeValueFromServerBeforeFormat
          );
        });
      });

      it('returns a fulfilled promise with the new asset attribute value information', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
          assetAttributeValueFromServerAfterFormat
        );
      });
    });

    context('when there is missing required information', function() {
      let assetAttributeValue;
      let assetAttributes;
      // let assetTypeId;

      beforeEach(function() {
        assetAttributeValue = fixture.build('assetAttributeValue');

        assetAttributes = new AssetAttributes(
          baseSdk,
          baseRequest,
          expectedHost
        );
      });

      it('throws an error if there is no asset type ID provided', function() {
        const promise = assetAttributes.createValue(null, assetAttributeValue);

        return expect(promise).to.be.rejectedWith(
          'An asset ID is required to create a new asset attribute value.'
        );
      });

      ['assetAttributeId', 'effectiveDate', 'value'].forEach(function(field) {
        it(`throws an error when ${field} is missing`, function() {
          const promise = assetAttributes.createValue(
            assetAttributeValue.id,
            omit(assetAttributeValue, [field])
          );

          return expect(promise).to.be.rejectedWith(
            `A ${field} is required to create a new asset attribute value.`
          );
        });
      });
    });
  });

  describe('deleteValue', function() {
    context('when all required information is supplied', function() {
      let expectedAssetAttributeValueId;
      let promise;

      beforeEach(function() {
        expectedAssetAttributeValueId = fixture.build('assetAttributeValue').id;

        const assetAttributes = new AssetAttributes(
          baseSdk,
          baseRequest,
          expectedHost
        );

        promise = assetAttributes.deleteValue(expectedAssetAttributeValueId);
      });

      it('requests to delete the asset attribute value', function() {
        expect(baseRequest.delete).to.be.calledWith(
          `${expectedHost}/assets/attributes/values/${expectedAssetAttributeValueId}`
        );
      });

      it('returns a fulfilled promise', function() {
        return expect(promise).to.be.fulfilled;
      });
    });

    context('when there is missing required information', function() {
      it('throws an error when the asset attribute value ID is missing', function() {
        const assetAttributes = new AssetAttributes(
          baseSdk,
          baseRequest,
          expectedHost
        );

        const promise = assetAttributes.deleteValue();

        return expect(promise).to.be.rejectedWith(
          'An asset attribute value ID is required for deleting an asset attribute value.'
        );
      });
    });
  });

  describe('getValue', function() {});

  describe('getAllValues', function() {});

  describe('updateValue', function() {});
});

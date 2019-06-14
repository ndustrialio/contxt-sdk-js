import omit from 'lodash.omit';
import AssetAttributes from './assetAttributes';
import * as objectUtils from '../utils/objects';
import * as paginationUtils from '../utils/pagination';

describe('Assets/Attributes', function() {
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
      let promise;
      let request;
      let toCamelCase;
      let toSnakeCase;

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

        request = {
          ...baseRequest,
          post: sinon.stub().resolves(assetAttributeFromServerBeforeFormat)
        };
        toCamelCase = sinon
          .stub(objectUtils, 'toCamelCase')
          .returns(assetAttributeFromServerAfterFormat);
        toSnakeCase = sinon
          .stub(objectUtils, 'toSnakeCase')
          .returns(assetAttributeToServerAfterFormat);

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
        expect(toSnakeCase).to.be.deep.calledWith(
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
          expect(toCamelCase).to.be.deep.calledWith(
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

    context('when creating a global attribute', function() {
      let assetTypeId;
      let attributeFromServerAfterFormat;
      let attributeFromServerBeforeFormat;
      let attributeToServerAfterFormat;
      let attributeToServerBeforeFormat;
      let promise;
      let request;
      let toCamelCase;
      let toSnakeCase;

      beforeEach(function() {
        attributeFromServerBeforeFormat = fixture.build('assetAttribute', {
          organizationId: null
        });
        attributeFromServerAfterFormat = fixture.build(
          'assetAttribute',
          attributeToServerBeforeFormat,
          { fromServer: true }
        );
        attributeToServerBeforeFormat = fixture.build('assetAttribute', {
          organizationId: null
        });
        attributeToServerAfterFormat = fixture.build(
          'assetAttribute',
          attributeToServerBeforeFormat,
          { fromServer: true }
        );

        assetTypeId = fixture.build('assetType').id;

        request = {
          ...baseRequest,
          post: sinon.stub().resolves(attributeFromServerBeforeFormat)
        };
        toCamelCase = sinon
          .stub(objectUtils, 'toCamelCase')
          .returns(attributeFromServerAfterFormat);
        toSnakeCase = sinon
          .stub(objectUtils, 'toSnakeCase')
          .returns(attributeToServerAfterFormat);

        const attributes = new AssetAttributes(baseSdk, request, expectedHost);

        promise = attributes.create(assetTypeId, attributeToServerBeforeFormat);
      });

      it('formats the submitted attribute object to send to the server', function() {
        expect(toSnakeCase).to.be.deep.calledWith(
          attributeToServerBeforeFormat
        );
      });

      it('creates a new attribute', function() {
        expect(request.post).to.be.deep.calledWith(
          `${expectedHost}/assets/types/${assetTypeId}/attributes`,
          attributeToServerAfterFormat
        );
      });

      it('formats the returned attribute object', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.deep.calledWith(
            attributeFromServerBeforeFormat
          );
        });
      });

      it('returns a fulfilled promise with the new attribute information', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
          attributeFromServerAfterFormat
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

      it('requests to delete the asset attribute', function() {
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
      let promise;
      let request;
      let toCamelCase;

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

        request = {
          ...baseRequest,
          get: sinon.stub().resolves(assetAttributeFromServerBeforeFormat)
        };
        toCamelCase = sinon
          .stub(objectUtils, 'toCamelCase')
          .returns(assetAttributeFromServerAfterFormat);

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
          expect(toCamelCase).to.be.deep.calledWith(
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
      let assetTypeId;
      let formatPaginatedDataFromServer;
      let numberOfAssetAttributes;
      let paginationOptionsAfterFormat;
      let paginationOptionsBeforeFormat;
      let promise;
      let request;
      let toSnakeCase;
      let valuesFromServerAfterFormat;
      let valuesFromServerBeforeFormat;

      beforeEach(function() {
        numberOfAssetAttributes = faker.random.number({ min: 1, max: 10 });
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
          records: fixture.buildList(
            'assetAttribute',
            numberOfAssetAttributes,
            { assetTypeId }
          )
        };
        valuesFromServerBeforeFormat = {
          ...valuesFromServerAfterFormat,
          records: valuesFromServerAfterFormat.records.map((values) =>
            fixture.build('assetAttribute', values, { fromServer: true })
          )
        };

        formatPaginatedDataFromServer = sinon
          .stub(paginationUtils, 'formatPaginatedDataFromServer')
          .returns(valuesFromServerAfterFormat);
        request = {
          ...baseRequest,
          get: sinon.stub().resolves(valuesFromServerBeforeFormat)
        };
        toSnakeCase = sinon
          .stub(objectUtils, 'toSnakeCase')
          .returns(paginationOptionsAfterFormat);

        const assetAttributes = new AssetAttributes(
          baseSdk,
          request,
          expectedHost
        );
        promise = assetAttributes.getAll(
          assetTypeId,
          paginationOptionsBeforeFormat
        );
      });

      it('formats the pagination options sent to the server', function() {
        expect(toSnakeCase).to.be.calledWith(paginationOptionsBeforeFormat);
      });

      it('gets a list of the asset attributes from the server', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/assets/types/${assetTypeId}/attributes`,
          { params: paginationOptionsAfterFormat }
        );
      });

      it('formats the asset attribute data', function() {
        return promise.then(() => {
          expect(formatPaginatedDataFromServer).to.be.calledWith(
            valuesFromServerBeforeFormat
          );
        });
      });

      it('resolves with a list of asset attributes', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
          valuesFromServerAfterFormat
        );
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
        return expect(promise).to.be.rejectedWith(
          'An asset type ID is required to get a list of all asset attributes.'
        );
      });
    });
  });

  describe('update', function() {
    context('when all required information is supplied', function() {
      let assetAttributeToServerAfterFormat;
      let assetAttributeToServerBeforeFormat;
      let toSnakeCase;
      let promise;

      beforeEach(function() {
        assetAttributeToServerAfterFormat = fixture.build(
          'assetAttribute',
          null,
          { fromServer: true }
        );
        assetAttributeToServerBeforeFormat = fixture.build('assetAttribute');

        toSnakeCase = sinon
          .stub(objectUtils, 'toSnakeCase')
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
        expect(toSnakeCase).to.be.deep.calledWith(
          assetAttributeToServerBeforeFormat,
          { excludeKeys: ['assetTypeId', 'id', 'organizationId'] }
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
      let assetId;
      let promise;
      let request;
      let toCamelCase;
      let toSnakeCase;
      let valueFromServerAfterFormat;
      let valueFromServerBeforeFormat;
      let valueToServerAfterFormat;
      let valueToServerBeforeFormat;

      beforeEach(function() {
        valueToServerBeforeFormat = fixture.build('assetAttributeValue');
        valueToServerAfterFormat = fixture.build(
          'assetAttributeValue',
          valueToServerBeforeFormat,
          {
            fromServer: true
          }
        );
        valueFromServerAfterFormat = fixture.build('assetAttributeValue');
        valueFromServerBeforeFormat = fixture.build(
          'assetAttributeValue',
          valueFromServerAfterFormat,
          { fromServer: true }
        );
        assetId = fixture.build('asset').id;

        request = {
          ...baseRequest,
          post: sinon.stub().resolves(valueFromServerBeforeFormat)
        };
        toCamelCase = sinon
          .stub(objectUtils, 'toCamelCase')
          .returns(valueFromServerAfterFormat);
        toSnakeCase = sinon
          .stub(objectUtils, 'toSnakeCase')
          .returns(valueToServerAfterFormat);

        const assetAttributes = new AssetAttributes(
          baseSdk,
          request,
          expectedHost
        );

        promise = assetAttributes.createValue(
          assetId,
          valueToServerBeforeFormat
        );
      });

      it('formats the submitted asset attribute value object to send to the server ', function() {
        expect(toSnakeCase).to.be.calledWith(valueToServerBeforeFormat);
      });

      it('creates a new asset attribute value', function() {
        expect(request.post).to.be.calledWith(
          `${expectedHost}/assets/${assetId}/attributes/${
            valueToServerBeforeFormat.assetAttributeId
          }/values`,
          valueToServerAfterFormat
        );
      });

      it('formats the returned asset attribute object', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.calledWith(valueFromServerBeforeFormat);
        });
      });

      it('returns a fulfilled promise with the new asset attribute value information', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
          valueFromServerAfterFormat
        );
      });
    });

    context('when there is missing required information', function() {
      let value;
      let assetAttributes;

      beforeEach(function() {
        value = fixture.build('assetAttributeValue');

        assetAttributes = new AssetAttributes(
          baseSdk,
          baseRequest,
          expectedHost
        );
      });

      it('throws an error if there is no asset type ID provided', function() {
        const promise = assetAttributes.createValue(null, value);

        return expect(promise).to.be.rejectedWith(
          'An asset ID is required to create a new asset attribute value.'
        );
      });

      ['assetAttributeId', 'effectiveDate', 'value'].forEach(function(field) {
        it(`throws an error when ${field} is missing`, function() {
          const promise = assetAttributes.createValue(
            value.id,
            omit(value, [field])
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
      let valueId;
      let promise;

      beforeEach(function() {
        valueId = fixture.build('assetAttributeValue').id;

        const assetAttributes = new AssetAttributes(
          baseSdk,
          baseRequest,
          expectedHost
        );

        promise = assetAttributes.deleteValue(valueId);
      });

      it('requests to delete the asset attribute value', function() {
        expect(baseRequest.delete).to.be.calledWith(
          `${expectedHost}/assets/attributes/values/${valueId}`
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

  describe('getEffectiveValuesByAssetId', function() {
    context('when all required information is supplied', function() {
      let assetId;
      let promise;
      let request;
      let toCamelCase;
      let toSnakeCase;
      let valueFiltersToServerAfterFormat;
      let valueFiltersToServerBeforeFormat;
      let valuesFromServerAfterFormat;
      let valuesFromServerBeforeFormat;

      beforeEach(function() {
        assetId = fixture.build('asset').id;
        valueFiltersToServerAfterFormat = {
          attribute_label: faker.hacker.phrase(),
          effective_date: faker.date.recent().toISOString()
        };
        valueFiltersToServerBeforeFormat = {
          attributeLabel: faker.hacker.phrase(),
          effectiveDate: faker.date.recent().toISOString()
        };
        valuesFromServerAfterFormat = fixture.buildList(
          'assetAttributeValue',
          faker.random.number({ min: 1, max: 20 }),
          { assetId }
        );
        valuesFromServerBeforeFormat = valuesFromServerAfterFormat.map(
          (values) =>
            fixture.build('assetAttributeValue', values, { fromServer: true })
        );

        request = {
          ...baseRequest,
          get: sinon.stub().resolves(valuesFromServerBeforeFormat)
        };
        toCamelCase = sinon
          .stub(objectUtils, 'toCamelCase')
          .returns(valuesFromServerAfterFormat);
        toSnakeCase = sinon
          .stub(objectUtils, 'toSnakeCase')
          .returns(valueFiltersToServerAfterFormat);

        const assetAttributes = new AssetAttributes(
          baseSdk,
          request,
          expectedHost
        );
        promise = assetAttributes.getEffectiveValuesByAssetId(
          assetId,
          valueFiltersToServerBeforeFormat
        );
      });

      it('formats the filters sent to the server', function() {
        expect(toSnakeCase).to.be.calledWith(valueFiltersToServerBeforeFormat);
      });

      it('gets a list of asset attributes from the server', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/assets/${assetId}/attributes/values`,
          { params: valueFiltersToServerAfterFormat }
        );
      });

      it('formats the asset attribute values', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.calledWith(valuesFromServerBeforeFormat);
        });
      });

      it('resolves with a list of asset attribute values', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
          valuesFromServerAfterFormat
        );
      });
    });

    context('when there is missing required information', function() {
      it('throws an error when the asset ID is missing', function() {
        const assetAttributes = new AssetAttributes(
          baseSdk,
          baseRequest,
          expectedHost
        );
        const promise = assetAttributes.getEffectiveValuesByAssetId(null);

        return expect(promise).to.be.rejectedWith(
          'An asset ID is required to get a list of asset attribute values.'
        );
      });
    });
  });

  describe('getEffectiveValuesByOrganizationId', function() {
    context('when all required information is supplied', function() {
      let formatPaginatedDataFromServer;
      let organizationId;
      let paginationOptionsBeforeFormat;
      let paginationOptionsAfterFormat;
      let promise;
      let request;
      let toSnakeCase;
      let valuesFromServerAfterFormat;
      let valuesFromServerBeforeFormat;

      beforeEach(function() {
        organizationId = fixture.build('organization').id;
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
          records: fixture.buildList(
            'assetAttributeValue',
            faker.random.number({ min: 1, max: 20 })
          )
        };
        valuesFromServerBeforeFormat = {
          ...valuesFromServerAfterFormat,
          records: valuesFromServerAfterFormat.records.map((values) =>
            fixture.build('assetAttributeValue', values, { fromServer: true })
          )
        };

        formatPaginatedDataFromServer = sinon
          .stub(paginationUtils, 'formatPaginatedDataFromServer')
          .returns(valuesFromServerAfterFormat);
        request = {
          ...baseRequest,
          get: sinon.stub().resolves(valuesFromServerBeforeFormat)
        };
        toSnakeCase = sinon
          .stub(objectUtils, 'toSnakeCase')
          .returns(paginationOptionsAfterFormat);

        const assetAttributes = new AssetAttributes(
          baseSdk,
          request,
          expectedHost
        );
        promise = assetAttributes.getEffectiveValuesByOrganizationId(
          organizationId,
          paginationOptionsBeforeFormat
        );
      });

      it('formats the pagination options sent to the server', function() {
        expect(toSnakeCase).to.be.calledWith(paginationOptionsBeforeFormat);
      });

      it('gets a list of asset attribute values from the server', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/organizations/${organizationId}/attributes/values`,
          { params: paginationOptionsAfterFormat }
        );
      });

      it('formats the asset attribute value data', function() {
        return promise.then(() => {
          expect(formatPaginatedDataFromServer).to.be.calledWith(
            valuesFromServerBeforeFormat
          );
        });
      });

      it('resolves with a list of asset attribute values', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
          valuesFromServerAfterFormat
        );
      });
    });

    context('when there is missing required information', function() {
      it('throws an error when the organization ID is missing', function() {
        const assetAttributes = new AssetAttributes(
          baseSdk,
          baseRequest,
          expectedHost
        );
        const promise = assetAttributes.getEffectiveValuesByOrganizationId();

        return expect(promise).to.be.rejectedWith(
          'An organization ID is required to get a list of asset attribute values.'
        );
      });
    });
  });

  describe('getValuesByAttributeId', function() {
    context('when all required information is supplied', function() {
      let assetId;
      let attributeId;
      let formatPaginatedDataFromServer;
      let paginationOptionsBeforeFormat;
      let paginationOptionsAfterFormat;
      let promise;
      let request;
      let toSnakeCase;
      let valuesFromServerAfterFormat;
      let valuesFromServerBeforeFormat;

      beforeEach(function() {
        assetId = fixture.build('asset').id;
        attributeId = fixture.build('assetAttribute').id;
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
          records: fixture.buildList(
            'assetAttributeValue',
            faker.random.number({ min: 1, max: 20 }),
            {
              assetId,
              assetAttributeId: attributeId
            }
          )
        };
        valuesFromServerBeforeFormat = {
          ...valuesFromServerAfterFormat,
          records: valuesFromServerAfterFormat.records.map((values) =>
            fixture.build('assetAttributeValue', values, { fromServer: true })
          )
        };

        formatPaginatedDataFromServer = sinon
          .stub(paginationUtils, 'formatPaginatedDataFromServer')
          .returns(valuesFromServerAfterFormat);
        request = {
          ...baseRequest,
          get: sinon.stub().resolves(valuesFromServerBeforeFormat)
        };
        toSnakeCase = sinon
          .stub(objectUtils, 'toSnakeCase')
          .returns(paginationOptionsAfterFormat);

        const assetAttributes = new AssetAttributes(
          baseSdk,
          request,
          expectedHost
        );
        promise = assetAttributes.getValuesByAttributeId(
          assetId,
          attributeId,
          paginationOptionsBeforeFormat
        );
      });

      it('formats the pagination options sent to the server', function() {
        expect(toSnakeCase).to.be.calledWith(paginationOptionsBeforeFormat);
      });

      it('gets a list of asset attribute values from the server', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/assets/${assetId}/attributes/${attributeId}/values`,
          { params: paginationOptionsAfterFormat }
        );
      });

      it('formats the asset attribute value data', function() {
        return promise.then(() => {
          expect(formatPaginatedDataFromServer).to.be.calledWith(
            valuesFromServerBeforeFormat
          );
        });
      });

      it('resolves with a list of asset attribute values', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
          valuesFromServerAfterFormat
        );
      });
    });

    context('when there is missing required information', function() {
      it('throws an error when the asset ID is missing', function() {
        const assetAttributes = new AssetAttributes(
          baseSdk,
          baseRequest,
          expectedHost
        );
        const promise = assetAttributes.getValuesByAttributeId(
          null,
          fixture.build('assetAttribute').id
        );

        return expect(promise).to.be.rejectedWith(
          'An asset ID is required to get a list of asset attribute values.'
        );
      });

      it('throws an error when the asset attribute ID is missing', function() {
        const assetAttributes = new AssetAttributes(
          baseSdk,
          baseRequest,
          expectedHost
        );
        const promise = assetAttributes.getValuesByAttributeId(
          fixture.build('asset').id,
          null
        );

        return expect(promise).to.be.rejectedWith(
          'An asset attribute ID is required to get a list of asset attribute values.'
        );
      });
    });
  });

  describe('updateValue', function() {
    context('when all required information is supplied', function() {
      let promise;
      let toSnakeCase;
      let valueToServerAfterFormat;
      let valueToServerBeforeFormat;

      beforeEach(function() {
        valueToServerBeforeFormat = fixture.build('assetAttributeValue');
        valueToServerAfterFormat = fixture.build(
          'assetAttributeValue',
          valueToServerBeforeFormat,
          { fromServer: true }
        );

        toSnakeCase = sinon
          .stub(objectUtils, 'toSnakeCase')
          .returns(valueToServerAfterFormat);

        const assetAttributes = new AssetAttributes(
          baseSdk,
          baseRequest,
          expectedHost
        );

        promise = assetAttributes.updateValue(
          valueToServerBeforeFormat.id,
          valueToServerBeforeFormat
        );
      });

      it('formats the data into the right format', function() {
        expect(toSnakeCase).to.calledWith(valueToServerBeforeFormat, {
          excludeKeys: ['assetAttributeId', 'assetId', 'id']
        });
      });

      it('updates the asset attribute value', function() {
        expect(baseRequest.put).to.be.calledWith(
          `${expectedHost}/assets/attributes/values/${
            valueToServerAfterFormat.id
          }`,
          valueToServerAfterFormat
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

        it('throws an error when there is not provided asset attribute value ID', function() {
          const valueUpdate = fixture.build('assetAttributeValue');
          const promise = assetAttributes.updateValue(null, valueUpdate);

          return expect(promise).to.be.rejectedWith(
            'An asset attribute value ID is required to update an asset attribute value.'
          );
        });

        it('throws an error when there is no update provided', function() {
          const valueUpdate = fixture.build('assetAttributeValue');
          const promise = assetAttributes.updateValue(valueUpdate.id);

          return expect(promise).to.be.rejectedWith(
            'An update is required to update an asset attribute value.'
          );
        });

        it('throws an error when the update is not a well-formed object', function() {
          const valueUpdate = fixture.build('assetAttributeValue');
          const promise = assetAttributes.updateValue(valueUpdate.id, [
            valueUpdate
          ]);

          return expect(promise).to.be.rejectedWith(
            'The asset attribute value update must be a well-formed object with the data you wish to update.'
          );
        });
      }
    );
  });
});

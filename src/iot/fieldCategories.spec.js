import omit from 'lodash.omit';
import FieldCategories from './fieldCategories';
import * as objectUtils from '../utils/objects';

describe('Iot/FieldCategories', function() {
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
          iot: fixture.build('audience')
        }
      }
    };
    expectedHost = faker.internet.url();
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  describe('constructor', function() {
    let fieldCategories;

    beforeEach(function() {
      fieldCategories = new FieldCategories(baseSdk, baseRequest, expectedHost);
    });

    it('sets a base url for the class instance', function() {
      expect(fieldCategories._baseUrl).to.equal(expectedHost);
    });

    it('appends the supplied request module to the class instance', function() {
      expect(fieldCategories._request).to.equal(baseRequest);
    });

    it('appends the supplied sdk to the class instance', function() {
      expect(fieldCategories._sdk).to.equal(baseSdk);
    });
  });

  describe('create', function() {
    context('when all required information is supplied', function() {
      let expectedCategory;
      let formattedCategoryFromServer;
      let formattedCategoryToServer;
      let initialCategory;
      let promise;
      let request;
      let toCamelCase;
      let toSnakeCase;

      beforeEach(function() {
        initialCategory = fixture.build('fieldCategory');
        formattedCategoryToServer = fixture.build('fieldCategory', null, {
          fromServer: true
        });
        formattedCategoryFromServer = fixture.build('fieldCategory', null, {
          fromServer: true
        });
        expectedCategory = fixture.build('fieldCategory', null, {
          fromServer: true
        });

        request = {
          ...baseRequest,
          post: this.sandbox.stub().resolves(formattedCategoryFromServer)
        };
        toCamelCase = this.sandbox
          .stub(objectUtils, 'toCamelCase')
          .returns(expectedCategory);
        toSnakeCase = this.sandbox
          .stub(objectUtils, 'toSnakeCase')
          .returns(formattedCategoryToServer);

        const fieldCategories = new FieldCategories(
          baseSdk,
          request,
          expectedHost
        );

        promise = fieldCategories.create(initialCategory);
      });

      it('formats the submitted field category object to send to the server', function() {
        expect(toSnakeCase).to.be.calledWith(initialCategory);
      });

      it('creates a new field category', function() {
        expect(request.post).to.be.deep.calledWith(
          `${expectedHost}/categories`,
          formattedCategoryToServer
        );
      });

      it('formats the returned field category object', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.calledWith(formattedCategoryFromServer);
        });
      });

      it('returns a fulfilled promise with the new field category information', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.equal(
          expectedCategory
        );
      });
    });

    context('when there is missing required information', function() {
      ['name', 'description', 'organizationId'].forEach(function(field) {
        it(`throws an error when ${field} is missing`, function() {
          const fieldCategory = fixture.build('fieldCategory');
          const fieldCategories = new FieldCategories(
            baseSdk,
            baseRequest,
            expectedHost
          );
          const promise = fieldCategories.create(omit(fieldCategory, [field]));

          return expect(promise).to.be.rejectedWith(
            `A ${field} is required to create a new field category.`
          );
        });
      });
    });
  });

  describe('delete', function() {
    context('the field category ID is provided', function() {
      let fieldCategoryId;
      let promise;
      let request;

      beforeEach(function() {
        fieldCategoryId = fixture.build('fieldCategory').id;

        request = {
          ...baseRequest,
          delete: this.sandbox.stub().resolves()
        };

        const fieldCategories = new FieldCategories(baseSdk, request);
        fieldCategories._baseUrl = expectedHost;

        promise = fieldCategories.delete(fieldCategoryId);
      });

      it('deletes the field category from the server', function() {
        expect(request.delete).to.be.calledWith(
          `${expectedHost}/categories/${fieldCategoryId}`
        );
      });

      it('returns a fulfilled promise', function() {
        return expect(promise).to.be.fulfilled;
      });
    });

    context('the field category ID is not provided', function() {
      it('throws an error', function() {
        const fieldCategories = new FieldCategories(baseSdk, baseRequest);
        const promise = fieldCategories.delete();

        return expect(promise).to.be.rejectedWith(
          'A categoryId is required for deleting a field category.'
        );
      });
    });
  });

  describe('get', function() {
    context('the field category ID is provided', function() {
      let expectedFieldCategory;
      let promise;
      let rawFieldCategory;
      let request;
      let toCamelCase;

      beforeEach(function() {
        expectedFieldCategory = fixture.build('fieldCategory');
        rawFieldCategory = fixture.build(
          'fieldCategory',
          expectedFieldCategory,
          {
            fromServer: true
          }
        );

        request = {
          ...baseRequest,
          get: this.sandbox.stub().resolves(rawFieldCategory)
        };
        toCamelCase = this.sandbox
          .stub(objectUtils, 'toCamelCase')
          .returns(expectedFieldCategory);

        const fieldCategories = new FieldCategories(baseSdk, request);
        fieldCategories._baseUrl = expectedHost;

        promise = fieldCategories.get(expectedFieldCategory.id);
      });

      it('gets the field category from the server', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/categories/${expectedFieldCategory.id}`
        );
      });

      it('formats the field category', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.calledWith(rawFieldCategory);
        });
      });

      it('returns the requested field category', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.equal(
          expectedFieldCategory
        );
      });
    });

    context('the field category ID is not provided', function() {
      it('throws an error', function() {
        const fieldCategories = new FieldCategories(baseSdk, baseRequest);
        const promise = fieldCategories.get();

        return expect(promise).to.be.rejectedWith(
          'A categoryId is required for getting information about a field category.'
        );
      });
    });
  });

  describe('getAll', function() {
    let expectedFieldCategories;
    let promise;
    let rawFieldCategories;
    let request;
    let toCamelCase;

    beforeEach(function() {
      const numberOfCategories = faker.random.number({ min: 1, max: 10 });
      expectedFieldCategories = fixture.buildList(
        'fieldCategory',
        numberOfCategories
      );
      rawFieldCategories = fixture.buildList(
        'fieldCategory',
        numberOfCategories
      );

      request = {
        ...baseRequest,
        get: this.sandbox.stub().resolves(rawFieldCategories)
      };
      toCamelCase = this.sandbox
        .stub(objectUtils, 'toCamelCase')
        .returns(expectedFieldCategories);

      const fieldCategories = new FieldCategories(baseSdk, request);
      fieldCategories._baseUrl = expectedHost;

      promise = fieldCategories.getAll();
    });

    it('gets the field categories from the server', function() {
      expect(request.get).to.be.calledWith(`${expectedHost}/categories`);
    });

    it('formats the field categories', function() {
      return promise.then(() => {
        expect(toCamelCase).to.be.calledWith(rawFieldCategories);
      });
    });

    it('returns the requested field categories', function() {
      return expect(promise).to.be.fulfilled.and.to.eventually.equal(
        expectedFieldCategories
      );
    });
  });

  describe('getAllByFacility', function() {
    context('the facility ID is provided', function() {
      let expectedFieldCategory;
      let promise;
      let rawFieldCategory;
      let request;
      let toCamelCase;

      beforeEach(function() {
        expectedFieldCategory = fixture.build('fieldCategory');
        rawFieldCategory = fixture.build(
          'fieldCategory',
          expectedFieldCategory,
          {
            fromServer: true
          }
        );

        request = {
          ...baseRequest,
          get: this.sandbox.stub().resolves(rawFieldCategory)
        };
        toCamelCase = this.sandbox
          .stub(objectUtils, 'toCamelCase')
          .returns(expectedFieldCategory);

        const fieldCategories = new FieldCategories(baseSdk, request);
        fieldCategories._baseUrl = expectedHost;

        promise = fieldCategories.get(expectedFieldCategory.id);
      });

      it('gets the field category from the server', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/categories/${expectedFieldCategory.id}`
        );
      });

      it('formats the field category', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.calledWith(rawFieldCategory);
        });
      });

      it('returns the requested field category', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.equal(
          expectedFieldCategory
        );
      });
    });

    context('the field category ID is not provided', function() {
      it('throws an error', function() {
        const fieldCategories = new FieldCategories(baseSdk, baseRequest);
        const promise = fieldCategories.get();

        return expect(promise).to.be.rejectedWith(
          'A categoryId is required for getting information about a field category.'
        );
      });
    });
  });

  describe('update', function() {
    context('when all required information is supplied', function() {
      let formattedCategoryFromServer;
      let formattedUpdateToServer;
      let categoryFromServer;
      let promise;
      let request;
      let toCamelCase;
      let toSnakeCase;
      let update;

      beforeEach(function() {
        formattedCategoryFromServer = fixture.build('fieldCategory');
        categoryFromServer = fixture.build(
          'fieldCategory',
          formattedCategoryFromServer,
          {
            fromServer: true
          }
        );
        update = omit(formattedCategoryFromServer, [
          'createdAt',
          'id',
          'organizationId',
          'ownerId',
          'updatedAt'
        ]);
        formattedUpdateToServer = fixture.build('fieldCategory', update, {
          fromServer: true
        });

        request = {
          ...baseRequest,
          put: this.sandbox.stub().resolves(categoryFromServer)
        };
        toCamelCase = this.sandbox
          .stub(objectUtils, 'toCamelCase')
          .returns(formattedCategoryFromServer);
        toSnakeCase = this.sandbox
          .stub(objectUtils, 'toSnakeCase')
          .returns(formattedUpdateToServer);

        const fieldCategories = new FieldCategories(
          baseSdk,
          request,
          expectedHost
        );

        promise = fieldCategories.update(
          formattedCategoryFromServer.id,
          update
        );
      });

      it('formats the field category update for the server', function() {
        expect(toSnakeCase).to.be.calledWith(update, {
          excludeKeys: ['id', 'organizationId']
        });
      });

      it('updates the field category', function() {
        expect(request.put).to.be.calledWith(
          `${expectedHost}/categories/${formattedCategoryFromServer.id}`,
          formattedUpdateToServer
        );
      });

      it('formats the returned field category', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.calledWith(categoryFromServer);
        });
      });

      it('returns a fulfilled promise with the updated field grouping', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.equal(
          formattedCategoryFromServer
        );
      });
    });

    context(
      'when there is missing or malformed required information',
      function() {
        let fieldCategories;

        beforeEach(function() {
          fieldCategories = new FieldCategories(baseSdk, baseRequest);
        });

        it('throws an error when there is no provided field category id', function() {
          const categoryUpdate = fixture.build('fieldCategory');
          const promise = fieldCategories.update(null, categoryUpdate);

          return expect(promise).to.be.rejectedWith(
            'A categoryId is required for updating information about a field category.'
          );
        });

        it('throws an error when there is no update provided', function() {
          const categoryUpdate = fixture.build('fieldCategory');
          const promise = fieldCategories.update(categoryUpdate.id);

          return expect(promise).to.be.rejectedWith(
            'An update is required to update a field category'
          );
        });

        it('throws an error when the update is not an object', function() {
          const categoryUpdate = fixture.build('fieldCategory');
          const promise = fieldCategories.update(categoryUpdate.id, [
            categoryUpdate
          ]);

          return expect(promise).to.be.rejectedWith(
            'The field category update must be a well-formed object with the data you wish to update.'
          );
        });
      }
    );
  });
});

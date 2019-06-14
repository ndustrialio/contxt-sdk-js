import omit from 'lodash.omit';
import FieldGroupings from './fieldGroupings';
import * as objectUtils from '../utils/objects';
import * as paginationUtils from '../utils/pagination';

describe('Iot/FieldGroupings', function() {
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
          iot: fixture.build('audience')
        }
      }
    };
    expectedHost = faker.internet.url();
  });

  afterEach(function() {
    sinon.restore();
  });

  describe('constructor', function() {
    let fieldGroupings;

    beforeEach(function() {
      fieldGroupings = new FieldGroupings(baseSdk, baseRequest, expectedHost);
    });

    it('sets a base url for the class instance', function() {
      expect(fieldGroupings._baseUrl).to.equal(expectedHost);
    });

    it('appends the supplied request module to the class instance', function() {
      expect(fieldGroupings._request).to.equal(baseRequest);
    });

    it('appends the supplied sdk to the class instance', function() {
      expect(fieldGroupings._sdk).to.equal(baseSdk);
    });
  });

  describe('addField', function() {
    context('when all required information is supplied', function() {
      let expectedFieldId;
      let expectedGroupingId;
      let fieldGroupingFieldToServer;
      let fieldGroupingFieldFromServer;
      let promise;
      let request;
      let toCamelCase;

      beforeEach(function() {
        fieldGroupingFieldToServer = fixture.build('fieldGroupingField');
        expectedFieldId = fieldGroupingFieldToServer.outputFieldId;
        expectedGroupingId = fieldGroupingFieldToServer.fieldGroupingId;
        fieldGroupingFieldFromServer = fixture.build(
          'fieldGroupingField',
          fieldGroupingFieldToServer,
          {
            fromServer: true
          }
        );

        request = {
          ...baseRequest,
          post: sinon.stub().resolves(fieldGroupingFieldFromServer)
        };
        toCamelCase = sinon
          .stub(objectUtils, 'toCamelCase')
          .returns(fieldGroupingFieldToServer);

        const fieldGroupings = new FieldGroupings(
          baseSdk,
          request,
          expectedHost
        );

        promise = fieldGroupings.addField(expectedGroupingId, expectedFieldId);
      });

      it('creates a new relationship between the field grouping and field', function() {
        expect(request.post).to.be.calledWith(
          `${expectedHost}/groupings/${expectedGroupingId}/fields/${expectedFieldId}`
        );
      });

      it('formats the returned field grouping field object', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.calledWith(fieldGroupingFieldFromServer);
        });
      });

      it('returns a fulfilled promise with the new field information', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.equal(
          fieldGroupingFieldToServer
        );
      });
    });

    context('when there is missing required information', function() {
      ['fieldGroupingId', 'outputFieldId'].forEach(function(field) {
        it(`it throws an error when ${field} is missing`, function() {
          const groupingField = fixture.build('fieldGroupingField');
          delete groupingField[field];

          const fieldGroupings = new FieldGroupings(
            baseSdk,
            baseRequest,
            expectedHost
          );

          const promise = fieldGroupings.addField(
            groupingField.fieldGroupingId,
            groupingField.outputFieldId
          );

          return expect(promise).to.be.rejectedWith(
            `A ${field} is required to create a relationship between a field grouping and a field.`
          );
        });
      });
    });
  });

  describe('create', function() {
    context('when all required information is supplied', function() {
      let expectedGrouping;
      let facilityId;
      let formattedGroupingFromServer;
      let formattedGroupingToServer;
      let initialGrouping;
      let promise;
      let request;
      let toCamelCase;
      let toSnakeCase;

      beforeEach(function() {
        facilityId = fixture.build('facility').id;
        initialGrouping = fixture.build('fieldGrouping');
        formattedGroupingToServer = fixture.build('fieldGrouping', null, {
          fromServer: true
        });
        formattedGroupingFromServer = fixture.build('fieldGrouping', null, {
          fromServer: true
        });
        expectedGrouping = fixture.build('fieldGrouping', null, {
          fromServer: false
        });

        request = {
          ...baseRequest,
          post: sinon.stub().resolves(formattedGroupingFromServer)
        };
        toCamelCase = sinon
          .stub(objectUtils, 'toCamelCase')
          .returns(expectedGrouping);
        toSnakeCase = sinon
          .stub(objectUtils, 'toSnakeCase')
          .returns(formattedGroupingToServer);

        const fieldGroupings = new FieldGroupings(
          baseSdk,
          request,
          expectedHost
        );

        promise = fieldGroupings.create(facilityId, initialGrouping);
      });

      it('formats the submitted field grouping object to send to the server', function() {
        expect(toSnakeCase).to.be.calledWith(initialGrouping);
      });

      it('creates a new field grouping', function() {
        expect(request.post).to.be.deep.calledWith(
          `${expectedHost}/facilities/${facilityId}/groupings`,
          formattedGroupingToServer
        );
      });

      it('formats the returned field grouping object', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.calledWith(formattedGroupingFromServer);
        });
      });

      it('returns a fulfilled promise with the new field grouping information', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.equal(
          expectedGrouping
        );
      });
    });

    context('when there is missing required information', function() {
      it('throws an error when facilityId is missing', function() {
        const fieldGrouping = fixture.build('fieldGrouping');
        const fieldGroupings = new FieldGroupings(
          baseSdk,
          baseRequest,
          expectedHost
        );
        const promise = fieldGroupings.create(null, fieldGrouping);

        return expect(promise).to.be.rejectedWith(
          'A facilityId is required for creating a field grouping.'
        );
      });

      ['label', 'description'].forEach(function(field) {
        it(`throws an error when ${field} is missing`, function() {
          const facilityId = fixture.build('facility').id;
          const fieldGrouping = fixture.build('fieldGrouping');
          const fieldGroupings = new FieldGroupings(
            baseSdk,
            baseRequest,
            expectedHost
          );
          const promise = fieldGroupings.create(
            facilityId,
            omit(fieldGrouping, [field])
          );

          return expect(promise).to.be.rejectedWith(
            `A ${field} is required to create a new field grouping.`
          );
        });
      });
    });
  });

  describe('delete', function() {
    context('the field grouping ID is provided', function() {
      let fieldGroupingId;
      let promise;
      let request;

      beforeEach(function() {
        fieldGroupingId = fixture.build('fieldGrouping').id;

        request = {
          ...baseRequest,
          delete: sinon.stub().resolves()
        };

        const fieldGroupings = new FieldGroupings(baseSdk, request);
        fieldGroupings._baseUrl = expectedHost;

        promise = fieldGroupings.delete(fieldGroupingId);
      });

      it('deletes the field grouping from the server', function() {
        expect(request.delete).to.be.calledWith(
          `${expectedHost}/groupings/${fieldGroupingId}`
        );
      });

      it('returns a fulfilled promise', function() {
        return expect(promise).to.be.fulfilled;
      });
    });

    context('the field grouping ID is not provided', function() {
      it('throws an error', function() {
        const fieldGroupings = new FieldGroupings(baseSdk, baseRequest);
        const promise = fieldGroupings.delete();

        return expect(promise).to.be.rejectedWith(
          'A groupingId is required for deleting a field grouping.'
        );
      });
    });
  });

  describe('get', function() {
    context('the field grouping ID is provided', function() {
      let fieldGroupingToServer;
      let promise;
      let fieldGroupingFromServer;
      let request;
      let toCamelCase;

      beforeEach(function() {
        fieldGroupingToServer = fixture.build('fieldGrouping');
        fieldGroupingFromServer = fixture.build(
          'fieldGrouping',
          fieldGroupingToServer,
          {
            fromServer: true
          }
        );

        request = {
          ...baseRequest,
          get: sinon.stub().resolves(fieldGroupingFromServer)
        };
        toCamelCase = sinon
          .stub(objectUtils, 'toCamelCase')
          .returns(fieldGroupingToServer);

        const fieldGroupings = new FieldGroupings(baseSdk, request);
        fieldGroupings._baseUrl = expectedHost;

        promise = fieldGroupings.get(fieldGroupingToServer.id);
      });

      it('gets the field grouping from the server', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/groupings/${fieldGroupingToServer.id}`
        );
      });

      it('formats the field grouping', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.calledWith(fieldGroupingFromServer);
        });
      });

      it('returns the requested field grouping', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.equal(
          fieldGroupingToServer
        );
      });
    });

    context('the field grouping ID is not provided', function() {
      it('throws an error', function() {
        const fieldGroupings = new FieldGroupings(baseSdk, baseRequest);
        const promise = fieldGroupings.get();

        return expect(promise).to.be.rejectedWith(
          'A groupingId is required for getting information about a field grouping.'
        );
      });
    });
  });

  describe('getGroupingsByFacilityId', function() {
    context('the facility ID is provided', function() {
      let facilityId;
      let fieldGroupingFromServerBeforeFormat;
      let fieldGroupingFromServerAfterFormat;
      let formatPaginatedDataFromServer;
      let paginationOptionsAfterFormat;
      let paginationOptionsBeforeFormat;
      let promise;
      let request;
      let toSnakeCase;

      beforeEach(function() {
        facilityId = faker.random.number({ min: 1, max: 300 });
        fieldGroupingFromServerAfterFormat = {
          _metadata: fixture.build('paginationMetadata'),
          records: fixture.buildList(
            'fieldGrouping',
            faker.random.number({ min: 5, max: 10 })
          )
        };
        fieldGroupingFromServerBeforeFormat = {
          ...fieldGroupingFromServerAfterFormat,
          records: fieldGroupingFromServerAfterFormat.records.map((values) =>
            fixture.build('fieldGrouping', values, { fromServer: true })
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
          .returns(fieldGroupingFromServerAfterFormat);

        request = {
          ...baseRequest,
          get: sinon.stub().resolves(fieldGroupingFromServerBeforeFormat)
        };
        toSnakeCase = sinon
          .stub(objectUtils, 'toSnakeCase')
          .returns(paginationOptionsAfterFormat);

        const fieldGroupings = new FieldGroupings(baseSdk, request);
        fieldGroupings._baseUrl = expectedHost;

        promise = fieldGroupings.getGroupingsByFacilityId(
          facilityId,
          paginationOptionsBeforeFormat
        );
      });

      it('formats the pagination options', function() {
        expect(toSnakeCase).to.be.calledWith(paginationOptionsBeforeFormat);
      });

      it('gets the field groupings from the server', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/facilities/${facilityId}/groupings`,
          { params: paginationOptionsAfterFormat }
        );
      });

      it('formats the field groupings', function() {
        return promise.then(() => {
          expect(formatPaginatedDataFromServer).to.be.calledWith(
            fieldGroupingFromServerBeforeFormat
          );
        });
      });

      it('returns the requested field groupingss', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.equal(
          fieldGroupingFromServerAfterFormat
        );
      });
    });

    context('the facility ID is not provided', function() {
      it('throws an error', function() {
        const fieldGroupings = new FieldGroupings(baseSdk, baseRequest);
        const promise = fieldGroupings.getGroupingsByFacilityId();

        return expect(promise).to.be.rejectedWith(
          'A facilityId is required for getting all field groupings.'
        );
      });
    });
  });

  describe('removeField', function() {
    context('when all required information is supplied', function() {
      let fieldGroupingField;
      let promise;

      beforeEach(function() {
        fieldGroupingField = fixture.build('fieldGroupingField');

        const fieldGroupings = new FieldGroupings(
          baseSdk,
          baseRequest,
          expectedHost
        );
        promise = fieldGroupings.removeField(
          fieldGroupingField.fieldGroupingId,
          fieldGroupingField.outputFieldId
        );
      });

      it('requests to remove the field from the field grouping', function() {
        const fieldGroupingId = fieldGroupingField.fieldGroupingId;
        const outputFieldId = fieldGroupingField.outputFieldId;

        expect(baseRequest.delete).to.be.calledWith(
          `${expectedHost}/groupings/${fieldGroupingId}/fields/${outputFieldId}`
        );
      });

      it('returns a fulfilled promise', function() {
        return expect(promise).to.be.fulfilled;
      });
    });

    context('when there is missing required information', function() {
      ['fieldGroupingId', 'outputFieldId'].forEach(function(field) {
        it(`it throws an error when ${field} is missing`, function() {
          const expectedErrorMessage = `A ${field} is required to remove a relationship between a field grouping and a field.`;
          const groupingField = fixture.build('fieldGroupingField');
          delete groupingField[field];

          const fieldGroupings = new FieldGroupings(
            baseSdk,
            baseRequest,
            expectedHost
          );
          const promise = fieldGroupings.removeField(
            groupingField.fieldGroupingId,
            groupingField.outputFieldId
          );

          return expect(promise).to.be.rejectedWith(expectedErrorMessage);
        });
      });
    });
  });

  describe('update', function() {
    context('when all required information is supplied', function() {
      let formattedGroupingFromServer;
      let formattedUpdateToServer;
      let groupingFromServer;
      let promise;
      let request;
      let toCamelCase;
      let toSnakeCase;
      let update;

      beforeEach(function() {
        formattedGroupingFromServer = fixture.build('facilityGrouping');
        groupingFromServer = fixture.build(
          'facilityGrouping',
          formattedGroupingFromServer,
          {
            fromServer: true
          }
        );
        update = omit(formattedGroupingFromServer, [
          'createdAt',
          'id',
          'organizationId',
          'ownerId',
          'updatedAt'
        ]);
        formattedUpdateToServer = omit(
          fixture.build('facilityGrouping', update, {
            fromServer: true
          }),
          ['created_at', 'id', 'organization_id', 'owner_id', 'updated_at']
        );

        request = {
          ...baseRequest,
          put: sinon.stub().resolves(groupingFromServer)
        };
        toCamelCase = sinon
          .stub(objectUtils, 'toCamelCase')
          .returns(formattedGroupingFromServer);
        toSnakeCase = sinon
          .stub(objectUtils, 'toSnakeCase')
          .returns(formattedUpdateToServer);

        const fieldGroupings = new FieldGroupings(
          baseSdk,
          request,
          expectedHost
        );

        promise = fieldGroupings.update(formattedGroupingFromServer.id, update);
      });

      it('formats the field grouping update for the server', function() {
        expect(toSnakeCase).to.be.calledWith(update, {
          excludeKeys: ['facilityId', 'id', 'ownerId', 'slug']
        });
      });

      it('updates the field grouping', function() {
        expect(request.put).to.be.calledWith(
          `${expectedHost}/groupings/${formattedGroupingFromServer.id}`,
          formattedUpdateToServer
        );
      });

      it('formats the returned field grouping', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.calledWith(groupingFromServer);
        });
      });

      it('returns a fulfilled promise with the updated field grouping', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.equal(
          formattedGroupingFromServer
        );
      });
    });

    context(
      'when there is missing or malformed required information',
      function() {
        let fieldGroupings;

        beforeEach(function() {
          fieldGroupings = new FieldGroupings(baseSdk, baseRequest);
        });

        it('throws an error when there is no provided field grouping id', function() {
          const groupingUpdate = fixture.build('fieldGrouping');
          const promise = fieldGroupings.update(null, groupingUpdate);

          return expect(promise).to.be.rejectedWith(
            'A groupingId is required for getting information about a field grouping.'
          );
        });

        it('throws an error when there is no update provided', function() {
          const groupingUpdate = fixture.build('fieldGrouping');
          const promise = fieldGroupings.update(groupingUpdate.id);

          return expect(promise).to.be.rejectedWith(
            'An update is required to update a field grouping'
          );
        });

        it('throws an error when the update is not an object', function() {
          const groupingUpdate = fixture.build('fieldGrouping');
          const promise = fieldGroupings.update(groupingUpdate.id, [
            groupingUpdate
          ]);

          return expect(promise).to.be.rejectedWith(
            'The field grouping update must be a well-formed object with the data you wish to update.'
          );
        });
      }
    );
  });
});

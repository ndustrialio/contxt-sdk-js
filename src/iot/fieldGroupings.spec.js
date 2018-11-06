import omit from 'lodash.omit';
import FieldGroupings from './fieldGroupings';
import * as objectUtils from '../utils/objects';

describe('Iot/FieldGroupings', function() {
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
      let expectedGroupingField;
      let expectedGroupingId;
      let promise;
      let rawGroupingField;
      let request;
      let toCamelCase;

      beforeEach(function() {
        expectedGroupingField = fixture.build('fieldGroupingField');
        expectedFieldId = expectedGroupingField.outputFieldId;
        expectedGroupingId = expectedGroupingField.fieldGroupingId;
        rawGroupingField = fixture.build(
          'fieldGroupingField',
          expectedGroupingField,
          {
            fromServer: true
          }
        );

        request = {
          ...baseRequest,
          post: this.sandbox.stub().resolves(rawGroupingField)
        };
        toCamelCase = this.sandbox
          .stub(objectUtils, 'toCamelCase')
          .returns(expectedGroupingField);

        const fieldGroupings = new FieldGroupings(
          baseSdk,
          request,
          expectedHost
        );

        promise = fieldGroupings.addField(expectedGroupingId, expectedFieldId);
      });

      it('creates the new field grouping <--> field relationship', function() {
        expect(request.post).to.be.calledWith(
          `${expectedHost}/groupings/${expectedGroupingId}/fields/${expectedFieldId}`
        );
      });

      it('formats the returned field grouping field object', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.calledWith(rawGroupingField);
        });
      });

      it('returns a fulfilled promise with the new field information', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.equal(
          expectedGroupingField
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
          post: this.sandbox.stub().resolves(formattedGroupingFromServer)
        };
        toCamelCase = this.sandbox
          .stub(objectUtils, 'toCamelCase')
          .returns(expectedGrouping);
        toSnakeCase = this.sandbox
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
          delete: this.sandbox.stub().resolves()
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
      let expectedFieldGrouping;
      let promise;
      let rawFieldGrouping;
      let request;
      let toCamelCase;

      beforeEach(function() {
        expectedFieldGrouping = fixture.build('fieldGrouping');
        rawFieldGrouping = fixture.build(
          'fieldGrouping',
          expectedFieldGrouping,
          {
            fromServer: true
          }
        );

        request = {
          ...baseRequest,
          get: this.sandbox.stub().resolves(rawFieldGrouping)
        };
        toCamelCase = this.sandbox
          .stub(objectUtils, 'toCamelCase')
          .returns(expectedFieldGrouping);

        const fieldGroupings = new FieldGroupings(baseSdk, request);
        fieldGroupings._baseUrl = expectedHost;

        promise = fieldGroupings.get(expectedFieldGrouping.id);
      });

      it('gets the field grouping from the server', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/groupings/${expectedFieldGrouping.id}`
        );
      });

      it('formats the field grouping', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.calledWith(rawFieldGrouping);
        });
      });

      it('returns the requested field grouping', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.equal(
          expectedFieldGrouping
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

  describe('getAllByFacilityId', function() {
    context('the facility ID is provided', function() {
      let expectedFieldGroupings;
      let promise;
      let rawFieldGroupings;
      let request;
      let toCamelCase;
      let facilityId;

      beforeEach(function() {
        const numberOfGroupings = faker.random.number({ min: 1, max: 10 });
        facilityId = faker.random.number({ min: 1, max: 300 });
        expectedFieldGroupings = fixture.buildList(
          'fieldGrouping',
          numberOfGroupings
        );
        rawFieldGroupings = fixture.buildList(
          'fieldGrouping',
          numberOfGroupings
        );

        request = {
          ...baseRequest,
          get: this.sandbox.stub().resolves(rawFieldGroupings)
        };
        toCamelCase = this.sandbox
          .stub(objectUtils, 'toCamelCase')
          .returns(expectedFieldGroupings);

        const fieldGroupings = new FieldGroupings(baseSdk, request);
        fieldGroupings._baseUrl = expectedHost;

        promise = fieldGroupings.getAllByFacilityId(facilityId);
      });

      it('gets the field groupings from the server', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/facilities/${facilityId}/groupings`
        );
      });

      it('formats the field groupings', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.calledWith(rawFieldGroupings);
        });
      });

      it('returns the requested field groupingss', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.equal(
          expectedFieldGroupings
        );
      });
    });

    context('the facility ID is not provided', function() {
      it('throws an error', function() {
        const fieldGroupings = new FieldGroupings(baseSdk, baseRequest);
        const promise = fieldGroupings.getAllByFacilityId();

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

      it('requests to remove the field', function() {
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
        formattedUpdateToServer = fixture.build('facilityGrouping', update, {
          fromServer: true
        });

        request = {
          ...baseRequest,
          put: this.sandbox.stub().resolves(groupingFromServer)
        };
        toCamelCase = this.sandbox
          .stub(objectUtils, 'toCamelCase')
          .returns(formattedGroupingFromServer);
        toSnakeCase = this.sandbox
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

import times from 'lodash.times';
import * as objectUtils from '../objects';
import formatPaginatedDataFromServer from './formatPaginatedDataFromServer';

describe('utils/pagination/formatPaginatedDataFromServer', function() {
  afterEach(function() {
    sinon.restore();
  });

  context('when a record formatter is provided', function() {
    let expectedMetadata;
    let expectedRecords;
    let formattedData;
    let initialMetadata;
    let initialRecords;
    let recordFormatter;
    let toCamelCase;

    beforeEach(function() {
      expectedMetadata = fixture.build('paginationMetadata');
      expectedRecords = times(faker.random.number({ min: 1, max: 10 }), () =>
        faker.helpers.createTransaction()
      );
      initialMetadata = fixture.build('paginationMetadata');
      initialRecords = expectedRecords.map(() =>
        faker.helpers.createTransaction()
      );

      toCamelCase = sinon
        .stub(objectUtils, 'toCamelCase')
        .returns(expectedMetadata);
      recordFormatter = sinon
        .stub()
        .callsFake((value, index) => expectedRecords[index]);

      formattedData = formatPaginatedDataFromServer(
        {
          _metadata: initialMetadata,
          records: initialRecords
        },
        recordFormatter
      );
    });

    it('formats the metadata', function() {
      expect(toCamelCase).to.be.calledWith(initialMetadata);
    });

    it('includes the pagination metadata', function() {
      expect(formattedData).to.include({ _metadata: expectedMetadata });
    });

    it('formats the records', function() {
      initialRecords.forEach((record) => {
        expect(recordFormatter).to.be.calledWith(record);
      });
    });

    it('includes the formatted records', function() {
      expect(formattedData).to.deep.include({ records: expectedRecords });
    });
  });

  context('when no record formatter is provided', function() {
    let expectedRecords;
    let initialRecords;
    let formattedData;
    let toCamelCase;

    beforeEach(function() {
      expectedRecords = fixture.buildList(
        'organization',
        faker.random.number({ min: 1, max: 10 })
      );
      initialRecords = expectedRecords.map((record) =>
        fixture.build('organization', record, { fromServer: true })
      );

      toCamelCase = sinon
        .stub(objectUtils, 'toCamelCase')
        .callsFake(
          (record) => expectedRecords.filter(({ id }) => id === record.id)[0]
        );

      formattedData = formatPaginatedDataFromServer({
        _metadata: fixture.build('paginationMetadata'),
        records: initialRecords
      });
    });

    it('formats the records using `toCamelCase`', function() {
      initialRecords.forEach((record) => {
        expect(toCamelCase).to.be.calledWith(record);
      });

      expect(formattedData.records).to.deep.equal(expectedRecords);
    });
  });
});

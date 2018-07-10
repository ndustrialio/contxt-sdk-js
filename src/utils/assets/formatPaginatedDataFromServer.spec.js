import times from 'lodash.times';
import formatPaginatedDataFromServer from './formatPaginatedDataFromServer';

describe('utils/assets/formatPaginatedDataFromServer', function() {
  beforeEach(function() {
    this.sandbox = sandbox.create();
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  context('when a record formatter is provided', function() {
    let expectedMetadata;
    let expectedRecords;
    let formattedData;
    let initialRecords;
    let recordFormatter;

    beforeEach(function() {
      expectedMetadata = fixture.build('paginationMetadata');
      expectedRecords = times(faker.random.number({ min: 1, max: 10 }), () =>
        faker.helpers.createTransaction()
      );
      initialRecords = expectedRecords.map(() =>
        faker.helpers.createTransaction()
      );
      recordFormatter = this.sandbox
        .stub()
        .callsFake((value, index) => expectedRecords[index]);

      formattedData = formatPaginatedDataFromServer(
        {
          _metadata: expectedMetadata,
          records: initialRecords
        },
        recordFormatter
      );
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
    let initialRecords;
    let formattedData;

    beforeEach(function() {
      initialRecords = times(faker.random.number({ min: 1, max: 10 }), () =>
        faker.helpers.createTransaction()
      );

      formattedData = formatPaginatedDataFromServer({
        _metadata: fixture.build('paginationMetadata'),
        records: initialRecords
      });
    });

    it('includes the original records untouched in a new array', function() {
      expect(formattedData.records).to.not.equal(initialRecords);

      formattedData.records.forEach((record, index) => {
        expect(record).to.equal(initialRecords[index]);
      });
    });
  });
});

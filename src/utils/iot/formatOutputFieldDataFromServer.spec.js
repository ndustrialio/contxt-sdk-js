import omit from 'lodash.omit';
import formatOutputFieldDataFromServer from './formatOutputFieldDataFromServer';

describe('utils/iot/formatOutputFieldDataFromServer', function() {
  let expectedOutputFieldDataRecords;
  let expectedOutputFieldMetadata;
  let formattedOutputFieldData;
  let outputFieldDataRecords;
  let outputFieldMetadata;

  beforeEach(function() {
    outputFieldDataRecords = fixture.buildList(
      'outputFieldData',
      faker.random.number({ min: 1, max: 10 }),
      null,
      { fromServer: true }
    );
    outputFieldMetadata = {
      count: faker.random.number(),
      has_more: faker.random.boolean(),
      next_page_url: faker.internet.url(),
      next_record_time: faker.date.recent().getTime()
    };
    expectedOutputFieldDataRecords = outputFieldDataRecords.map((record) =>
      omit({ ...record, eventTime: record.event_time }, ['event_time'])
    );
    expectedOutputFieldMetadata = omit(
      {
        ...outputFieldMetadata,
        hasMore: outputFieldMetadata.has_more,
        nextPageUrl: outputFieldMetadata.next_page_url,
        nextRecordTime: outputFieldMetadata.next_record_time
      },
      ['has_more', 'next_page_url', 'next_record_time']
    );

    formattedOutputFieldData = formatOutputFieldDataFromServer({
      meta: outputFieldMetadata,
      records: outputFieldDataRecords
    });
  });

  it('converts the metadata keys to camelCase', function() {
    expect(formattedOutputFieldData.meta).to.deep.equal(
      expectedOutputFieldMetadata
    );
  });

  it("converts the records' keys to camelCase", function() {
    expect(formattedOutputFieldData.records).to.deep.equal(
      expectedOutputFieldDataRecords
    );
  });
});

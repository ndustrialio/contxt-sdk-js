import omit from 'lodash.omit';
import URL from 'url-parse';
import formatOutputFieldDataFromServer from './formatOutputFieldDataFromServer';

describe('utils/iot/formatOutputFieldDataFromServer', function() {
  let expectedOutputFieldDataRecords;
  let expectedOutputFieldMetadata;
  let expectedOutputFieldParsedMetadata;
  let formattedOutputFieldData;
  let initialOutputFieldDataRecords;
  let initialOutputFieldMetadata;

  beforeEach(function() {
    expectedOutputFieldMetadata = {
      count: faker.random.number(),
      hasMore: faker.random.boolean(),
      nextRecordTime: Math.floor(faker.date.recent().getTime() / 1000)
    };
    expectedOutputFieldParsedMetadata = {
      limit: faker.random.number(),
      timeEnd: expectedOutputFieldMetadata.nextRecordTime,
      timeStart: Math.floor(faker.date.past().getTime() / 1000),
      window: faker.random.arrayElement([0, 60, 900, 3600])
    };
    expectedOutputFieldDataRecords = fixture.buildList(
      'outputFieldData',
      faker.random.number({ min: 1, max: 10 })
    );
    initialOutputFieldMetadata = omit(
      {
        ...expectedOutputFieldMetadata,
        has_more: expectedOutputFieldMetadata.hasMore,
        next_page_url:
          faker.internet.url() +
          '/outputs/' +
          faker.random.number() +
          '/fields/' +
          faker.hacker.noun() +
          '/data' +
          URL.qs.stringify(expectedOutputFieldParsedMetadata, true),
        next_record_time: expectedOutputFieldMetadata.nextRecordTime
      },
      ['hasMore', 'nextRecordTime', 'timeEnd', 'timeStart', 'window']
    );
    initialOutputFieldDataRecords = expectedOutputFieldDataRecords.map(
      (record) =>
        omit({ ...record, event_time: record.eventTime }, ['eventTime'])
    );

    formattedOutputFieldData = formatOutputFieldDataFromServer({
      meta: initialOutputFieldMetadata,
      records: initialOutputFieldDataRecords
    });
  });

  it('converts the metadata keys to camelCase', function() {
    expect(formattedOutputFieldData.meta).to.include(
      expectedOutputFieldMetadata
    );
  });

  it('parses the `next_page_url` query string to be regular metadata', function() {
    expect(formattedOutputFieldData.meta).to.include(
      expectedOutputFieldParsedMetadata
    );
  });

  it("converts the records' keys to camelCase", function() {
    expect(formattedOutputFieldData.records).to.deep.equal(
      expectedOutputFieldDataRecords
    );
  });
});

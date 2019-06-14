import omit from 'lodash.omit';
import URL from 'url-parse';
import formatOutputFieldDataFromServer from './formatOutputFieldDataFromServer';
import * as iotUtils from './index';
import * as objectUtils from '../objects';

describe('utils/iot/formatOutputFieldDataFromServer', function() {
  let expectedOutputFieldDataRecords;
  let expectedOutputFieldMetadata;
  let expectedOutputFieldParsedMetadata;
  let formattedOutputFieldData;
  let initialOutputFieldDataRecords;
  let initialOutputFieldMetadata;
  let parseOutputFieldNextPageUrlMetadata;
  let toCamelCase;

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

    parseOutputFieldNextPageUrlMetadata = sinon
      .stub(iotUtils, 'parseOutputFieldNextPageUrlMetadata')
      .returns(expectedOutputFieldParsedMetadata);
    toCamelCase = sinon.stub(objectUtils, 'toCamelCase').callsFake((input) => {
      switch (input) {
        case initialOutputFieldMetadata:
          return expectedOutputFieldMetadata;

        case initialOutputFieldDataRecords:
          return expectedOutputFieldDataRecords;

        default:
          return null;
      }
    });

    formattedOutputFieldData = formatOutputFieldDataFromServer({
      meta: initialOutputFieldMetadata,
      records: initialOutputFieldDataRecords
    });
  });

  afterEach(function() {
    sinon.restore();
  });

  it('transforms the regular metadata keys to camel case', function() {
    expect(toCamelCase).to.be.calledWith(initialOutputFieldMetadata, {
      excludeKeys: ['next_page_url']
    });
  });

  it('parses the `next_page_url` query string to be regular metadata', function() {
    expect(parseOutputFieldNextPageUrlMetadata).to.be.calledWith(
      initialOutputFieldMetadata.next_page_url
    );
  });

  it('transforms the records keys to be camel case', function() {
    expect(toCamelCase).to.be.calledWith(initialOutputFieldDataRecords);
  });

  it('returns the transformed metadata and records', function() {
    expect(formattedOutputFieldData).to.deep.equal({
      meta: {
        ...expectedOutputFieldParsedMetadata,
        ...expectedOutputFieldMetadata
      },
      records: expectedOutputFieldDataRecords
    });
  });
});

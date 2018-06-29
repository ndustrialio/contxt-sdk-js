import URL from 'url-parse';
import parseOutputFieldNextPageUrlMetadata from './parseOutputFieldNextPageUrlMetadata';

describe('utils/iot/parseOutputFieldNextPageUrlMetadata', function() {
  let expectedMetadata;
  let metadata;

  beforeEach(function() {
    expectedMetadata = {
      limit: faker.random.number(),
      timeEnd: Math.floor(faker.date.recent().getTime() / 1000),
      timeStart: Math.floor(faker.date.past().getTime() / 1000),
      window: faker.random.arrayElement([0, 60, 900, 3600])
    };

    const url =
      faker.internet.url() +
      '/outputs/' +
      faker.random.number() +
      '/fields/' +
      faker.hacker.noun() +
      '/data' +
      URL.qs.stringify(expectedMetadata, true);
    metadata = parseOutputFieldNextPageUrlMetadata(url);
  });

  it('parses the keys out of the url', function() {
    expect(metadata).to.include.keys([
      'limit',
      'timeEnd',
      'timeStart',
      'window'
    ]);
  });

  it('converts the number values to numbers', function() {
    expect(metadata.limit).to.be.a('number');
    expect(metadata.limit).to.equal(expectedMetadata.limit);

    expect(metadata.timeEnd).to.be.a('number');
    expect(metadata.timeEnd).to.equal(expectedMetadata.timeEnd);

    expect(metadata.timeStart).to.be.a('number');
    expect(metadata.timeStart).to.equal(expectedMetadata.timeStart);

    expect(metadata.window).to.be.a('number');
    expect(metadata.window).to.equal(expectedMetadata.window);
  });
});

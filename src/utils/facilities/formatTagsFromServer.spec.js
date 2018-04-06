import omit from 'lodash.omit';
import formatTagsFromServer from './formatTagsFromServer';

describe('utils/facilities/formatTagsFromServer', function() {
  let expectedTags;
  let formattedTags;
  let tags;

  beforeEach(function() {
    tags = fixture.buildList(
      'facilityTag',
      faker.random.number({ min: 1, max: 2 }),
      null,
      { fromServer: true }
    );
    expectedTags = tags.map((tag) => {
      return omit(
        {
          ...tag,
          createdAt: tag.created_at,
          facilityId: tag.facility_id,
          updatedAt: tag.updated_at
        },
        ['created_at', 'facility_id', 'updated_at']
      );
    });

    formattedTags = formatTagsFromServer(tags);
  });

  it('converts the object keys to camelCase', function() {
    expect(formattedTags).to.deep.equal(expectedTags);
  });
});

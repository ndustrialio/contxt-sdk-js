import omit from 'lodash.omit';
import formatPaginationOptionsToServer from './formatPaginationOptionsToServer';

describe('utils/assets/formatPaginationOptionsToServer', function() {
  let expectedOptions;
  let formattedOptions;

  beforeEach(function() {
    const initialOptions = {
      limit: faker.random.number(),
      offset: faker.random.number()
    };
    expectedOptions = omit(
      {
        ...initialOptions
      },
      []
    );

    formattedOptions = formatPaginationOptionsToServer(initialOptions);
  });

  it('converts the object keys to snake case', function() {
    expect(formattedOptions).to.deep.equal(expectedOptions);
  });
});

import times from 'lodash.times';
import formatFacilityOptionsToServer from './formatFacilityOptionsToServer';

describe('utils/facilities/formatFacilityOptionsToServer', function() {
  it('provides a default object if no options passed', function() {
    const options = formatFacilityOptionsToServer();
    expect(options).to.deep.equal({
      include_groupings: false
    });
  });

  it('provides an object that includes any custom options', function() {
    const customOptions = times(
      faker.random.number({
        min: 1,
        max: 10
      })
    ).reduce((memo) => {
      memo[faker.hacker.adjective()] = faker.helpers.createTransaction();
      return memo;
    }, {});

    const expectedOptions = Object.assign({}, customOptions, {
      include_groupings: false
    });

    const options = formatFacilityOptionsToServer(customOptions);

    expect(options).to.deep.equal(expectedOptions);
  });

  it('provides an object that includes the `include_groupings` that the API service can understand', function() {
    const expectedIncludeGroupings = faker.random.boolean();
    const customOptions = times(
      faker.random.number({
        min: 1,
        max: 10
      })
    ).reduce((memo) => {
      memo[faker.hacker.adjective()] = faker.helpers.createTransaction();
      return memo;
    }, {});

    const expectedOptions = Object.assign({}, customOptions, {
      include_groupings: expectedIncludeGroupings
    });

    const options = formatFacilityOptionsToServer({
      ...customOptions,
      includeGroupings: expectedIncludeGroupings
    });

    expect(options).to.deep.equal(expectedOptions);
  });
});

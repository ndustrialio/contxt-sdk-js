import omit from 'lodash.omit';
import times from 'lodash.times';
import formatAssetOptionsToServer from './formatAssetOptionsToServer';

describe('utils/assets/formatAssetOptionsToServer', function() {
  it('provides a default empty object if no options are passed', function() {
    const defaultOptions = formatAssetOptionsToServer();

    expect(defaultOptions).to.deep.equal({});
  });

  it('provides an object that includes any custom options', function() {
    const customOptions = times(faker.random.number({ min: 1, max: 5 })).reduce(
      (memo) => {
        memo[faker.hacker.adjective()] = faker.hacker.adjective();
        return memo;
      },
      {}
    );

    const expectedOptions = Object.assign({}, customOptions);

    const options = formatAssetOptionsToServer({ ...customOptions });

    expect(options).to.deep.equal(expectedOptions);
  });

  it("includes the 'asset_type_id' key if it's included", function() {
    const assetTypeId = faker.random.uuid();
    const customOptions = times(faker.random.number({ min: 1, max: 5 })).reduce(
      (memo) => {
        memo[faker.hacker.adjective()] = faker.hacker.adjective();
        return memo;
      },
      {
        assetTypeId
      }
    );

    const expectedOptions = omit(
      Object.assign({}, customOptions, { asset_type_id: assetTypeId }),
      ['assetTypeId']
    );

    const options = formatAssetOptionsToServer({ ...customOptions });

    expect(options).to.deep.equal(expectedOptions);
  });
});

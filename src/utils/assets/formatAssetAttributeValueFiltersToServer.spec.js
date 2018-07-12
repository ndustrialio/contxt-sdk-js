import omit from 'lodash.omit';
import formatAssetAttributeValueFiltersToServer from './formatAssetAttributeValueFiltersToServer';

describe('utils/assets/formatAssetAttributeValueFiltersToServer', function() {
  let expectedValueFilters;
  let formattedValueFilters;

  beforeEach(function() {
    const initialValueFilters = {
      attributeLabel: faker.hacker.phrase(),
      effectiveDate: faker.date.recent().toISOString()
    };
    expectedValueFilters = omit(
      {
        ...initialValueFilters,
        attribute_label: initialValueFilters.attributeLabel,
        effective_date: initialValueFilters.effectiveDate
      },
      ['attributeLabel', 'effectiveDate']
    );

    formattedValueFilters = formatAssetAttributeValueFiltersToServer(
      initialValueFilters
    );
  });

  it('converts the object keys to snake case', function() {
    expect(formattedValueFilters).to.deep.equal(expectedValueFilters);
  });
});

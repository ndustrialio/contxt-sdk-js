import toCamelCase from './toCamelCase';

describe('utils/objects/toCamelCase', function() {
  context('objects', function() {
    it('transforms first-level keys', function() {
      const transformedObject = toCamelCase({ first_key: 'first value' });

      expect(transformedObject).to.deep.equal({ firstKey: 'first value' });
    });

    it('transforms nested keys by default', function() {
      const transformedObject = toCamelCase({
        first_level_first_key: {
          second_level_first_key: {
            third_level_first_key: 'third level first value'
          }
        }
      });

      expect(transformedObject).to.deep.equal({
        firstLevelFirstKey: {
          secondLevelFirstKey: {
            thirdLevelFirstKey: 'third level first value'
          }
        }
      });
    });

    it('does not transform nested keys when `deep` is set to `false`', function() {
      const transformedObject = toCamelCase(
        {
          first_level_first_key: {
            second_level_first_key: {
              third_level_first_key: 'third level first value'
            }
          }
        },
        { deep: false }
      );

      expect(transformedObject).to.deep.equal({
        firstLevelFirstKey: {
          second_level_first_key: {
            third_level_first_key: 'third level first value'
          }
        }
      });
    });

    it('does not transform first-level excluded keys', function() {
      const transformedObject = toCamelCase(
        {
          first_key: 'first value',
          second_key: 'second value'
        },
        { excludeTransform: ['second_key'] }
      );

      expect(transformedObject).to.deep.equal({
        firstKey: 'first value',
        second_key: 'second value'
      });
    });

    it('does not transform nested excluded keys', function() {
      const transformedObject = toCamelCase(
        {
          first_level_first_key: {
            second_level_first_key: {
              third_level_first_key: 'third level first value'
            }
          }
        },
        {
          deep: true,
          excludeTransform: ['third_level_first_key']
        }
      );

      expect(transformedObject).to.deep.equal({
        firstLevelFirstKey: {
          secondLevelFirstKey: {
            third_level_first_key: 'third level first value'
          }
        }
      });
    });

    it('removes keys marked for removal', function() {
      const transformedObject = toCamelCase(
        {
          first_level_first_key: 'first level first value',
          first_level_second_key: 'first level second value'
        },
        { excludeKeys: ['first_level_first_key'] }
      );

      expect(transformedObject).to.deep.equal({
        firstLevelSecondKey: 'first level second value'
      });
    });

    it('removes nested keys marked for removal by default', function() {
      const transformedObject = toCamelCase(
        {
          first_level_first_key: {
            second_level_first_key: 'second level first value',
            second_level_second_key: 'second level second value'
          }
        },
        { excludeKeys: ['second_level_first_key'] }
      );

      expect(transformedObject).to.deep.equal({
        firstLevelFirstKey: {
          secondLevelSecondKey: 'second level second value'
        }
      });
    });

    it('does not remove nested keys when `deep` is set to `false`', function() {
      const transformedObject = toCamelCase(
        {
          first_level_first_key: {
            second_level_first_key: 'second level first value',
            second_level_second_key: 'second level second value'
          }
        },
        { deep: false }
      );

      expect(transformedObject).to.deep.equal({
        firstLevelFirstKey: {
          second_level_first_key: 'second level first value',
          second_level_second_key: 'second level second value'
        }
      });
    });
  });

  context('arrays', function() {
    it('transforms keys in top-level arrays of objects', function() {
      const transformedObject = toCamelCase([
        { first_level_first_key: 'first level first value' },
        { first_level_second_key: 'first level second value' }
      ]);

      expect(transformedObject).to.deep.equal([
        { firstLevelFirstKey: 'first level first value' },
        { firstLevelSecondKey: 'first level second value' }
      ]);
    });

    it('transforms keys in nested arrays of objects by default', function() {
      const transformedObject = toCamelCase({
        first_level_first_key: {
          second_level_first_key: [
            { third_level_first_key: 'third level first value' },
            { third_level_second_key: 'third level second value' },
            {
              third_level_third_key: [
                { fourth_level_first_key: 'fourth level first value' }
              ]
            }
          ]
        }
      });

      expect(transformedObject).to.deep.equal({
        firstLevelFirstKey: {
          secondLevelFirstKey: [
            { thirdLevelFirstKey: 'third level first value' },
            { thirdLevelSecondKey: 'third level second value' },
            {
              thirdLevelThirdKey: [
                { fourthLevelFirstKey: 'fourth level first value' }
              ]
            }
          ]
        }
      });
    });

    it('does not transform keys in arrays nested in objects when `deep` is set to `false`', function() {
      const transformedObject = toCamelCase(
        {
          first_level_first_key: 'first level first value',
          first_level_second_key: [
            { second_level_first_key: 'second level first value' }
          ]
        },
        { deep: false }
      );

      expect(transformedObject).to.deep.equal({
        firstLevelFirstKey: 'first level first value',
        firstLevelSecondKey: [
          { second_level_first_key: 'second level first value' }
        ]
      });
    });
  });
});

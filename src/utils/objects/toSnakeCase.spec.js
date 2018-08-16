import toSnakeCase from './toSnakeCase';

describe('utils/objects/toSnakeCase', function() {
  context('objects', function() {
    it('transforms first-level keys', function() {
      const transformedObject = toSnakeCase({ firstKey: 'first value' });

      expect(transformedObject).to.deep.equal({ first_key: 'first value' });
    });

    it('transforms nested keys by default', function() {
      const transformedObject = toSnakeCase({
        firstLevelFirstKey: {
          secondLevelFirstKey: {
            thirdLevelFirstKey: 'third level first value'
          }
        }
      });

      expect(transformedObject).to.deep.equal({
        first_level_first_key: {
          second_level_first_key: {
            third_level_first_key: 'third level first value'
          }
        }
      });
    });

    it('does not transform nested keys when `deep` is set to `false`', function() {
      const transformedObject = toSnakeCase(
        {
          firstLevelFirstKey: {
            secondLevelFirstKey: {
              thirdLevelFirstKey: 'third level first value'
            }
          }
        },
        { deep: false }
      );

      expect(transformedObject).to.deep.equal({
        first_level_first_key: {
          secondLevelFirstKey: {
            thirdLevelFirstKey: 'third level first value'
          }
        }
      });
    });

    it('does not transform first-level excluded keys', function() {
      const transformedObject = toSnakeCase(
        {
          firstKey: 'first value',
          secondKey: 'second value'
        },
        { excludeTransform: ['secondKey'] }
      );

      expect(transformedObject).to.deep.equal({
        first_key: 'first value',
        secondKey: 'second value'
      });
    });

    it('does not transform nested excluded keys', function() {
      const transformedObject = toSnakeCase(
        {
          firstLevelFirstKey: {
            secondLevelFirstKey: {
              thirdLevelFirstKey: 'third level first value'
            }
          }
        },
        {
          deep: true,
          excludeTransform: ['thirdLevelFirstKey']
        }
      );

      expect(transformedObject).to.deep.equal({
        first_level_first_key: {
          second_level_first_key: {
            thirdLevelFirstKey: 'third level first value'
          }
        }
      });
    });

    it('removes keys marked for removal', function() {
      const transformedObject = toSnakeCase(
        {
          firstLevelFirstKey: 'first level first value',
          firstLevelSecondKey: 'first level second value'
        },
        { excludeKeys: ['firstLevelFirstKey'] }
      );

      expect(transformedObject).to.deep.equal({
        first_level_second_key: 'first level second value'
      });
    });

    it('removes nested keys marked for removal by default', function() {
      const transformedObject = toSnakeCase(
        {
          firstLevelFirstKey: {
            secondLevelFirstKey: 'second level first value',
            secondLevelSecondKey: 'second level second value'
          }
        },
        { excludeKeys: ['secondLevelFirstKey'] }
      );

      expect(transformedObject).to.deep.equal({
        first_level_first_key: {
          second_level_second_key: 'second level second value'
        }
      });
    });

    it('does not remove nested keys when `deep` is set to `false`', function() {
      const transformedObject = toSnakeCase(
        {
          firstLevelFirstKey: {
            secondLevelFirstKey: 'second level first value',
            secondLevelSecondKey: 'second level second value'
          }
        },
        { deep: false }
      );

      expect(transformedObject).to.deep.equal({
        first_level_first_key: {
          secondLevelFirstKey: 'second level first value',
          secondLevelSecondKey: 'second level second value'
        }
      });
    });
  });

  context('arrays', function() {
    it('transforms keys in top-level arrays of objects', function() {
      const transformedObject = toSnakeCase([
        { firstLevelFirstKey: 'first level first value' },
        { firstLevelSecondKey: 'first level second value' }
      ]);

      expect(transformedObject).to.deep.equal([
        { first_level_first_key: 'first level first value' },
        { first_level_second_key: 'first level second value' }
      ]);
    });

    it('transforms keys in nested arrays of objects by default', function() {
      const transformedObject = toSnakeCase({
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

      expect(transformedObject).to.deep.equal({
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
    });

    it('does not transform keys in arrays nested in objects when `deep` is set to `false`', function() {
      const transformedObject = toSnakeCase(
        {
          firstLevelFirstKey: 'first level first value',
          firstLevelSecondKey: [
            { secondLevelFirstKey: 'second level first value' }
          ]
        },
        { deep: false }
      );

      expect(transformedObject).to.deep.equal({
        first_level_first_key: 'first level first value',
        first_level_second_key: [
          { secondLevelFirstKey: 'second level first value' }
        ]
      });
    });
  });
});

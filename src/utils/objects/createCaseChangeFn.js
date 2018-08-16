import mapObj from './map';

/*
 * Creates a function that can be used to change object keys.
 *
 * @param {Function} caseChangeFn A function used to change the case of keys in
 * the object/array. Can be one from [the NPM package `change-case`](https://github.com/blakeembrey/change-case)
 * or a custom function that follows the same API.
 *
 * @returns {Function}
 *
 * @private
 */
function createCaseChangeFn(caseChangeFn) {
  /*
   * Maps over an array or object and converts all the keys to a different
   * format
   *
   * @param {Object|Array} input The object or array to map over
   * @param {Object} [userOptions]
   * @param {Boolean} [userOptions.deep = true] Boolean indicating if only the first
   *   level should be mapped or if it should recursively map over nested
   *   objects/arrays
   * @param {String[]} [userOptions.excludeKeys] A list of keys that should not
   *   be included in the returned object
   * @param {String[]} [userOptions.excludeTransform] A list of keys that should
   *   not be transformed in the returned object
   *
   * @returns {Object|Array}
   *
   * @private
   */
  function changeCase(input = {}, userOptions) {
    const options = {
      deep: true,
      excludeKeys: [],
      excludeTransform: [],
      ...userOptions
    };

    return mapObj(
      input,
      (value, key) => {
        if (options.excludeKeys.indexOf(key) > -1) {
          return [value, '__MARKED_FOR_REMOVAL__'];
        }

        if (options.excludeTransform.indexOf(key) === -1) {
          key = caseChangeFn(key);
        }

        return [value, key];
      },
      { deep: options.deep }
    );
  }

  return function(input, options) {
    return Array.isArray(input)
      ? input.map((item) => changeCase(item, options))
      : changeCase(input, options);
  };
}

export default createCaseChangeFn;

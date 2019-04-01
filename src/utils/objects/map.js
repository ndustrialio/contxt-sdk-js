import isPlainObject from 'lodash.isplainobject';

/*
 * Maps over an object (which can include nested objects and arrays).
 *
 * @param {Object} input The object to map over
 * @param {Function} callback The function invoked per iteration
 * @param {Object} [userOptions]
 * @param {Boolean} [userOptions.deep = false] Boolean indicating if only the first
 *   level should be mapped or if it should recursively map over nested
 *   objects/arrays
 *
 * @returns {Object}
 *
 * @private
 */
function map(input, callback, userOptions) {
  const options = {
    deep: false,
    ...userOptions
  };

  return Object.keys(input).reduce((memo, key) => {
    const value = input[key];
    const result = callback(value, key, input);
    let [newValue, newKey] = result;

    if (newKey === '__MARKED_FOR_REMOVAL__') {
      return memo;
    }

    if (options.deep) {
      if (isPlainObject(newValue)) {
        newValue = map(newValue, callback, options);
      } else if (Array.isArray(newValue)) {
        newValue = newValue.map(
          (val) => (isPlainObject(val) ? map(val, callback, options) : val)
        );
      }
    }

    memo[newKey] = newValue;

    return memo;
  }, {});
}

export default map;

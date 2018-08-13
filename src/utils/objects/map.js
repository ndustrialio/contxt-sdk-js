import isPlainObject from 'lodash.isplainobject';

function map(input, callback, options) {
  options = {
    deep: false,
    ...options
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

import mapObj from './map';

function createCaseChangeFn(caseChangeFn) {
  function changeCase(input = {}, options) {
    options = {
      deep: true,
      excludeKeys: [],
      excludeTransform: [],
      ...options
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

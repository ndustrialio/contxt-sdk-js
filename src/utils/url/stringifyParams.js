import qs from 'qs';

/*
 * Stringifies url params for.  Especially useful for passing arrays into axios
 * GET requests via the internal _request object.
 *
 * @see {@link https://github.com/ljharb/qs#stringifying}
 *
 * @example
 * this._request.get(url, {
 *   params: { assetIds: [ ... ] },
 *   paramsSerializer: stringifyParams
 * })
 *
 * @returns {String}
 *
 * @private
 */
const stringifyParams = (params, options = {}) => {
  return qs.stringify(params, options);
};

const stringifyParamsWithCommaSeparatedArrays = (params) =>
  stringifyParams(params, { arrayFormat: 'comma' });

export { stringifyParams, stringifyParamsWithCommaSeparatedArrays };

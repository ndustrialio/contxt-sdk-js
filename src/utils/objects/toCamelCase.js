import changeCase from 'change-case';
import createCaseChangeFn from './createCaseChangeFn';

/*
 * Maps over an array or object and converts all the keys to be camelCase
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
export default createCaseChangeFn(changeCase.camelCase);

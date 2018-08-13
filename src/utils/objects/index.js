import changeCase from 'change-case';
import createCaseChangeFn from './createCaseChangeFn';

export const toCamelCase = createCaseChangeFn(changeCase.camelCase);
export const toSnakeCase = createCaseChangeFn(changeCase.snakeCase);

import changeCase from 'change-case';
import createCaseChangeFn from './createCaseChangeFn';

export default createCaseChangeFn(changeCase.camelCase);

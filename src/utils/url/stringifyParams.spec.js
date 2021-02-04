import { expect } from 'chai';
import faker from 'faker';

import { stringifyParamsWithCommaSeparatedArrays } from './stringifyParams';

const URL_ENCODED_COLON = '%3A';
const URL_ENCODED_COMMA = '%2C';
const URL_PARAM_SEPARATOR = '&';

describe('src/utils/url/stringifyParams.js', function() {
  const value = { value: faker.random.number() };
  const word = { word: faker.lorem.word() };
  const uuid = { uuid: faker.random.uuid() };
  const date = { date: faker.date.past().toISOString() };

  const listValue1 = faker.lorem.word();
  const listValue2 = faker.lorem.word();

  const list = {
    list: [listValue1, listValue2]
  };

  const allPrams = { ...value, ...word, ...uuid, ...date, ...list };

  describe('stringifyParamsWithCommaSeparatedArrays', function() {
    const stringifiedValue = `value=${value.value}`;
    const stringifiedWord = `word=${word.word}`;
    const stringifiedUuid = `uuid=${uuid.uuid}`;
    const stringifiedDate = `date=${date.date.replace(
      /:/g,
      URL_ENCODED_COLON
    )}`;
    const stringifiedList = `list=${list.list.join(URL_ENCODED_COMMA)}`;

    const allStringified =
      stringifiedValue +
      URL_PARAM_SEPARATOR +
      stringifiedWord +
      URL_PARAM_SEPARATOR +
      stringifiedUuid +
      URL_PARAM_SEPARATOR +
      stringifiedDate +
      URL_PARAM_SEPARATOR +
      stringifiedList;

    it('correctly parses values of common params to the correct url encoding', function() {
      const result1 = stringifyParamsWithCommaSeparatedArrays(value);
      const result2 = stringifyParamsWithCommaSeparatedArrays(word);
      const result3 = stringifyParamsWithCommaSeparatedArrays(uuid);
      const result4 = stringifyParamsWithCommaSeparatedArrays(date);
      const result5 = stringifyParamsWithCommaSeparatedArrays(list);

      expect(result1).to.equal(stringifiedValue);
      expect(result2).to.equal(stringifiedWord);
      expect(result3).to.equal(stringifiedUuid);
      expect(result4).to.equal(stringifiedDate);
      expect(result5).to.equal(stringifiedList);
    });

    it('correctly parses and object of many values to the correct url encoding', function() {
      const result = stringifyParamsWithCommaSeparatedArrays(allPrams);
      expect(result).to.equal(allStringified);
    });
  });
});

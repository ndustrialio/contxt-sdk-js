import { expect } from 'chai';
import faker from 'faker';

import { stringifyParamsWithCommaSeparatedArrays } from './stringifyParams';

const URL_ENCODED_COLON = '%3A';
const URL_ENCODED_COMMA = '%2C';
const URL_PARAM_SEPARATOR = '&';

describe('src/utils/url/stringifyParams.js', function() {
  let value;
  let word;
  let uuid;
  let date;

  let listValue1;
  let listValue2;
  let list;
  let allParams;

  describe('stringifyParamsWithCommaSeparatedArrays', function() {
    let stringifiedValue;
    let stringifiedWord;
    let stringifiedUuid;
    let stringifiedDate;
    let stringifiedList;
    let allStringified;

    beforeEach(function() {
      value = { value: faker.random.number() };
      word = { word: faker.lorem.word() };
      uuid = { uuid: faker.random.uuid() };
      date = { date: faker.date.past().toISOString() };

      listValue1 = faker.lorem.word();
      listValue2 = faker.lorem.word();
      list = {
        list: [listValue1, listValue2]
      };

      allParams = { ...value, ...word, ...uuid, ...date, ...list };

      stringifiedValue = `value=${value.value}`;
      stringifiedWord = `word=${word.word}`;
      stringifiedUuid = `uuid=${uuid.uuid}`;
      stringifiedDate = `date=${date.date.replace(/:/g, URL_ENCODED_COLON)}`;
      stringifiedList = `list=${list.list.join(URL_ENCODED_COMMA)}`;

      allStringified =
        stringifiedValue +
        URL_PARAM_SEPARATOR +
        stringifiedWord +
        URL_PARAM_SEPARATOR +
        stringifiedUuid +
        URL_PARAM_SEPARATOR +
        stringifiedDate +
        URL_PARAM_SEPARATOR +
        stringifiedList;
    });

    it('correctly parses a number param to the correct url encoding', function() {
      const result = stringifyParamsWithCommaSeparatedArrays(value);
      expect(result).to.equal(stringifiedValue);
    });

    it('correctly parses a word param to the correct url encoding', function() {
      const result = stringifyParamsWithCommaSeparatedArrays(word);
      expect(result).to.equal(stringifiedWord);
    });

    it('correctly parses a uuid param to the correct url encoding', function() {
      const result = stringifyParamsWithCommaSeparatedArrays(uuid);
      expect(result).to.equal(stringifiedUuid);
    });

    it('correctly parses a date param to the correct url encoding', function() {
      const result = stringifyParamsWithCommaSeparatedArrays(date);
      expect(result).to.equal(stringifiedDate);
    });

    it('correctly parses an array/list param to the correct url encoding', function() {
      const result = stringifyParamsWithCommaSeparatedArrays(list);
      expect(result).to.equal(stringifiedList);
    });

    it('correctly parses an object of many values to the correct url encoding', function() {
      const result = stringifyParamsWithCommaSeparatedArrays(allParams);
      expect(result).to.equal(allStringified);
    });
  });
});

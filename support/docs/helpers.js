'use strict';

const handlebars = require('handlebars');
const identifiers = require('dmd/helpers/ddata')._identifiers;
const sortBy = require('lodash.sortby');

function typedefs(options) {
  return handlebars.helpers.each(
    sortBy(
      identifiers(options).filter((identifier) => identifier.kind === 'typedef'),
      'longname'
    ),
    options
  );
}

module.exports = {
  typedefs
};

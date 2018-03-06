'use strict';

const handlebars = require('handlebars');
const {
  anchorName,
  _identifiers: identifiers,
  link: originalLink
} = require('dmd/helpers/ddata');
const sortBy = require('lodash.sortby');

function link(longname, options) {
  const linkedInfo = identifiers({
    ...options,
    hash: { id: longname }
  })[0];

  if (linkedInfo && linkedInfo.kind === 'typedef') {
    return `./Typedefs.md#${anchorName.call(linkedInfo, options)}`;
  }

  return originalLink(longname, options);
}

function readmeLink(options) {
  switch (this.kind) {
    case 'class':
      return `./${this.longname}.md`;

    case 'typedef':
      return `./Typedefs.md#${anchorName.call(this, options)}`;

    default:
      return anchorName.call(this, options);
  }
}

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
  link,
  readmeLink,
  typedefs
};

'use strict';

const fs = require('fs');
const jsdoc2md = require('jsdoc-to-markdown');
const path = require('path');
const sortBy = require('lodash.sortby');

module.exports = function({ data, outputDir }) {
  const sortedData = sortBy(data, 'longname');
  const template = '{{>main-index~}}';
  const output = jsdoc2md.renderSync({
    template,
    data: sortedData,
    helper: path.join(__dirname, 'helpers.js'),
    partial: [path.join(__dirname, 'partials', 'sig-link-html.hbs')]
  });
  const outputPath = path.resolve(outputDir, 'README.md');

  fs.writeFileSync(outputPath, output);
};

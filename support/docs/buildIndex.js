'use strict';

const fs = require('fs');
const jsdoc2md = require('jsdoc-to-markdown');
const path = require('path');

module.exports = function({ data, outputDir }) {
  const template = '{{>main-index~}}';
  const output = jsdoc2md.renderSync({
    data,
    partial: [
      path.join(__dirname, 'partials', 'sig-link-html.hbs')
    ],
    template,
    helper: path.join(__dirname, 'helpers.js')
  });
  const outputPath = path.resolve(outputDir, 'README.md');

  fs.writeFileSync(outputPath, output);
};
